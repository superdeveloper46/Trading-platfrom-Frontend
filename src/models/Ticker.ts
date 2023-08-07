import {
	applySnapshot,
	cast,
	flow,
	getParent,
	getSnapshot,
	Instance,
	types as t,
} from "mobx-state-tree";

import config from "helpers/config";
import cache from "helpers/cache";
import ExchangeService from "services/ExchangeService";
import { TradeTypeEnum } from "types/exchange";
import { ITickerWS, TickersQuotedEnum } from "types/ticker";
import { FAVORITE_TICKERS_CACHE_KEY, TICKERS_LOW_LIQUIDITY_CACHE_KEY } from "utils/cacheKeys";
import { TickerModelNamesEnum } from "types/models";
import errorHandler from "utils/errorHandler";
import { CompareSymbol, SearchSymbolResultItem } from "charting_library/charting_library";
import { queryVars } from "constants/query";
import { IRootStore } from "./Root";

export const QUOTED_CURRENCIES_BASE = config.tickersQuotedCurrenciesBase
	.split(",")
	.filter((curr) => !!curr);
export const QUOTED_CURRENCIES_FIAT = config.tickersQuotedCurrenciesFiat
	.split(",")
	.filter((curr) => !!curr);
export const QUOTED_CURRENCIES_ALL = QUOTED_CURRENCIES_BASE.concat(QUOTED_CURRENCIES_FIAT).concat([
	TickersQuotedEnum.FIAT,
	TickersQuotedEnum.FAVORITES,
]);

const filterCross = (t: ITicker): boolean => (t.cross_margin_leverage ?? 0) > 0;
const filterIsolated = (t: ITicker): boolean => (t.isolated_margin_leverage ?? 0) > 0;
const mapQuotedCodes = (t: ITicker): string => t.quote_currency?.code ?? "";

const Currency = t.model({
	code: t.string,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	name: t.string,
});

export const Ticker = t
	.model(TickerModelNamesEnum.TICKER, {
		amount_precision: t.number,
		base_currency: Currency,
		base_currency_code: t.string,
		base_volume: t.number,
		change: t.number,
		change_percent: t.number,
		close: t.number,
		cross_margin_leverage: t.number,
		isolated_margin_leverage: t.number,
		high: t.number,
		is_defi: t.boolean,
		is_enabled: t.boolean,
		is_favorite: t.boolean,
		is_limit_enabled: t.boolean,
		is_low: t.optional(t.boolean, false),
		is_market_enabled: t.boolean,
		is_stop_limit_enabled: t.boolean,
		label: t.string,
		low: t.number,
		maximum_order_size: t.number,
		minimum_order_size: t.number,
		minimum_order_value: t.number,
		open: t.number,
		price_precision: t.number,
		quote_currency: Currency,
		quote_currency_code: t.string,
		quote_volume: t.number,
		symbol: t.identifier,
		updated_at: t.string,
	})
	.views((self) => ({
		get changePercent() {
			const fixedPercent = +self.change_percent.toFixed(2);
			return fixedPercent < 0.01 && fixedPercent > -0.01 ? 0 : fixedPercent;
		},
		get fullName() {
			return `${self.base_currency.name}/${self.quote_currency.name}`;
		},
	}))
	.actions((self) => ({
		setClose(nextClose: number) {
			self.close = nextClose;
		},
		setIsFavorite(nextIsFavorite: boolean) {
			self.is_favorite = nextIsFavorite;
			const cachedTickers: string[] = cache.getItem(FAVORITE_TICKERS_CACHE_KEY, "[]");

			if (nextIsFavorite) {
				cachedTickers.push(self.symbol);
				cache.setItem(FAVORITE_TICKERS_CACHE_KEY, cachedTickers);
			} else {
				const idx = cachedTickers.findIndex((t) => t === self.symbol);
				if (idx !== -1) {
					cachedTickers.splice(idx, 1);
					cache.setItem(FAVORITE_TICKERS_CACHE_KEY, cachedTickers);
				}
			}
		},
	}));
export type ITicker = Instance<typeof Ticker>;

const TickersFilter = t
	.model("TickersFilter", {
		lowLiquidity: t.optional(t.boolean, cache.getItem(TICKERS_LOW_LIQUIDITY_CACHE_KEY, "true")),
		tradeType: t.optional(t.string, TradeTypeEnum.SPOT),
		quotedCurrency: t.optional(t.string, ""),
		sort: t.optional(t.string, "symbol.asc"), // [name.asc|desc]
		search: t.optional(t.string, ""),
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
		setLowLiquidity(nextLowLiquidity: boolean) {
			self.lowLiquidity = nextLowLiquidity;
			cache.setItem(TICKERS_LOW_LIQUIDITY_CACHE_KEY, nextLowLiquidity);
		},
		setTradeType(nextTradeType: TradeTypeEnum) {
			self.tradeType = nextTradeType;
		},
		setSort(nextSort: string) {
			self.sort = nextSort;
		},
		setQuotedCurrency(nextQuotedCurrency: string) {
			self.quotedCurrency = QUOTED_CURRENCIES_ALL.includes(nextQuotedCurrency)
				? nextQuotedCurrency
				: QUOTED_CURRENCIES_BASE[0];
		},
		setSearch(nextSearch: string) {
			self.search = nextSearch;
		},
	}));

export const Tickers = t
	.model({
		list: t.optional(t.array(Ticker), []),
		isLoading: t.optional(t.boolean, false),
		isLoaded: t.optional(t.boolean, false),
		filter: t.optional(TickersFilter, {}),
	})
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.views((self) => ({
		get chartCompareSymbols(): SearchSymbolResultItem[] {
			return self.list.map((t) => ({
				symbol: t.symbol.replace("_", "/"),
				full_name: t.label,
				description: `${t.base_currency.name}/${t.quote_currency.name}`,
				exchange: config.department ?? "",
				ticker: t.symbol,
				type: "",
			}));
		},
		get hasLowLiquidity() {
			return self.list.filter((t) => t.is_low).length > 0;
		},
		get formattedList() {
			const nextList = self.list.filter((t) => {
				const searchFilter = self.filter.search
					? t.base_currency.code.toUpperCase().includes(self.filter.search.toUpperCase()) ||
					  t.base_currency.name.toUpperCase().includes(self.filter.search.toUpperCase())
					: true;
				const marginIsolatedFilter =
					self.filter.tradeType === TradeTypeEnum.ISOLATED
						? (t.isolated_margin_leverage ?? 0) > 0
						: true;
				const marginCrossFilter =
					self.filter.tradeType === TradeTypeEnum.CROSS ? (t.cross_margin_leverage ?? 0) > 0 : true;
				const lowFilter = self.filter.lowLiquidity ? true : !t.is_low;
				const quoteFilter =
					self.filter.quotedCurrency === TickersQuotedEnum.FIAT
						? QUOTED_CURRENCIES_FIAT.includes(t.quote_currency_code)
						: self.filter.quotedCurrency === TickersQuotedEnum.FAVORITES
						? t.is_favorite
						: t.quote_currency_code === self.filter.quotedCurrency;

				return (
					searchFilter && lowFilter && marginCrossFilter && marginIsolatedFilter && quoteFilter
				);
			});

			const [sortName, sortValue] = self.filter.sort.split(".");
			nextList.sort((ticker1: ITicker, ticker2: ITicker) => {
				switch (sortName) {
					case "symbol":
						return sortValue === queryVars.asc
							? ticker1.symbol.localeCompare(ticker2.symbol)
							: ticker2.symbol.localeCompare(ticker1.symbol);
					case "close":
						return sortValue === queryVars.asc
							? ticker1.close - ticker2.close
							: ticker2.close - ticker1.close;
					case "quote_volume":
						return sortValue === queryVars.asc
							? ticker1.quote_volume - ticker2.quote_volume
							: ticker2.quote_volume - ticker1.quote_volume;
					case "change_percent":
						return sortValue === queryVars.asc
							? ticker1.change_percent - ticker2.change_percent
							: ticker2.change_percent - ticker1.change_percent;
					default:
						return 0;
				}
			});

			return nextList;
		},
	}))
	.views((self) => ({
		get maxCrossLeverage() {
			return Math.max(...self.list.map((t) => t.cross_margin_leverage ?? 0));
		},
		get maxIsolatedLeverage() {
			return Math.max(...self.list.map((t) => t.isolated_margin_leverage ?? 0));
		},
		get quotedCurrenciesCross() {
			return Array.from(new Set(self.list.filter(filterCross).map(mapQuotedCodes)));
		},
		get quotedCurrenciesIsolated() {
			return Array.from(new Set(self.list.filter(filterIsolated).map(mapQuotedCodes)));
		},
	}))
	.views((self) => ({
		get quotedCurrencies(): Record<string, string[]> {
			return {
				[TradeTypeEnum.SPOT]: QUOTED_CURRENCIES_BASE,
				[TradeTypeEnum.CROSS]: self.quotedCurrenciesCross,
				[TradeTypeEnum.ISOLATED]: self.quotedCurrenciesIsolated,
			};
		},
	}))
	.actions((self) => ({
		updateTickersWS(tickers: ITickerWS[]) {
			const nextTickers = [...self.list];
			tickers.forEach((t) => {
				const idx = nextTickers.findIndex((nt) => nt.symbol === t.symbol);
				if (idx !== -1) {
					nextTickers[idx] = {
						...nextTickers[idx],
						...t,
					};
				}
			});
			self.list = cast(nextTickers);

			const account = getParent<IRootStore>(self).account;
			account.updateBalancesValuations();
		},
	}))
	.actions((self) => ({
		loadTickers: flow(function* () {
			try {
				self.isLoading = true;
				const tickers = yield ExchangeService.getTickers();
				if (Array.isArray(tickers)) {
					const cachedTickers: string[] = cache.getItem(FAVORITE_TICKERS_CACHE_KEY, "[]");
					tickers.forEach((t: ITicker) => {
						t.open = t.open ?? 0;
						t.close = t.close ?? 0;
						t.high = t.high ?? 0;
						t.low = t.low ?? 0;
						t.cross_margin_leverage = t.cross_margin_leverage ?? 0;
						t.isolated_margin_leverage = t.isolated_margin_leverage ?? 0;
						t.is_favorite = cachedTickers.includes(t.symbol);
					});
					self.list = cast(tickers);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
				self.isLoaded = true;
			}
		}),
		updateFavoritePair: flow(function* (symbol: string, isFavorite: boolean) {
			try {
				yield ExchangeService.updateFavoritePair(symbol, isFavorite);
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export type ITickers = Instance<typeof Tickers>;
