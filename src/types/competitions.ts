export interface ICompetition {
	id: number;
	slug: string;
	name: string;
	slogan: string;
	cover_image_svg: string;
	preview_png: string;
	start_at: string;
	end_at: string;
	description: string | null;
	target_parameter: number;
	rules: string;
	amount: number;
	currency_code: string;
	verification_required: boolean;
	total_places: boolean;
	prizes: ICompetitionPrize[];
	is_demo: boolean;
	is_participant: boolean;
}

export interface ICompetitionPrize {
	code: string;
	places: string;
	reward: string;
}

export interface ICompetitionBoard {
	top: IBoardTopTrader[];
	user: IBoardUser;
	reset_required: boolean | null;
}

export interface IBoardTopTrader {
	account_uid: string;
	amount: string | null;
	currency_code: string;
	is_winner: boolean;
	joined_at: string;
	rank: number;
	trades_count: number;
	updated_at: string;
}

export interface IBoardUser {
	account_uid: string;
	amount: null | number;
	currency_code: string;
	is_winner: boolean;
	joined_at: string;
	rank: number;
	total_bonus: null | number;
	total_places: number | null;
	total_referrals: number | null;
	trades_count: number;
	updated_at: string;
}
