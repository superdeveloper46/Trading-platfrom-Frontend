import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { CommonChart } from "components/Terminal/Chart";
import useParamQuery from "hooks/useSearchQuery";
import styles from "styles/pages/MobileChart.module.scss";
import SupportWebSocket from "components/SupportWebSocket";
import { ITrade } from "components/Terminal/Chart/CommonChart";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { queryVars } from "constants/query";

const MobileChart: React.FC = () => {
	const { tickers } = useMst();
	const title = "Multi Charts";
	const query = useParamQuery();
	const pair = query.get(queryVars.pair) ?? "";
	const [trades, setTrades] = useState<ITrade[]>([]);
	const ticker = tickers.list.find((t) => t.symbol === pair);

	const loadTickers = () => {
		tickers.loadTickers();
	};

	useEffect(() => {
		loadTickers();
	}, []);

	const handleAddTrade = (trade: ITrade) => {
		setTrades((prevState) => [trade, ...prevState]);
	};

	return (
		<>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				{ticker ? (
					<>
						<CommonChart ticker={ticker} trades={trades} />
						<SupportWebSocket onAddTrade={handleAddTrade} symbol={ticker.symbol} />
					</>
				) : (
					<LoadingSpinner />
				)}
			</div>
		</>
	);
};

export default observer(MobileChart);
