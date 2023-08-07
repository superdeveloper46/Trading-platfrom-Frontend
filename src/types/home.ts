export interface IPromotedPairCandle {
	price: number;
}

export interface IPromotedPair {
	symbol: string;
	diff: number;
	last_price: number;
	image_png?: string;
	image_svg?: string;
	candles: IPromotedPairCandle[];
}
