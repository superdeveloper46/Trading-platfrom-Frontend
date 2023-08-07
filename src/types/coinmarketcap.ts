import { queryVars } from "constants/query";
import { IPaginationParams } from "./general";

export enum ListingStatusEnum {
	Active = "active",
	Inactive = "inactive",
	Untracked = "untracked",
}

export enum CryptoCurrencyTypeEnum {
	All = "all",
	Coins = "coins",
	Tokens = "tokens",
}

export enum TagEnum {
	All = "all",
	Defi = "defi",
	FileSharing = "filesharing",
}

export interface ICoin {
	id: number;
	coin: IMarketCapCoin;
	info: IMarketCapCoinInfo;
}

export interface IMarketCapMetaRequest {
	address?: string;
	id?: string;
	slug?: string;
	symbol?: string;
	aux?: string;
	refresh?: boolean;
}

export interface IMarketCapQuoteRequest {
	id?: string;
	slug?: string;
	symbol?: string;
	convert?: string;
	convert_id?: string;
	aux?: string;
	skip_invalid?: boolean;
}

export interface IMarketCapCategoryRequest {
	start?: number;
	limit?: number;
	id?: string;
	symbol?: string;
	slug?: string;
}

export interface ISetFavoriteRequest {
	[queryVars.currency_id]: number;
	[queryVars.is_favorite]: boolean;
}

export interface IListingVoteRequest {
	[queryVars.currency_id]: number;
	[queryVars.vote]: true;
}

export interface IMarketCapResponse<T> {
	results: T;
	count: number;
}

export interface ICoinInfoQuotesResponse<T> {
	data: IMarketCapMap<T>;
	status: IStatus;
}

export interface IStatus {
	credit_count: number;
	elapsed: number;
	error_code: 0;
	error_message: null;
	notice?: any;
	timestamp: string;
	total_count: number;
}

export interface IMarketCapCoinInfo {
	logo: string;
	symbol: string;
	id: number;
	name: string;
	slug: string;
	description: string;
	date_added: string;
	date_launched: string;
	tags: string[];
	platform?: IPlatform;
	category: string;
	twitter_username: string;
	urls: IMarketCapCoinInfoUrl;
	is_hidden: number;
	notice: string;
	subreddit: string;
	"tag-groups": string[];
	"tag-names": string[];
	is_favorite: boolean;
	is_voted: boolean;
	is_staking: boolean;

	// FIXME Add real types
	contract_address: any;
	self_reported_circulating_supply: any;
	self_reported_market_cap: any;
	self_reported_tags: any;
}

export interface IMarketCapCoinInfoUrl {
	announcement?: string[];
	chat?: string[];
	explorer?: string[];
	facebook?: string[];
	message_board?: string[];
	reddit?: string[];
	source_code?: string[];
	technical_doc?: string[];
	twitter?: string[];
	website?: string[];
}

export interface ICoinUrls {
	website: string[];
	technical_doc: string[];
	twitter: string[];
	reddit: string[];
	message_board: string[];
	announcement: string[];
	chat: string[];
	explorer: string[];
	source_code: string[];
}

export interface IMarketCoinCapCategory {
	id: string;
	name: string;
	title: string;
	description: string;
	num_tokens: number;
	avg_price_change: number;
	market_cap: number;
	market_cap_change: number;
	volume: number;
	volume_change: number;
	last_updated: string;
}

export interface IMarketCapCoin {
	id: number;
	name: string;
	symbol: string;
	slug: string;
	price: number;
	cmc_rank: number;
	num_market_pairs: number;
	circulating_supply: number;
	currency: IMarketCapCoinInfo;
	total_supply: number;
	max_supply: number;
	last_updated: string;
	date_added: string;
	tags: string[];
	platform?: IPlatform;
	self_reported_circulation_supply?: any;
	self_reported_market_cap?: any;
	quote: IMarketCapMap<ICurrency>;
}

export interface IPlatform {
	id: number;
	name: string;
	symbol: string;
	slug: string;
	token_address: string;
}

export interface IMarketCapMap<T> {
	[key: string]: T;
}

export interface ICurrency {
	fully_diluted_market_cap: number;
	last_updated: string;
	market_cap: number;
	market_cap_dominance: number;
	percent_change_1h: number;
	percent_change_7d: number;
	percent_change_24h: number;
	percent_change_30d: number;
	percent_change_60d: number;
	percent_change_90d: number;
	price: number;
	volume_24h: number;
}

export interface ILoadCoinsParams extends IPaginationParams {
	[queryVars.is_favorite]?: boolean;
	[queryVars.search]?: string;
	[queryVars.ordering]?: string;
	is_promoted?: boolean;
}
