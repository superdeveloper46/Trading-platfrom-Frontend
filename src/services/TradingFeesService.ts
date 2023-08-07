import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IGetTradingFeesRes, ISetDeduction } from "types/tradingFees";
import { queryVars } from "constants/query";

export interface ITradingFeesParams {
	[queryVars.page]: number;
	[queryVars.search]: string;
	[queryVars.ordering]: string;
}

const TradingFeesService = {
	getTradingFeesRes: (params?: ITradingFeesParams) =>
		ApiClient.get("web/finance/trading-fees", params),
	setFeeDeduction: (data: ISetDeduction) => ApiClient.post("web/finance/set-fee-deduction", data),
};

export const useTradingFees = (params?: ITradingFeesParams) =>
	useQuery<IGetTradingFeesRes>(["trading-pairs", null], async () => {
		const data = await TradingFeesService.getTradingFeesRes(params);
		return data;
	});

export default TradingFeesService;
