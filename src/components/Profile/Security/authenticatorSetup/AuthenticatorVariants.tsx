import React from "react";
import classnames from "classnames";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";
import { AuthenticatorVariantEnum } from "types/authenticatorSetup";
import { useIntl } from "react-intl";
import securityMessages from "messages/security";
import commonMessages from "messages/common";

import googleAuthenticatorAppImg from "assets/images/auth/google_authenticator.svg";
import alpAuthenticatorAppImg from "assets/images/auth/alp_authenticator.svg";

interface IAuthenticatorVariantProps {
	variant: AuthenticatorVariantEnum;
	onChangeVariant(variant: AuthenticatorVariantEnum): void;
}

const AuthenticatorVariants: React.FC<IAuthenticatorVariantProps> = ({
	variant,
	onChangeVariant,
}) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.content}>
			<div className={styles.title}>
				{formatMessage(
					variant === AuthenticatorVariantEnum.Alp
						? securityMessages.use_alp_authenticator
						: securityMessages.use_google_authenticator,
				)}
			</div>
			<div className={styles.subtitle}>
				{formatMessage(securityMessages.download_and_install_the_app)}
				&nbsp;
				<a href="https://www.google.com/landing/2step/" target="_blank" rel="noopener noreferrer">
					{formatMessage(commonMessages.more)}
				</a>
			</div>
			<div className={styles.authenticator_container}>
				<div
					className={classnames(styles.authenticator, {
						[styles.active]: variant === AuthenticatorVariantEnum.Google,
					})}
					onClick={() => onChangeVariant(AuthenticatorVariantEnum.Google)}
				>
					<div
						className={classnames(styles.authenticator_icon, {
							[styles.active]: variant === AuthenticatorVariantEnum.Google,
						})}
					>
						<img
							src={googleAuthenticatorAppImg}
							alt="google-authenticator"
							width="120"
							height="120"
						/>
					</div>
					<span>Google Authenticator</span>
				</div>
				<div
					className={classnames(styles.authenticator, {
						[styles.active]: variant === AuthenticatorVariantEnum.Alp,
					})}
					onClick={() => onChangeVariant(AuthenticatorVariantEnum.Alp)}
				>
					<div
						className={classnames(styles.authenticator_icon, {
							[styles.active]: variant === AuthenticatorVariantEnum.Alp,
						})}
					>
						<img src={alpAuthenticatorAppImg} alt="alp-authenticator" width="120" height="120" />
					</div>
					<span>ALP2FA</span>
				</div>
			</div>
		</div>
	);
};

export default AuthenticatorVariants;
