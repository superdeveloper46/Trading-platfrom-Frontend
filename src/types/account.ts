import { queryVars } from "constants/query";

export enum AccountTypeEnum {
	SPOT = "spot",
	CROSS = "cross",
	ISOLATED = "isolated",
}

export enum WalletTypeEnum {
	SPOT = "SPOT",
	CROSS_MARGIN = "CROSS_MARGIN",
	ISOLATED_MARGIN = "ISOLATED_MARGIN",
}

export interface IGetMarginStatusParams {
	[queryVars.wallet_type]: number;
	[queryVars.pair]?: string;
}

export interface IBalanceWS {
	code: string;
	type: string;
	market: string;
	balance: string;
	reserve: string;
}

export enum RateAlgoPlanEnum {
	CONSTANT = "constant",
	DIRECT = "direct",
	DIV = "div",
	MUL = "mul",
	REVERSED = "reversed",
	MUL_REVERSED = "mulReversed",
}
