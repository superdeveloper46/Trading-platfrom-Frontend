import { FormatNumberOptions } from "react-intl";

export const FORMAT_NUMBER_OPTIONS_BTC: FormatNumberOptions = {
	useGrouping: false,
	minimumFractionDigits: 8,
	maximumFractionDigits: 8,
};

export const FORMAT_NUMBER_OPTIONS_USDT: FormatNumberOptions = {
	useGrouping: false,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

export const FORMAT_NUMBER_OPTIONS_USD: FormatNumberOptions = {
	useGrouping: true,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};
