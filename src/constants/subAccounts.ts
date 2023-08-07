import * as yup from "yup";
import { AnyObjectSchema } from "yup";

import formMessages from "messages/form";

import {
	ISubAccApiKeyCreateFormBody,
	ISubAccApiKeyEditFormBody,
	ISubAccCreateFormBody,
	ISubAccTransferCreateFormBody,
	PairsStrategyEnum,
	PermittedActionsEnum,
	PermittedIPStrategyEnum,
} from "types/subAccounts";
import { MessageDescriptor } from "react-intl";
import { ISelectOption } from "components/UI/Select";

export const PAGE_SIZE = 15;

export enum WalletTypeEnum {
	Spot = "spot",
	Cross = "cross",
	Isolated = "isolated",
}

export const SUB_ACC_WALLET_TYPES: ISelectOption[] = [
	{
		label: "Spot",
		value: WalletTypeEnum.Spot,
	},
	{
		label: "Cross",
		value: WalletTypeEnum.Cross,
	},
	{
		label: "Isolated",
		value: WalletTypeEnum.Isolated,
	},
];

export const INITIAL_SUB_ACC_CREATE_FORM: ISubAccCreateFormBody = {
	login: "",
	email: "",
	password: "",
	description: "",
};

export const INITIAL_SUB_ACC_API_KEY_CREATE_FORM: ISubAccApiKeyCreateFormBody = {
	sub_account: "",
	label: "",
	permittedIPs: "",
	permittedIPsList: [],
	permittedActions: PermittedActionsEnum.Reading,
	tradeCoins: {
		spot: true,
		margin: false,
	},
};

export const yupCustomPasswordValidation = (formatMessages: (v: MessageDescriptor) => string) =>
	yup
		.string()
		.required()
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&(){}<>^+=|/:;])[A-Za-z\d@$!%*#?&(){}<>^+=|/:;]{8,}$/,
			formatMessages(formMessages.password_requirements),
		)
		.min(8, formatMessages(formMessages.password_is_too_short));

export const SUB_ACC_API_KEY_CREATE_FORM_VALIDATION_SCHEMA = (
	formatMessages: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object().shape({
		sub_account: yup.string().required(formatMessages(formMessages.required)),
		label: yup.string().required(formatMessages(formMessages.required)),
		permittedIPs: yup.string(),
		permittedIPsList: yup.array().of(yup.string()),
		permittedActions: yup
			.mixed<PermittedActionsEnum>()
			.oneOf(Object.values(PermittedActionsEnum))
			.required(formatMessages(formMessages.required)),
		tradeCoins: yup.object().shape({
			spot: yup.boolean(),
			margin: yup.boolean().required(formatMessages(formMessages.required)),
		}),
	});

export const INITIAL_SUB_ACC_API_KEY_EDIT_FORM: ISubAccApiKeyEditFormBody = {
	label: "",
	permittedIPs: "",
	permittedIPsList: [],
	permittedActions: PermittedActionsEnum.Reading,
	permittedIPStrategy: PermittedIPStrategyEnum.Any,
	availablePairsStrategy: PairsStrategyEnum.Any,
	availablePairsList: [],
	tradeCoins: {
		spot: true,
		margin: false,
	},
};

export const SUB_ACC_API_KEY_EDIT_FORM_VALIDATION_SCHEMA = yup.object().shape({
	label: yup.string().required(),
	permittedIPs: yup.string(),
	permittedIPsList: yup.array().of(yup.string()),
	permittedActions: yup
		.mixed<PermittedActionsEnum>()
		.oneOf(Object.values(PermittedActionsEnum))
		.required(),
	permittedIPStrategy: yup
		.mixed<PermittedIPStrategyEnum>()
		.oneOf(Object.values(PermittedIPStrategyEnum))
		.required(),
	availablePairsStrategy: yup
		.mixed<PairsStrategyEnum>()
		.oneOf(Object.values(PairsStrategyEnum))
		.required(),
	availablePairsList: yup.array().of(yup.string()),
	tradeCoins: yup.object().shape({
		spot: yup.boolean(),
		margin: yup.boolean().required(),
	}),
});

export const INITIAL_SUB_ACC_TRANSFER_CREATE_FORM: ISubAccTransferCreateFormBody = {
	sender: "",
	// sender_type: WalletTypeEnum.Spot,
	receiver: "",
	// receiver_type: WalletTypeEnum.Spot,
	amount: "",
	currency: "",
};

export const SUB_ACC_TRANSFER_CREATE_FORM_VALIDATION_SCHEMA = (
	formatMessages: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object({
		sender: yup.string().required(formatMessages(formMessages.required)),
		// sender_type: yup.mixed<WalletTypeEnum>().oneOf(Object.values(WalletTypeEnum)).required(),
		receiver: yup.string().required(formatMessages(formMessages.required)),
		// receiver_type: yup.mixed<WalletTypeEnum>().oneOf(Object.values(WalletTypeEnum)).required(),
		amount: yup.string().required(formatMessages(formMessages.required)),
		currency: yup.string().required(formatMessages(formMessages.required)),
	});

export const SUB_ACC_CREATE_FORM_VALIDATION_SCHEMA = (
	formatMessages: (v: MessageDescriptor) => string,
	isPasswordEnabled?: boolean,
): AnyObjectSchema =>
	yup.object({
		login: yup
			.string()
			.test(
				"Email checking",
				formatMessages(formMessages.it_cant_be_email),
				(value) => !yup.string().email().isValidSync(value),
			)
			.required(formatMessages(formMessages.required)),
		email: yup.string().email().required(formatMessages(formMessages.required)),
		password: isPasswordEnabled ? yupCustomPasswordValidation(formatMessages) : yup.string(),
		description: yup.string().max(40, formatMessages(formMessages.description_more_than_40_chars)),
	});
