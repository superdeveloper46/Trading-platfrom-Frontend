import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";

const ContentService = {
	getListing: () => ApiClient.get("web/article/listing"),
	getAMLKYCPolicy: () => ApiClient.get("web/article/aml_kyc_policy"),
	getRiskWarning: () => ApiClient.get("web/article/risk_warnings"),
	getPrivaryPolicy: () => ApiClient.get("web/article/privacy_policy"),
	getTermsOfUse: () => ApiClient.get("web/article/terms_of_use"),
	getMarginAgreement: () => ApiClient.get("web/article/margin_agreement"),
};

export default ContentService;

export const useListing = () =>
	useQuery(
		["listing"],
		async () => {
			const data = await ContentService.getListing();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);

export const useAMLKYCPolicy = () =>
	useQuery(
		["aml-kyc-policy"],
		async () => {
			const data = await ContentService.getAMLKYCPolicy();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);

export const useRiskWarning = () =>
	useQuery(
		["risk-warning"],
		async () => {
			const data = await ContentService.getRiskWarning();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);

export const usePrivacyPolicy = () =>
	useQuery(
		["privary-policy"],
		async () => {
			const data = await ContentService.getPrivaryPolicy();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);

export const useTermsOfUse = () =>
	useQuery(
		["terms-of-use"],
		async () => {
			const data = await ContentService.getTermsOfUse();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);

export const useMarginAgreement = () =>
	useQuery(
		["margin-agreement"],
		async () => {
			const data = await ContentService.getMarginAgreement();
			return data ?? [];
		},
		{ staleTime: Infinity },
	);
