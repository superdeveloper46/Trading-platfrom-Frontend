export interface IFeeRate {
	label?: string;
	amount?: number;
	taker_fee_rate: number;
	maker_fee_rate: number;
}

export interface IFeeRates {
	trading_fees: IFeeRate[];
	my_fees: IFeeRate;
}

export interface IPaymentFee {
	id: number;
	currency: string;
	name: string;
	deposit_fee_type: {
		key: number;
		label: string;
	};
	deposit_fee_value: string;
	deposit_fee_amount: string;
	deposit_fee_rate: string;
	min_deposit: string;
	max_deposit: string;
	min_withdraw: string;
	max_withdraw: string;
	withdraw_fee_type: {
		key: number;
		label: string;
	};
	withdraw_fee_value: string;
	withdraw_fee_amount: string;
	withdraw_fee_rate: string;
	withdraw_fee_currency: string;
	is_deposit_enabled: boolean;
	is_withdraw_enabled: boolean;
}
