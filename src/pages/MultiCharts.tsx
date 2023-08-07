import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { CommonChart } from "components/Terminal/Chart";
import useParamQuery from "hooks/useSearchQuery";
import styles from "styles/pages/MultiCharts.module.scss";
import TerminalLayout from "layouts/TerminalLayout";
import SupportWebSocket from "components/SupportWebSocket";
import { ITrade } from "components/Terminal/Chart/CommonChart";
import { ITicker } from "models/Ticker";

const MultiCharts: React.FC = () => {
	const { tickers } = useMst();
	const title = "Multi Charts";
	const query = useParamQuery();
	const pairs = query.get("pairs")?.split(",") ?? [];
	const [trades, setTrades] = useState<ITrade[]>([]);

	// for query sort order
	const selectedTickers: ITicker[] = [];
	pairs.forEach((pair) => {
		const ticker = tickers.list.find((t) => t.symbol === pair);
		if (ticker) {
			selectedTickers.push(ticker);
		}
	});

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
		<TerminalLayout>
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
				{selectedTickers.length > 0 &&
					selectedTickers.map((t) => (
						<CommonChart
							key={t.symbol}
							ticker={t}
							trades={trades.filter((tr) => tr.symbol === t.symbol)}
						/>
					))}
				<SupportWebSocket onAddTrade={handleAddTrade} />
			</div>
		</TerminalLayout>
	);
};

export default observer(MultiCharts);
