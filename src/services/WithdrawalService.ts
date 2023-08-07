import ApiClient from "helpers/ApiClient";
import { ICreateWithdrawReq, ICreateWithdrawRes } from "types/withdrawal";
import { queryVars } from "constants/query";

const WithdrawalService = {
	withdrawMethodsInit: (params: { [queryVars.currency]: string }): Promise<void> =>
		ApiClient.get("web/withdraw/methods", params),
	getPreviousWithdraws: (params?: any): Promise<void> =>
		ApiClient.get("web/withdraw/withdraws", params),
	createWithdraw: (data: ICreateWithdrawReq): Promise<ICreateWithdrawRes> =>
		ApiClient.post("web/withdraw/create/request", data),
	getCurrentBalance: (): Promise<ICreateWithdrawRes> => ApiClient.get("web/profile/wallets"),
	getWithdrawDetails: (slug: string): Promise<ICreateWithdrawRes | null> =>
		ApiClient.get(`web/withdraw/create/${slug}/details`),
	getWithdrawLimit: (params: { [queryVars.currency]: string }): Promise<void> =>
		ApiClient.get(`web/withdraw/withdraw-daily-limit`, params),
	cancelWithdraw: (slug: string): Promise<void> =>
		ApiClient.post(`web/withdraw/create/${slug}/cancel`),
};

export default WithdrawalService;
