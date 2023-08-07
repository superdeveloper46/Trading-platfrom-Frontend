import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";
import { IPromotedPair } from "types/home";

const HomeService = {
	getPromotedPairs: (): Promise<IPromotedPair[]> => ApiClient.get("web/marketing/promoted-pairs"),
};

export default HomeService;

export const usePromotedPairs = () =>
	useQuery(["promoted-pairs", null], async () => {
		const data = await HomeService.getPromotedPairs();
		return data ?? [];
	});
