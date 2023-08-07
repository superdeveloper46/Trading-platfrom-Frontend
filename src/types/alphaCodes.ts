import { queryVars } from "constants/query";

export interface IGetCodesRequestBody {
	[queryVars.page]: number;
	[queryVars.page_size]: number;
}

export interface IActivateRequestBody {
	code?: string;
}

export interface ICreateRequestBody {
	[queryVars.amount]: string;
	[queryVars.currency]: string;
	recipient_email: string;
}
