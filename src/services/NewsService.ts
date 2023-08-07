import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IPaginationParams, IPaginationRes } from "types/general";
import { INews } from "types/news";
import { queryVars } from "constants/query";

const NewsService = {
	getNews: (params: IPaginationParams): Promise<IPaginationRes<INews>> =>
		ApiClient.get("web/news/news", params),
	getNewsDetails: (slug: string): Promise<INews> =>
		ApiClient.get(`web/news/news/detail-slug/${slug}`),
};

export default NewsService;

interface IUseNewsParams extends IPaginationParams {
	[queryVars.category]?: string;
}

export const useNews = (params: IUseNewsParams) =>
	useQuery(["news", params], async () => {
		const data = await NewsService.getNews(params);
		return data ?? null;
	});

export const useNewsDetails = (slug: string, onError?: () => void) =>
	useQuery(
		["news-details", slug],
		async () => {
			const data = await NewsService.getNewsDetails(slug);
			return data;
		},
		{
			onError,
		},
	);
