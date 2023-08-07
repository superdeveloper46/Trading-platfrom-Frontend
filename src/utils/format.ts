// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable prefer-template */

import { MAX_PRICE_PRECISION } from "./constants";

/* eslint-disable radix */
export const formatNumberToString = (n: number, precision?: number): string => {
	if (n >= 1e3 && n < 1e6) return `${+(n / 1e3).toFixed(1)}k`;
	if (n >= 1e6 && n < 1e9) return `${+(n / 1e6).toFixed(1)}M`;
	if (n >= 1e9 && n < 1e12) return `${+(n / 1e9).toFixed(1)}B`;
	if (n >= 1e12) return `${+(n / 1e12).toFixed(1)}T`;
	return formatNumberNoRounding(n, precision);
};

const toFixed = (x: number) => {
	if (Math.abs(x) < 1.0) {
		const e = parseInt(x.toString().split("e-")[1]);
		if (e) {
			x *= 10 ** (e - 1);
			x = "0." + new Array(e).join("0") + x.toString().substring(2);
		}
	} else {
		let e = parseInt(x.toString().split("+")[1]);
		if (e > 20) {
			e -= 20;
			x /= 10 ** e;
			x += new Array(e + 1).join("0");
		}
	}
	return x;
};

const toFixedTrunc = (x: number, n: number): string => {
	x = toFixed(x);

	// From here on the code is the same than the original answer
	const v = (typeof x === "string" ? x : x.toString()).split(".");
	if (n <= 0) return v[0];
	let f = v[1] || "";
	if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
	while (f.length < n) f += "0";
	return `${v[0]}.${f}`;
};

export const formatNumberNoRounding = (n: number, fixed = 8): string => {
	if (typeof n !== "number") {
		return "";
	}

	return toFixedTrunc(n, fixed);
};

export const formatField = (
	value: number,
	precision: number,
	formatNumber: (value: number | bigint, opts?: FormatNumberOptions) => string,
): string =>
	formatNumber(value, {
		useGrouping: false,
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	}).replace(",", ".");

export const flip = (obj: Record<any, any>) =>
	Object.keys(obj).reduce((ret, key) => {
		ret[obj[key]] = key;
		return ret;
	}, {});

export const formatRateToPercentage = (rate: number): string =>
	`${formatNumberNoRounding(rate * 100, 4)}%`;

// only for coin info
export const formatCryptoCurrencyPrice = (price?: number, currency = "$"): string => {
	if (typeof price !== "number") {
		return "--";
	}

	const stringPrice = price.toString();
	const indexOfPoint = stringPrice.indexOf(".");

	if (price >= 1) {
		return `${currency} ${groupPrice(stringPrice.slice(0, indexOfPoint + 3))}`;
	}

	let firstNotZeroIndex = 0;

	for (let i = 0; i < stringPrice.length; i++) {
		if (stringPrice[i] !== "0" && stringPrice[i] !== ".") {
			firstNotZeroIndex = i;
			break;
		}
	}

	return `${currency} ${stringPrice.slice(0, firstNotZeroIndex + 4)}`;
};

export const formatPercent = (percent?: number) => {
	const formattedPercent = Math.abs(percent).toFixed(2);
	return percent ? `${formattedPercent} %` : "--";
};

const groupPrice = (v: string, decimal = ",") => v.replace(/\B(?=(\d{3})+(?!\d))/g, decimal);

export const ellipsisInsideWord = (word: string, moreThan = 10) =>
	word && word.length > moreThan
		? `${word.substr(0, 5)}.....${word.substr(word.length - 5)}`
		: word;

export const getPrecision = (precision: any) =>
	Number.isNaN(+precision) ? MAX_PRICE_PRECISION : Math.min(+precision, MAX_PRICE_PRECISION);

export const getRoundedNumber = (value, precision = MAX_PRICE_PRECISION) => {
	const roundTo = 10 ** precision;
	return Math.floor(value * roundTo) / roundTo;
};

export const limitDecimals = (value: string, precision: number = MAX_PRICE_PRECISION): string => {
	const decimals = value.split(",")[1] || value.split(".")[1];

	return decimals && decimals.length >= precision
		? value.slice(0, value.toString().length - (decimals.length - precision))
		: value;
};
