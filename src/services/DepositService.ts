import ApiClient from "helpers/ApiClient";
import errorHandler from "utils/errorHandler";
import { ICreateDepositReq, ICreateDepositRes } from "types/deposit";

const DepositService = {
	depositMethodsInit: (params: { currency: string }): Promise<void> =>
		ApiClient.get("web/deposit/methods", params),
	getPreviousDeposits: (params?: any): Promise<void> =>
		ApiClient.get("web/deposit/deposits", params),
	createDeposit: async (data: ICreateDepositReq): Promise<void> => {
		try {
			const result: ICreateDepositRes = await ApiClient.post("web/deposit/request", data);
			window.location.replace(result.redirect_url);
		} catch (err) {
			errorHandler(err);
		}
	},
};

export const createDeposit = (data: ICreateDepositReq) => DepositService.createDeposit(data);

export default DepositService;
