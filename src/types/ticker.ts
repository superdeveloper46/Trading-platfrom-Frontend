export enum TickersQuotedEnum {
	FIAT = "fiat",
	FAVORITES = "favorites",
}

export interface ITickerWS {
	symbol: string;
	close: number;
	base_volume: number;
	quote_volume: number;
	change_percent: number;
	high: number;
	low: number;
	bid: number;
	ask: number;
}
