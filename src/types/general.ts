import { MessageDescriptor } from "react-intl";

import { queryVars } from "constants/query";

export type MessageFormatter = (d: MessageDescriptor) => string;

export type FixedSizeArray<N extends number, T> = N extends 0
	? never[]
	: {
			0: T;
			length: N;
	  } & ReadonlyArray<T>;

export interface IPaginationParams {
	[queryVars.page]?: number;
	[queryVars.page_size]?: number;
}

export interface IPaginationRes<T> {
	count: number;
	next?: string | null;
	previous?: string | null;
	results: T[];
}

export interface IDepartmentInfo {
	app_name?: string;
	base_url?: string;
	code?: string;
	label?: string;
	support_email?: string;
}

export interface IError {
	data: Record<string, string | string[]>;
	message: string;
	status: number;
}

export interface IEcaptchaData {
	site_key: string;
	action: string;
}

export enum YesNoEnum {
	Yes = "yes",
	No = "No",
}
