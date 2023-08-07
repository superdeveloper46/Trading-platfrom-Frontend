import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import {
	IChangeEmailRequestBody,
	IChangePasswordRequestBody,
	ICheckLoginBody,
	ICreateSubAccApiKeyRequestBody,
	ICreateSubAccApiKeyResponse,
	ICreateSubAccountBody,
	ICreateSubAccTransferRequestBody,
	ICrossSubAccountBalance,
	IDisableSub2FABody,
	IEnable2FASub,
	IGetSubMarginCurrencyStatusParams,
	IIsolatedSubAccountBalance,
	ILoadApiKeysParams,
	ILoadOrdersParams,
	ILoadSessionsParams,
	ILoadSubAccountParams,
	ILoadTransfersParams,
	IRegisterSubAccountRes,
	ISubAccount,
	ISubAccountBalance,
	ISubAccountMarginBorrowBody,
	ISubAccountMarginRepayBody,
	ISubAccountMarginTransferBody,
	ISubAccountOrder,
	ISubAccountSession,
	ISubAccountTransfer,
	ISubAccountWallet,
	ISubApi,
	IUpdateSubAccApiKeyRequestBody,
	IUpdateSubAccApiKeyResponse,
	IUpdateSubAccountBody,
} from "types/subAccounts";
import { IPaginationRes } from "types/general";
import { ISecureTokenRes } from "types/secureToken";
import { IQrCode } from "types/profileSecurity";
import { IMarginCurrencyStatus } from "models/Terminal";
import { queryVars } from "constants/query";

const SubAccountService = {
	getSubAccounts: (params?: ILoadSubAccountParams): Promise<ISubAccount[]> =>
		ApiClient.get("web/sub-account/sub-accounts", params),
	getSessions: (params?: ILoadSessionsParams): Promise<IPaginationRes<ISubAccountSession>> =>
		ApiClient.get("web/sub-account/session", params),
	getOrders: (params?: ILoadOrdersParams): Promise<IPaginationRes<ISubAccountOrder>> =>
		ApiClient.get("web/sub-account/orders", params),
	getTransfers: (params?: ILoadTransfersParams): Promise<IPaginationRes<ISubAccountTransfer>> =>
		ApiClient.get("web/sub-account/transfers", params),
	getSubApis: (params?: ILoadApiKeysParams): Promise<IPaginationRes<ISubApi>> =>
		ApiClient.get("web/sub-account/api-keys/list", params),
	getSubAccountApiKeyDetail: (slug: string): Promise<ISubApi> =>
		ApiClient.get(`web/sub-account/api-keys/${slug}/detail`),
	updateSubAccApiKey: (
		data: IUpdateSubAccApiKeyRequestBody,
	): Promise<IUpdateSubAccApiKeyResponse> =>
		ApiClient.post("web/sub-account/api-keys/update/request", data),
	cancelUpdateSubAccApiKey: (slug: string): Promise<void> =>
		ApiClient.post(`web/sub-account/api-keys/update/${slug}/cancel`),
	getBalances: (): Promise<ISubAccountBalance[]> =>
		ApiClient.get("web/sub-account/sub-accounts/balances"),
	checkLogin: (body: ICheckLoginBody): Promise<void> =>
		ApiClient.post("web/sub-account/check-login", body),
	createSubAccountRegisterRequest: (body: ICreateSubAccountBody): Promise<IRegisterSubAccountRes> =>
		ApiClient.post("web/sub-account/register/request", body),
	cancelSubAccountRegisterRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/sub-account/register/${slug}/cancel`),
	updateSubAccount: (uid: string, body: IUpdateSubAccountBody): Promise<void> =>
		ApiClient.patch(`web/sub-account/sub-accounts/${uid}/update`, body),
	getSubAccount: (uid: string): Promise<ISubAccount> =>
		ApiClient.get(`web/sub-account/sub-accounts/${uid}`),
	cancelSubAccountOrder: (id: number): Promise<void> =>
		ApiClient.post(`web/sub-account/cancel-order`, { [queryVars.order_id]: id }),
	getSubAccountWallets: (uid: string, hideEmpty?: boolean): Promise<ISubAccountWallet[]> =>
		ApiClient.get(`web/sub-account/sub-accounts/${uid}/wallets`, {
			hide_empty: hideEmpty,
		}),
	getCrossSubAccountBalances: (uid: string): Promise<ICrossSubAccountBalance[]> =>
		ApiClient.get(`web/sub-account/margin/${uid}/cross-balance`),
	getIsolatedSubAccountBalances: (uid: string): Promise<IIsolatedSubAccountBalance[]> =>
		ApiClient.get(`web/sub-account/margin/${uid}/isolated-balance`),
	createSubAccApiKey: (
		data: ICreateSubAccApiKeyRequestBody,
	): Promise<ICreateSubAccApiKeyResponse> =>
		ApiClient.post("web/sub-account/api-keys/create/request", data),
	deleteSubApi: (slug: string): Promise<void> =>
		ApiClient.delete(`web/sub-account/api-keys/${slug}/delete`),
	cancelCreateSubAccApiKey: (slug: string): Promise<void> =>
		ApiClient.post(`web/sub-account/api-keys/create/${slug}/cancel`),
	createSubAccTransfer: (data: ICreateSubAccTransferRequestBody) =>
		ApiClient.post("web/sub-account/transfer", data),
	cancelSubAccTransferCreate: (slug: string) =>
		ApiClient.post(`web/sub-account/transfer/${slug}/cancel`),
	createSubAccountChangeEmailRequest: (data: IChangeEmailRequestBody): Promise<ISecureTokenRes> =>
		ApiClient.post("web/sub-account/change-email/request", data),
	cancelSubAccountChangeEmailRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/sub-account/change-email/${slug}/cancel`),
	createSubAccountChangePasswordRequest: (
		body: IChangePasswordRequestBody,
	): Promise<ISecureTokenRes> => ApiClient.post("web/sub-account/change-password/request", body),
	cancelSubAccountChangePasswordRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/sub-account/change-password/${slug}/cancel`),
	generateKeyTwoFASub: (sub_account: string): Promise<IQrCode> =>
		ApiClient.post("web/sub-account/two-factor/generate-key", { sub_account }),
	enableTwoFASub: (body: IEnable2FASub): Promise<void> =>
		ApiClient.post("web/sub-account/two-factor/setup", body),
	disable2FASub: (body: IDisableSub2FABody): Promise<void> =>
		ApiClient.post("web/sub-account/two-factor/disable", body),
	getCurrencyStatus: (params: IGetSubMarginCurrencyStatusParams): Promise<IMarginCurrencyStatus> =>
		ApiClient.get("web/sub-account/margin/currency-status", params),
	marginBorrow: (body: ISubAccountMarginBorrowBody): Promise<void> =>
		ApiClient.post("web/sub-account/margin/borrow", body),
	marginRepay: (body: ISubAccountMarginRepayBody): Promise<void> =>
		ApiClient.post("web/sub-account/margin/repay", body),
	marginTransfer: (body: ISubAccountMarginTransferBody): Promise<void> =>
		ApiClient.post("web/sub-account/margin/transfer", body),
};

export default SubAccountService;

export const useSubAccounts = (params?: ILoadSubAccountParams) =>
	useQuery(["sub-accounts", params], async () => {
		const data = await SubAccountService.getSubAccounts(params);
		return data ?? null;
	});

export const useSessions = (params?: ILoadSessionsParams) =>
	useQuery(["login-sessions", params], async () => {
		const data = await SubAccountService.getSessions(params);
		return data ?? null;
	});

export const useOrders = (params?: ILoadOrdersParams) =>
	useQuery(["sub-acc-orders", params], async () => {
		const data = await SubAccountService.getOrders(params);
		return data ?? null;
	});

export const useTransfers = (params?: ILoadTransfersParams) =>
	useQuery(["sub-acc-transfers", params], async () => {
		const data = await SubAccountService.getTransfers(params);
		return data ?? null;
	});

export const useSubApis = (params?: ILoadApiKeysParams) =>
	useQuery(["sub-acc-apis", params], async () => {
		const data = await SubAccountService.getSubApis(params);
		return data ?? null;
	});

export const useSubAccWallets = (uid: string, hideEmpty?: boolean) =>
	useQuery(
		[
			"sub-acc-balances",
			{
				uid,
				hideEmpty,
			},
		],
		async () => {
			const data = await SubAccountService.getSubAccountWallets(uid, hideEmpty);
			return data ?? null;
		},
	);

export const useCrossSubAccBalances = (uid: string) =>
	useQuery(
		[
			"sub-acc-cross-balances",
			{
				uid,
			},
		],
		async () => {
			const data = await SubAccountService.getCrossSubAccountBalances(uid);
			return data ?? null;
		},
	);

export const useIsolatedSubAccBalances = (uid: string) =>
	useQuery(
		[
			"sub-acc-isolated-balances",
			{
				uid,
			},
		],
		async () => {
			const data = await SubAccountService.getIsolatedSubAccountBalances(uid);
			return data ?? null;
		},
	);
