import React from "react";
import styles from "styles/components/CoinDetails.module.scss";
import { CommonChart } from "components/Terminal/Chart";
import { ITicker } from "models/Ticker";

interface IProps {
	tickers: ITicker[];
}

const CoinDetailsChart: React.FC<IProps> = ({ tickers }) => (
	<div className={styles.chart}>
		{tickers[0] && <CommonChart ticker={tickers[0]} trades={[]} />}
	</div>
);

export default CoinDetailsChart;
