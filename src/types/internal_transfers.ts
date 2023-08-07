import { IOption } from "components/UI/CurrencySelect";
import { queryVars } from "constants/query";
import { ISecureTokenRes } from "./secureToken";

export interface ICreateTransferRequestBody {
	receiver: string;
	[queryVars.amount]: number;
	[queryVars.currency]: string;
	security_code?: string;
	valid_days?: number;
	message?: string;
	note?: string;
}

export interface IAcceptTransferBody {
	security_code: string;
}

interface IInternalTransferCurrency {
	code: string;
	name: string;
	image_svg: string;
	image_png: string;
	precision: number;
}

interface IInternalTransferReceiver {
	uid: string;
	verified: boolean;
}

interface IInternalTransferStatus {
	key: number;
	label: string;
}

export interface IInternalTransferDetails {
	txid: string;
	date: string;
	amount: string;
	currency: IInternalTransferCurrency;
	sender: string;
	receiver: IInternalTransferReceiver;
	status?: IInternalTransferStatus;
	message?: string;
	valid_till: string;
	is_outgoing: boolean;
	can_cancel: boolean;
	can_accept: boolean;
}

export interface ICreateTransferRes extends ISecureTokenRes {
	transfer: IInternalTransferDetails;
}

export interface IInternalTransferHistory {
	amount: string;
	can_accept: boolean;
	can_cancel: boolean;
	currency: IInternalTransferCurrency;
	date: string;
	is_outgoing: boolean;
	receiver: IInternalTransferReceiver;
	sender: string;
	status: IInternalTransferStatus;
	txid: string;
	valid_till?: string;
	message?: string;
	[key: string]: any;
}

export interface IInternalTransferTableHistory extends IInternalTransferHistory {
	option?: IOption;
}

export interface ITransfersHistoryFilter {
	search: string;
	currency: string;
}
