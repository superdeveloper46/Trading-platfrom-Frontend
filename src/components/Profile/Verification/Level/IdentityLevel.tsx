import React from "react";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import classnames from "classnames";

import { useMst } from "models/Root";
import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import errorHandler from "utils/errorHandler";
import VerificationService from "services/VerificationService";
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

const IdentityLevel: React.FC<ILevelProps> = ({ className, minimum }) => {
	const { formatMessage, formatNumber } = useIntl();
	const {
		verification: { identityState },
		render,
	} = useMst();
	const navigate = useNavigate();

	const handleStart = async () => {
		try {
			if (identityState?.needStart) await VerificationService.startPerson();
			navigate(routes.verification.getVerificationType(URL_VARS.IDENTITY));
		} catch (err) {
			errorHandler(err);
		}
	};

	const handleCancel = async () => {
		try {
			await VerificationService.cancelPerson();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<div className={classnames(styles.level_container, className)}>
			<div className={styles.level_card}>
				<div className={styles.level_card_header}>
					<div className={classnames(styles.level_card_title, styles.identity)}>
						<i className="ai ai-user" />
						<div className={styles.level_card_title_label}>
							<span>{formatMessage(verificationMessages.identity)}</span>
							<span>{formatMessage(verificationMessages.identity_verification)}</span>
						</div>
					</div>
					{identityState?.isApproved ? <LevelVerified /> : <LevelNotVerified />}
				</div>
				{identityState?.isRejected && <RejectedCardBody message={identityState?.latest?.comment} />}
				<div className={styles.level_card_body}>
					<IncreaseSecurityMessage />
					{identityState?.isModeration ? (
						<LevelModeration />
					) : identityState?.canUpdate ? (
						<LevelUpdateButton onClick={handleStart} onCancel={handleCancel} />
					) : identityState?.isDraft ? (
						<LevelContinueButton onClick={handleStart} />
					) : (
						<LevelPassButton onClick={handleStart} />
					)}
				</div>
				{!minimum && identityState?.limit ? (
					<LevelBonus isApproved={identityState.isApproved}>
						{formatMessage(verificationMessages.daily_withdrawal_limit_up_to, {
							amount: formatNumber(+identityState.limit.quota, {
								maximumFractionDigits: 8,
							}),
							currency: identityState.limit.currency,
						})}
						{render.buyCrypto && (
							<>
								<br />
								{formatMessage(verificationMessages.ability_to_buy_cryptocurrency_from_a_bank_card)}
							</>
						)}
						<br />
						{formatMessage(verificationMessages.possibility_to_use_fiat_deposit_withdrawal_methods)}
					</LevelBonus>
				) : null}
			</div>
		</div>
	);
};

export default observer(IdentityLevel);
