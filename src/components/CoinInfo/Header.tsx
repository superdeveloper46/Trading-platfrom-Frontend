import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/components/CoinInfo.module.scss";
import BitcoinImg from "assets/images/coin_info/bitcoin.svg";
import TronImg from "assets/images/coin_info/tron.svg";
import EthereumImg from "assets/images/coin_info/ethereum.svg";
import messages from "messages/coin_info";
import classnames from "classnames";

const Header: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.header}>
			<Coins />
			<div className={styles.title}>{formatMessage(messages.coin_info_header)}</div>
			<div className={styles.subtitle}>{formatMessage(messages.coin_info_subheader)}</div>
		</div>
	);
};

export default Header;

const Coins: React.FC = () => (
	<>
		<img className={classnames(styles.coins, styles.bitcoin)} alt="coin" src={BitcoinImg} />
		<img className={classnames(styles.coins, styles.ethereum)} alt="coin" src={EthereumImg} />
		<img className={classnames(styles.coins, styles.tron)} alt="coin" src={TronImg} />
	</>
);
