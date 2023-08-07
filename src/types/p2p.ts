import { queryVars } from "constants/query";
import { YesNoEnum } from "./general";

export enum P2PSideEnum {
	All = 0,
	Sell = 1,
	Buy = 2,
}

export enum P2PPaymentTimeEnum {
	Minutes15 = 15,
	Minutes30 = 30,
	Minutes45 = 45,
}

export enum P2POrderStatusEnum {
	OPEN = 2,
	CANCELLED = 3,
	CANCELLED_BY_MANAGER = 4,
	FILLED = 6,
	FILLED_BY_MANAGER = 7,
	MODERATION = 9,
}

export enum PriceTypeEnum {
	Fixed = 1,
	Floating = 2,
}

export enum MerchantStatusEnum {
	DEFAULT = 0,
	MODERATION = 1,
	MERCHANT = 2,
	CANCELLED_BY_MODERATOR = 3,
}

export interface IP2PCurrency {
	brand_color: string;
	code: string;
	image_png: string;
	image_svg: string;
	is_fiat: boolean;
	name: string;
	precision: number;
}

export interface IFilterPair {
	base_currency: IP2PCurrency;
	is_enabled: boolean;
	maximum_order_size: string;
	minimum_order_size: string;
	quote_currency: IP2PCurrency;
	regions: string[];
	symbol: string;
}

export interface IP2PPair {
	is_enabled: boolean;
	maximum_order_size: string;
	minimum_order_size: string;
	regions: string[];
	symbol: string;
}

export interface IAdListRequestParams {
	[queryVars.page]: number;
	[queryVars.page_size]: number;
	[queryVars.side]?: P2PSideEnum;
	[queryVars.seller_id]?: string;
	[queryVars.quote_currency]?: string;
	[queryVars.base_currency]?: string;
	[queryVars.payment_method]?: string;
	[queryVars.region]?: string;
	[queryVars.is_merchant]?: boolean;
	[queryVars.search]?: string;
	[queryVars.amount_min]?: number;
	[queryVars.owner]?: string;
}

export interface IMyAdsListRequestParams extends IAdListRequestParams {
	status: string;
	is_active: boolean;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
}

export interface IAd {
	id: number;
	amount: string;
	available: string;
	[queryVars.is_active]: boolean;
	limit: {
		minimal: string;
		maximum: string;
	};
	[queryVars.pair]: IFilterPair;
	[queryVars.payment_methods]: IPaymentMethod[];
	price: string;
	price_type: number;
	side: P2PSideEnum;
	valid_till: number;
	terms?: string;
	profile: {
		all_trades: number;
		avg_payment_time: number;
		avg_release_time: number;
		completed_trades_30d: number;
		is_merchant: boolean;
		negative_feedback_count: number;
		nickname: string;
		orders_completed: number;
		positive_feedback_count: number;
		trades_30d: number;
		id: number;
	};
}

export interface IAdRequestParams {
	[queryVars.id]: string;
	[queryVars.search]: string;
	[queryVars.ordering]: string;
}

export interface IOrderListRequestParams {
	[queryVars.page]: number;
	[queryVars.page_size]: number;
}

export interface IOrderRequestParams {
	[queryVars.id]: string;
	[queryVars.search]: string;
	[queryVars.ordering]: string;
}

export interface IOrderPair {
	base_currency: string;
	is_enabled: boolean;
	maximum_order_size: string;
	minimum_order_size: string;
	quote_currency: string;
	symbol: string;
}

export interface IOrderProfile {
	all_trades: number;
	avg_payment_time: number;
	avg_release_time: number;
	completed_trades_30d: number;
	orders_completed: number;
	trades_30d: number;
	id: number;
	nickname: string;
	is_merchant: boolean;
}

export interface IOrder {
	amount: string;
	buyer_approved_at: string;
	seller_approved_at: string;
	buyer_profile: IOrderProfile;
	id: number;
	order: string;
	pair: IP2PPair;
	requisites: IRequisites[];
	price: string;
	seller_profile: IOrderProfile;
	active_till: Date;
	created_at: Date;
	maker_order_side: number;

	// value: number;
	status: P2POrderStatusEnum;
}

export interface ICreateAdFormBody {
	// first step
	[queryVars.side]: P2PSideEnum;
	[queryVars.base_currency]: string;
	[queryVars.quote_currency]: string;
	[queryVars.price_type]: string;
	[queryVars.price]: number;
	// second step
	[queryVars.amount]: number;
	[queryVars.minimal]: number;
	[queryVars.maximum]: number;
	[queryVars.payment_methods]: number[];
	[queryVars.payment_requisites]: number[];
	[queryVars.payment_time]: string;
	// third step
	[queryVars.terms]: string;
}

export type ICreateAdFormErrors = Partial<Record<keyof ICreateAdFormBody, string>>;

export interface ICreateAdRequestBody {
	// first step
	[queryVars.pair]: string;
	[queryVars.limit]: {
		[queryVars.minimal]: number;
		[queryVars.maximum]: number;
	};
	[queryVars.side]: number;
	[queryVars.price]: PriceTypeEnum;
	[queryVars.price_type]: number;
	// second step
	[queryVars.payment_time]: number;
	[queryVars.amount]: number;
	[queryVars.payment_requisites]?: number[];
	[queryVars.payment_methods]?: number[];
	// third step
	[queryVars.terms]?: string;
}

export type TCreateAdFirstStepKey = keyof Pick<
	ICreateAdRequestBody,
	"pair" | "limit" | "side" | "price" | "price_type"
>;

export type TCreateAdSecondStepKey = keyof Pick<
	ICreateAdRequestBody,
	"payment_time" | "amount" | "payment_requisites" | "payment_methods"
>;

export type TCreateAdThirdStepKey = keyof Pick<ICreateAdRequestBody, "terms">;

export interface ICreateAppealParams {
	[queryVars.deal]: number;
	[queryVars.reason]: string;
	[queryVars.comment]?: string;
}

export interface ICreateOrderParams {
	[queryVars.order]: number;
	[queryVars.amount]: number;
	[queryVars.payment_requisites]?: number[];
}

export interface IAcceptTermsParams {
	[queryVars.accept]: boolean;
}

export interface ICancelOrderParams {
	[queryVars.reason]?: string;
}

export interface IBlockUserParams {
	[queryVars.target]: number;
	[queryVars.reason]: string;
	[queryVars.comment]: string;
	[queryVars.is_blocked]: boolean;
}

export interface ILeaveFeedbackParams {
	[queryVars.deal]: number;
	[queryVars.text]: string;
	[queryVars.is_positive]: boolean;
	[queryVars.is_anonymous]: boolean;
}

export interface IFeedback {
	author: number;
	created_at: Date;
	is_anonymous: boolean;
	is_positive: boolean;
	text: string;
}

export interface IUserDetails {
	all_trades: number;
	avg_release_time: number;
	avg_payment_time: number;
	completed_trades_30d: number;
	is_merchant: boolean;
	is_blocked: boolean;
	negative_feedback_count: number;
	nickname: string;
	orders_completed: number;
	positive_feedback_count: number;
	trades_30d: number;
	registered_at: Date;
	first_deal_at: Date;
	id: number;
}

export interface IPaymentMethod {
	id: number;
	currencies: IP2PCurrency[];
	name: string;
	image_svg: string;
	image_png: string;
	attributes: IMethodAttribute[];
}

export interface IRequisites {
	id: number;
	payment_method: IPaymentMethod;
	attributes_labeled: IRequisitesAttribute[];
	name: string;
}

export interface IMethodAttribute {
	label: string;
	max_length: number;
	min_length: number;
	name: string;
	regex: string;
	required: boolean;
	type: string;
}

export interface IRequisitesAttribute {
	name: string;
	label: string;
	value: string;
}

export interface ISetPaymentMethodParams {
	[queryVars.name]: string;
	[queryVars.payment_method]: number;
	[queryVars.attributes]: Record<string, string>;
}

export interface IEditPaymentMethodParams {
	[queryVars.id]: number;
	[queryVars.attributes]: Record<string, string>;
	[queryVars.name]: string;
}

export interface IFetchRequisitesParams {
	[queryVars.page]?: string;
	[queryVars.search]?: string;
	[queryVars.ordering]?: string;
}

export interface IReportRequestFormBody {
	[queryVars.reason]: string;
	[queryVars.deal]: string;
	description: string;
	[queryVars.proof]: File | null;
}

export interface IMerchantRequestFormBody {
	[queryVars.telegram]: string;
	[queryVars.is_familiar]: YesNoEnum | "";
	[queryVars.video]: File | null;
}

export interface IConfirmPaymentRequestBody {
	[queryVars.id]: number;
	[queryVars.payment_requisites]?: number;
}

export interface IBlockedUser {
	comment: string;
	is_blocked: boolean;
	nickname: string;
	reason: string;
	target: number;
	date: Date;
}

export interface IMerchantStatusResponse {
	[queryVars.status]: MerchantStatusEnum;
	moderator_comment: string;
	created_at: Date;
}

export interface IP2PVolume {
	amount: string;
	amount_30: string;
	avg_price: string;
	avg_price_30: string;
	symbol: string;
}

export interface IP2PBalance {
	balance: string;
	code: string;
	image_png: string;
	image_svg: string;
	is_enabled: boolean;
	is_fiat: boolean;
	name: string;
	precision: number;
	reserve: string;
	total: string;
}

export interface ITransferParams {
	direction: number;
	amount: number;
	currency: string;
}

export interface IMessage {
	author: number;
	created_at: Date;
	text: string;
}

export type IReportRequestFormErrorsBody = Partial<Record<keyof IReportRequestFormBody, string>>;

export type IMerchantRequestFormErrorsBody = Partial<
	Record<keyof IMerchantRequestFormBody, string>
>;
