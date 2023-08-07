import { IBalance } from "models/Account";

export interface ITradeFormBody {
	[key: string]: string;
	price: string;
	amount: string;
	total: string;
	stop_price: string;
}

export interface ITradeFormRealBody {
	[key: string]: number;
	price: number;
	amount: number;
	total: number;
	stop_price: number;
}

export interface IMarginData {
	actionType: string;
	availablePlusBorrowable: number;
	available: number;
	debt: number;
}

export interface ISpotData {
	currentBalance: IBalance;
}

export enum InputNameEnum {
	AMOUNT = "amount",
	PRICE = "price",
	TOTAL = "total",
	QUOTE_AMOUNT = "quote_amount",
}
