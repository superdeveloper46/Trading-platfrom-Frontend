import React from "react";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";
import { AuthenticatorVariantEnum } from "types/authenticatorSetup";

import AppleBtnImg from "assets/images/common/app-apple-button.svg";
import GoogleBtnImg from "assets/images/common/app-google-button-stable.svg";

interface IAuthenticatorLinkProps {
	variant: AuthenticatorVariantEnum;
}

const AuthenticatorLinks: React.FC<IAuthenticatorLinkProps> = ({ variant }) => (
	<div className={styles.authenticator_link_container}>
		<div className={styles.authenticator_links}>
			<a
				href={
					variant === "alp"
						? "https://apps.apple.com/app/2fa-alp-authenticator/id1569434233"
						: "https://apps.apple.com/app/google-authenticator/id388497605"
				}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src={AppleBtnImg} alt="app-apple-link" width="160" height="56" />
			</a>
			<a
				href={
					variant === "alp"
						? "https://play.google.com/store/apps/details?id=com.alp.two_fa"
						: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
				}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src={GoogleBtnImg} alt="app-google-link" width="160" height="56" />
			</a>
		</div>
	</div>
);

export default AuthenticatorLinks;
