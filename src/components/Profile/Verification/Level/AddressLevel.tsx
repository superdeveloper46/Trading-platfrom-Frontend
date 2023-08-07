import React from "react";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import classnames from "classnames";

import styles from "styles/pages/ProfileVerification.module.scss";
import { useMst } from "models/Root";
import verificationMessages from "messages/verification";
import VerificationService from "services/VerificationService";
import errorHandler from "utils/errorHandler";
import { routes, URL_VARS } from "constants/routing";
import {
	ILevelProps,
	IncreaseSecurityMessage,
	LevelBonus,
	LevelContinueButton,
	LevelModeration,
	LevelNotVerified,
	LevelPassButton,
	LevelUpdateButton,
	LevelVerified,
	RejectedCardBody,
} from "./LevelCommon";

const AddressLevel: React.FC<ILevelProps> = ({ className, minimum }) => {
	const { formatMessage, formatNumber } = useIntl();
	const {
		verification: { addressState },
	} = useMst();
	const navigate = useNavigate();

	const handleStart = async () => {
		try {
			if (addressState?.needStart) await VerificationService.startAddress();
			navigate(routes.verification.getVerificationType(URL_VARS.ADDRESS));
		} catch (err) {
			errorHandler(err);
		}
	};

	const handleCancel = async () => {
		try {
			await VerificationService.cancelFinance();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<div className={classnames(styles.level_container, className)}>
			<div className={styles.level_card}>
				<div className={styles.level_card_header}>
					<div className={classnames(styles.level_card_title, styles.address)}>
						<i className="ai ai-home_outline" />
						<div className={styles.level_card_title_label}>
							<span>{formatMessage(verificationMessages.address)}</span>
							<span>{formatMessage(verificationMessages.proof_of_residence)}</span>
						</div>
					</div>
					{addressState?.isApproved ? <LevelVerified /> : <LevelNotVerified />}
				</div>
				{addressState?.isRejected && <RejectedCardBody message={addressState?.latest?.comment} />}
				<div className={styles.level_card_body}>
					<IncreaseSecurityMessage />
					{addressState?.isModeration ? (
						<LevelModeration />
					) : addressState?.canUpdate ? (
						<LevelUpdateButton onClick={handleStart} onCancel={handleCancel} />
					) : addressState?.isDraft ? (
						<LevelContinueButton onClick={handleStart} />
					) : (
						<LevelPassButton onClick={handleStart} />
					)}
				</div>
				{!minimum && addressState?.limit && (
					<LevelBonus isApproved={addressState.isApproved}>
						{formatMessage(verificationMessages.daily_withdrawal_limit_up_to, {
							amount: formatNumber(+addressState.limit.quota, {
								maximumFractionDigits: 8,
							}),
							currency: addressState.limit.currency,
						})}
						<br />
						{formatMessage(verificationMessages.ability_to_buy_cryptocurrency_from_a_bank_card)}
					</LevelBonus>
				)}
			</div>
		</div>
	);
};

export default observer(AddressLevel);
