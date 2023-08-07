/* eslint-disable no-unreachable-loop */
import React from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import cookies from "js-cookie";
import appConfig from "helpers/config";
import { toast } from "react-toastify";
import { LOCALE_CACHE_KEY } from "utils/cacheKeys";
import { defaultLocale } from "providers/LanguageProvider/i18n";
import cache from "./cache";

const API_PREFIX = appConfig.apiPrefix;
const CSRF_COOKIE_NAME = appConfig.csrfCookieName;
const SESSION_COOKIE_NAME = appConfig.sessionCookieName;

axios.defaults.withCredentials = true;

type TResponseType = "json" | "arraybuffer" | "blob" | "document" | "text" | "stream" | undefined;
type TRequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface IError {
	data: any;
	status: number;
	message: string;
}

export type IApiError = IError;

const getDetails = (obj: Record<string, unknown>): string => {
	const d = obj[Object.keys(obj)?.length ? Object.keys(obj)[0] : "details"];
	while (typeof d === "object") {
		return getDetails(d as Record<string, unknown>);
	}
	return (typeof d === "string" ? d : "Server error") as string;
};

let isUnauthorized = false;
const handleError = (err: AxiosError) => {
	const status = err.response?.status ?? 0;
	if ([401, 403].includes(status)) {
		if (!isUnauthorized) {
			isUnauthorized = true;
			cookies.remove(appConfig.sessionCookieName);

			toast(
				<>
					<i className="ai ai-info_outlined" />
					{status === 401 ? "Unauthorized [401]" : "Access denied [403]"}
				</>,
			);

			setTimeout(() => {
				const locale = cache.getItem(LOCALE_CACHE_KEY, defaultLocale);
				window.location.href = `/${locale}/login`;
			}, 1000);
		}

		return Promise.resolve();
	}

	const originalError = (err as Record<string, any>)?.response.data || err;
	const details = { ...originalError };
	const message =
		typeof details === "object"
			? getDetails(details as Record<string, unknown>)
			: err.message || "Server error";
	console.error("API error: ", err.response);
	const error = {
		data: originalError,
		status: status,
		message: message,
	};

	if (error.status === 0 || error.status >= 500) {
		toast(
			<>
				<i className="ai ai-error_outline" />
				Server error
			</>,
		);
	} else if (error.status === 404) {
		toast(
			<>
				<i className="ai ai-error_outline" />
				Not Found
			</>,
		);
	} else if (error.status === 401) {
		toast(
			<>
				<i className="ai ai-error_outline" />
				{message}
			</>,
		);
	}
	return Promise.reject(error);
};

const handleResponse = (res: AxiosResponse) => res.data || res;

const handleRequest = (config: AxiosRequestConfig) => {
	const sessionToken = cookies.get(SESSION_COOKIE_NAME);
	const csrfToken = cookies.get(CSRF_COOKIE_NAME);

	if (config.headers) {
		if (sessionToken) {
			config.headers.Authorization = `Bearer ${sessionToken}`;
		}
		if (csrfToken) {
			config.headers["X-CSRFToken"] = csrfToken;
		}
	}

	return config;
};

// const csrfInit = () => request(CSRF_API_URL, "GET");

axios.interceptors.response.use(handleResponse, handleError);
axios.interceptors.request.use(handleRequest);

const request = async (
	url: string,
	method: TRequestMethod,
	data: any,
	params = null,
	headers = {},
	responseType: TResponseType = "json",
): Promise<any> => {
	const config: AxiosRequestConfig = {
		method,
		params,
		url: `${API_PREFIX}/${url}`,
		data,
		responseType,
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			"accept-language": cache.getItem(LOCALE_CACHE_KEY, defaultLocale),
			...headers,
		},
	};

	return axios(config);
};

export default class ApiClient {
	static get = async (
		url: string,
		params: any = null,
		headers: Record<string, unknown> = {},
		responseType?: TResponseType,
	) => request(url, "GET", null, params, headers, responseType);

	static post = async (url: string, data?: unknown, params?: any, headers: any = {}) =>
		request(url, "POST", data, params, headers);

	static put = async (url: string, data?: any, params: any = null) =>
		request(url, "PUT", data, params);

	static patch = async (url: string, data?: any, params: any = null, headers: any = {}) =>
		request(url, "PATCH", data, params, headers);

	static delete = async (url: string, headers: any = {}, data?: any) =>
		request(url, "DELETE", data, null, headers);
}
