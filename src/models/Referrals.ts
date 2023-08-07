import { cast, flow, types as t } from "mobx-state-tree";
import ReferralsService from "services/ReferralsService";
import {
	ICreateReferralInvite,
	IEditReferralInvite,
	IGetAccruals,
	IGetRefbacksList,
	IGetReferrals,
} from "types/referrals";
import errorHandler from "../utils/errorHandler";

export const ReferralRefback = t.model({
	date: t.string,
	kickback: t.number,
	kickback_valuation: t.number,
	currency_code: t.string,
});

export const ReferralInvite = t.model({
	id: t.maybeNull(t.number),
	label: t.optional(t.string, ""),
	code: t.maybeNull(t.string),
	kickback_rate: t.maybeNull(t.string),
	is_default: t.optional(t.boolean, false),
	invited_count: t.optional(t.number, 0),
	bonus_all_time: t.maybeNull(t.string),
	bonus_30d: t.maybeNull(t.string),
});

export const ReferralAccrual = t.model({
	date: t.string,
	referral_uid: t.string,
	invite: t.maybeNull(ReferralInvite),
	tier_rate: t.string,
	bonus: t.string,
	bonus_valuation: t.string,
	currency_code: t.string,
});

export const Referral = t.model({
	joined_at: t.maybeNull(t.string),
	referral_uid: t.maybeNull(t.string),
	invite: t.maybeNull(ReferralInvite),
	referral_bonus_all_time: t.maybeNull(t.string),
	referral_bonus_30d: t.maybeNull(t.string),
	is_active_referral: t.maybeNull(t.boolean),
	activity_at: t.maybeNull(t.string),
});

export const ReferralTier = t.model({
	conditions_params: t.maybeNull(t.string),
	conditions_text: t.maybeNull(t.string),
	icon: t.maybeNull(t.string),
	id: t.number,
	label: t.string,
	level: t.number,
	max_invites_per_user: t.number,
	rate: t.maybeNull(t.string),
});

export const ReferralInfo = t.model({
	activity_ny21_referrals_count: t.optional(t.maybeNull(t.number), null),
	bonus_30d: t.optional(t.maybeNull(t.string), ""),
	bonus_all_time: t.optional(t.maybeNull(t.string), ""),
	calculated_at: t.optional(t.maybeNull(t.string), ""),
	invite: t.optional(t.maybeNull(ReferralInvite), null),
	invited_count: t.optional(t.number, 0),
	invited_count_30d: t.optional(t.number, 0),
	joined_at: t.optional(t.maybeNull(t.string), ""),
	kickback_30d: t.optional(t.maybeNull(t.string), null),
	kickback_all_time: t.optional(t.string, ""),
	active_count_30d: t.optional(t.number, 0),
	rank: t.optional(t.maybeNull(t.number), null),
	tier: t.optional(t.maybeNull(ReferralTier), null),
});

export const Referrals = t
	.model({
		referralsList: t.optional(t.array(Referral), []),
		isReferralsListLoading: t.optional(t.boolean, false),
		info: t.optional(t.maybeNull(ReferralInfo), null),
		isInfoLoading: t.optional(t.boolean, false),
		invites: t.optional(t.array(ReferralInvite), []),
		isInvitesLoading: t.optional(t.boolean, false),
		referralsCount: t.optional(t.number, 0),
		isAccrualsListLoading: t.optional(t.boolean, false),
		accrualsList: t.optional(t.array(ReferralAccrual), []),
		accrualsCount: t.optional(t.number, 0),
		refbacksList: t.optional(t.array(ReferralRefback), []),
		isRefbacksListLoading: t.optional(t.boolean, false),
		refbacksCount: t.optional(t.number, 0),
	})
	.views((self) => ({
		get defaultInvite() {
			return self.invites.find((invite) => invite.is_default);
		},
	}))
	.actions((self) => ({
		loadReferralsList: flow(function* (params: IGetReferrals) {
			try {
				self.isReferralsListLoading = true;
				const data = yield ReferralsService.fetchReferralsList(params);
				self.referralsCount = data.count;

				if (Array.isArray(data.results)) {
					self.referralsList = cast(data.results);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isReferralsListLoading = false;
			}
		}),
		loadReferralInvites: flow(function* (params?: any) {
			try {
				self.isInvitesLoading = true;
				const data = yield ReferralsService.fetchReferralInvites(params);

				if (Array.isArray(data)) {
					self.invites = cast(data);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isInvitesLoading = false;
			}
		}),
		loadReferralAccruals: flow(function* (params: IGetAccruals) {
			try {
				self.isAccrualsListLoading = true;
				const data = yield ReferralsService.fetchReferralAccruals(params);

				if (Array.isArray(data.results)) {
					self.accrualsList = cast(data.results);
				}
				self.accrualsCount = data.count;
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isAccrualsListLoading = false;
			}
		}),
		loadReferralsInfo: flow(function* (params?: any) {
			try {
				self.isInfoLoading = true;
				self.info = yield ReferralsService.fetchReferralsInfo(params);
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isInfoLoading = false;
			}
		}),
		loadReferralRefbacks: flow(function* (params: IGetRefbacksList) {
			try {
				self.isRefbacksListLoading = true;
				const data = yield ReferralsService.getReferralRefbacks(params);
				if (Array.isArray(data.results)) {
					self.refbacksList = cast(data.results);
				}
				self.refbacksCount = data.count;
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isRefbacksListLoading = false;
			}
		}),
	}))
	.actions((self) => ({
		createReferralInvite: flow(function* (params: ICreateReferralInvite) {
			try {
				yield ReferralsService.createReferralInvite(params);
				self.loadReferralInvites();
			} catch (err) {
				errorHandler(err);
			}
		}),
		editReferralInvite: flow(function* (id: number, params: IEditReferralInvite) {
			try {
				yield ReferralsService.editReferralInvite(id, params);
				self.loadReferralInvites();
			} catch (err) {
				errorHandler(err);
			}
		}),
		deleteReferralInvite: flow(function* (id: number) {
			try {
				yield ReferralsService.deleteReferralInvite(id);
				self.loadReferralInvites();
			} catch (err) {
				errorHandler(err);
			}
		}),
		setReferralInviteByDefault: flow(function* (id: number) {
			try {
				yield ReferralsService.setReferralInviteByDefault(id);
				self.loadReferralInvites();
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));
