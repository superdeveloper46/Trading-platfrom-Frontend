import { BadgeColorEnum } from "../components/UI/Badge";

export const getActiveMenuElement = (url = "", level: number): string | undefined => {
	if (!url) return;
	const splittedPath = url.split("/");
	// eslint-disable-next-line consistent-return
	return splittedPath[level] ?? "";
};

export const getParentMenuElement = (url = "", level: number): string | undefined => {
	if (!url && level < 2) return;
	const splittedPath = url.split("/");
	// eslint-disable-next-line consistent-return
	return splittedPath[level - 1] ?? "";
};

export const getStatusColor = (status: number): BadgeColorEnum => {
	switch (status) {
		case 1:
			return BadgeColorEnum.VIOLET;
		case 2:
			return BadgeColorEnum.GREY;
		case 3:
			return BadgeColorEnum.BLUE;
		default:
			return BadgeColorEnum.GREY;
	}
};

export const getStatusName = (status: number) => {
	switch (status) {
		case 1:
			return "staking";
		case 2:
			return "closed";
		case 3:
			return "postponed";
		default:
			return "staking";
	}
};

export const getCurrencyColor = (currencyCode: string): string => {
	switch (currencyCode) {
		case "PZM":
			return "#993dd0";
		case "KRG":
			return "#361FFF";
		case "CTG":
			return "#45B391";
		case "BTC":
			return "#EF8E19";
		case "USDT":
			return "#53AE94";
		default:
			return "";
	}
};
