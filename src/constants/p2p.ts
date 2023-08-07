import { MessageDescriptor } from "react-intl";
import * as yup from "yup";
import { AnyObjectSchema } from "yup";

import formMessages from "messages/form";
import {
	ICreateAdFormBody,
	IMerchantRequestFormBody,
	IReportRequestFormBody,
	P2POrderStatusEnum,
	P2PPaymentTimeEnum,
	P2PSideEnum,
	PriceTypeEnum,
	TCreateAdFirstStepKey,
	TCreateAdSecondStepKey,
	TCreateAdThirdStepKey,
} from "types/p2p";
import { YesNoEnum } from "types/general";
import { queryVars } from "./query";

export const COOKIE_P2P_SCAMMER_ATTENTION = "p2psa";
export const COOKIE_ACCEPTED = "accepted";

export const ADS_PAGE_PAGE_SIZE = 8;
export const FEEDBACKS_PAGE_SIZE = 4;
export const TERMS_MAX_SYMBOLS = 1000;
export const REASON_MAX_SYMBOLS = 1000;

export const MAX_REPORT_FILE_SIZE = 1024 * 1024; // 1 MB
export const MAX_VIDEO_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const CARDHOLDER_ATTRIBUTE_NAME = "cardholder_name";

export enum ReportReasonsEnum {
	Scam = "order-fraud-or-scam",
	UnreasonableConditions = "unreasonable-conditions",
	Other = "other",
}

export enum StepsEnum {
	FirstStep,
	SecondStep,
	ThirdStep,
}

export const INITIAL_CREATE_AD_FORM: ICreateAdFormBody = {
	// first step
	[queryVars.side]: P2PSideEnum.Buy,
	[queryVars.base_currency]: "",
	[queryVars.quote_currency]: "",
	[queryVars.price_type]: PriceTypeEnum.Fixed.toString(),
	[queryVars.price]: NaN,
	// second step
	[queryVars.amount]: NaN,
	[queryVars.minimal]: NaN,
	[queryVars.maximum]: NaN,
	[queryVars.payment_methods]: [],
	[queryVars.payment_requisites]: [],
	[queryVars.payment_time]: P2PPaymentTimeEnum.Minutes15.toString(),
	// third step
	[queryVars.terms]: "",
};

export const INITIAL_REPORT_REQUEST_FORM: IReportRequestFormBody = {
	reason: "",
	deal: "",
	description: "",
	proof: null,
};

export const INITIAL_MERCHANT_REQUEST_FORM: IMerchantRequestFormBody = {
	telegram: "",
	is_familiar: "",
	video: null,
};

export const REPORT_REQUEST_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		[queryVars.reason]: yup.string().required(formatMessage(formMessages.required)),
		[queryVars.deal]: yup.string().required(formatMessage(formMessages.required)),
		description: yup.string().required(formatMessage(formMessages.required)),
		[queryVars.proof]: yup.mixed().required(formatMessage(formMessages.required)),
	});

export const MERCHANT_REQUEST_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		[queryVars.telegram]: yup.string().required(formatMessage(formMessages.required)),
		[queryVars.is_familiar]: yup
			.string()
			.required()
			.oneOf([YesNoEnum.Yes], "You must be familiar with OTC/P2P Trading"),
		[queryVars.video]: yup.mixed().required(formatMessage(formMessages.required)),
	});

export const P2PStatuses = {
	[P2POrderStatusEnum.OPEN]: {
		label: "Pending Payment",
		color: "#f79319",
	},
	[P2POrderStatusEnum.CANCELLED]: {
		label: "Cancelled",
		color: "#FF0000",
	},
	[P2POrderStatusEnum.MODERATION]: {
		label: "Moderation",
		color: "#ff5f66",
	},
	[P2POrderStatusEnum.FILLED]: {
		label: "Order Completed",
		color: "#00c853",
	},
	[P2POrderStatusEnum.CANCELLED_BY_MANAGER]: {
		label: "Canceled by manager",
		color: "#FF0000",
	},
	[P2POrderStatusEnum.FILLED_BY_MANAGER]: {
		label: "Approved by manager",
		color: "#00c853",
	},
};

export const CREATE_ORDER_FIRST_STEP_KEYS: TCreateAdFirstStepKey[] = [
	queryVars.pair,
	queryVars.limit,
	queryVars.side,
	queryVars.price,
	queryVars.price_type,
];

export const CREATE_ORDER_SECOND_STEP_KEYS: TCreateAdSecondStepKey[] = [
	queryVars.payment_time,
	queryVars.amount,
	queryVars.payment_requisites,
	queryVars.payment_methods,
];

export const CREATE_ORDER_THIRD_STEP_KEYS: TCreateAdThirdStepKey[] = [queryVars.terms];

export const CREATE_AD_FIRST_STEP_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		[queryVars.side]: yup.number().required(formatMessage(formMessages.required)),
		[queryVars.base_currency]: yup.string().required(formatMessage(formMessages.required)),
		[queryVars.quote_currency]: yup.string().required(formatMessage(formMessages.required)),
		[queryVars.price_type]: yup.number().required(formatMessage(formMessages.required)),
		[queryVars.price]: yup
			.number()
			.transform((value) => (Number.isNaN(value) ? undefined : value))
			.required(formatMessage(formMessages.required))
			.moreThan(0),
	});

export const CREATE_AD_SECOND_STEP_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
	side: P2PSideEnum,
	balance: number,
	maxLimit: number,
): AnyObjectSchema =>
	yup.object().shape({
		[queryVars.amount]: yup
			.number()
			.when([], {
				is: () => side === P2PSideEnum.Sell,
				then: yup.number().max(balance),
			})
			.transform((value) => (Number.isNaN(value) ? undefined : value))
			.moreThan(0)
			.required(formatMessage(formMessages.required)),
		[queryVars.minimal]: yup
			.number()
			.transform((value) => (Number.isNaN(value) ? undefined : value))
			.max(maxLimit, "Minimal limit must be less or equal of maximum available")
			.moreThan(0, "Minimal limit must be more than 0")
			.required(formatMessage(formMessages.required)),
		[queryVars.maximum]: yup
			.number()
			.transform((value) => (Number.isNaN(value) ? undefined : value))
			.max(maxLimit, "Maximum limit must be less or equal of maximum available")
			.min(
				yup.ref(queryVars.minimal),
				"Maximum limit must be greater than or equal to minimal limit",
			)
			.required(formatMessage(formMessages.required)),
		...(side === P2PSideEnum.Buy
			? {
					[queryVars.payment_methods]: yup
						.array()
						.of(yup.number())
						.min(1)
						.required(formatMessage(formMessages.required)),
			  }
			: {
					[queryVars.payment_requisites]: yup
						.array()
						.of(yup.number())
						.min(1)
						.required(formatMessage(formMessages.required)),
			  }),
		[queryVars.payment_time]: yup.string().required(formatMessage(formMessages.required)),
	});

export const CREATE_AD_THIRD_STEP_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		[queryVars.terms]: yup.string().max(TERMS_MAX_SYMBOLS),
	});

export const CREATE_ORDER_VALIDATION_SCHEMA = (
	formatMessage: (v: MessageDescriptor) => string,
	side: P2PSideEnum,
	minimalLimit: number,
	maximalLimit: number,
	balance: number,
): AnyObjectSchema =>
	yup.object().shape({
		trade_amount:
			side === P2PSideEnum.Sell
				? yup
						.number()
						.min(minimalLimit, "Amount can't be less than minimum limit")
						.max(maximalLimit, "Amount can't be more than maximum limit or available currency")
						.required(formatMessage(formMessages.required))
				: yup
						.number()
						.max(balance, "Amount can't be more than your balance")
						.required(formatMessage(formMessages.required)),
		receive_amount:
			side === P2PSideEnum.Buy
				? yup
						.number()
						.min(minimalLimit, "Amount can't be less than minimum limit")
						.max(maximalLimit, "Amount can't be more than maximum limit or available currency")
						.required(formatMessage(formMessages.required))
				: yup.number().required(formatMessage(formMessages.required)),
		[queryVars.requisites]:
			side === P2PSideEnum.Buy
				? yup.number().required(formatMessage(formMessages.required))
				: yup.mixed().notRequired(),
	});
