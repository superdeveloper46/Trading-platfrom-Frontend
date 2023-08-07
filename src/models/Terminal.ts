import { observable } from "mobx";
import { applySnapshot, cast, flow, getSnapshot, Instance, types as t } from "mobx-state-tree";
import cache from "helpers/cache";
import config from "helpers/config";
import { placeOrderInOrderbook, formatOrders } from "helpers/exchange";
import ExchangeService from "services/ExchangeService";
import { IOrderBookData, TerminalMobileWidgetEnum } from "types/exchange";
import { TerminalModelNamesEnum } from "types/models";
import { OrderSideEnum } from "types/orders";
import { TERMINAL_LATEST_PAIR_CACHE_KEY } from "utils/cacheKeys";
import errorHandler from "utils/errorHandler";
import { getPrecision } from "utils/format";
import { MAX_PRICE_PRECISION } from "utils/constants";
import { queryVars } from "constants/query";
import { ITicker, Ticker } from "./Ticker";

export interface IOrderBookOrder {
	amount: number;
	amount2: number;
	key: string;
	last_update: number;
	orderDepth: number;
	price: number;
	progress: string;
	unique: boolean;
}

export const orderBook = observable({
	buy: [] as IOrderBookOrder[],
	sell: [] as IOrderBookOrder[],
	update(buy: IOrderBookOrder[], sell: IOrderBookOrder[]) {
		this.buy = buy;
		this.sell = sell;
	},
	get maxViewSize() {
		return typeof +config.maxOrderBookSize === "number" ? +config.maxOrderBookSize : 100;
	},
	get totalBuy() {
		return this.buy.reduce((a: number, b: IOrderBookOrder) => +a + b.amount * b.price, 0); // quote amount
	},
	get totalSell() {
		return this.sell.reduce((a: number, b: IOrderBookOrder) => +a + b.amount, 0); // base amount
	},
});

export interface IRecentTrade {
	id: number;
	amount: number;
	date: number;
	price: number;
	type: number;
	symbol: string;
}

export const trades = observable({
	list: [] as IRecentTrade[],
	init(trades: IRecentTrade[]) {
		this.list = trades;
	},
	add(trade: IRecentTrade) {
		this.list.unshift(trade);
	},
	get recentTrade() {
		return this.list.length > 0 ? this.list[0] : null;
	},
});

const MarginCurrencyStatusCurrency = t.model({
	brand_color: t.string,
	code: t.string,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	is_fiat: t.boolean,
	name: t.string,
	precision: t.number,
});

const MarginCurrencyStatusPair = t.model({
	amount_precision: t.maybeNull(t.number),
	base_currency_code: t.maybeNull(t.string),
	name: t.maybeNull(t.string),
	price_precision: t.maybeNull(t.number),
	quote_currency_code: t.maybeNull(t.string),
	symbol: t.maybeNull(t.string),
});

const MarginCurrencyStatus = t.model({
	wallet_type: t.number,
	balance: t.number,
	borrowable: t.number,
	borrowed: t.number,
	currency: MarginCurrencyStatusCurrency,
	debt_mc: t.number,
	interest: t.number,
	interest_rate: t.number,
	leverage: t.number,
	margin_level: t.number,
	pair: t.maybeNull(MarginCurrencyStatusPair),
	price: t.number,
	reserve: t.number,
	total_mc: t.number,
	transferable: t.number,
});
export interface IMarginCurrencyStatus extends Instance<typeof MarginCurrencyStatus> {}

const MarginCurrency = t
	.model({
		base: t.optional(t.maybeNull(MarginCurrencyStatus), null),
		quote: t.optional(t.maybeNull(MarginCurrencyStatus), null),
	})
	.views((self) => ({
		get availableBase() {
			return self.base ? self.base.balance - self.base.reserve : 0;
		},
		get availableQuote() {
			return self.quote ? self.quote.balance - self.quote.reserve : 0;
		},
	}))
	.views((self) => ({
		get availablePlusBorrowableBase() {
			return self.base ? self.availableBase + self.base.borrowable : 0;
		},
		get availablePlusBorrowableQuote() {
			return self.quote ? self.availableQuote + self.quote.borrowable : 0;
		},
	}))
	.views((self) => ({
		getAvailable(side: OrderSideEnum) {
			return side === OrderSideEnum.BUY ? self.availableQuote : self.availableBase;
		},
		getAvailablePlusBorrowable(side: OrderSideEnum) {
			return side === OrderSideEnum.BUY
				? self.availablePlusBorrowableQuote
				: self.availablePlusBorrowableBase;
		},
		getDebt(side: OrderSideEnum) {
			return side === OrderSideEnum.BUY
				? self.base
					? self.base.borrowed + self.base.interest
					: 0
				: self.quote
				? self.quote.borrowed + self.quote.interest
				: 0;
		},
	}));
export interface IMarginCurrency extends Instance<typeof MarginCurrency> {}

const Pair = t
	.model(TerminalModelNamesEnum.PAIR, {
		id: t.string,
		label: t.string,
		amount_precision: t.number,
		base_currency_name: t.string,
		quote_currency_name: t.string,
		maker_fee_rate: t.number,
		maximum_order_size: t.number,
		minimum_order_size: t.number,
		minimum_order_value: t.number,
		price_precision: t.number,
		close: t.number,
		base_currency_code: t.string,
		cross_margin_leverage: t.number,
		isolated_margin_leverage: t.number,
		quote_currency_code: t.string,
		symbol: t.string,
		taker_fee_rate: t.number,
		low: t.number,
		high: t.number,
		base_volume: t.number,
		change: t.number,
		change_percent: t.number,
	})
	.views((self) => ({
		get fullName() {
			return `${self.base_currency_name}/${self.quote_currency_name}`;
		},
	}));
export interface IPair extends Instance<typeof Pair> {}

const Order = t.model(TerminalModelNamesEnum.ORDER, {
	amount: t.number,
	amount2: t.number,
	key: t.identifier,
	last_update: t.number,
	orderDepth: t.number,
	price: t.number,
	progress: t.string,
	unique: t.boolean,
});
export interface IOrder extends Instance<typeof Order> {}

const TradeForm = t
	.model({
		clickedSellOrder: t.optional(t.maybeNull(Order), null),
		clickedBuyOrder: t.optional(t.maybeNull(Order), null),
	})
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({
		setClickedOrder(nextOrder: IOrder, type: OrderSideEnum) {
			if (type === OrderSideEnum.SELL) {
				self.clickedBuyOrder = cast({ ...nextOrder });
			} else {
				self.clickedSellOrder = cast({ ...nextOrder });
			}
		},
	}));
export interface ITradeForm extends Instance<typeof TradeForm> {}

export const Terminal = t
	.model({
		ticker: t.maybe(t.reference(Ticker)),
		pair: t.optional(t.maybeNull(Pair), null),
		displayChartOrders: t.optional(t.boolean, true),
		isTickersAbsolute: t.optional(t.boolean, false),
		isTickersExpanded: t.optional(t.boolean, true),
		isQuickOrderPlacementOpen: t.optional(t.boolean, false),
		isLoading: t.optional(t.boolean, false),
		isLoaded: t.optional(t.boolean, false),
		tradeForm: t.optional(TradeForm, {}),
		showAllOpenedOrders: t.optional(t.boolean, false),
		marginCurrency: t.optional(MarginCurrency, {}),
		mobileActiveWidget: t.optional(t.string, TerminalMobileWidgetEnum.TRADE),
		chartSubscribeSymbol: t.optional(t.string, ""),
		orderBookPrecision: t.optional(t.number, MAX_PRICE_PRECISION),
	})
	.views((self) => ({
		get recentTrades() {
			return trades.list.filter((t) => t.symbol === self.pair?.symbol ?? "");
		},
	}))
	.views((self) => ({
		get recentTradeDiff() {
			return self.recentTrades.length > 1
				? (self.recentTrades[0]?.price ?? 0) - (self.recentTrades[1]?.price ?? 0)
				: 0;
		},
		get recentTrade() {
			return self.recentTrades.length > 0 ? self.recentTrades[0] : null;
		},
	}))
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({
		setTicker(nextTicker: ITicker) {
			self.ticker = nextTicker;
		},
		setOrderBookPrecision(v: number) {
			self.orderBookPrecision = v;
		},
		toggleDisplayChartOrders() {
			self.displayChartOrders = !self.displayChartOrders;
		},
		setIsLoaded(nextIsLoaded: boolean) {
			self.isLoaded = nextIsLoaded;
		},
		setShowAllOpenedOrders(nextShowAllOpenedOrders: boolean) {
			self.showAllOpenedOrders = nextShowAllOpenedOrders;
		},
		setIsQuickOrderPlacementOpen(nextIsOpen: boolean) {
			self.isQuickOrderPlacementOpen = nextIsOpen;
		},
		setChartSubscribeSymbol(nextSymbol: string) {
			self.chartSubscribeSymbol = nextSymbol;
		},
		addRecentTrade(trade: IRecentTrade) {
			trades.add(trade);
		},
		updatePair(nextPair: IPair) {
			self.pair = cast(nextPair);
		},
		setIsTickersExpanded(nextIsTickersExpanded: boolean) {
			self.isTickersExpanded = nextIsTickersExpanded;
		},
		setIsTickersAbsolute(nextisTickersAbsolute: boolean) {
			self.isTickersExpanded = true;
			self.isTickersAbsolute = nextisTickersAbsolute;
		},
		setMobileActiveWidget(nextActiveWidget: TerminalMobileWidgetEnum) {
			self.mobileActiveWidget = nextActiveWidget;
		},
		updateOrderBook(data: IOrderBookData) {
			const nextOrderBook: { buy: string[][]; sell: string[][] } = {
				buy: orderBook.buy.map((o: IOrder) => [o.key, o.amount.toString()]),
				sell: orderBook.sell.map((o: IOrder) => [o.key, o.amount.toString()]),
			};

			const minOrderAmount = self.pair?.amount_precision ? 10 ** -self.pair.amount_precision : 0;

			if (data.symbol === self.pair?.symbol) {
				if (Array.isArray(data.bids) && data.bids.length) {
					for (let i = 0; i < data.bids.length; i++) {
						if (data.bids[i].length > 1 && Math.abs(+data.bids[i][1]) >= minOrderAmount) {
							nextOrderBook.buy = placeOrderInOrderbook(nextOrderBook.buy, data.bids[i], "buy");
						}
					}
				}

				if (Array.isArray(data.asks) && data.asks.length) {
					for (let i = 0; i < data.asks.length; i++) {
						if (data.asks[i].length > 1 && Math.abs(+data.asks[i][1]) >= minOrderAmount) {
							nextOrderBook.sell = placeOrderInOrderbook(nextOrderBook.sell, data.asks[i], "sell");
						}
					}
				}

				orderBook.update(
					formatOrders(nextOrderBook.buy, self.ticker?.price_precision ?? 8),
					formatOrders(nextOrderBook.sell, self.ticker?.price_precision ?? 8),
				);
			}
		},
	}))
	.actions((self) => ({
		loadExchange: flow(function* (isAuthenticated?: boolean) {
			if (self.ticker) {
				try {
					self.isLoading = true;
					const data = yield ExchangeService.getExchange({
						pair: self.ticker.symbol,
						coin_info: true,
						recent_trades: true,
						v2: true,
						wallets: isAuthenticated,
						depth: true,
					});
					if (!data) {
						return;
					}
					if (Array.isArray(data.recent_trades)) {
						data.recent_trades.forEach((t: IRecentTrade) => {
							t.amount = t.amount ?? 0;
							t.date = t.date ?? 0;
							t.price = t.price ?? 0;
							t.symbol = self.ticker?.symbol ?? "";
							t.type = t.type ?? 0;
						});
						trades.init(data.recent_trades);
					}
					if (data.pair && typeof data.pair === "object") {
						// TODO refactor
						data.pair.close = self.ticker.close;
						data.pair.low = self.ticker.low;
						data.pair.high = self.ticker.high;
						data.pair.base_volume = self.ticker.base_volume;
						data.pair.change = self.ticker.change;
						data.pair.change_percent = self.ticker.change_percent;
						self.pair = cast({
							...self.ticker,
							...data.pair,
							base_currency_name: self.ticker.base_currency.name,
							quote_currency_name: self.ticker.quote_currency.name,
						});
						self.setOrderBookPrecision(getPrecision(data.pair.price_precision));
						cache.setItem(TERMINAL_LATEST_PAIR_CACHE_KEY, data.pair.symbol);
					}
					if (data.depth && data.depth.bids && data.depth.asks) {
						const minOrderAmount = data.pair?.amount_precision
							? 10 ** -data.pair.amount_precision
							: 0;
						self.tradeForm.resetState();
						data.depth.asks = data.depth.asks.filter((o: string[]) => +o[1] >= minOrderAmount);
						data.depth.bids = data.depth.bids.filter((o: string[]) => +o[1] >= minOrderAmount);

						orderBook.update(
							formatOrders(data.depth.bids, data.pair.price_precision),
							formatOrders(data.depth.asks, data.pair.price_precision),
						);
					}
				} catch (err) {
					console.error(err);
				} finally {
					self.isLoading = false;
					self.isLoaded = true;
				}
			}
		}),
		loadMarginCurrency: flow(function* (
			accountType: number,
			baseCurrencyCode: string,
			quoteCurrencyCode: string,
			pair?: string,
		) {
			try {
				const baseStatus = yield ExchangeService.getCurrencyStatus({
					[queryVars.wallet_type]: accountType,
					currency: baseCurrencyCode,
					pair: pair,
				});
				const quoteStatus = yield ExchangeService.getCurrencyStatus({
					[queryVars.wallet_type]: accountType,
					currency: quoteCurrencyCode,
					pair: pair,
				});
				if (baseStatus && quoteStatus) {
					self.marginCurrency = cast({ base: baseStatus, quote: quoteStatus });
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export interface ITerminal extends Instance<typeof Terminal> {}
