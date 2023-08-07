import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import messages from "messages/common";
import auth_messages from "messages/auth";
import styles from "styles/components/EmailPasswordConfirmations.module.scss";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import useLocalStorage from "hooks/useLocalStorage";
import { TERMINAL_LATEST_PAIR_CACHE_KEY } from "utils/cacheKeys";
import config from "helpers/config";
import Input from "components/UI/Input";
import { getPageTitle } from "helpers/global";
import AuthLayout from "layouts/AuthLayout";
import ConfirmResetPasswordService from "services/ConfirmResetPasswordService";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";

interface IFormErrors {
	password?: string;
	password2?: string;
}

interface IError {
	status?: number;
	statusText?: string;
}

const getErrorsFromResponse = (responseErrors: any, errorName: string) => {
	const err = responseErrors[errorName];
	if (Array.isArray(err) && err.length) {
		return err[0];
	}
	return "";
};

const ResetPasswordConfirming = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") ?? "";
	const [latestTerminalPair] = useLocalStorage(
		TERMINAL_LATEST_PAIR_CACHE_KEY,
		config.defaultTerminalPair,
	);

	const [status, setStatus] = useState(0);
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [errors, setErrors] = useState<IFormErrors>({});
	const [isConfirmLoading, setConfirmLoading] = useState<boolean>(false);
	const { formatMessage } = useIntl();

	const handleConfirmClick = async () => {
		try {
			setConfirmLoading(true);
			const data = await ConfirmResetPasswordService.confirm({ token, password, password2 });
			if (data?.form?.errors) {
				const err: IFormErrors = {
					password: getErrorsFromResponse(data.form.errors, "password"),
					password2:
						getErrorsFromResponse(data.form.errors, "password2") ||
						getErrorsFromResponse(data.form.errors, "non_field_errors"),
				};

				setErrors(err);
			}
			if (!Object.prototype.hasOwnProperty.call(data, "form")) {
				setStatus(1);
			}
		} catch (err) {
			errorHandler(err);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		switch (name) {
			case "password":
				setErrors((e) => ({ ...e, password: "" }));
				setPassword(value);
				break;
			case "password2":
				setErrors((e) => ({ ...e, password2: "" }));
				setPassword2(value);
				break;
			default:
				break;
		}
	};

	const title = getPageTitle(formatMessage(auth_messages.reset_password_confirmation_header));

	return (
		<AuthLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				<div className={styles.outlined_card_panel_content}>
					{!token && (
						<>
							<h3>{formatMessage(messages.error_occurred)}</h3>
							<p>{formatMessage(messages.no_confirm_token)}</p>
						</>
					)}
					{status === 1 ? (
						<>
							<div>
								<h1 className={styles.header}>
									{formatMessage(auth_messages.reset_password_confirmation_header)}
								</h1>
								<p>{formatMessage(auth_messages.reset_password_confirmation_success)}</p>
							</div>
							<div className={styles.outlined_card_panel_btn_group}>
								<InternalLink to={routes.login.root}>
									<Button
										color="primary"
										variant="text"
										label={formatMessage(messages.login)}
										fullWidth
									/>
								</InternalLink>
							</div>
						</>
					) : (
						<>
							<div>
								<h1 className={styles.header}>
									{formatMessage(auth_messages.reset_password_confirmation_header)}
								</h1>
								<p>{formatMessage(auth_messages.reset_password_confirmation_description)}</p>
							</div>
							<div className={styles.outlined_card_panel_form_body}>
								<Input
									placeholder={formatMessage(
										auth_messages.reset_password_confirmation_input_placeholder,
									)}
									labelValue={formatMessage(
										auth_messages.reset_password_confirmation_input_placeholder,
									)}
									value={password}
									onChange={handleInputChange}
									error={errors.password}
									name="password"
									password
									autoFocus
									onEnter={handleConfirmClick}
								/>
								<Input
									placeholder={formatMessage(
										auth_messages.reset_password_confirmation_input_placeholder2,
									)}
									labelValue={formatMessage(
										auth_messages.reset_password_confirmation_input_placeholder2,
									)}
									value={password2}
									onChange={handleInputChange}
									error={errors.password2}
									name="password2"
									password
									onEnter={handleConfirmClick}
								/>
								<div className={styles.outlined_card_panel_btn_group}>
									<Button
										color="primary"
										variant="filled"
										label={formatMessage(messages.confirm)}
										onClick={handleConfirmClick}
										fullWidth
										isLoading={isConfirmLoading}
									/>
									<InternalLink to={routes.trade.getPair(latestTerminalPair)}>
										<Button
											color="primary"
											variant="text"
											label={formatMessage(messages.home)}
											fullWidth
										/>
									</InternalLink>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</AuthLayout>
	);
};

export default ResetPasswordConfirming;
