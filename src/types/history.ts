import { ACCOUNT_TYPE } from "constants/exchange";
import { queryVars } from "constants/query";
import { IPaginationParams } from "./general";

export interface IGetOrdersParams extends IPaginationParams {
	[queryVars.pair]?: string;
	open_only?: boolean;
	closed_only?: boolean;
	[queryVars.side]?: number; // 1 (sell) | 2 (buy)
	[queryVars.type]?: number; // 1 | 2 | 3
	[queryVars.ordering]?: string;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.wallet_type]?: TWalletType;
}

interface IPair {
	amount_precision: number;
	description: string | null;
	full_name: string | null;
	id: string;
	is_enabled: boolean;
	label: string | null;
	maximum_order_size: number;
	minimum_order_size: number;
	minimum_order_value: number;
	price_precision: number;
	symbol: string;
}

export interface IHistoryOrder {
	amount: number | null;
	amount_cancelled: number | null;
	amount_filled: number | null;
	amount_unfilled: number | null;
	amount_original: number | null;
	filled_percent: number | null;
	date: number;
	direction: string;
	fee_filled: number | null;
	id: number;
	key: string;
	status: number | null;
	symbol: string;
	price: number | null;
	price_avg: number | null;
	type: number;
	value_filled: number | null;
	side: number | null;
	stop_price: number | null;
	stop_operator: number | null;
	pair?: IPair;
	state?: string;
	open_at?: number;
	done_at?: number | null;
	updated_at?: number;

	[key: string]: any;

	// margin
	wallet_type?: number;
	side_effect?: number | null;
	tif?: number;

	// modified
	trades?: ITrade[];
	pair_id?: string;
	order_filled_value?: number | null;
	order_total_value?: number | null;
}

export type THistoryOrderType = "spot" | "cross" | "isolated";

export interface IHistoryOrderWS {
	amount: number;
	amount_cancelled: number;
	amount_filled: number;
	amount_original: number;
	amount_unfilled: number;
	date: number;
	fee_filled: number;
	filled_percent: number;
	id: number;
	key: string;
	price: number;
	price_avg: null | number;
	side: number;
	status: number;
	stop_operator: number | null;
	stop_price: number | null;
	symbol: string;
	type: number;
	value_filled: number;

	// modified
	pair_id?: string;
	direction?: string;
}

export interface IHistoryOrdersFilter {
	name: string;
	value: string;
	type?: string;
}

export interface ITrade {
	amount1: number | null;
	amount2: number | null;
	date: number | null;
	fee_amount: number | null;
	fee_currency_id: string;
	fee_rate: number | null;
	id: number;
	is_maker: boolean;
	order_id: number;
	pair_id: string;
	price: number | null;
	type: number;
}

export interface IGetProfileOrdersResult {
	count: number;
	results: IHistoryOrder[];
}

export interface IGetProfileOrdersParams {
	[queryVars.pair]?: string;
	open_only?: boolean;
	closed_only?: boolean;
	[queryVars.side]?: number; // 1 (sell) | 2 (buy)
	[queryVars.type]?: number; // 1 | 2 | 3
	[queryVars.page]?: number;
	[queryVars.ordering]?: string;
	[queryVars.page_size]?: number;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.wallet_type]?: number;
}

export interface IGetProfileTradesParams {
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
	[queryVars.pair]?: string;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.ordering]?: string;
	[queryVars.wallet_type]?: number;
}

export interface IGetProfileTradesResult {
	count: number;
	results: ITrade[];
}

export interface IHistoryParams extends IPaginationParams {
	[queryVars.wallet_type]: number; // 2, 3
	[queryVars.currency]?: string;
	[queryVars.pair]?: string;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.ordering]?: string;
}

interface ICurrency {
	brand_color: string;
	code: string;
	image_png: string | null;
	image_svg: string | null;
	is_fiat: boolean;
	name: string;
	precision: number;
}

interface IMarginPair {
	base_currency_code: string;
	quote_currency_code: string;
	name: string;
	symbol: string;
	price_precision: number;
	amount_precision: number;
}

export interface IBorrow {
	wallet_type: number;
	borrowed: number;
	closed_at: string | null;
	currency: ICurrency;
	date: string;
	id: number;
	interest_accrued: number;
	interest_paid: number;
	interest_rate: number;
	is_open: boolean;
	last_interest_at: string;
	opened_at: string;
	pair: IMarginPair | null;
	repaid: number;
	type: number;
}

export interface IRepay {
	id: number;
	date: string;
	type: number;
	wallet_type: number;
	pair: IMarginPair | null;
	currency: ICurrency;
	amount: number;
	principal_amount: number;
	interest_amount: number;
}

export interface IInterest {
	id: number;
	date: string;
	wallet_type: number;
	borrowed: number;
	pair: IMarginPair | null;
	currency: ICurrency;
	interest_accrued: number;
	interest_amount: number;
	interest_rate: number;
}

export interface ITransfer {
	date: string;
	direction: number;
	wallet_type: number;
	from_pair: IMarginPair | null;
	from_account_type?: number;
	to_account_type?: number;
	to_pair?: IMarginPair | null;
	pair?: IMarginPair | null;
	currency: ICurrency;
	amount: number;
	note: string;
}

export interface IPosition {
	wallet_type: number;
	base_amount: number;
	base_price: number;
	closed_at: string | null;
	direction: number;
	id: number;
	opened_at: string;
	pair: IMarginPair;
	base_currency_code: string;
	name: string;
	quote_currency_code: string;
	quote_amount: number;
}

export interface IGetPositionsParams {
	[queryVars.wallet_type]: number;
	[queryVars.pair]?: string;
}

export interface IMarginCall {
	created_at: string;
	wallet_type: number;
	pair: IMarginPair;
	margin_level: number;
	sent_at: string;
	content: string;
}

export interface IExecution extends Omit<IHistoryOrder, "pair"> {
	pair: IMarginPair;
}

export interface ILiquidation {
	amount: number;
	closed_at: string;
	created_at: string;
	currency: ICurrency;
	executions: IExecution[];
	margin_level: number;
	pair: IMarginPair;
	wallet_type: number;
	total_balance: number;
	total_debt: number;
	is_closed: true;
}

export type TWalletType = typeof ACCOUNT_TYPE[keyof typeof ACCOUNT_TYPE];
