import { queryVars } from "constants/query";
import { IPaginationParams } from "./general";

export interface ISessionResult {
	count: number;
	results: ISession[];
}
export interface IChangePasswordReqData {
	old_password: string;
	new_password1: string;
	new_password2: string;
}

export interface ILoadSessionsParams extends IPaginationParams {
	[queryVars.is_active]?: boolean;
}
export interface ISession {
	checked_2fa_backup: boolean;
	checked_2fa_token: boolean;
	checked_email_pincode: string | null;
	country_code: string | null;
	country_name: string | null;
	date: number;
	expiry_date: number;
	id: number;
	ip_address: string | null;
	is_active: boolean;
	is_current: boolean;
	known_device: boolean;
	passed_ip_whitelist: boolean;
	status_label: string;
	ua: {
		browser: string | null;
		device: string | null;
		os: string | null;
		is_mobile_app: boolean;
	};
}

export interface IQrCode {
	otpauth_url: string;
	key: string;
}

export interface IWhitelistIP {
	id: number;
	ip_address: string;
	created_at: string;
}

export interface IDisable2FABody {
	password: string;
	token: string;
}

export interface IEnable2FABody {
	token: string;
}

export interface ISetWhitelistIPsBody {
	enabled: boolean;
	ips: string[];
}
