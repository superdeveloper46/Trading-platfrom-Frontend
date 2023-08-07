import { AccountTypeEnum } from "types/account";
import { TerminalLayoutEnum } from "types/exchange";
import { TVerificationType } from "types/routing";
import { URL_VARS } from "./routing";

export const ACCOUNT_TYPE: Record<string, number> = {
	[AccountTypeEnum.SPOT]: 1,
	[AccountTypeEnum.CROSS]: 2,
	[AccountTypeEnum.ISOLATED]: 3,
};

export const STOP_OPERATOR: Record<string, number> = {
	GTE: 1,
	LTE: 2,
};

export const TERMINAL_LAYOUTS = [
	TerminalLayoutEnum.BASIC,
	TerminalLayoutEnum.STANDARD,
	TerminalLayoutEnum.ADVANCED,
];

export const VERIFICATION_LEVELS: { [key: number]: TVerificationType } = {
	1: URL_VARS.IDENTITY,
	2: URL_VARS.ADDRESS,
};
