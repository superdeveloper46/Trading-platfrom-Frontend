import ApiClient from "helpers/ApiClient";
import {
	IGetApiKeysParams,
	IGetApiKeysRes,
	ICreateApiKeyRequestBody,
	IApiKeyRequestDetails,
	IUpdateApiKeyRequestBody,
	IConfirmApiKeyRequestBody,
} from "types/profile";
import { IApiKeyDetails } from "models/ApiKeys";

const ApiService = {
	loadApiKeysRequest: (params: IGetApiKeysParams): Promise<IGetApiKeysRes> =>
		ApiClient.get("web/api/api-key/list", params),
	createApiKeyRequest: (params: ICreateApiKeyRequestBody): Promise<IApiKeyRequestDetails> =>
		ApiClient.post("web/api/create/request", params),
	createApiKeyUpdateRequest: (data: IUpdateApiKeyRequestBody): Promise<IApiKeyRequestDetails> =>
		ApiClient.post("web/api/update/request", data),
	cancelApiKeyCreateRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/api/create/${slug}/cancel`),
	cancelApiKeyUpdateRequest: (slug: string): Promise<void> =>
		ApiClient.post(`web/api/update/${slug}/cancel`),
	getApiKeyCreatingDetailsRequest: (slug: string): Promise<IApiKeyRequestDetails> =>
		ApiClient.get(`web/api/create/${slug}/details`),
	getApiKeyUpdatingDetailsRequest: (slug: string): Promise<IApiKeyRequestDetails> =>
		ApiClient.get(`web/api/update/${slug}/details`),
	getApiKeyDetailsRequest: (slug: string): Promise<IApiKeyDetails> =>
		ApiClient.get(`web/api/api-key/${slug}/detail`),
	confirmApiKeyRequest: (
		slug: string,
		data: IConfirmApiKeyRequestBody,
	): Promise<IApiKeyRequestDetails> => ApiClient.post(`web/api/create/${slug}/confirm`, data),
	confirmApiKeyUpdateRequest: (
		slug: string,
		data: IConfirmApiKeyRequestBody,
	): Promise<IApiKeyRequestDetails> => ApiClient.post(`web/api/update/${slug}/confirm`, data),
	resendConfirmationCodeRequest: (slug: string): Promise<IApiKeyRequestDetails> =>
		ApiClient.post(`web/api/create/${slug}/resend`),
	resendUpdateConfirmationCodeRequest: (slug: string): Promise<IApiKeyRequestDetails> =>
		ApiClient.post(`web/api/update/${slug}/resend`),
	deleteApiKeyRequest: (slug: string): Promise<void> =>
		ApiClient.delete(`web/api/api-key/${slug}/delete`, {}, null),
};

export const createApiKey = async (params: ICreateApiKeyRequestBody): Promise<string> => {
	const details = await ApiService.createApiKeyRequest(params);
	return details?.slug ?? "";
};

export const updateApiKey = async (params: IUpdateApiKeyRequestBody): Promise<string> => {
	const details = await ApiService.createApiKeyUpdateRequest(params);
	return details?.slug ?? "";
};

export const cancelApiKeyCreating = async (slug: string): Promise<void> =>
	ApiService.cancelApiKeyCreateRequest(slug);

export const cancelApiKeyUpdating = async (slug: string): Promise<void> =>
	ApiService.cancelApiKeyUpdateRequest(slug);

export const getApiKeyCreatingDetails = async (
	slug: string,
): Promise<IApiKeyRequestDetails | null> => {
	const data: IApiKeyRequestDetails = await ApiService.getApiKeyCreatingDetailsRequest(slug);
	return data ?? null;
};

export const getApiKeyUpdatingDetails = async (
	slug: string,
): Promise<IApiKeyRequestDetails | null> => {
	const data: IApiKeyRequestDetails = await ApiService.getApiKeyUpdatingDetailsRequest(slug);
	return data ?? null;
};

export const getApiKeyDetails = async (slug: string): Promise<IApiKeyDetails | null> => {
	const data: IApiKeyDetails = await ApiService.getApiKeyDetailsRequest(slug);
	return data ?? null;
};

export const confirmApiKey = async (
	slug: string,
	data: IConfirmApiKeyRequestBody,
): Promise<IApiKeyRequestDetails | null> => {
	const details: IApiKeyRequestDetails = await ApiService.confirmApiKeyRequest(slug, data);
	return details ?? null;
};

export const confirmApiKeyUpdating = async (
	slug: string,
	data: IConfirmApiKeyRequestBody,
): Promise<IApiKeyRequestDetails | null> => {
	const details: IApiKeyRequestDetails = await ApiService.confirmApiKeyUpdateRequest(slug, data);
	return details ?? null;
};

export const resendConfirmationCode = async (
	slug: string,
): Promise<IApiKeyRequestDetails | null> => {
	const details: IApiKeyRequestDetails = await ApiService.resendConfirmationCodeRequest(slug);
	return details ?? null;
};

export const resendUpdateConfirmationCode = async (
	slug: string,
): Promise<IApiKeyRequestDetails | null> => {
	const details: IApiKeyRequestDetails = await ApiService.resendUpdateConfirmationCodeRequest(slug);
	return details ?? null;
};

export const deleteApiKey = async (slug: string): Promise<void> => {
	await ApiService.deleteApiKeyRequest(slug);
};

export default ApiService;
