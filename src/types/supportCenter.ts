export interface IArticleParent {
	slug: string | null;
	type: number;
	parent_slug: null | number;
	title: string | null;
}

export interface IArticle {
	announce_till: string | null;
	content: string | null;
	created_at: string | null;
	icon: string | null;
	meta_description: string | null;
	meta_keywords: any;
	parent: IArticleParent;
	parent_slug: string | null;
	published_at: string | null;
	slug: string | null;
	title: string | null;
	type: number;
	updated_at: string | null;
}

export interface ISupportCenterNews {
	[value: string]: any;
}

export interface ISupportCenterNewsItem {
	slug: string;
	title: string;
	content: string;
}

export interface ISupportCenterArticles {
	count: number;
	results: any[];
	categoriesKeys: string[];
}

export interface ISupportCenterCategories {
	count: number;
	results?: IArticle[];
}

export interface IArticleData {
	[value: string]: any;
}

export interface IError {
	status: number | string;
	detail?: string;
}
