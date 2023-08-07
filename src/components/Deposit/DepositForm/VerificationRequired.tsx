import React from "react";
import { useIntl } from "react-intl";

import messages from "messages/finance";
import UserVerificationIcon from "assets/images/deposit/user-verification.svg";
import styles from "styles/components/DepositWithdrawal.module.scss";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

interface Props {
	level: number;
}

const VerificationRequired: React.FC<Props> = ({ level }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.verification_required_container}>
			<img src={UserVerificationIcon} alt="user-verification" />
			<div className={styles.verification_required_text}>
				{formatMessage(messages.deposit_verification_level, {
					level,
				})}
			</div>
			<InternalLink to={routes.verification.root} className={styles.pass_kyc_button_link}>
				{formatMessage(messages.pass_kyc)}
			</InternalLink>
		</div>
	);
};

export default VerificationRequired;
