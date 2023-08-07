import ApiClient from "helpers/ApiClient";
import { IDonate } from "types/charity";

const CharityService = {
	sendDonate: (body: IDonate) => ApiClient.post("web/charity/stop-war/donate", body),
	getPaymentMethods: () => ApiClient.get("web/charity/stop-war/payment-methods"),
	getCurrencies: () => ApiClient.get("web/charity/stop-war/currencies"),
};

export default CharityService;
