import { IAlphaCode } from "models/AlphaCodes";

export const formatAlphaCodes = (codes: Record<string, any>[]): IAlphaCode[] =>
	codes.map((c) => ({
		amount: +c.amount,
		date: c.date,
		code_search: c.code_search ?? "",
		currency_id: c.currency_id ?? "",
		recipient_email: c.recipient_email ?? "",
		is_active: c.is_active ?? false,
	}));
