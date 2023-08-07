interface IMetaDefault {
	meta_description: string | null;
	meta_keywords: string | null;
	slug: string | null;
	title: string | null;
}

export type IAuthor = IMetaDefault;
export type ICategory = IMetaDefault;
export type ITag = IMetaDefault;

export interface IStory {
	author: IAuthor | null;
	category: ICategory | null;
	content: string;
	cover_image: { file: string } | null;
	created_at: string;
	is_comments_allowed: boolean;
	lead: string | null;
	meta_description: string | null;
	meta_keywords: string | null;
	promoted_till: string | null;
	published_at: string | null;
	slug: string;
	tags: ITag[] | null;
	title: string;
	updated_at: string | null;
	views_count: string | null;
}

export interface IBanner {
	id: number;
	image: { file: string } | null;
	size: string | null;
	url: string | null;
}
