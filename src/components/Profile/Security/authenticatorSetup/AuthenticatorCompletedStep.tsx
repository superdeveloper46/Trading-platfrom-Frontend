import React from "react";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";
import { useIntl } from "react-intl";
import securityMessages from "messages/security";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

interface IAuthenticatorCompletedStepProps {
	subAccountMode?: boolean;
}

const AuthenticatorCompletedStep: React.FC<IAuthenticatorCompletedStepProps> = ({
	subAccountMode,
}) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.content}>
			<div className={styles.title}>{formatMessage(commonMessages.completed)}</div>
			<div className={styles.subtitle}>
				{formatMessage(securityMessages.your_account_is_now_securely_protected)}
			</div>
			<div className={styles.setup_success}>
				<i className="ai ai-check_filled" />
				<InternalLink
					to={subAccountMode ? routes.subAccounts.accountManagement : routes.security.root}
				>
					{formatMessage(commonMessages.ready)}
				</InternalLink>
			</div>
		</div>
	);
};

export default AuthenticatorCompletedStep;
