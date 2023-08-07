export enum SecureTokenVariantEnum {
	BUTTON = "button",
	SPINNER = "spinner",
}

export enum SecureTokenTypeEnum {
	OTPCODE = "otpcode",
	TOKEN = "token",
	PINCODE = "pincode",
}

export interface ISecureTokenRes {
	slug?: string;
	is_totp_required: boolean;
	delay?: string;
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
	ip_address: string;
	created_at: string;

	// AUTH
	done: Record<string, any>;

	// ALPHA CODES
	create_coupon?: {
		code: string;
	};
}
