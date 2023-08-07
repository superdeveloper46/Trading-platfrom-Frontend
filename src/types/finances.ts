export interface ICurrency {
	available: string;
	balance: string;
	code: string;
	image_png: null | string;
	image_svg: null | string;
	is_defi: boolean;
	is_deposit_enabled: boolean;
	is_enabled: boolean;
	is_fiat: boolean;
	is_internal_transfer_enabled: boolean;
	is_withdraw_enabled: boolean;
	liquidity_type: number;
	name: string;
	precision: boolean;
	reserve: string;
}

export interface IConverted {
	[key: string]: number;
}

export interface IWallet {
	available: number;
	balance: number;
	converted: IConverted;
	currency_id: string;
	is_deposit_enabled: boolean;
	is_withdraw_enabled: boolean;
	name: string;
	precision: number;
	reserve: number;
	[key: string]: any;
}

export type TCurrenciesType =
	| "spot"
	| "cross"
	| "isolated"
	| "demo"
	| "demo-cross"
	| "demo-isolated"
	| "";

export interface IWalletsFilter {
	name: string;
	value: string;
	search: string;
	not_empty: boolean;
	currencies_type: TCurrenciesType;
	favorites?: boolean;
}

export interface IBalance {
	available: string;
	balance: string;
	code: string;
	image_png: null | string;
	image_svg: null | string;
	is_defi: boolean;
	is_deposit_enabled: boolean;
	is_enabled: boolean;
	is_fiat: boolean;
	is_internal_transfer_enabled: boolean;
	is_withdraw_enabled: boolean;
	liquidity_type: number;
	name: string;
	precision: number;
	reserve: string;
}

export interface ICurrenciesReqParams {
	format: string;
	currencies: boolean;
	is_internal_transfer_enabled?: boolean;
}

export interface IWalletsReqParams {
	non_empty?: boolean;
	is_demo?: boolean;
	symbols?: Record<string, string>;
}

export interface ICoinInfo {
	symbol: string;
	name: string;
	asset_label: string;
	asset_type: string;
	network: string;
	description: string;
	wallet_status: string;
	wallet_message: string;
	listing_status: string;
	listing_message: string;
	revain_score: number;
	listed_at: string;
	urls: ICoinUrl[];
}

export interface ICoinUrl {
	label: string;
	url: string;
}
