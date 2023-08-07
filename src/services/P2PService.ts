import { useQuery } from "react-query";

import {
	IAcceptTermsParams,
	IAd,
	IAdListRequestParams,
	IAdRequestParams,
	IBlockedUser,
	IBlockUserParams,
	ICancelOrderParams,
	IConfirmPaymentRequestBody,
	ICreateAdRequestBody,
	ICreateAppealParams,
	ICreateOrderParams,
	IEditPaymentMethodParams,
	IFeedback,
	IFilterPair,
	ILeaveFeedbackParams,
	IMerchantStatusResponse,
	IMessage,
	IMyAdsListRequestParams,
	IOrder,
	IOrderListRequestParams,
	IP2PBalance,
	IP2PVolume,
	IPaymentMethod,
	IRequisites,
	ISetPaymentMethodParams,
	ITransferParams,
	IUserDetails,
	P2PSideEnum,
} from "types/p2p";
import { IPaginationParams, IPaginationRes } from "types/general";
import ApiClient from "helpers/ApiClient";
import { queryVars } from "constants/query";
import { ISecureTokenRes } from "types/secureToken";

const P2PService = {
	getAds: (params: IAdListRequestParams): Promise<IPaginationRes<IAd>> =>
		ApiClient.get("web/p2p/order/list", {
			...params,
			[queryVars.ordering]: `${
				+(params?.side || P2PSideEnum.Sell) === P2PSideEnum.Sell ? "" : "-"
			}${queryVars.price}`,
		}),
	getMyAds: (params: IMyAdsListRequestParams): Promise<IPaginationRes<IAd>> =>
		ApiClient.get("web/p2p/order/list-own", params),
	getAdDetails: (params: IAdRequestParams): Promise<IAd> =>
		ApiClient.get(`web/p2p/order/${params.id}`, params),
	getOrders: (params: IOrderListRequestParams): Promise<IPaginationRes<IOrder>> =>
		ApiClient.get("web/p2p/deal/list", params),
	getOrderDetails: (id: string | null): Promise<IOrder> => ApiClient.get(`web/p2p/deal/${id}`),
	createAd: (params: ICreateAdRequestBody): Promise<IAd> => ApiClient.post(`web/p2p/order`, params),
	createOrder: (params: ICreateOrderParams): Promise<IOrder> =>
		ApiClient.post(`web/p2p/deal`, params),
	createAppeal: (params: ICreateAppealParams): Promise<void> =>
		ApiClient.post(`web/p2p/appeal`, params),
	acceptTerms: (params: IAcceptTermsParams): Promise<void> =>
		ApiClient.post(`web/p2p/accept-terms`, params),
	merchantRequest: (body: FormData): Promise<void> =>
		ApiClient.post(`web/p2p/merchant-request`, body),
	setPaymentMethod: (params: ISetPaymentMethodParams): Promise<any> =>
		ApiClient.post("web/p2p/payment-requisites", params),
	editRequisites: ({ id, ...params }: IEditPaymentMethodParams): Promise<any> =>
		ApiClient.patch(`web/p2p/payment-requisites/${id}`, params),
	getFeedbacks: (id: number, params: IPaginationParams): Promise<IPaginationRes<IFeedback>> =>
		ApiClient.get(`web/p2p/feedbacks/${id}`, params),
	getMyUserDetails: (): Promise<IUserDetails> => ApiClient.get(`web/p2p/profile/me`),
	getUserDetails: (id: number): Promise<IUserDetails> => ApiClient.get(`web/p2p/profile/${id}`),
	getPairs: (): Promise<IPaginationRes<IFilterPair>> => ApiClient.get("web/p2p/pairs"),
	getPaymentMethods: (): Promise<IPaginationRes<IPaymentMethod>> =>
		ApiClient.get("web/p2p/payment-methods"),
	getRequisites: (): Promise<IPaginationRes<IRequisites>> =>
		ApiClient.get("web/p2p/payment-requisites"),
	getBlockedUsers: (params: IPaginationParams): Promise<IPaginationRes<IBlockedUser>> =>
		ApiClient.get("web/p2p/black-list", params),
	deletePaymentRequisite: (id?: number): Promise<void> =>
		ApiClient.delete(`web/p2p/payment-requisites/${id}`),
	reportUser: (body: FormData): Promise<void> =>
		ApiClient.post("web/p2p/report", body, null, {
			"content-type": "multipart/form-data",
		}),
	confirmPayment: (params: IConfirmPaymentRequestBody): Promise<void> =>
		ApiClient.post("web/p2p/deal/approve/request", { ...params, is_totp_required: false }),
	releasePayment: (params: IConfirmPaymentRequestBody): Promise<ISecureTokenRes> =>
		ApiClient.post("web/p2p/deal/approve/request", params),
	cancelReleaseRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/p2p/deal/approve/${slug}/cancel`),
	cancelOrder: (id: number, params?: ICancelOrderParams): Promise<void> =>
		ApiClient.delete(`web/p2p/deal/${id}`, params),
	cancelAd: (id: number): Promise<void> => ApiClient.delete(`web/p2p/order/${id}`),
	blockUser: (params: IBlockUserParams): Promise<void> =>
		ApiClient.post(`web/p2p/black-list`, params),
	unblockUser: (id: number): Promise<void> =>
		ApiClient.post(`web/p2p/black-list`, {
			[queryVars.target]: id,
			[queryVars.is_blocked]: false,
		}),
	getVolumes: (): Promise<IP2PVolume[]> => ApiClient.get("web/p2p/volume"),
	getMerchantRequestStatus: (): Promise<IMerchantStatusResponse> =>
		ApiClient.get("web/p2p/merchant-request"),
	leaveFeedback: (params: ILeaveFeedbackParams): Promise<void> =>
		ApiClient.post(`web/p2p/feedback`, params),
	getBalances: (): Promise<IP2PBalance[]> => ApiClient.get("web/p2p/balances"),
	fundingTransfer: (params: ITransferParams): Promise<void> =>
		ApiClient.post("web/p2p/transfer", params),
	getMessages: (order_id: number): Promise<IPaginationRes<IMessage>> =>
		ApiClient.get(`web/p2p/chat/${order_id}`),
	sendMessage: (order_id: number, text: string): Promise<void> =>
		ApiClient.post(`web/p2p/chat/${order_id}`, { [queryVars.text]: text }),
};

export const useChatMessages = (order_id: number) =>
	useQuery(["chat", order_id], async () => {
		const data = await P2PService.getMessages(order_id);
		return data ?? null;
	});

export const useAds = (params: IAdListRequestParams) =>
	useQuery(["ads", params], async () => {
		const data = await P2PService.getAds(params);
		return data ?? null;
	});

export const useMyAds = (params: IMyAdsListRequestParams) =>
	useQuery(["own-ads", params], async () => {
		const data = await P2PService.getMyAds(params);
		return data ?? null;
	});

export const usePairs = () =>
	useQuery(["pairs"], async () => {
		const data = await P2PService.getPairs();
		return data ?? null;
	});

export const useOrders = (params: IOrderListRequestParams) =>
	useQuery(["orders", params], async () => {
		const data = await P2PService.getOrders(params);
		return data ?? null;
	});

export const useFeedbacks = (id: number, params: IPaginationParams) =>
	useQuery(["feedbacks", { ...params, id }], async () => {
		if (id) {
			const data = await P2PService.getFeedbacks(id, params);
			return data ?? undefined;
		}
		return undefined;
	});

export const usePaymentMethods = () =>
	useQuery(["payment-methods"], async () => {
		const data = await P2PService.getPaymentMethods();
		return data ?? null;
	});

export const usePaymentRequisites = (trigger: boolean) =>
	useQuery(["requisites", trigger], async () => {
		if (trigger) {
			const data = await P2PService.getRequisites();
			return data ?? null;
		}
		return null;
	});

export const useBlockedUsers = (params: IPaginationParams) =>
	useQuery(["blocked-users", params], async () => {
		const data = await P2PService.getBlockedUsers(params);
		return data ?? undefined;
	});

export const useUserDetails = (id: number) =>
	useQuery(["user-details", id], async () => {
		if (id) {
			const data = await P2PService.getUserDetails(id);
			return data ?? undefined;
		}
		return undefined;
	});

export const useMyUserDetails = () =>
	useQuery(["my-user-details"], async () => {
		const data = await P2PService.getMyUserDetails();
		return data ?? undefined;
	});

export const useOrderDetails = (id: string | null) =>
	useQuery(["order-details", id], async () => {
		if (id) {
			const data = await P2PService.getOrderDetails(id);
			return data ?? undefined;
		}
		return undefined;
	});

export const useMyVolumes = () =>
	useQuery(["volumes"], async () => {
		const data = await P2PService.getVolumes();
		return data ?? undefined;
	});

export const useMerchantRequestStatus = () =>
	useQuery(["merchant-request-status"], async () => {
		const data = await P2PService.getMerchantRequestStatus();
		return data ?? undefined;
	});

export const useBalances = () =>
	useQuery(["balances"], async () => {
		const data = await P2PService.getBalances();
		return data ?? undefined;
	});

export const useCurrencyBalance = (currency: string) =>
	useQuery(["balance", currency], async () => {
		if (currency) {
			const balances = await P2PService.getBalances();

			if (balances) {
				return balances.find(({ code }) => currency === code);
			}
		}
		return undefined;
	});

export default P2PService;
