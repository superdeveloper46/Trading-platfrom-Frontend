import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IPaginationParams, IPaginationRes } from "types/general";
import {
	IComment,
	IDonateRequestBody,
	IDonation,
	IDonationsParams,
	IListingProject,
	IPaymentChannel,
} from "types/listing";
import { queryVars } from "constants/query";

const SocialListingService = {
	getDonations: (params: IDonationsParams): Promise<IPaginationRes<IDonation>> =>
		ApiClient.get("web/listing/donations", params),
	getProjects: (params: IPaginationParams): Promise<IPaginationRes<IListingProject>> =>
		ApiClient.get("web/listing/projects", params),
	getProject: (project: string): Promise<IListingProject> =>
		ApiClient.get(`web/listing/projects/${project}`, {}),
	getComments: (project: string): Promise<IPaginationRes<IComment>> =>
		ApiClient.get(`web/listing/projects/${project}/comments`),
	getLatestProjectDonations: (
		project: string,
		params: IDonationsParams,
	): Promise<IPaginationRes<IDonation>> =>
		ApiClient.get(`web/listing/donations?project=${project}`, params),
	getProjectPaymentChannels: (project: string): Promise<IPaymentChannel[]> =>
		ApiClient.get(`web/listing/projects/${project}/channels`),
	sendDonate: (project_id: string, body: IDonateRequestBody) =>
		ApiClient.post(`web/listing/projects/${project_id}/donate`, body),
};

export default SocialListingService;

export const useLatestDonations = () =>
	useQuery(["latest-donations"], async () => {
		const data = await SocialListingService.getDonations({
			[queryVars.ordering]: `-${queryVars.date}`,
			[queryVars.page_size]: 5,
		});

		return data ?? null;
	});

export const useTopDonations = () =>
	useQuery(["top-donations"], async () => {
		const data = await SocialListingService.getDonations({
			[queryVars.ordering]: `-${queryVars.value}`,
			[queryVars.page_size]: 5,
		});

		return data ?? null;
	});

export const useProjects = () =>
	useQuery(["listing-projects"], async () => {
		const data = await SocialListingService.getProjects({});

		return data ?? null;
	});

export const useProject = (project: string) =>
	useQuery(["listing-project"], async () => {
		const data = await SocialListingService.getProject(project);

		return data ?? null;
	});

export const useComments = (project: string) =>
	useQuery(["comments"], async () => {
		const data = await SocialListingService.getComments(project);
		const nextData = data.results.map((comment) => {
			if (comment.replies > 0) {
				// dispatch(getReplies(api, comment.id, post)); TODO
			}
			return { ...comment, replies: [] };
		});

		return { ...data, results: nextData } ?? null;
	});

export const useLatestProjectDonations = (project: string, params?: IPaginationParams) =>
	useQuery(["project-latest-donations", params?.page], async () => {
		const data = await SocialListingService.getLatestProjectDonations(project, {
			[queryVars.ordering]: `-${queryVars.date}`,
			...params,
		});

		return data ?? null;
	});

export const useProjectPaymentChannels = (project: string) =>
	useQuery(["project-payment-channels"], async () => {
		const data = await SocialListingService.getProjectPaymentChannels(project);

		return data ?? null;
	});
