import ApiClient from "helpers/ApiClient";
import { ISendPurchaseData } from "types/buyCrypto";
import { queryVars } from "constants/query";

export interface IFiatRatesParams {
	[queryVars.direction]: number;
}

const BuyCryptoService = {
	getFiatsRates: (params: IFiatRatesParams) => ApiClient.get("web/fiats/rates", params),
	sendPurchase: (data: ISendPurchaseData) => ApiClient.post("web/fiats/token", data),
};

export default BuyCryptoService;
