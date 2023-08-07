import { useQuery } from "react-query";
import ApiClient from "helpers/ApiClient";
import {
	IArticleData,
	ISupportCenterArticles,
	ISupportCenterCategories,
	ISupportCenterNews,
	IError,
} from "types/supportCenter";

const SupportCenterService = {
	commonSupportCenterRequest: (params = {}) => ApiClient.get("web/support/articles", params),
	loadArticleData: (slug: string) => ApiClient.get(`web/support/article/${slug}`),
	getSupportRequestForm: () => ApiClient.get("web/support/create-issue"),
	sendReport: (body = {}) => ApiClient.post("web/support/create-issue", body),
};

export const sendReport = async (body = {}) => {
	const result = await SupportCenterService.sendReport(body);

	return result;
};

export const useSupportRequestFormData = () =>
	useQuery(["support-request-form"], () => SupportCenterService.getSupportRequestForm());

export const useSupportArticleData = (slug: string) =>
	useQuery(["support-article-data", slug], () => SupportCenterService.loadArticleData(slug));

export const useSupportSearch = (params = {}) => {
	const reqParams = { ...params, type: 2, page_size: 100 };
	return useQuery(["support-search", reqParams], () =>
		SupportCenterService.commonSupportCenterRequest(reqParams),
	);
};

export const useSupportNews = (params = {}) => {
	const reqParams = { ...params, announce: true };
	return useQuery(["support-news", reqParams], () =>
		SupportCenterService.commonSupportCenterRequest(reqParams),
	);
};

export const useSupportArticles = (params = {}, parent_slug = null, enabled = true) => {
	const reqParams = { ...params, type: 2, page_size: 100, parent_slug };
	return useQuery(
		["support-articles", reqParams],
		() => SupportCenterService.commonSupportCenterRequest(reqParams),
		{ enabled },
	);
};

export const useSupportCategories = (params = {}) => {
	const reqParams = { ...params, type: 1, is_root: true, page_size: 100 };
	return useQuery(["support-categories", reqParams], () =>
		SupportCenterService.commonSupportCenterRequest(reqParams),
	);
};

export const useSupportArticlePageRequests = (
	slug?: string,
): {
	data: {
		support_center_article_data?: IArticleData;
		support_center_articles?: ISupportCenterArticles;
	};
	isLoading: boolean;
	error: IError | null;
} => {
	const article = useSupportArticleData(slug!);
	const articles = useSupportArticles({}, article.data?.parent?.slug, !!article.data?.parent?.slug);

	const isLoading = article.isLoading || articles.isLoading;
	const error = (article.error || articles.error) as IError;
	const data = {
		support_center_article_data: article.data,
		support_center_articles: articles.data,
	};

	return { data, isLoading, error };
};

export const useSupportRootPageRequests = (): {
	data: {
		support_center_news?: ISupportCenterNews;
		support_center_articles?: ISupportCenterArticles;
		support_center_categories?: ISupportCenterCategories;
	};
	isLoading: boolean;
	error: IError | null;
} => {
	const news = useSupportNews();
	const articles = useSupportArticles();
	const categories = useSupportCategories();

	const isLoading = news.isLoading || categories.isLoading || articles.isLoading;
	const error = (news.error || categories.error || articles.error) as IError;
	const data = {
		support_center_news: news.data,
		support_center_articles: articles.data,
		support_center_categories: categories.data,
	};

	return { data, isLoading, error };
};

export default SupportCenterService;
