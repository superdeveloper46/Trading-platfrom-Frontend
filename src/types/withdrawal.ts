export interface ICreateWithdrawReq {
	payment_type: number;
	amount: string;
	note?: string;
	stored_attributes?: any;
	attributes: {
		[key: string]: any;
	};
}

export interface ICreateWithdrawRes {
	slug: string;
	is_totp_required: boolean;
	totp_timeout: string;
	is_totp_confirmed: boolean;
	is_pincode_required: boolean;
	pincode_tries_left: number;
	pincode_timeout: string;
	pincode_generated_at: string;
	is_pincode_confirmed: boolean;
	deadline_at: string;
	is_totp_ok: boolean;
	is_pincode_ok: boolean;
	is_ok: boolean;
}

export enum WithdrawalStatusesEnum {
	WITHDRAW_STATUS_NEW = 10, // created new, need to be confirmed
	WITHDRAW_STATUS_CONFIRMED = 20, // confirmed by user, need to be verified
	WITHDRAW_STATUS_VERIFIED = 23, // verified by automatic system. ve additinal info in verification field
	WITHDRAW_STATUS_PROCESSING = 27, // processing by bot or operator
	WITHDRAW_STATUS_DONE = 30, // money sent, see tx id in payment field
	WITHDRAW_STATUS_REFUSED = 40, // refuxed by operator or bot
	WITHDRAW_STATUS_CANCELLED = 50, // cancelled by user
}
