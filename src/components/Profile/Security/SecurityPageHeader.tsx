import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import accountMessages from "messages/account";
import securityMessages from "messages/security";
import Icons from "assets/images/security/header-icons.png";
import styles from "styles/pages/ProfileSecurity.module.scss";
import classnames from "classnames";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IProfileStatus } from "models/Account";

interface IProps {
	profileStatus: IProfileStatus;
	isLoading: boolean;
}

const SecurityPageHeader: React.FC<IProps> = ({ profileStatus, isLoading }) => {
	const { formatMessage } = useIntl();
	const [securityLevel, setSecurityLevel] = useState<number>(0);

	useEffect(() => {
		setSecurityLevel(() => {
			let level = 0;
			if (profileStatus) {
				if (profileStatus.two_factor_enabled) {
					level++;
				}
				if (profileStatus.verification_level >= 1) {
					level++;
				}
				if (profileStatus.use_ip_whitelist) {
					level++;
				}
			}

			return level;
		});
	}, [isLoading, profileStatus]);

	return (
		<div className={styles.security_card_page_header}>
			<div className={styles.security_card_header_section}>
				<div className={styles.security_card_header_title}>
					{formatMessage(accountMessages.general_security_level)}&nbsp;(
					{securityLevel})
					<div className={styles.security_card_header_shields}>
						{isLoading ? (
							<LoadingSpinner />
						) : (
							[1, 2, 3].map((level: number) => (
								<i
									key={level}
									className={classnames(`ai ai-shield-03`, {
										[styles.active]: securityLevel >= level,
									})}
								/>
							))
						)}
					</div>
				</div>
				<div className={styles.security_card_header_subtitle}>
					{formatMessage(securityMessages.here_you_can_customize_your_login_settings)}
				</div>
			</div>
			<img className="aa-fade-in" src={Icons} alt="security" width="220" height="94" />
		</div>
	);
};

export default SecurityPageHeader;
