import React from "react";
import homeMessages from "messages/home";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import QrCodeComponent from "qrcode.react";
import mobileAppLogo from "assets/images/logos/mobile-app-logo.svg";
import mobileAppTrade from "assets/images/home/mobile-app-trade.svg";
import mobileAppMockup from "assets/images/home/mobile-app-mockup-2.svg";
import AppleBtnImgWhite from "assets/images/common/app-apple-button-white.svg";
import GoogleBtnImgWhite from "assets/images/common/app-google-button-white.svg";
import styles from "styles/pages/Home.module.scss";
import { HOST } from "utils/constants";
import config from "helpers/config";

const MobileApp: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<h2 className={styles.section_title}>{formatMessage(homeMessages.mobile_app_header)}</h2>
			<span className={styles.section_subtitle}>
				{formatMessage(homeMessages.mobile_app_header_desc)}
			</span>
			<div className={styles.mobile_app_line_wrapper} />
			<div className={styles.mobile_app_container}>
				<div className={styles.mobile_app_about_column}>
					<div>{formatMessage(homeMessages.mobile_app_text_1)}</div>
					<div>{formatMessage(homeMessages.mobile_app_text_3)}</div>
				</div>
				<img
					src={mobileAppTrade}
					className="app-trade"
					width="718"
					height="320"
					loading="lazy"
					alt="app-trade"
				/>
				<div className={styles.mobile_app_mockup_container}>
					<img src={mobileAppMockup} width="285" height="573" alt="app-mockup" loading="lazy" />
					<img
						src={mobileAppLogo}
						className="app-logo"
						width="58"
						height="28"
						alt="app-logo"
						loading="lazy"
					/>
					<div className={styles.mobile_app_app_download_links}>
						<div className={styles.mobile_app_qr_container}>
							<span>{formatMessage(commonMessages.scan_to_download)}</span>
							<span>{formatMessage(commonMessages.ios_and_android_apps)}</span>
							<QrCodeComponent value={config.mobileDownloadLink} size={130} />
						</div>
						<a href={config.mobileAppAppStore} target="_blank" rel="noopener noreferrer">
							<img
								src={AppleBtnImgWhite}
								alt="app-apple-link"
								height="66"
								width="188"
								loading="lazy"
							/>
						</a>
						<a href={config.mobileAppGooglePlay} target="_blank" rel="noopener noreferrer">
							<img
								src={GoogleBtnImgWhite}
								alt="app-google-link"
								height="66"
								width="188"
								loading="lazy"
							/>
						</a>
					</div>
				</div>
				<div className={styles.mobile_app_about_column}>
					<div>{formatMessage(homeMessages.mobile_app_text_2)}</div>
					<div>{formatMessage(homeMessages.mobile_app_text_4)}</div>
				</div>
			</div>
		</section>
	);
};

export default MobileApp;
