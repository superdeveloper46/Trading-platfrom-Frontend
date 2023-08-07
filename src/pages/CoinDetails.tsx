import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { getPageTitle } from "helpers/global";
import messages from "messages/coin_info";
import MainLayout from "layouts/MainLayout";
import styles from "styles/pages/CoinInfo.module.scss";
import Header from "components/CoinDetails/Header";
import MainContent from "components/CoinDetails/MainContent";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { ICurrency, IMarketCapCoin, IMarketCapCoinInfo } from "types/coinmarketcap";
import { useMst } from "models/Root";
import errorHandler from "utils/errorHandler";
import CoinMarketCapService from "services/CoinMarketCapService";
import { ITicker } from "models/Ticker";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { searchString } from "utils/search";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";

export interface ICoinDetails {
	coin: IMarketCapCoin;
	info: IMarketCapCoinInfo;
	usd: ICurrency;
	isFavourite?: boolean;
}

const CoinDetails: React.FC = () => {
	const { coin } = useParams<{ coin: string }>();
	const { formatMessage } = useIntl();
	const title = getPageTitle(`${formatMessage(messages.coin_details)} / ${coin}`);
	const [coinInfo, setCoinInfo] = useState<IMarketCapCoinInfo>();
	const [marketCapCoin, setMarketCapCoin] = useState<IMarketCapCoin>();
	const [usd, setUSD] = useState<ICurrency>();
	const [matchingTickers, setTickers] = useState<ITicker[]>();
	const [isLoading, setLoading] = useState<boolean>(false);

	const { tickers } = useMst();

	useEffect(() => {
		initializeCoin();
	}, []);

	useEffect(() => {
		if (tickers.list && marketCapCoin) {
			setTickers([...tickers.list.filter((t) => searchString(t.symbol, marketCapCoin?.symbol))]);
		}
	}, [tickers, marketCapCoin, marketCapCoin?.symbol]);

	const initializeCoin = async () => {
		try {
			if (!coin) return;
			setLoading(true);
			await tickers.loadTickers();
			await loadCoinMarketCap();
			await loadCoinMeta();
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const loadCoinMarketCap = async () => {
		try {
			setLoading(true);
			if (!coin) return;
			const { data } = await CoinMarketCapService.getCoin({ symbol: coin });
			if (!data[coin]) return;
			setMarketCapCoin(data[coin][0]);
			setUSD(data[coin][0].quote?.USD);
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const loadCoinMeta = async () => {
		try {
			if (!coin) return;
			setLoading(true);
			const { results } = await CoinMarketCapService.getCoinInfo({
				symbol: coin,
			});
			if (!results[0]) return;
			setCoinInfo(results[0]);
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<MainLayout>
				<Helmet title={title} meta={[{ name: "description", content: title }]} />
				<div className={styles.coin_details_layout}>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<>
							<Breadcrumbs
								links={[
									{
										link: routes.coin.root,
										label: formatMessage(messages.coin_info_all_coins),
									},
								]}
								current={formatMessage(messages.coin_details)}
							/>
							<Header
								tickers={matchingTickers}
								coinInfo={coinInfo}
								marketCapCoin={marketCapCoin}
								usd={usd}
							/>
							<MainContent isLoading={false} coinInfo={coinInfo} tickers={matchingTickers} />
						</>
					)}
				</div>
			</MainLayout>
			<WebSocket events={[WSListenEventEnum.TICKERS, WSListenEventEnum.TRADES]} />
		</>
	);
};

export default CoinDetails;
