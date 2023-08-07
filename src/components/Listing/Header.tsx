import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import listingMessages from "messages/listing";
import headerCoins from "assets/images/listing/header-coins.png";
import etheriumIcon from "assets/images/listing/etherium.png";
import bitcoinIcon from "assets/images/listing/bitcoin.png";
import tetherIcon from "assets/images/listing/tether.png";
import Button from "components/UI/Button";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/pages/Listing.module.scss";
import stylesPage from "styles/pages/Page.module.scss";

interface IProps {
	onFillFormClick: () => void;
}

const Header: React.FC<IProps> = ({ onFillFormClick }) => {
	const { mobile } = useWindowSize();
	const { formatMessage } = useIntl();

	return (
		<div className={cn(stylesPage.header_container, styles.header_container)}>
			<div className={styles.content}>
				<div className={styles.header_info}>
					<div className={styles.header_title}>{formatMessage(listingMessages.header_title)}</div>
					<div className={styles.header_desc}>{formatMessage(listingMessages.header_desc)}</div>
					<Button
						onClick={onFillFormClick}
						className={cn(styles.header_button, styles.white)}
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
		</div>
	);
};

export default Header;
