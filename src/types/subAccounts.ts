import { queryVars } from "constants/query";
import { ISecureTokenRes } from "./secureToken";
import { IPaginationParams } from "./general";
import { TWalletType } from "./history";

export interface ISubAccount {
	uid: string;
	login: string;
	email: string;
	created_at: string;
	description: string;
	is_spot_enabled: boolean;
	is_margin_enabled: boolean;
	is_login_enabled: boolean;
	is_api_enabled: boolean;
	is_deposit_enabled: boolean;
	is_withdraw_enabled: boolean;
	is_active: boolean;
	two_factor_enabled: boolean;
}

export interface ISubAccountBalance {
	uid: string;
	login: string;
	email: string;
	description: string;
	total_balance: string;
	is_active: boolean;

	valuation: {
		[key: string]: number;
	};
}

export interface IRegisterSubAccountRes extends ISecureTokenRes {
	login: string;
	email: string;
	description: string;
}

export interface ISubApi {
	sub_account: {
		uid: string;
		login: string;
		email: string;
		description: string;
	};
	label: string;
	can_trade: boolean;
	can_margin: boolean;
	can_cancel_order: boolean;
	can_create_order: boolean;
	can_use_internal: boolean;
	use_whitelist: boolean;
	limit_to_ips: string[];
	allowed_symbols: string[] | null;
	key: string;

	prefix: string;
	slug: string;
	used_at: null;
	created_at: string;
}

export interface ISubAccTransfer {
	sender: string;
	// sender_type: WalletTypeEnum;
	receiver: string;
	// receiver_type: WalletTypeEnum;
	amount: number;
	currency: string;
	description: string;
	message: string;
	note: string;
}

export interface IRegisterSubAccountRequest extends ISecureTokenRes {
	login: string;
	email: string;
	description: string;
}

export interface IRegisterSubAccountDetails extends ISecureTokenRes {
	sub_account: ISubAccount;
}

export type ICreateSubAccApiKeyRequestBody = Pick<
	ISubApi,
	"label" | "limit_to_ips" | "can_trade" | "can_margin"
> & { sub_account: string };

export interface IUpdateSubAccApiKeyRequestBody
	extends Pick<ISubApi, "label" | "allowed_symbols" | "limit_to_ips" | "can_trade" | "can_margin"> {
	api_key: string;
	use_whitelist: boolean;
}

export type ICreateSubAccTransferRequestBody = Omit<
	ISubAccTransfer,
	"message" | "description" | "note"
>;

export type IApiCreatedResponse = Omit<ISubApi, "prefix" | "slug" | "used_at" | "created_at">;

export type IApiUpdatedResponse = Omit<ISubApi, "prefix" | "slug" | "used_at" | "created_at">;

export type ICreateSubAccApiKeyResponse = ISecureTokenRes & IApiCreatedResponse;

export type IUpdateSubAccApiKeyResponse = ISecureTokenRes & IApiUpdatedResponse;

export type ICreateSubAccTransferResponse = Omit<
	ISubAccTransfer,
	"message" | "description" | "note"
>;

export interface IConfirmCreateSubAccApiKeyResponse extends ICreateSubAccApiKeyResponse {
	api_key_created: {
		key: string;
		secret: string;
		slug: string;
	} & IApiCreatedResponse;
}

export interface ICreateSubAccountBody {
	login: string;
	email: string;
	password?: string;
	description?: string;
}

export interface IChangePasswordRequestBody {
	[queryVars.sub_account]: string;
	old_password: string;
	new_password1: string;
	new_password2: string;
}

export interface IChangeEmailRequestBody {
	[queryVars.sub_account]: string;
	[queryVars.email]: string;
}

export interface ICheckLoginBody {
	login: string;
}

export interface IUpdateSubAccountBody {
	description?: string;
	is_spot_enabled?: boolean;
	is_margin_enabled?: boolean;
	is_login_enabled?: boolean;
	is_api_enabled?: boolean;
	is_deposit_enabled?: boolean;
	is_withdraw_enabled?: boolean;
	[queryVars.is_active]?: boolean;
}

export interface ICreateTransferRequest {
	sender: string;
	receiver: string;
	amount: number;
	currency: string;
	description: string;
	message: string;
	note: string;
}

export interface ILoadSubAccountParams {
	[queryVars.account]: string;
	[queryVars.is_active]?: boolean;
}

export interface ILoadApiKeysParams extends IPaginationParams {
	[queryVars.account]: string;
}

export interface ILoadOrdersParams extends IPaginationParams {
	[queryVars.account]?: string;
	[queryVars.wallet_type]?: TWalletType;
	[queryVars.side]: number;
}

export interface ILoadTransfersParams extends IPaginationParams {
	[queryVars.currency]?: string;
	[queryVars.status]?: string;
	[queryVars.is_outgoing]?: string;
	[queryVars.is_outdated]?: string;
	[queryVars.search]?: string;
}

export interface ILoadSessionsParams extends IPaginationParams {
	[queryVars.account]?: string;
}

interface ISubAccountTransferCurrency {
	code: string;
	name: string;
	brand_color: string;
	image_svg: string;
	image_png: string;
	is_fiat: boolean;
	precision: number;
}

interface ISubAccountTransferStatus {
	key: number;
	label: string;
}

export interface ISubAccountTransfer {
	txid: string;
	date: string;
	amount: number;
	currency: ISubAccountTransferCurrency;
	sender: string;
	receiver: {
		uid: string;
		verified: boolean;
	};
	status: ISubAccountTransferStatus;
	message: string;
	valid_till: string;
	is_outgoing: boolean;
	can_cancel: string;
	can_accept: string;
}

export interface ISubAccountOrder {
	id: number;
	account: ISubAccount[];
	date: number;
	wallet_type: number;
	side_effect: number;
	side: number;
	type: number;
	symbol: string;
	key: number;
	price: number;
	base_amount: number;
	quote_amount: number;
	amount: number;
	amount_original: number;
	amount_unfilled: number;
	amount_filled: number;
	amount_cancelled: number;
	value_filled: number;
	fee_filled: number;
	price_avg: number;
	filled_percent: number;
	done_at?: number | null;
	open_at?: number;
	updated_at: string;
	state: string;
	status: number;
	stop_price: number;
	stop_operator: number;
}

interface ISessionAccount {
	uid: string;
	login: string;
	email: string;
}

export interface ISubAccountSession {
	id: number;
	ip_address: string;
	date: string;
	account: ISessionAccount;
}

export enum PermittedActionsEnum {
	Reading = "reading",
	Trading = "trading",
}

export enum PermittedIPStrategyEnum {
	Any = "any",
	Specified = "specified",
}

export enum PairsStrategyEnum {
	Any = "any",
	Specified = "specified",
}

export interface ISubAccountWallet {
	balance: number;
	reserve: number;
	available: number;
	login: string;
	code: string;
	image_png: string;
	image_svg: string;
	name: string;
	is_cross_margin_available: boolean;
	precision: number;
}

export interface ICrossSubAccountBalance {
	code: string;
	name: string;
	image_svg: string;
	image_png: string;
	precision: 0;
	is_demo: boolean;
	is_defi: boolean;
	is_fiat: boolean;
	is_enabled: boolean;
	balance: number;
	reserve: number;
	equity: number;
	borrowed: number;
	interest: number;
	debt: number;
	total: number;
	price: number;
	debt_btc: number;
	total_btc: number;
}

export interface IIsolatedSubAccountBalance {
	code: string;
	name: string;
	image_svg: string;
	image_png: string;
	precision: 0;
	is_demo: boolean;
	is_defi: boolean;
	is_fiat: boolean;
	is_enabled: boolean;
	pair: string;
	isolated_margin_leverage: number;
	balance: number;
	reserve: number;
	equity: number;
	borrowed: number;
	interest: number;
	debt: number;
	total: number;
	price: number;
	debt_btc: number;
	total_btc: number;
}

export interface ISubAccCreateFormBody {
	login: string;
	email: string;
	password: string;
	description: string;
	[key: string]: string;
}

export interface ISubAccApiKeyCreateFormBody {
	[queryVars.sub_account]: string;
	label: string;
	permittedIPs: string;
	permittedIPsList: string[];
	permittedActions: PermittedActionsEnum;
	tradeCoins: {
		spot: boolean;
		margin: boolean;
	};
}

export type ISubAccApiKeyCreateFormErrorsBody = Partial<
	Record<keyof ISubAccApiKeyCreateFormBody, string>
>;

export interface ISubAccApiKeyEditFormBody {
	label: string;
	permittedIPs: string;
	permittedIPsList: string[];
	permittedActions: PermittedActionsEnum;
	permittedIPStrategy: PermittedIPStrategyEnum;
	availablePairsStrategy: PairsStrategyEnum;
	availablePairsList: string[];
	tradeCoins: {
		spot: boolean;
		margin: boolean;
	};
}

export type ISubAccApiKeyEditFormErrorsBody = Partial<
	Record<keyof ISubAccApiKeyEditFormBody, string>
>;

export interface ISubAccTransferCreateFormBody {
	sender: string;
	// sender_type: WalletTypeEnum;
	receiver: string;
	// receiver_type: WalletTypeEnum;
	amount: string;
	currency: string;
}

export type ISubAccTransferCreateFormErrorsBody = Partial<
	Record<keyof ISubAccTransferCreateFormBody, string>
>;

export interface IEnable2FASub {
	token: string;
	sub_account: string;
}

export interface IDisableSub2FABody {
	[queryVars.sub_account]: string;
	password: string;
	token: string;
}

export enum SubAccountTypeEnum {
	Spot = "spot",
	Cross = "cross",
	Isolated = "isolated",
}

export interface IGetSubMarginCurrencyStatusParams {
	[queryVars.sub_account]: string;
	[queryVars.wallet_type]: number;
	[queryVars.currency]: string;
	[queryVars.pair]?: string;
}

export interface ISubAccountMarginBorrowBody {
	[queryVars.wallet_type]: number;
	[queryVars.pair]?: string;
	[queryVars.currency]: string;
	[queryVars.amount]: number;
	[queryVars.sub_account]: string;
}

export interface ISubAccountMarginRepayBody {
	[queryVars.wallet_type]: number;
	[queryVars.pair]?: string;
	[queryVars.currency]: string;
	[queryVars.amount]: number;
	[queryVars.sub_account]: string;
}

export interface ISubAccountMarginTransferBody {
	[queryVars.direction]: number;
	[queryVars.wallet_type]: number;
	[queryVars.pair]?: string;
	[queryVars.currency]: string;
	[queryVars.amount]: number;
	note?: string;
	[queryVars.sub_account]: string;
}
