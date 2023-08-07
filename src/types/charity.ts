import { IDepositMethod } from "models/Deposit";

export interface ICurrency {
	code: string;
	name: string;
	available: string;
	image_svg: string;
	image_png: string;
}

export interface IFormBody {
	currency: string;
	amount: string;
	note: string;
	paymentMethod?: IDepositMethod;
}

export interface IDonate {
	amount: string;
	currency: string;
	message?: string;
}
