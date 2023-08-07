import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/components/CoinDetails.module.scss";
import { IMarketCapCoinInfo } from "types/coinmarketcap";
import messages from "messages/coin_info";

interface IProps {
	coinInfo?: IMarketCapCoinInfo;
	isLoading?: boolean;
}

const Article: React.FC<IProps> = ({ coinInfo, isLoading }) => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<div className={styles.article_title}>
				{formatMessage(messages.what_is)}&nbsp;
				<span className={styles.name}>{coinInfo?.name}</span>?
			</div>
			<p className={styles.article_body}>{coinInfo?.description}</p>
		</div>
	);
};

export default Article;
