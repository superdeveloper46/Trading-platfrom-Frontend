import React, { useState } from "react";
import styles from "styles/components/Header.module.scss";
import mobileAppLogo from "assets/images/logos/mobile-app-logo.svg";
import homeMessages from "messages/home";
import config from "helpers/config";
import { useIntl } from "react-intl";
import { isAndroid } from "utils/browser";
import cache from "helpers/cache";
import { MOBILE_APP_BANNER_CACHE_KEY } from "utils/cacheKeys";
import useWindowSize from "hooks/useWindowSize";

const MobileAppBanner: React.FC = () => {
	const { tablet } = useWindowSize();
	const now = Date.now();
	const closedDate = cache.getItem(MOBILE_APP_BANNER_CACHE_KEY, "0");
	const [isVisible, setIsVisible] = useState(closedDate + 3600 * 1000 > now ? false : tablet);

	const { formatMessage } = useIntl();

	const handleClose = () => {
		cache.setItem(MOBILE_APP_BANNER_CACHE_KEY, Date.now());
		setIsVisible(false);
	};

	return isVisible ? (
		<div className={styles.mobile_app_banner}>
			<div className={styles.mobile_app_banner_section}>
				<div className={styles.mobile_app_banner_img}>
					<img src={mobileAppLogo} alt={config.department || "Logo"} width="32" height="32" />
				</div>
				<div className={styles.mobile_app_banner_description}>
					<span>{formatMessage(homeMessages.mobile_app_header)}</span>
					<span>{formatMessage(homeMessages.mobile_app_header_desc)}</span>
				</div>
			</div>
			<div className={styles.mobile_app_banner_section}>
				<a
					href={isAndroid ? config.mobileAppGooglePlay : config.mobileAppAppStore}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.mobile_app_banner_download}
				>
					<i className="ai ai-download" />
				</a>
				<button className={styles.mobile_app_banner_close} type="button" onClick={handleClose}>
					<i className="ai ai-cancel_mini" />
				</button>
			</div>
		</div>
	) : null;
};

export default MobileAppBanner;
