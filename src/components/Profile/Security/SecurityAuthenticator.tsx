import React from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import styles from "styles/pages/ProfileSecurity.module.scss";
import Breadcrumbs from "components/Breadcrumbs";
import SecurityService from "services/SecurityService";
import { routes } from "constants/routing";
import AuthenticatorSetup from "./AuthenticatorSetup";

const SecurityAuthenticator: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.security_page_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.security.root,
						label: formatMessage(commonMessages.settings),
					},
				]}
				current="2FA"
			/>
			<AuthenticatorSetup
				generateCallback={SecurityService.generateTwoFA}
				setupCallback={SecurityService.enableTwoFa}
			/>
		</div>
	);
};

export default SecurityAuthenticator;
