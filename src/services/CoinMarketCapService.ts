import { useQuery } from "react-query";

import ApiClient from "helpers/ApiClient";
import {
	IMarketCapCoin,
	IMarketCapResponse,
	IMarketCapMetaRequest,
	IMarketCapCoinInfo,
	IMarketCapQuoteRequest,
	ICoinInfoQuotesResponse,
	ISetFavoriteRequest,
	ILoadCoinsParams,
	IListingVoteRequest,
} from "types/coinmarketcap";
import { GAINERS_LOSERS_COUNT, HIGHLIGHTS_COINS_COUNT } from "constants/coin_info";
import { queryVars } from "constants/query";

const CoinMarketCapService = {
	getLatestListings: (request?: ILoadCoinsParams): Promise<IMarketCapResponse<IMarketCapCoin[]>> =>
		ApiClient.get("web/coin-info/listings", request),
	getCoin: (request: IMarketCapQuoteRequest): Promise<ICoinInfoQuotesResponse<IMarketCapCoin[]>> =>
		ApiClient.get("web/coin-info/quotes", request),
	getCoinInfo: (
		request?: IMarketCapMetaRequest,
	): Promise<IMarketCapResponse<IMarketCapCoinInfo[]>> =>
		ApiClient.get("web/coin-info/currency-info", request),
	setFavorite: (params: ISetFavoriteRequest): Promise<void> =>
		ApiClient.post("web/coin-info/favorite", params),
	listingVote: (params: IListingVoteRequest): Promise<void> =>
		ApiClient.post("web/coin-info/listing-vote", params),
};

export default CoinMarketCapService;

export const useCoins = (params?: ILoadCoinsParams) =>
	useQuery(["coins", params], async () => {
		const data = await CoinMarketCapService.getLatestListings(params);
		return data ?? null;
	});

export const useGainers = (params?: ILoadCoinsParams) =>
	useQuery(["gainers-coins", params], async () => {
		const data = await CoinMarketCapService.getLatestListings({
			[queryVars.page_size]: GAINERS_LOSERS_COUNT,
			[queryVars.ordering]: `-${queryVars.percent_change_24h}`,
			...params,
		});
		return data ?? null;
	});

export const useLosers = (params?: ILoadCoinsParams) =>
	useQuery(["losers-coins", params], async () => {
		const data = await CoinMarketCapService.getLatestListings({
			[queryVars.page_size]: GAINERS_LOSERS_COUNT,
			[queryVars.ordering]: queryVars.percent_change_24h,
			...params,
		});
		return data ?? null;
	});

export const usePromotedCoins = (params?: ILoadCoinsParams) =>
	useQuery(["promoted-coins", params], async () => {
		const data = await CoinMarketCapService.getLatestListings({
			[queryVars.page_size]: HIGHLIGHTS_COINS_COUNT,
			is_promoted: true,
			...params,
		});
		return data ?? null;
	});
