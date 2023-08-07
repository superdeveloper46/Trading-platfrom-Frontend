import ApiClient from "helpers/ApiClient";
import { IAlphaCode, ICurrency } from "models/AlphaCodes";
import { IActivateRequestBody, ICreateRequestBody, IGetCodesRequestBody } from "types/alphaCodes";
import { ISecureTokenRes } from "types/secureToken";

interface IAlphaCodesData {
	results: IAlphaCode[];
	count: number;
}

const AlphaCodesService = {
	fetchCreatedAlphaCodes: (params: IGetCodesRequestBody): Promise<IAlphaCodesData> =>
		ApiClient.get("web/profile/create-coupon", params),
	fetchActivatedAlphaCodes: (params: IGetCodesRequestBody): Promise<IAlphaCodesData> =>
		ApiClient.get("web/profile/redeem-coupon", params),
	activateCode: (body: IActivateRequestBody): Promise<IAlphaCodesData> =>
		ApiClient.post("web/profile/redeem-coupon", body),
	createCode: (body: ICreateRequestBody): Promise<ISecureTokenRes> =>
		ApiClient.post("web/coupons/create/request", body),
	cancelCode: (slug: string): Promise<void> => ApiClient.post(`web/coupons/create/${slug}/cancel`),
	fetchCurrencies: (): Promise<ICurrency[]> => ApiClient.get("web/finance/balance"),
};

export default AlphaCodesService;
