import { queryVars } from "constants/query";

export enum TerminalLayoutEnum {
	BASIC = "basic",
	STANDARD = "standard",
	ADVANCED = "advanced",
	FULLSCREEN = "fullscreen",
}

export enum TerminalMobileWidgetEnum {
	WALLETS = "wallets",
	RECENT_TRADES = "recent_trades",
	MARKETS = "markets",
	TRADE = "TRADE",
}

export interface ITickersQuotedTabs {
	spot: string[];
	cross: string[];
	isolated: string[];
	[key: string]: string[];
}

export enum TradeTypeEnum {
	SPOT = "spot",
	CROSS = "cross",
	ISOLATED = "isolated",
}

export enum ChatWalletsTradesEnum {
	CHAT = "chat",
	WALLETS = "wallets",
	TRADES = "trades",
}

export enum ChartEventEnum {
	LANGUAGE = "language",
	SYMBOL = "symbol",
	ADD_TRADE = "add_trade",
	HIDE_ORDERS = "hide_orders",
	DISPLAY_ORDERS = "display_orders",
	CHANGE_THENE = "change_theme",
	ADD_DEFAULT_STUDIES = "default_studies",
}

export enum ChartThemesEnum {
	LIGHT = "Light",
	DARK = "Dark",
}

export enum OrderbookViewVariantEnum {
	GROUP = "group",
	BUY = "buy",
	SELL = "sell",
}

export enum OrderMarginActionEnum {
	BORROW = "borrow",
	REPAY = "repay",
}

export enum OrderbookTradesVariantEnum {
	ORDEBOOK = "orderbook",
	TRADES = "trades",
	ORDERBOOK_TRADES = "orderbook-trades",
}

export enum OrdersHistoryTypeEnum {
	OPENED = "opened",
	CLOSED = "closed",
	TRIGGER = "trigger",
	FUNDS = "funds",
}

export enum MarginActionTypeEnum {
	NORMAL = "normal",
	BORROW = "borrow",
	REPAY = "repay",
}

export interface ICreateOrderBody {
	type: string;
	side: string;
	symbol: string;
	amount?: string;
	price?: string;
	pair?: string;
	side_effect?: string;
	stop_price?: string;
	stop_operator?: string;
	wallet_type?: string;
	quote_amount?: string;
	[key: string]: any;
}

export interface IGetExchangeParams {
	pair: string;
	coin_info?: boolean;
	recent_trades?: boolean;
	v2?: boolean;
	wallets?: boolean;
	depth?: boolean;
}

export interface IGetMarginCurrencyStatusParams {
	[queryVars.wallet_type]: number;
	[queryVars.currency]: string;
	[queryVars.pair]?: string;
}

export enum RecentTradeTypeEnum {
	Sell = "sell",
	Buy = "buy",
}

export interface IOrderBookData {
	symbol?: string;
	bids: string[][];
	asks: string[][];
}

export enum MobileFilterOrderSideEnum {
	ALL = "all",
	BUY = "buy",
	SELL = "sell",
}

export enum MobileFilterHistoryOrdersEnum {
	ALL = "all",
	BUY = "buy",
	SELL = "sell",
}

export enum MarginModalEnum {
	BORROW = "borrow",
	TRANSFER = "transfer",
	REPAY = "repay",
}

export interface IMarginBorrowBody {
	[queryVars.wallet_type]: number;
	[queryVars.currency]: string;
	[queryVars.amount]: number;
	[queryVars.pair]?: string;
}

export interface IMarginTransferBody {
	[queryVars.direction]: number;
	[queryVars.wallet_type]: number;
	[queryVars.currency]: string;
	[queryVars.amount]: number;
	note?: string;
	[queryVars.pair]?: string;
}
