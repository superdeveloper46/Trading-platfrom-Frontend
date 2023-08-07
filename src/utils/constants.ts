export const IS_WINDOW_AVAILABLE = typeof window !== "undefined";

export interface IMonth {
	abbreviation: TMonthKey;
	name: string;
	value: string;
}

type TMonthKey =
	| "Jan"
	| "Feb"
	| "Mar"
	| "Apr"
	| "May"
	| "Jun"
	| "Jul"
	| "Aug"
	| "Sep"
	| "Oct"
	| "Nov"
	| "Dec";

export const MONTHS: IMonth[] = [
	{
		abbreviation: "Jan",
		name: "january",
		value: "01",
	},
	{
		abbreviation: "Feb",
		name: "february",
		value: "02",
	},
	{
		abbreviation: "Mar",
		name: "march",
		value: "03",
	},
	{
		abbreviation: "Apr",
		name: "april",
		value: "04",
	},
	{
		abbreviation: "May",
		name: "may",
		value: "05",
	},
	{
		abbreviation: "Jun",
		name: "june",
		value: "06",
	},
	{
		abbreviation: "Jul",
		name: "july",
		value: "07",
	},
	{
		abbreviation: "Aug",
		name: "august",
		value: "08",
	},
	{
		abbreviation: "Sep",
		name: "september",
		value: "09",
	},
	{
		abbreviation: "Oct",
		name: "october",
		value: "10",
	},
	{
		abbreviation: "Nov",
		name: "november",
		value: "11",
	},
	{
		abbreviation: "Dec",
		name: "december",
		value: "12",
	},
];

export const contentLocaleJoin = "+";
export const MAX_UPLOAD_FILE_SIZE_MB = 8;
export const MAX_PRICE_PRECISION = 8;
export const HOST = `${window.location.protocol}//${window.location.hostname}`;
export const SHARING_LINK_PREFIX = `${HOST}/invite?r=`;
export const REFERRAL_CODE_KEY = "r";
export const MAX_ORDERBOOK_PRECISION_DIFF = 5;
