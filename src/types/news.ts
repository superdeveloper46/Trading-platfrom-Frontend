export interface INews {
	date: number;
	id: number;
	image: string | null;
	image_thumbnail: string | null;
	image_webp: string | null;
	keywords: string | null;
	short_text: string | null;
	slug: string | null;
	text: string | null;
	title: string | null;
	views: number;
}

export enum INewsCategoryEnum {
	WORLD = "world",
	EXCHANGE = "exchange",
}
