import { useQuery } from "react-query";
import { IPaginationRes } from "../types/general";
import ApiClient from "../helpers/ApiClient";
import { ICompetition, ICompetitionBoard } from "../types/competitions";

const CompetitionService = {
	getCompetitions: (): Promise<IPaginationRes<ICompetition>> =>
		ApiClient.get("web/competitions/competitions"),
	getCompetitionDetails: (slug: string): Promise<ICompetition> =>
		ApiClient.get(`web/competitions/competition/${slug}`, null),
	getCompetitionBoard: (slug: string): Promise<ICompetitionBoard> =>
		ApiClient.get(`web/competitions/board/${slug}`),
	participate: (competition_id: number) =>
		ApiClient.post("web/competitions/participate", {
			competition_id: competition_id,
		}),
};

export default CompetitionService;

export const useCompetitions = () =>
	useQuery(["competitions"], async () => {
		const data = await CompetitionService.getCompetitions();
		return data ?? null;
	});

export const useCompetitionDetails = (slug: string) =>
	useQuery(["competition-details", slug], async () => {
		const data = await CompetitionService.getCompetitionDetails(slug);
		return data ?? null;
	});

export const useCompetitionBoard = (slug: string) =>
	useQuery(["competition-board", slug], async () => {
		const data = await CompetitionService.getCompetitionBoard(slug);
		return data ?? null;
	});
