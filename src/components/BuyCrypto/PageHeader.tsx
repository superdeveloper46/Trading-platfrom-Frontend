import React from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import buyCryptoMessages from "messages/buy_crypto";
import headerIcons from "assets/images/buy_crypto/header-icons.png";
import styles from "styles/pages/Page.module.scss";

const PageHeader: React.FC = React.memo(() => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.header_container}>
			<div className={styles.header_content}>
				<img className={styles.header_image} src={headerIcons} alt="Buy Crypto" />
				<div className={styles.header_focus_container}>
					<h1>{formatMessage(commonMessages.buy_crypto)}</h1>
					<h2>{formatMessage(buyCryptoMessages.page_subtitle)}</h2>
				</div>
			</div>
		</div>
	);
});

export default PageHeader;
