export enum WITHDRAWS_STATUS {
	NEW = 10, // created new, need to be confirmed
	CONFIRMED = 20, // confirmed by user, need to be verified
	VERIFIED = 23, // verified by automatic system. ve additinal info in verification field
	PROCESSING = 27, // processing by bot or operator
	DONE = 30, // money sent, see tx id in payment field
	REFUSED = 40, // refuxed by operator or bot
	CANCELLED = 50, // cancelled by user
}
