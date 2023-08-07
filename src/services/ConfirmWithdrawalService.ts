import ApiClient from "helpers/ApiClient";
import { IConfirmWithdrawalInfo } from "models/ConfirmWithdrawal";
import { useQuery } from "react-query";

const ConfirmWithdrawalService = {
	getWithdrawDetails: (slug: string): Promise<IConfirmWithdrawalInfo> =>
		ApiClient.get(`web/withdraw/create/${slug}/details`),
	confirmWithdraw: (
		slug: string,
		data: { totp?: string; pincode?: string },
	): Promise<IConfirmWithdrawalInfo> => ApiClient.post(`web/withdraw/create/${slug}/confirm`, data),
	resendCode: (slug: string): Promise<void> => ApiClient.post(`web/withdraw/create/${slug}/resend`),
	cancelWithdraw: (slug: string): Promise<void> =>
		ApiClient.post(`web/withdraw/create/${slug}/cancel`),
};

export default ConfirmWithdrawalService;
