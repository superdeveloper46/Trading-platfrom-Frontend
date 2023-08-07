import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IHistoryOrder, IHistoryOrderTrade, IPosition } from "models/History";
import { IPaginationRes } from "types/general";
import {
	IBorrow,
	IHistoryParams,
	IGetOrdersParams,
	IGetPositionsParams,
	IGetProfileTradesParams,
	IInterest,
	ILiquidation,
	IMarginCall,
	IRepay,
	ITrade,
	ITransfer,
} from "types/history";
import { queryVars } from "constants/query";

const CurrencyRegExp = /^[0-9A-Z]{1,10}$/;

type TPlainObject = {
	[key: string]: any;
};

export const depositAndWithdrawsLoadingValidate = (body: TPlainObject): TPlainObject => {
	const sentBody = { ...body };

	Object.keys(body).forEach((key) => {
		if (body[key] && key === queryVars.currency && !CurrencyRegExp.test(body[key])) {
			sentBody[key] = null;
		}
	});

	return sentBody;
};

const HistoryService = {
	getOrders: (params: IGetOrdersParams): Promise<IPaginationRes<IHistoryOrder>> =>
		ApiClient.get("web/profile/orders", params),
	getOrder: (id: number): Promise<{ trades: IHistoryOrderTrade[] }> =>
		ApiClient.get(`web/profile/orders/${id}`, { trades: true }),
	getPositions: (params: IGetPositionsParams): Promise<IPosition[]> =>
		ApiClient.get("web/margin/positions", params),
	getDeposits: (params: any): Promise<void> => {
		const sendBody = depositAndWithdrawsLoadingValidate(params);
		return ApiClient.get("web/deposit/deposits", { ...sendBody });
	},
	getWithdraws: (params: any): Promise<void> => {
		const sendBody = depositAndWithdrawsLoadingValidate(params);
		return ApiClient.get("web/withdraw/withdraws", { ...sendBody });
	},
	cancelOrder: (id: number): Promise<void> =>
		ApiClient.post("web/finance/cancel-order", { [queryVars.order_id]: id }),
	cancelWithdraw: (id: number) => ApiClient.post(`web/profile/withdraws/${id}/cancel`),
	getBorrows: (params: IHistoryParams): Promise<IPaginationRes<IBorrow>> =>
		ApiClient.get("web/margin/borrows", params),
	getRepays: (params: IHistoryParams): Promise<IPaginationRes<IRepay>> =>
		ApiClient.get("web/margin/repays", params),
	getInterests: (params: IHistoryParams): Promise<IPaginationRes<IInterest>> =>
		ApiClient.get("web/margin/interests", params),
	getMarginTransfers: (params: IHistoryParams): Promise<IPaginationRes<ITransfer>> =>
		ApiClient.get("web/margin/transfers", params),
	getMarginCalls: (params: IHistoryParams): Promise<IPaginationRes<IMarginCall>> =>
		ApiClient.get("web/margin/calls", params),
	getLiquidations: (params: IHistoryParams): Promise<IPaginationRes<ILiquidation>> =>
		ApiClient.get("web/margin/liquidations", params),
	getTrades: (params: IGetProfileTradesParams): Promise<IPaginationRes<ITrade>> =>
		ApiClient.get("web/profile/trades", params),
};

export const useActiveOrders = (params: IGetOrdersParams) =>
	useQuery(["active-orders", params], async () => {
		const data = await HistoryService.getOrders({ ...params, open_only: true });
		return data ?? null;
	});

export const useClosedOrders = (params: IGetOrdersParams) =>
	useQuery(["closed-orders", params], async () => {
		const data = await HistoryService.getOrders({ ...params, closed_only: true });
		return data ?? null;
	});

export const useTrades = (params: IGetProfileTradesParams) =>
	useQuery(["trades", params], async () => {
		const data = await HistoryService.getTrades(params);
		return data ?? null;
	});

export const useBorrows = (params: IHistoryParams) =>
	useQuery(["borrows", params], async () => {
		const data = await HistoryService.getBorrows(params);
		return data ?? null;
	});

export const useRepays = (params: IHistoryParams) =>
	useQuery(["repays", params], async () => {
		const data = await HistoryService.getRepays(params);
		return data ?? null;
	});

export const useInterests = (params: IHistoryParams) =>
	useQuery(["interests", params], async () => {
		const data = await HistoryService.getInterests(params);
		return data ?? null;
	});

export const useMarginTransfers = (params: IHistoryParams) =>
	useQuery(["margin-transfers", params], async () => {
		const data = await HistoryService.getMarginTransfers(params);
		return data ?? null;
	});

export const useMarginCalls = (params: IHistoryParams) =>
	useQuery(["margin-calls", params], async () => {
		const data = await HistoryService.getMarginCalls(params);
		return data ?? null;
	});

export const useLiquidations = (params: IHistoryParams) =>
	useQuery(["liquidations", params], async () => {
		const data = await HistoryService.getLiquidations(params);
		return data ?? null;
	});

export default HistoryService;
