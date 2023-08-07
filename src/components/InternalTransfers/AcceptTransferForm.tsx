import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { useParams } from "react-router";

import Breadcrumbs from "components/Breadcrumbs";
import InternalLink from "components/InternalLink";
import internalTransfersMessages from "messages/transfers";
import commonMessages from "messages/common";
import formMessages from "messages/form";
import TransferAcceptedImg from "assets/images/internal_transfers/transfer-activated.svg";
import styles from "styles/components/InternalTransfers/AcceptTransferForm.module.scss";
import Button, { ButtonsGroup } from "components/UI/Button";
import { IInternalTransferDetails } from "types/internal_transfers";
import errorHandler from "utils/errorHandler";
import InternalTransferService from "services/InternalTransferService";
import InfoSnack from "components/InfoSnack";
import Input from "components/UI/Input";
import { formatNumberNoRounding } from "utils/format";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { routes } from "constants/routing";
import { TransferInfoItem } from "./TransferCommon";
import { getUnitOfTime, getUnitValue } from "./InternalTransfersUtil";

const AcceptTransferForm: React.FC = () => {
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSuccessful, setSuccessful] = useState<boolean>(false);
	const [details, setDetails] = useState<IInternalTransferDetails | undefined>();
	const [securityCode, setSecurityCode] = useState<string>("");
	const [securityCodeError, setSecurityCodeError] = useState<string>("");

	const { formatMessage } = useIntl();
	const { txid } = useParams<{ txid: string }>();

	const now = Date.now();
	const diff = details?.valid_till
		? dayjs(details.valid_till).diff(dayjs(now), "seconds", true)
		: NaN;

	useEffect(() => {
		loadTransferDetails();
	}, []);

	const loadTransferDetails = async () => {
		if (!txid) return;
		try {
			setLoading(true);
			const data = await InternalTransferService.getTransferDetails(txid);
			if (!data) return;
			setDetails(data);
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSecurityCode(e.target.value);
		if (!securityCodeError) return;
		setSecurityCodeError("");
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter") return;
		submit();
	};

	const submit = async () => {
		if (!txid) return;
		if (!securityCode.trim()) {
			setSecurityCodeError(formatMessage(formMessages.required));
			return;
		}
		try {
			setSubmitting(true);
			await InternalTransferService.acceptTransferRequest(txid, securityCode);
			setSuccessful(true);
		} catch (err) {
			errorHandler(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.page_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.transfers.root,
						label: formatMessage(commonMessages.transfer),
					},
				]}
				current={formatMessage(internalTransfersMessages.transfer_receiving)}
			/>
			<div className={styles.card}>
				<h3 className={styles.card_title}>
					{formatMessage(internalTransfersMessages.transfer_receiving)}
				</h3>
				{isSuccessful ? (
					<div className={styles.accepted_transfer_container}>
						<img
							src={TransferAcceptedImg}
							alt="Transfer Accepted"
							title="Transfer Accepted"
							width="250"
							height="88"
						/>
						<ButtonsGroup>
							<InternalLink to={routes.transfers.root}>
								<Button
									fullWidth
									variant="text"
									color="primary"
									label={formatMessage(commonMessages.back_btn)}
								/>
							</InternalLink>
						</ButtonsGroup>
					</div>
				) : details ? (
					<>
						<span className={styles.card_subtitle}>
							{formatMessage(internalTransfersMessages.transfer_receiving_desc)}
						</span>
						<div className={styles.transfer_info}>
							<TransferInfoItem
								className={styles.transfer_info_item}
								title={<>{formatMessage(commonMessages.amount)}:</>}
								subtitle={
									<>
										<b>
											{formatNumberNoRounding(
												+(details?.amount ?? 0),
												details?.currency?.precision ?? 8,
											)}
										</b>
										&nbsp;
										{details?.currency.code}
									</>
								}
							/>
							<TransferInfoItem
								className={styles.transfer_info_item}
								title={<>{formatMessage(commonMessages.sender)}&nbsp;User ID:</>}
								subtitle={details?.sender}
							/>
							{details?.valid_till && (
								<TransferInfoItem
									className={styles.transfer_info_item}
									title={<>{formatMessage(commonMessages.active_to)}:</>}
									subtitle={
										<>
											{getUnitValue(diff)}
											&nbsp;
											{getUnitOfTime(diff, formatMessage)}
										</>
									}
								/>
							)}
							{details?.message && (
								<TransferInfoItem
									className={styles.transfer_info_item}
									title={<>{formatMessage(commonMessages.description)}:</>}
									subtitle={details?.message}
								/>
							)}
						</div>
						<InfoSnack color="yellow" iconCode="warning">
							<span>{formatMessage(internalTransfersMessages.secure_transfer_msg)}</span>
						</InfoSnack>
						<div className={styles.form_container}>
							<Input
								type="password"
								name="security_code"
								labelValue={formatMessage(commonMessages.secure_code)}
								value={securityCode}
								onChange={handleInputChange}
								error={securityCodeError}
								onKeyDown={handleInputKeyDown}
							/>
							<ButtonsGroup>
								<Button
									fullWidth
									variant="filled"
									color="primary"
									label={formatMessage(commonMessages.receive)}
									isLoading={isSubmitting}
									onClick={submit}
								/>
								<InternalLink to={routes.transfers.root}>
									<Button
										fullWidth
										variant="text"
										color="primary"
										label={formatMessage(commonMessages.back_btn)}
									/>
								</InternalLink>
							</ButtonsGroup>
						</div>
					</>
				) : (
					<LoadingSpinner />
				)}
			</div>
		</div>
	);
};

export default AcceptTransferForm;
