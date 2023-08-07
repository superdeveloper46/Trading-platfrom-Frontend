import { Instance } from "mobx-state-tree";
import {
	Referrals,
	ReferralInvite,
	Referral,
	ReferralTier,
	ReferralInfo,
	ReferralAccrual,
	ReferralRefback,
} from "models/Referrals";
import { queryVars } from "constants/query";

export interface IGetReferrals {
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
	[queryVars.search]?: string;
	joined_at_before?: string;
	joined_at_after?: string;
}

export interface IGetAccruals {
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.search]?: string;
}

export interface IGetRefbacksList {
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
	[queryVars.date_after]?: string;
	[queryVars.date_before]?: string;
	[queryVars.search]?: string;
}

export interface IResError {
	status: number;
	detail: any;
}

export interface IError {
	status: number;
	code?: string | number;
	detail?: string;
	data?: any;
}

export interface IResList {
	count: number;
	next: string | null;
	previous: string | null;
	results: any[];
}

export type IReferralInvite = Instance<typeof ReferralInvite>;
export type IReferral = Instance<typeof Referral>;
export type IReferralTier = Instance<typeof ReferralTier>;
export type IReferralInfo = Instance<typeof ReferralInfo>;
export type IReferralAccrual = Instance<typeof ReferralAccrual>;
export type IReferralRefback = Instance<typeof ReferralRefback>;

export interface IAccrualsList extends IResList {
	results: IReferralAccrual[];
}

export interface IRefbacksList extends IResList {
	results: IReferralRefback[];
}

export interface ICreateReferralInvite {
	label: string;
	kickback_rate: number;
	is_default: boolean;
}

export type IEditReferralInvite = ICreateReferralInvite;
export type IReferralsState = Instance<typeof Referrals>;
