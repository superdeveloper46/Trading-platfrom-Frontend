export interface ITradingFeesTier {
	code: string;
	name: string;
	min_volume: number | null;
	min_token: number | null;
	maker_fee_rate: number | null;
	taker_fee_rate: number | null;
	maker_fee_token: number | null;
	taker_fee_token: number | null;
	is_special: true;
}

export interface ITradingFeesPairPair {
	amount_precision: number;
	base_currency?: {
		code: string;
		name: string;
	};
	quote_currency?: {
		code: string;
		name: string;
	};
	description: string;
	full_name: string;
	id: string;
	is_active: boolean;
	is_enabled: boolean;
	label: string;
	liquidity_type: { id: number; label: string };
	maximum_order_size: number;
	minimum_order_size: number;
	minimum_order_value: number;
	price_precision: number;
	symbol: string;
	updated_at: string;
}

export interface ITradingFeesPair {
	expire_at: null | string;
	maker_fee_rate: number;
	taker_fee_rate: number;
	pair: ITradingFeesPairPair;
}

export interface ITradingFeesPersonal {
	fee_tier: ITradingFeesTier | null;
	is_fixed: boolean;
	is_token_deduction: boolean;
	maker_fee_rate: number;
	taker_fee_rate: number;
	token_balance: number;
	volume: number;
}

export interface IGetTradingFeesRes {
	pairs: ITradingFeesPair[];
	tiers: ITradingFeesTier[];
	personal?: ITradingFeesPersonal;
}

export interface ISetDeduction {
	is_token_deduction: boolean;
}
