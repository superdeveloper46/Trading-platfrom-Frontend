import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import classnames from "classnames";

import styles from "styles/pages/ProfileVerification.module.scss";
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

const FinanceLevel: React.FC<ILevelProps> = ({ className, minimum }) => {
	const { formatMessage, formatNumber } = useIntl();
	const {
		verification: { financeState },
	} = useMst();
	const navigate = useNavigate();

	const handleStart = async () => {
		try {
			if (financeState?.needStart) await VerificationService.startFinance();
			navigate(routes.verification.getVerificationType(URL_VARS.FINANCE));
		} catch (err) {
			errorHandler(err);
		}
	};

	const handleCancel = async () => {
		try {
			await VerificationService.cancelAddress();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<div className={classnames(styles.level_container, className)}>
			<div className={styles.level_card}>
				<div className={styles.level_card_header}>
					<div className={classnames(styles.level_card_title, styles.finance)}>
						<i className="ai ai-coin_outline" />
						<div className={styles.level_card_title_label}>
							<span> {formatMessage(verificationMessages.finance)}</span>
							<span>{formatMessage(verificationMessages.removal_of_withdrawal_limits)}</span>
						</div>
					</div>
					{financeState?.isApproved ? <LevelVerified /> : <LevelNotVerified />}
				</div>
				{financeState?.isRejected && <RejectedCardBody message={financeState?.latest?.comment} />}
				<div className={styles.level_card_body}>
					<IncreaseSecurityMessage />
					{financeState?.isModeration ? (
						<LevelModeration />
					) : financeState?.canUpdate ? (
						<LevelUpdateButton onClick={handleStart} onCancel={handleCancel} />
					) : financeState?.isDraft ? (
						<LevelContinueButton onClick={handleStart} />
					) : (
						<LevelPassButton onClick={handleStart} />
					)}
				</div>
				{!minimum && financeState?.limit && (
					<LevelBonus isApproved={financeState.isApproved}>
						{formatMessage(verificationMessages.daily_withdrawal_limit_up_to, {
							amount: formatNumber(+financeState.limit.quota, {
								maximumFractionDigits: 8,
							}),
							currency: financeState.limit.currency,
						})}
						<br />
						{formatMessage(verificationMessages.ability_to_buy_cryptocurrency_from_a_bank_card)}
					</LevelBonus>
				)}
			</div>
		</div>
	);
};

export default observer(FinanceLevel);
