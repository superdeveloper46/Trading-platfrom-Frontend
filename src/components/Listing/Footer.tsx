import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import listingMessages from "messages/listing";
import headerCoins from "assets/images/listing/header-coins.png";
import etheriumIcon from "assets/images/listing/etherium.png";
import bitcoinIcon from "assets/images/listing/bitcoin.png";
import tetherIcon from "assets/images/listing/tether.png";
import styles from "styles/pages/Listing.module.scss";
import Button from "components/UI/Button";
import useWindowSize from "hooks/useWindowSize";

interface IProps {
	onFillFormClick: () => void;
}

const Footer: React.FC<IProps> = ({ onFillFormClick }) => {
	const { mobile } = useWindowSize();
	const { formatMessage } = useIntl();

	return (
		<div className={cn(styles.content, styles.footer)}>
			<div className={styles.header_info}>
				<div className={styles.header_title}>{formatMessage(listingMessages.footer_title)}</div>
				<div className={styles.header_desc}>{formatMessage(listingMessages.footer_desc)}</div>
				<Button
					onClick={onFillFormClick}
					className={styles.header_button}
					label={formatMessage(listingMessages.fill_out_the_form)}
				/>
			</div>
			{!mobile && <img className={styles.header_coins} src={headerCoins} alt="Coins" />}
			{mobile && (
				<>
					<img className={styles.eth_icon} src={etheriumIcon} alt="ETH" />
					<img className={styles.btc_icon} src={bitcoinIcon} alt="BTC" />
					<img className={styles.trc_icon} src={tetherIcon} alt="TRC" />
				</>
			)}
		</div>
	);
};

export default Footer;
