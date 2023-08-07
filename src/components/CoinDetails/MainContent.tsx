import React, { useMemo, useRef } from "react";
import classnames from "classnames";

import styles from "styles/components/CoinDetails.module.scss";
import TwitterWidget from "components/TwitterWidget";
import { IMarketCapCoinInfo } from "types/coinmarketcap";
import useWindowSize from "hooks/useWindowSize";
import { ITicker } from "models/Ticker";
import CoinDetailsChart from "./CoinDetailsChart";
import Article from "./Article";
import TrendCurrencies from "./TrendCurrencies";

interface IProps {
	coinInfo?: IMarketCapCoinInfo;
	isLoading?: boolean;
	tickers?: ITicker[];
}

const MainContent: React.FC<IProps> = ({ isLoading, tickers, coinInfo }) => {
	const { width, desktop, tablet, mobile } = useWindowSize();

	const ref = useRef(null);

	const height = useMemo(() => {
		if (mobile) {
			return 400;
		}
		if (tablet) {
			return 500;
		}
		if (desktop) {
			return 600;
		}
		return 600;
	}, [mobile, tablet, desktop]);

	return (
		<div className={styles.main_content}>
			<div
				ref={ref}
				className={classnames(styles.first_col, {
					[styles.no_twitter]: !coinInfo?.twitter_username,
				})}
			>
				{tickers && tickers?.length > 0 && <CoinDetailsChart tickers={tickers} />}
				<Article isLoading={isLoading} coinInfo={coinInfo} />
				{/* <Comments comments={[FakeComment]} /> */}
				<TrendCurrencies />
			</div>
			{coinInfo?.twitter_username && (
				<div style={{ height }} className={styles.twitter_widget_container}>
					<TwitterWidget
						url={`https://twitter.com/${coinInfo?.twitter_username}`}
						width={width}
						height={height}
					/>
				</div>
			)}
		</div>
	);
};

export default MainContent;
