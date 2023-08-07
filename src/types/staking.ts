import { IBalance } from "models/Account";
import { queryVars } from "constants/query";
import { IPaginationParams } from "./general";
import { ICurrency } from "./finances";

export interface IProjectCurrency {
	code: string;
	name: string;
	image_svg: null | string;
	image_png: null | string;
}

export interface IProject {
	id: number;
	currency: IProjectCurrency;
	is_enabled: boolean;
	label: string;
	description: string;
	min_locked_amount: string;
	max_locked_amount: string;
	min_interest_amount: string;
	open_position_limit: string;
	open_position_sum: string;
}

export type IProgressiveRate = {
	days: number | null;
	percent: number | null;
};

export type IPlanReferralProgram = {
	min_verification_level: number;
	name: string;
};

export type IPlan = {
	duration: number;
	id: number;
	interest_rate: string;
	interest_strategy: number;
	is_redemption_instant: boolean;
	is_enabled: boolean;
	interest_rate_type: number; // 10 - fixed 20 - progressive
	is_resubscribable: boolean;
	project: IProject;
	penalty_rate: string;
	progressive_rates: IProgressiveRate[] | null;
	subscription_amount_limit: string | null;
	subscription_amount_used: string | null;
	subscription_period_limit: number | null;
	referral_program: IPlanReferralProgram | null;
	postpone_period: number;
};

export interface ISubscribeRequestBody {
	amount: number;
	plan_id: number;
	promo_code?: string;
	positionId?: number | null;
	positionsParams?: Record<string, any>;
}

export interface IPosition {
	id: number;
	amount: string;
	currency: IBalance;
	duration: number;
	end_at: string | null;
	interest_at: string | null;
	interest_paid: string;
	interest_rate: number;
	promo: any;
	is_flexible: boolean;
	is_open: boolean;
	project: IProject;
	plan: IPlan;
	redeemed_at: string | null;
	redeem_due_at: string | null;
	status: number;
	subscribed_at: string;
	timeout_at: string | null;
}

export interface IPositionsParams extends IPaginationParams {
	[queryVars.is_redeemed]: boolean;
	[queryVars.ordering]: "-subscribed_at" | "-redeemed_at";
}

export type IInterest = {
	id: number;
	project: IProject;
	plan: IPlan;
	position: IPosition;
	amount: number;
	trigger: number;
	date: string | null;
};

export interface IResCurrentInterest {
	current_interest: string;
}

export interface IPromo {
	currency: ICurrency;
	description: string | null;
	id: number;
	is_enabled: boolean;
	label: string | null;
	max_amount: string | null;
}
