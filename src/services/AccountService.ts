import ApiClient from "helpers/ApiClient";
import { IBalance, IMarginStatus, IProfileStatus, IRateAlgo } from "models/Account";
import { IGetMarginStatusParams } from "types/account";
import { useQuery } from "react-query";

const AccountService = {
	getProfileStatus: (): Promise<IProfileStatus> => ApiClient.get("web/profile/status"),
	getBalances: (): Promise<IBalance[]> => ApiClient.get("web/finance/balances"),
	getBalancesCross: (): Promise<IBalance[]> => ApiClient.get("web/margin/cross-balance"),
	getBalancesIsolated: (): Promise<IBalance[]> => ApiClient.get("web/margin/isolated-balance"),
	getMarginStatus: (params: IGetMarginStatusParams): Promise<IMarginStatus> =>
		ApiClient.get("web/margin/account-status", params),
	getRates: (quoteCurrency: string): Promise<IRateAlgo[]> =>
		ApiClient.get("web/finance/rates/algo", { quote_currency: quoteCurrency }),
};

export const useRatesUSDT = () =>
	useQuery(["ads"], async () => {
		const data = await AccountService.getRates("USDT");
		return data ?? null;
	});

export default AccountService;
