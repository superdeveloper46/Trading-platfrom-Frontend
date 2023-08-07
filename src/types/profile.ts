import { IApiKeyDetails } from "models/ApiKeys";
import { queryVars } from "constants/query";
import { ISecureTokenRes } from "./secureToken";

export interface IGetApiKeysRes {
	count: number;
	results: IApiKeyDetails[];
}

export interface IGetApiKeysParams {
	[queryVars.page]?: number;
	[queryVars.search]?: string;
	[queryVars.ordering]?: string;
}

export interface ICreateApiKeyRequestBody {
	label: string;
	can_trade: boolean;
	can_withdraw: boolean;
	can_margin: boolean;
	limit_to_ips?: string[];
	allowed_symbols?: string[];
}

export interface IUpdateApiKeyRequestBody {
	api_key: string;
	label: string;
	can_trade: boolean;
	can_withdraw: boolean;
	can_margin: boolean;
	limit_to_ips?: string[];
	allowed_symbols?: string[];
}

export interface IApiKeyCreated {
	allowed_symbols?: string[];
	can_margin: boolean;
	can_trade: boolean;
	can_withdraw: boolean;
	key: string;
	label: string;
	limit_to_ips?: string[];
	secret: string;
	slug: string;
}

export interface IApiKeyRequestDetails extends ISecureTokenRes {
	limit_to_ips: string[];
	label?: string;
	can_trade?: boolean;
	api_key_created?: IApiKeyCreated;
	api_key?: IApiKeyCreated;
}

export interface IConfirmApiKeyRequestBody {
	pincode?: string;
	totp?: string;
}
