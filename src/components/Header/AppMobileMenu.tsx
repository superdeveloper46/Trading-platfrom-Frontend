import React from "react";
import commonMessages from "messages/common";
import QrCodeComponent from "qrcode.react";
import AppleBtnImg from "assets/images/common/app-apple-button.svg";
import GoogleBtnImg from "assets/images/common/app-google-button.svg";
import { useIntl } from "react-intl";
import styles from "styles/components/Header.module.scss";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { HOST } from "utils/constants";
import { useMst } from "models/Root";
import config from "helpers/config";

const AppMobileMenu: React.FC = () => {
	const {
		global: { theme },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={styles.mobile_apps_menu}>
			<div className={styles.list}>
				<div className={styles.content}>
					<span className={styles.title}>{formatMessage(commonMessages.scan_to_download)}</span>
					<span className={styles.subtitle}>
						{formatMessage(commonMessages.ios_and_android_apps)}
					</span>
					<div className={styles.qr_code_container}>
						<div className={styles.qr_code}>
							<QrCodeComponent value={config.mobileDownloadLink} size={90} />
						</div>
					</div>
					<div className={cn(styles.download_buttons, { [styles.brightness]: theme === "dark" })}>
						<a href={config.mobileAppAppStore} target="_blank" rel="noopener noreferrer">
							<img src={AppleBtnImg} alt="app-apple-link" />
						</a>
						<a href={config.mobileAppGooglePlay} target="_blank" rel="noopener noreferrer">
							<img src={GoogleBtnImg} alt="app-google-link" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(AppMobileMenu);
