import ApiClient from "helpers/ApiClient";
import {
	IAddressFill,
	IAddressFillBodyUpdate,
	IFinanceFill,
	IFinanceFillBodyUpdate,
	IPersonFill,
	IPersonFillBodyUpdate,
} from "types/verification";

const VerificationService = {
	getPersonalFill: (): Promise<IPersonFill> => ApiClient.get("web/verification/person/fill"),
	getAddressFill: (): Promise<IAddressFill> => ApiClient.get("web/verification/address/fill"),
	getFinanceFill: (): Promise<IFinanceFill> => ApiClient.get("web/verification/finance/fill"),
	startPerson: () => ApiClient.post("web/verification/person/start", {}),
	startAddress: () => ApiClient.post("web/verification/address/start", {}),
	startFinance: () => ApiClient.post("web/verification/finance/start", {}),
	submitPerson: () => ApiClient.post("web/verification/person/submit", {}),
	submitAddress: () => ApiClient.post("web/verification/address/submit", {}),
	submitFinance: () => ApiClient.post("web/verification/finance/submit", {}),
	cancelPerson: () => ApiClient.post("web/verification/person/cancel", {}),
	cancelAddress: () => ApiClient.post("web/verification/address/cancel", {}),
	cancelFinance: () => ApiClient.post("web/verification/finance/cancel", {}),
	updatePerson: (data: IPersonFillBodyUpdate & FormData) =>
		ApiClient.patch("web/verification/person/fill", data, null, {
			"content-type": "multipart/form-data",
		}),
	updateAddress: (data: IAddressFillBodyUpdate & FormData): Promise<IAddressFillBodyUpdate> =>
		ApiClient.patch("web/verification/address/fill", data, null, {
			"content-type": "multipart/form-data",
		}),
	updateFinance: (data: IFinanceFillBodyUpdate & FormData) =>
		ApiClient.patch("web/verification/finance/fill", data, null, {
			"content-type": "multipart/form-data",
		}),
	getVerificationState: () => ApiClient.get("web/verification/states"),
};

export default VerificationService;
