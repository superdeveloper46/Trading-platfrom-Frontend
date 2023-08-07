import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import { IPaginationParams, IPaginationRes } from "types/general";
import { queryVars } from "constants/query";
import {
	IInterest,
	IPlan,
	IPosition,
	IPositionsParams,
	IResCurrentInterest,
	ISubscribeRequestBody,
} from "types/staking";

const StakingService = {
	getPlans: (): Promise<IPaginationRes<IPlan>> => ApiClient.get("web/staking/plans"),
	subscribe: (body: ISubscribeRequestBody): Promise<void> =>
		ApiClient.post("web/staking/subscribe", body),
	getPositions: (params: IPositionsParams): Promise<IPaginationRes<IPosition>> =>
		ApiClient.get("web/staking/positions", params),
	getInterests: (params: IPaginationParams): Promise<IPaginationRes<IInterest>> =>
		ApiClient.get("web/staking/interests", params),
	getPositionInterests: (position_id: number): Promise<IPaginationRes<IInterest>> =>
		ApiClient.get(
			`web/staking/interests?${queryVars.position_id}=${position_id}&${queryVars.page_size}=10`,
		),
	confirmInterest: (position_id: number): Promise<void> =>
		ApiClient.post("web/staking/interest", { position_id }),
	redeem: (position_id: number): Promise<void> =>
		ApiClient.post("web/staking/redeem", { position_id }),
	redeemEarly: (position_id: number): Promise<void> =>
		ApiClient.post("web/staking/postpone-redeem", { position_id }),
	getCurrentInterest: (position_id: number): Promise<IResCurrentInterest> =>
		ApiClient.get(`web/staking/positions/${position_id}/current-interest`),
};

export default StakingService;

export const usePlans = () =>
	useQuery(["plans"], async () => {
		const data = await StakingService.getPlans();
		return data ?? null;
	});

export const usePositions = (params: IPositionsParams) =>
	useQuery(["positions", params?.page], async () => {
		const data = await StakingService.getPositions({
			[queryVars.page_size]: 12,
			...params,
		});

		return data ?? null;
	});

export const useInterests = (params: IPaginationParams) =>
	useQuery(["interests", params?.page], async () => {
		const data = await StakingService.getInterests({
			[queryVars.page_size]: 12,
			...params,
		});

		return data ?? null;
	});
