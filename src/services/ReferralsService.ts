import {
	ICreateReferralInvite,
	IEditReferralInvite,
	IGetAccruals,
	IGetRefbacksList,
	IGetReferrals,
	IReferralInfo,
	IReferralInvite,
} from "types/referrals";
import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";
import errorHandler from "utils/errorHandler";

const SocialListingService = {
	fetchReferralsList: (params: IGetReferrals): Promise<void> =>
		ApiClient.get("web/referral/referrals", params),
	fetchReferralInvites: (params = {}): Promise<void> =>
		ApiClient.get("web/referral/invites", params),
	fetchReferralAccruals: (params: IGetAccruals): Promise<void> =>
		ApiClient.get("web/referral/bonus-history", params),
	fetchReferralsInfo: (params = {}): Promise<IReferralInfo> =>
		ApiClient.get("web/referral/profile", params),
	createReferralInvite: (params: ICreateReferralInvite): Promise<void> =>
		ApiClient.post("web/referral/invites", params),
	editReferralInvite: async (id: number, data: IEditReferralInvite): Promise<void> =>
		ApiClient.put(`web/referral/invites/${id}`, data),
	getReferralInvite: async (id: number): Promise<IReferralInvite> =>
		ApiClient.get(`web/referral/invites/${id}`),
	deleteReferralInvite: async (id: number): Promise<void> =>
		ApiClient.delete(`web/referral/invites/${id}`, {}, {}),
	setReferralInviteByDefault: async (id: number): Promise<void> =>
		ApiClient.patch(`web/referral/invites/${id}`, { is_default: true }),
	getReferralRefbacks: async (params: IGetRefbacksList): Promise<void> =>
		ApiClient.get("web/referral/kickback-history", params),
};

export default SocialListingService;

export const getReferralInvite = async (id: number): Promise<IReferralInvite | null> => {
	try {
		return await SocialListingService.getReferralInvite(id);
	} catch (err: any) {
		errorHandler(err);
	}
	return null;
};

export const useReferralInfo = () =>
	useQuery(["referral-info", null], async () => {
		const data = await SocialListingService.fetchReferralsInfo();
		return data;
	});
