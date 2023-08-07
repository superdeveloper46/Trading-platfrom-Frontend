/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import styles from "styles/pages/Terminal.module.scss";
import commonMessages from "messages/common";
import { useMst } from "models/Root";
import {
	Tickers,
	ChatWalletTrades,
	OrderBookTrades,
	Chart,
	CoinInfo,
	OrdersGroup,
	OrderForm,
	SellOrders,
	BuyOrders,
	OrderFormTablet,
	OrderFormAdvanced,
	OrdersHistory,
	TerminalMobile,
	Positions,
} from "components/Terminal";
import useWindowSize from "hooks/useWindowSize";
import { QUOTED_CURRENCIES_FIAT } from "models/Ticker";
import { TickersQuotedEnum } from "types/ticker";
import useTerminalLayout from "hooks/useTerminalLayout";
import { TerminalLayoutEnum } from "types/exchange";
import useParamQuery from "hooks/useSearchQuery";
import { TERMINAL_LAYOUTS, ACCOUNT_TYPE } from "constants/exchange";
import cache from "helpers/cache";
import { TERMINAL_LAYOUT_CACHE_KEY } from "utils/cacheKeys";
import useAccountType from "hooks/useAccountType";
import { AccountTypeEnum } from "types/account";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import useAutoFetch from "hooks/useAutoFetch";
import TerminalLayout from "layouts/TerminalLayout";
import MarginRiskModal from "components/Terminal/modals/MarginRiskModal";
import { getPageTitle } from "helpers/global";
import { queryVars } from "constants/query";

const ChatWalletTradesWidget = () => (
	<div className={styles.chat_wallet_trades_widget}>
		<ChatWalletTrades />
	</div>
);

const ChartCoinInfoWidget: React.FC<{ isTickersAbsolute?: boolean }> = ({ isTickersAbsolute }) => (
	<div className={cn(styles.chart_coin_info_widget, styles.widget)}>
		{isTickersAbsolute && <Tickers absolute />}
		<CoinInfo />
		<Chart />
	</div>
);

const OrderFormWidget = () => (
	<div className={styles.order_form_widget}>
		<OrderForm />
	</div>
);

const OrderFormWidgetAdvanced = () => (
	<div className={styles.order_form_widget_advanced}>
		<OrderFormAdvanced />
	</div>
);

const OrdersHistoryWidget = () => (
	<div className={styles.orders_widget}>
		<OrdersHistory />
	</div>
);

const PositionsWidget = () => (
	<div className={styles.positions_widget}>
		<Positions />
	</div>
);

const OrdersHistoryPositionsWidget = () => (
	<div className={styles.orders_history_positions}>
		<PositionsWidget />
		<OrdersHistoryWidget />
	</div>
);

const TickersWidget = () => (
	<div className={styles.tickers}>
		<Tickers />
	</div>
);

const SellOrdersWidget = () => (
	<div className={cn(styles.sell_orders, styles.widget)}>
		<SellOrders />
	</div>
);

const BuyOrdersWidget = () => (
	<div className={cn(styles.buy_orders, styles.widget)}>
		<BuyOrders />
	</div>
);

const ChartChatWalletBasic: React.FC<{ isTickersAbsolute?: boolean }> = ({ isTickersAbsolute }) => (
	<div className={styles.chart_chat_wallet_basic}>
		<ChartCoinInfoWidget isTickersAbsolute={isTickersAbsolute} />
		<ChatWalletTrades />
	</div>
);

const TickersChartAdvanced: React.FC<{
	isTickersExpanded?: boolean;
	isTickersAbsolute?: boolean;
	showTickersWidget?: boolean;
}> = ({ isTickersExpanded, isTickersAbsolute, showTickersWidget }) => (
	<div className={cn(styles.tickers_chart_advanced, isTickersExpanded && styles.expanded)}>
		{showTickersWidget && <TickersWidget />}
		<ChartCoinInfoWidget isTickersAbsolute={isTickersAbsolute} />
	</div>
);

const TickersChartChatWalletBasic: React.FC<{ isTickersExpanded?: boolean }> = ({
	isTickersExpanded,
}) => (
	<div className={cn(styles.tickers_chart_chat_wallet_basic, isTickersExpanded && styles.expanded)}>
		<TickersWidget />
		<ChartCoinInfoWidget />
		<ChatWalletTradesWidget />
	</div>
);

const Basic: React.FC<{ isTickersExpanded?: boolean }> = ({ isTickersExpanded }) => (
	<div className={styles.grid_basic}>
		<TickersChartChatWalletBasic isTickersExpanded={isTickersExpanded} />
		<SellOrdersWidget />
		<OrderFormWidget />
		<BuyOrdersWidget />
		<OrdersHistoryWidget />
	</div>
);

const Standard: React.FC<{ isTickersExpanded?: boolean }> = ({ isTickersExpanded }) => (
	<div className={styles.grid_standard}>
		<ChartCoinInfoWidget />
		<OrderFormWidget />
		<div className={styles.orders_group}>
			<OrdersGroup />
		</div>
		<div className={cn(styles.tickers_trades_standard, isTickersExpanded && styles.expanded)}>
			<TickersWidget />
			<ChatWalletTradesWidget />
		</div>
		<OrdersHistoryWidget />
	</div>
);

const Advanced: React.FC<{
	isTickersExpanded?: boolean;
	isTickersAbsolute?: boolean;
	showTickersWidget?: boolean;
	showPositions?: boolean;
}> = ({ isTickersExpanded, isTickersAbsolute, showTickersWidget, showPositions }) => (
	<div className={cn(styles.grid_advanced, showPositions && styles.positions)}>
		<TickersChartAdvanced
			isTickersExpanded={isTickersExpanded}
			isTickersAbsolute={isTickersAbsolute}
			showTickersWidget={showTickersWidget}
		/>
		<OrderBookTrades />
		{showPositions ? <OrdersHistoryPositionsWidget /> : <OrdersHistoryWidget />}
		<OrderFormWidgetAdvanced />
	</div>
);

interface ITablet {
	isTickersAbsolute: boolean;
	smallTablet: boolean;
}

const Tablet: React.FC<ITablet> = ({ isTickersAbsolute, smallTablet }) => (
	<div className={styles.grid_basic}>
		<ChartChatWalletBasic isTickersAbsolute={isTickersAbsolute} />
		{smallTablet ? (
			<div className={styles.sell_buy_form}>
				<SellOrdersWidget />
				<BuyOrdersWidget />
				<OrderFormWidget />
			</div>
		) : (
			<>
				<SellOrdersWidget />
				<OrderFormTablet />
				<BuyOrdersWidget />
			</>
		)}
		<OrdersHistoryWidget />
	</div>
);

const Terminal: React.FC = () => {
	const {
		terminal,
		account: { loadRates, profileStatus, loadMarginStatus, loadProfileStatus },
		tickers,
		global: { isAuthenticated, isWSDown },
		finance: { loadMarginOptions, marginRequiredVerificationLevel },
		render,
	} = useMst();
	const [isMarginRiskModalOpened, setIsMarginRiskModalOpened] = useState<boolean>(false);
	const { pair: pairParams } = useParams<{ [queryVars.pair]: string }>();
	const { formatMessage, formatNumber } = useIntl();
	const { smallDesktop, smallTablet, medium, width } = useWindowSize();
	const navigate = useNavigate();
	const layout = useTerminalLayout();
	const type = useAccountType();
	const paramQuery = useParamQuery();
	const queryLayout = paramQuery.get(queryVars.layout);
	const queryType = paramQuery.get(queryVars.type);
	const price = terminal.pair
		? formatNumber(terminal.pair.close, {
				useGrouping: false,
				maximumFractionDigits: terminal.pair.price_precision ?? 8,
		  })
		: 0;
	const name = terminal.pair?.symbol?.replace("_", "/") ?? "";
	const title = getPageTitle(
		terminal.pair
			? `${price} | ${name} | ${formatMessage(commonMessages.exchange)}`
			: `${formatMessage(commonMessages.exchange)}`,
	);

	useEffect(() => {
		document.title = title;
	}, [title]);

	const desc = getPageTitle(
		terminal.pair
			? `${formatMessage(commonMessages.exchange)} ${name}, ${formatMessage(
					commonMessages.price,
			  )} ${price} ${name}`
			: `${formatMessage(commonMessages.exchange)}`,
	);

	const loadExchange = () => {
		terminal.loadExchange(isAuthenticated);
	};

	const loadTickers = () => {
		tickers.loadTickers();
	};

	const handleCloseMarginRiskModal = () => {
		setIsMarginRiskModalOpened(false);
		navigate({ [queryVars.search]: `?${queryVars.layout}=${layout}&${queryVars.type}=spot` });
	};

	const handleCloseAcceptedMarginRiskModal = () => {
		setIsMarginRiskModalOpened(false);
		loadProfileStatus();
	};

	useEffect(() => {
		if (
			[AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(type) &&
			profileStatus?.isMarginRulesAcceptRequired
		) {
			setIsMarginRiskModalOpened(true);
		}
	}, [type, profileStatus?.isMarginRulesAcceptRequired]);

	useEffect(() => {
		loadTickers();
		if (render.margin) {
			loadMarginOptions();
		}
	}, []);

	useEffect(() => {
		loadExchange();
	}, [terminal.ticker?.symbol, isAuthenticated]);

	useAutoFetch(loadTickers, isWSDown);
	useAutoFetch(loadExchange, isWSDown);

	const processTickers = () => {
		if (tickers.isLoaded) {
			const nextTicker = tickers.list.find((t) => t.symbol === pairParams);
			if (nextTicker) {
				if (tickers.filter.quotedCurrency !== TickersQuotedEnum.FAVORITES) {
					tickers.filter.setQuotedCurrency(
						QUOTED_CURRENCIES_FIAT.includes(nextTicker.quote_currency_code)
							? TickersQuotedEnum.FIAT
							: nextTicker.quote_currency_code,
					);
				}
				terminal.setTicker(nextTicker);
			}
		}
	};

	useEffect(() => {
		processTickers();
	}, [pairParams, tickers.list.length, tickers.isLoaded]);

	// reload tickers filter state for spot trading (margin only with advanced view)
	useEffect(() => {
		if (layout !== TerminalLayoutEnum.ADVANCED) {
			tickers.filter.resetState();
			processTickers();
		}
	}, [layout]);

	useEffect(() => {
		if (isAuthenticated) {
			loadRates();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (
			isAuthenticated &&
			render.margin &&
			(type === AccountTypeEnum.CROSS || (type === AccountTypeEnum.ISOLATED && pairParams))
		) {
			loadMarginStatus({
				[queryVars.wallet_type]: ACCOUNT_TYPE[type],
				[queryVars.pair]: type === AccountTypeEnum.ISOLATED ? pairParams : undefined,
			});
		}
	}, [type, pairParams, isAuthenticated]);

	useEffect(() => {
		if (
			!queryLayout ||
			!queryType ||
			!TERMINAL_LAYOUTS.includes(queryLayout as TerminalLayoutEnum)
		) {
			navigate({ [queryVars.search]: `?${queryVars.layout}=${layout}&${queryVars.type}=${type}` });
		}
		cache.setItem(TERMINAL_LAYOUT_CACHE_KEY, layout);
	}, [layout, queryLayout, type, queryType]);

	const renderTerminal = () => {
		if (smallDesktop) {
			return medium ? (
				<TerminalMobile />
			) : (
				<Tablet isTickersAbsolute={terminal.isTickersAbsolute} smallTablet={smallTablet} />
			);
		}
		switch (layout) {
			case TerminalLayoutEnum.STANDARD:
				return <Standard isTickersExpanded={terminal.isTickersExpanded} />;
			case TerminalLayoutEnum.ADVANCED:
				return (
					<Advanced
						isTickersExpanded={terminal.isTickersExpanded}
						isTickersAbsolute={terminal.isTickersAbsolute}
						showTickersWidget={width > 1820}
						showPositions={render.margin && type !== AccountTypeEnum.SPOT}
					/>
				);
			default:
				return <Basic isTickersExpanded={terminal.isTickersExpanded} />;
		}
	};

	return (
		<TerminalLayout mobile={medium}>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: desc },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: desc },
					{ name: "twitter:description", content: desc },
				]}
			/>
			{renderTerminal()}
			<WebSocket
				events={[
					WSListenEventEnum.ORDERS,
					WSListenEventEnum.ORDERS_PAIR,
					WSListenEventEnum.TICKERS,
					WSListenEventEnum.FUNDS,
					WSListenEventEnum.ORDERBOOK,
					WSListenEventEnum.TRADES,
					WSListenEventEnum.CHAT,
				]}
			/>
			{isMarginRiskModalOpened && (
				<MarginRiskModal
					onClose={handleCloseMarginRiskModal}
					onCloseAccepted={handleCloseAcceptedMarginRiskModal}
					requiredVerificationLevel={marginRequiredVerificationLevel}
				/>
			)}
		</TerminalLayout>
	);
};

export default observer(Terminal);
