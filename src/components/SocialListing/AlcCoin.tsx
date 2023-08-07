import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/SocialListing.module.scss";
import alcIcon from "assets/images/listing/alc.svg";
import messages from "messages/listing";
import commonMessages from "messages/common";

const AlcCoin: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.alc_coin}>
			<i className="ai ai-info_outlined" />
			<div className={styles.alc_coin_header}>
				<h3>Alpha Listing Coin (ALC)</h3>
				<img src={alcIcon} alt="ALC" />
			</div>
			<div className={styles.alc_coin_info}>
				{formatMessage(messages.alc_desc, {
					ref: (
						<a href="https://alp.com/news/btc-alpha-integrates-alpha-listing-coin-alc-is?utm_source=sociallisting&utm_medium=button&utm_campaign=more">
							{formatMessage(commonMessages.more)}
						</a>
					),
				})}
			</div>
		</div>
	);
};

export default AlcCoin;
