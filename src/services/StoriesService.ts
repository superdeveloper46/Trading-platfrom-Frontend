import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";
import { IPaginationRes } from "types/general";
import { ICategory, IStory } from "types/stories";
import { queryVars } from "constants/query";

export interface IGetStoriesParams {
	[queryVars.type]?: string;
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
	[queryVars.search]?: string;
	[queryVars.category]?: string;
}

const StoriesService = {
	getCategories: (): Promise<ICategory[]> => ApiClient.get("web/blog/category"),
	getStories: (params: IGetStoriesParams): Promise<IPaginationRes<IStory>> =>
		ApiClient.get("web/blog/post", params),
	getStory: (slug: string): Promise<IStory> => ApiClient.get(`web/blog/post/${slug}`),
};

export default StoriesService;

export const useStories = (params: IGetStoriesParams) =>
	useQuery(["stories", params], async () => {
		const data = await StoriesService.getStories(params);
		return data;
	});

export const useCategories = () =>
	useQuery(
		["categories"],
		async () => {
			const data = await StoriesService.getCategories();
			return data;
		},
		{ staleTime: Infinity },
	);

export const useStoryDetails = (slug: string) =>
	useQuery(
		["story-details", slug],
		async () => {
			const data = await StoriesService.getStory(slug);
			return data;
		},
		{ refetchOnWindowFocus: false },
	);
