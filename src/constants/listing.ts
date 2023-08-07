import { IListingRequestFormBody } from "types/listing";
import { MessageDescriptor } from "react-intl";
import { AnyObjectSchema } from "yup";
import * as yup from "yup";

import formMessages from "messages/form";
import listingMessages from "messages/listing";

export const MAX_LEGAL_OPINION_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_LOGO_FILE_SIZE = 0.5 * 1024 * 1024; // 0.5 MB

export enum MarketValuesEnum {
	BTCPair = "BTC/Coin",
	USDTPair = "USDT/Coin",
}

export const GENERAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		project_name: yup.string().required(formatMessage(formMessages.required)),
		currency_name: yup.string().required(formatMessage(formMessages.required)),
		currency_code: yup.string().required(formatMessage(formMessages.required)),
		website_url: yup
			.string()
			.url(formatMessage(formMessages.url_wrong_error))
			.required(formatMessage(formMessages.required)),
		markets: yup
			.array()
			.of(yup.string().oneOf(Object.values(MarketValuesEnum)))
			.min(1)
			.required(formatMessage(formMessages.required)),
		coin_market_cap_url: yup.string().url(formatMessage(formMessages.url_wrong_error)),
		email: yup.string().email().required(formatMessage(formMessages.required)),
		telegram_contact: yup.string().required(formatMessage(formMessages.required)),
		telegram_community: yup.string().url(formatMessage(formMessages.url_wrong_error)),
		twitter: yup.string().url(formatMessage(formMessages.url_wrong_error)),
	});

export const TECHNICAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		blockchain_type: yup.string().required(formatMessage(formMessages.required)),
		explorer_url: yup
			.string()
			.url(formatMessage(formMessages.url_wrong_error))
			.required(formatMessage(formMessages.required)),
		source_code_url: yup
			.string()
			.url(formatMessage(formMessages.url_wrong_error))
			.required(formatMessage(formMessages.required)),
		smart_contact_address: yup.string(),
		legal_opinion: yup.mixed().required(formatMessage(formMessages.required)),
		icon: yup.mixed().required(formatMessage(formMessages.required)),
		is_not_security_token: yup
			.boolean()
			.oneOf([true], formatMessage(listingMessages.security_token_error)),
		is_already_listed: yup.boolean().oneOf([true, false]),
	});

export const INITIAL_LISTING_REQUEST_FORM: IListingRequestFormBody = {
	project_name: "",
	currency_name: "",
	currency_code: "",
	website_url: "",
	markets: [],
	coin_market_cap_url: "",
	email: "",
	telegram_contact: "",
	telegram_community: "",
	twitter: "",

	blockchain_type: "",
	explorer_url: "",
	source_code_url: "",
	smart_contact_address: "",
	legal_opinion: null,
	icon: null,
	is_not_security_token: false,
	is_already_listed: false,
};

export type TGeneralStepKey = keyof Pick<
	IListingRequestFormBody,
	| "project_name"
	| "currency_name"
	| "currency_code"
	| "website_url"
	| "markets"
	| "coin_market_cap_url"
	| "email"
	| "telegram_contact"
	| "telegram_community"
	| "twitter"
>;

export type TTechStepKey = keyof Pick<
	IListingRequestFormBody,
	| "blockchain_type"
	| "explorer_url"
	| "source_code_url"
	| "smart_contact_address"
	| "legal_opinion"
	| "icon"
	| "is_already_listed"
>;

export const GENERAL_STEP_KEYS: TGeneralStepKey[] = [
	"project_name",
	"currency_name",
	"currency_code",
	"website_url",
	"markets",
	"coin_market_cap_url",
	"email",
	"telegram_contact",
	"telegram_community",
	"twitter",
];

export const TECH_STEP_KEYS: TTechStepKey[] = [
	"blockchain_type",
	"explorer_url",
	"source_code_url",
	"smart_contact_address",
	"legal_opinion",
	"icon",
	"is_already_listed",
];
