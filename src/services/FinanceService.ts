import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IMarginOption } from "models/Finance";
import {
	ICoinInfo,
	ICurrenciesReqParams,
	ICurrency,
	IWallet,
	IWalletsReqParams,
} from "types/finances";

const FinanceService = {
	getMarginOptions: (): Promise<IMarginOption[]> => ApiClient.get("web/margin/options"),
	getCurrencies: (params: ICurrenciesReqParams): Promise<ICurrency[]> =>
		ApiClient.get("web/finance/currencies", { ...params, currencies: true }),
	getCoins: (): Promise<ICoinInfo[]> => ApiClient.get("web/finance/coins"),
	getCoin: (currency_code: string): Promise<ICoinInfo> =>
		ApiClient.get(`web/finance/coins/${currency_code}`),
	getWallets: (params?: IWalletsReqParams): Promise<IWallet[]> =>
		ApiClient.get(walletsBuildUrl(params)),
};

export const useCurrencies = (params: ICurrenciesReqParams) =>
	useQuery(["currencies", params], async () => {
		const data = await FinanceService.getCurrencies(params);
		return data ?? null;
	});

export const useCoins = () =>
	useQuery(["coins"], async () => {
		const data = await FinanceService.getCoins();
		return data ?? null;
	});

export const useWallets = (params?: IWalletsReqParams) =>
	useQuery(["wallets", params], async () => {
		const data = await FinanceService.getWallets(params);
		return data ?? null;
	});

// Utils
const walletsBuildUrl = (params?: IWalletsReqParams): string => {
	const walletsUrl = "web/profile/wallets";
	if (!params) {
		return walletsUrl;
	}
	let finalUrl = `${walletsUrl}?`;
	if (Object.prototype.hasOwnProperty.call(params, "is_demo") && params.is_demo) {
		finalUrl += `is_demo=${params.is_demo}&`;
	}
	if (Array.isArray(params.symbols)) {
		params.symbols.forEach((symbol: string) => {
			finalUrl += `convert_symbol=${symbol}&`;
		});
	}
	finalUrl = finalUrl.substring(finalUrl.length - 1, 0);

	return finalUrl;
};

export default FinanceService;
