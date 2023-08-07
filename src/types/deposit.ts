export enum DepositColorsEnum {
	Blue = "blue",
	Green = "green",
	Orange = "orange",
	Red = "red",
}

export enum DepositStatusesEnum {
	Pending = 1, //  # when waiting for confirmation
	Moderation = 2, //  # when manual or additional moderation need (no usage)
	Confirmed = 5, //  # when on balance
	Rejected = 6, //  # when impossible to approve
}

export interface ICreateDepositReq {
	payment_type: number;
	amount: number;
}

export interface ICreateDepositRes {
	redirect_url: string;
}
