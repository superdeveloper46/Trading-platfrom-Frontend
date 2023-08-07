import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import messages from "messages/common";
import Button from "components/UI/Button";
import styles from "styles/components/EmailPasswordConfirmations.module.scss";
import InternalLink from "components/InternalLink";
import ConfirmEmailService, { useConfirmInfo } from "services/ConfirmEmailService";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";

enum ConfirmationStatus {
	NON_CONFIRMED = "NON_CONFIRMED",
	CONFIRMED = "CONFIRMED",
	ERROR = "ERROR",
}

interface IAttribute {
	label: string;
	value: string;
}

interface IInfo {
	title?: string;
	message?: string;
	description?: string;
	notes: string[];
	attributes: IAttribute[];
}

interface IError {
	status?: string;
	statusText?: string;
}

const EmailConfirmationForm = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") ?? "";
	const { data, error: confirmInfoError } = useConfirmInfo(token);
	const { formatMessage } = useIntl();
	const [info, setInfo] = useState<IInfo>();
	const [error, setError] = useState<IError>();
	const [status, setStatus] = useState<ConfirmationStatus>(ConfirmationStatus.NON_CONFIRMED);

	useEffect(() => {
		if (data) {
			setInfo(data);
		}
	}, [data]);

	useEffect(() => {
		if (confirmInfoError) {
			setError(confirmInfoError as IError);
			setStatus(ConfirmationStatus.ERROR);
			errorHandler(confirmInfoError);
		}
	}, [confirmInfoError]);

	const handleConfirmClick = useCallback(
		async (e: React.SyntheticEvent<HTMLButtonElement>) => {
			e.preventDefault();
			try {
				const data = await ConfirmEmailService.confirm(token);
				setInfo(data);
				setStatus(ConfirmationStatus.CONFIRMED);
			} catch (error) {
				setError(error as IError);
				setStatus(ConfirmationStatus.ERROR);
				errorHandler(error);
			}
		},
		[token],
	);

	const detectValue = useCallback((value) => {
		if (typeof value === "object") {
			let resultString = "";

			Object.keys(value).forEach((item) => {
				resultString += `${value[item]}, `;
				return resultString;
			});

			return resultString.substring(0, resultString.length - 2);
		}

		switch (value) {
			case true:
				return formatMessage(messages.yes);
			case false:
				return formatMessage(messages.no);
			default:
				return value;
		}
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.outlined_card_panel_content}>
				{!token && (
					<>
						<h3>{formatMessage(messages.error_occurred)}</h3>
						<p>{formatMessage(messages.no_confirm_token)}</p>
					</>
				)}
				{status === ConfirmationStatus.ERROR ? (
					<>
						<h3>{formatMessage(messages.error_occurred)}</h3>
						<p>{error?.status}</p>
						<p>{error?.statusText}</p>
					</>
				) : (
					<>
						{info && (
							<div>
								<h1 className={styles.header}>{info.title}</h1>
								<p>{info.message}</p>
								<p>{info.description}</p>
								{info.notes?.map((note) => (
									<p key={note} dangerouslySetInnerHTML={{ __html: note }} />
								))}
								{info.attributes?.map((attribute) => (
									<p key={attribute.label} className="confirm-attribute notranslate">
										<strong>{attribute.label}: </strong>
										{detectValue(attribute.value)}
									</p>
								))}
							</div>
						)}
						<div className={styles.outlined_card_panel_btn_group}>
							{status === ConfirmationStatus.NON_CONFIRMED && (
								<Button
									color="primary"
									onClick={handleConfirmClick}
									label={formatMessage(messages.confirm)}
								/>
							)}
							{status === ConfirmationStatus.CONFIRMED && (
								<InternalLink to={routes.login.root}>
									<Button
										variant="text"
										color="primary"
										label={formatMessage(messages.login)}
										fullWidth
									/>
								</InternalLink>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default observer(EmailConfirmationForm);
