import ApiClient from "../helpers/ApiClient";

export interface IParams {
	format: string;
	currencies: boolean;
	is_internal_transfer_enabled?: boolean;
}

const CurrenciesService = {
	loadCurrencies: (params: IParams = { format: "json", currencies: true }) =>
		ApiClient.get("web/finance/currencies", { ...params, currencies: true }),
};

export default CurrenciesService;
