import { queryVars } from "constants/query";
import { IPaginationParams } from "./general";

export interface IDonationsParams extends IPaginationParams {
	[queryVars.ordering]: string;
}

export interface IDonationProject {
	cover_image: string;
	name: string;
	slug: string;
	symbol: string;
	thumb_image: string;
}

export interface IDonation {
	account: string;
	amount: number;
	currency: string;
	date: string;
	project?: IDonationProject;
	tx: string | null;
	value: number;
}

export interface IDonateRequestBody {
	currency: string;
	amount: string;
}

export interface IListingProject {
	active_till: string;
	campaign: string;
	completed_at: string | null;
	cover_image: string;
	created_at: string;
	currency: string;
	current_amount: number;
	description_full: string | null;
	description_short: string | null;
	donation_number: number;
	facebook_url: string | null;
	instagram_url: string | null;
	is_comments_allowed: boolean;
	last_donation_at: string | null;
	meta_description: string | null;
	meta_keywords: string | null;
	name: string;
	roadmap: string | null;
	shares_number: number;
	slug: string;
	symbol: string;
	target_amount: number;
	team: string;
	telegram_url: string | null;
	thumb_image: string;
	twitter_url: string | null;
	vk_url: string | null;
	website_url: string | null;
}

export type IComment = Record<string, any>;

export interface IPaymentChannel {
	address: string;
	currency: string;
	min_amount: number;
	rate: number;
	attributes: {
		address: string;
	};
	payment_method: {
		id: number;
		name: string;
	};
}

export interface IListingRequestRequestBody extends FormData {
	project_name: string;
	currency_name: string;
	currency_code: string;
	website_url: string;
	markets: string[];
	coin_market_cap_url: string; // not required
	email: string;
	telegram_contact: string;
	telegram_community: string; // not required
	twitter: string; // not required

	blockchain_type: string;
	explorer_url: string;
	source_code_url: string;
	smart_contact_address: string; // not required // if ERC-20
	legal_opinion: File;
	icon: File;
	is_already_listed: boolean;
}

export enum StepsEnum {
	GeneralInfo,
	TechnicalInfo,
}

export interface IListingRequestFormBody {
	project_name: string;
	currency_name: string;
	currency_code: string;
	website_url: string;
	markets: string[];
	coin_market_cap_url: string; // not required
	email: string;
	telegram_contact: string;
	telegram_community: string; // not required
	twitter: string; // not required

	blockchain_type: string;
	explorer_url: string;
	source_code_url: string;
	smart_contact_address: string; // not required // if ERC-20
	legal_opinion: File | null; // FIXME File type
	icon: File | null; // FIXME File type
	is_not_security_token: boolean;
	is_already_listed: boolean;
}

export type IListingRequestFormErrorsBody = Partial<Record<keyof IListingRequestFormBody, string>>;
