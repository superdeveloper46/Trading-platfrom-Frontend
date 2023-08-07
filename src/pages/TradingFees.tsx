import About from "components/TradingFees/About";
import AlpFees from "components/TradingFees/AlpFees";
import FeeSpotTable from "components/TradingFees/FeeSpotTable";
import TradingFeeLevel from "components/TradingFees/TradingFeeLevel";
import MainLayout from "layouts/MainLayout";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useTradingFees } from "services/TradingFeesService";
import feesTradingMessages from "messages/fees_trading";
import styles from "styles/pages/Content.module.scss";
import { getPageTitle } from "helpers/global";
import { useMst } from "models/Root";

const TradingFees: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(feesTradingMessages.trading_fees));
	const [isLoading, setLoading] = useState(true);
	const { status, data } = useTradingFees();
	const { render } = useMst();

	useEffect(() => {
		setLoading(status === "loading");
	}, [status]);

	return (
		<MainLayout>
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
				<TradingFeeLevel isLoading={isLoading} tradingFees={data} />
				{render.alpCoin && (
					<>
						<AlpFees isLoading={isLoading} tradingFees={data} />
						<About />
					</>
				)}
				<FeeSpotTable tradingFees={data} />
			</div>
		</MainLayout>
	);
};

export default TradingFees;
