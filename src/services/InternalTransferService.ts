import ApiClient from "helpers/ApiClient";
import { IPaginationParams, IPaginationRes } from "types/general";
import {
	ICreateTransferRequestBody,
	ICreateTransferRes,
	IInternalTransferDetails,
	IInternalTransferHistory,
} from "types/internal_transfers";

const InternalTransferService = {
	getTransferDetails: (txid: string): Promise<IInternalTransferDetails> =>
		ApiClient.get(`web/transfer/${txid}/detail`),
	loadTransfersHistory: (
		params: IPaginationParams | any,
	): Promise<IPaginationRes<IInternalTransferHistory>> =>
		ApiClient.get("web/transfer/transfers", params),
	createTransferRequest: (body: ICreateTransferRequestBody): Promise<ICreateTransferRes> =>
		ApiClient.post("web/transfer/create/request", body),
	acceptTransferRequest: (txid: string, security_code: string) =>
		ApiClient.post(`web/transfer/${txid}/accept`, { security_code }),
	cancelCreateTransferRequest: (txid: string) =>
		ApiClient.post(`web/transfer/create/${txid}/cancel`),
	cancelTransferRequest: (txid: string) => ApiClient.post(`web/transfer/${txid}/cancel`),
};

export default InternalTransferService;
