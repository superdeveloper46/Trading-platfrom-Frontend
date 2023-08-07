import { URL_VARS } from "constants/routing";

export type TVerificationType =
	| typeof URL_VARS.IDENTITY
	| typeof URL_VARS.ADDRESS
	| typeof URL_VARS.FINANCE;

export type TFinanceHistoryType = typeof URL_VARS.DEPOSITS | typeof URL_VARS.WITHDRAWS;

export interface ISocialListingParams {
	[URL_VARS.SLUG]: string;
}

export interface IStoriesParams {
	[URL_VARS.SLUG]: string;
}

export interface IBalanceDetailsParams {
	[URL_VARS.UID]: string;
}

export interface IApiQueryParams {
	[URL_VARS.SUB_ACCOUNT]?: string;
}

export interface ITransferQueryParams {
	[URL_VARS.OUT]?: string;
	[URL_VARS.IN]?: string;
}

export interface IWalletQueryParams {
	[URL_VARS.TYPE]?: string;
}

export interface IDepositParams {
	[URL_VARS.CURRENCY]: string;
}

export interface IWithdrawConfirmParams {
	[URL_VARS.SLUG]: string;
}

export interface ITransferAcceptParams {
	[URL_VARS.TXID]: string;
}

export interface INotificationParams {
	[URL_VARS.SLUG]: string;
}
