import ApiClient from "helpers/ApiClient";
import { IHistoryOrder } from "models/History";
import { IMarginCurrencyStatus } from "models/Terminal";
import { ITicker } from "models/Ticker";
import {
	ICreateOrderBody,
	IGetExchangeParams,
	IGetMarginCurrencyStatusParams,
	IMarginBorrowBody,
	IMarginTransferBody,
} from "types/exchange";
import { queryVars } from "constants/query";

const ExchangeService = {
	getTickers: (): Promise<ITicker[]> => ApiClient.get("web/finance/tickers"),
	getExchange: (params: IGetExchangeParams): Promise<Record<string, unknown>> =>
		ApiClient.get("web/finance/exchange", params),
	getChartData: (pair: string, resolution: string, params: any): Promise<any> =>
		ApiClient.get(`charts/${pair}/${resolution}/chart/`, params),
	cancelOrder: (orderId: number): Promise<any> =>
		ApiClient.post("web/finance/cancel-order", { [queryVars.order_id]: orderId }),
	cancelAllOrders: (params?: { [queryVars.pair]?: string }): Promise<any> =>
		ApiClient.post("web/finance/cancel-open-orders", params),
	createOrder: (body: ICreateOrderBody): Promise<IHistoryOrder> =>
		ApiClient.post("web/margin/create-order", body),
	getCurrencyStatus: (params: IGetMarginCurrencyStatusParams): Promise<IMarginCurrencyStatus> =>
		ApiClient.get("web/margin/currency-status", params),
	updateFavoritePair: (symbol: string, isFavorite: boolean): Promise<void> =>
		ApiClient.post("web/finance/favorite-pair", {
			symbol,
			[queryVars.is_favorite]: isFavorite,
		}),
	marginBorrow: (body: IMarginBorrowBody): Promise<void> =>
		ApiClient.post("web/margin/borrow", body),
	marginRepay: (body: IMarginBorrowBody): Promise<void> => ApiClient.post("web/margin/repay", body),
	marginTransfer: (body: IMarginTransferBody): Promise<void> =>
		ApiClient.post("web/margin/transfer", body),
	acceptMarginTerms: (): Promise<void> =>
		ApiClient.post("web/margin/accept-margin-terms", { accept_terms: true }),
};

export default ExchangeService;
