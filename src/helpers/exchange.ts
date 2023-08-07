import formMessages from "messages/form";
import { IOrder, IOrderBookOrder } from "models/Terminal";
import { MessageDescriptor } from "react-intl";
import { ICreateOrderBody } from "types/exchange";
import { MAX_ORDERBOOK_PRECISION_DIFF } from "utils/constants";
import { formatNumberNoRounding } from "utils/format";

export const onSubmitValidate = (
	order: ICreateOrderBody,
	minAmount: number,
	maxAmount: number,
	formatMessage: (descriptor: MessageDescriptor) => string,
	amountPrecision: number,
	pricePrecision: number,
): { errors: Record<string, unknown>; isValid: boolean } => {
	const errors: Record<string, unknown> = {};

	const isValid = Object.keys(order).every((key: string) => {
		if (!order[key] || +order[key] === 0) {
			errors[key] = formatMessage(formMessages.required);
			return false;
		}

		if (key === "price" || key === "stop_price") {
			const price = order[key]?.toString().split(".");

			if (price && price[1] && price[1].length > pricePrecision) {
				errors[key] = `${formatMessage(formMessages.max_digits)} ${pricePrecision}`;
				return false;
			}
		}

		const value = +(order[key] ?? "0");
		if (key === "amount") {
			if (value < minAmount) {
				errors[key] = `${formatMessage(formMessages.min_value)} ${minAmount}`;
				return false;
			}

			if (value > maxAmount) {
				errors[key] = `${formatMessage(formMessages.max_value)} ${maxAmount}`;
				return false;
			}

			const amount = (order[key] ?? 0).toString().split(".");
			if (amount[1] && amount[1].length > amountPrecision) {
				errors[key] = `${formatMessage(formMessages.max_digits)} ${amountPrecision}`;
				return false;
			}
		}

		if (key === "quote_amount") {
			if (value < minAmount) {
				errors[key] = `${formatMessage(formMessages.min_value)} ${minAmount}`;
				return false;
			}

			if (value > maxAmount) {
				errors[key] = `${formatMessage(formMessages.max_value)} ${maxAmount}`;
				return false;
			}

			const amount = value.toString().split(".");
			if (amount[1] && amount[1].length > amountPrecision) {
				errors[key] = `${formatMessage(formMessages.max_digits)} ${amountPrecision}`;
				return false;
			}
		}

		return true;
	});

	return { errors, isValid };
};

export const formatErrorFromServer = (
	err: Record<string, unknown>,
): { errors: Record<string, unknown>; serverErrors: Record<string, unknown> } => {
	const errors: Record<string, unknown> = {};
	const serverErrors: Record<string, unknown> = {};

	Object.keys(err).forEach((key) => {
		errors[key] = "invalid";
		serverErrors[key] = err[key];
	});

	return { errors, serverErrors };
};

export const formatOrders = (orders: string[][], pricePrecision: number): IOrder[] => {
	if (!Array.isArray(orders)) return [];
	let depth = 0;
	let totalDepth = 0;

	for (let i = 0; i < orders.length; i++) {
		totalDepth += +orders[i][1];
	}

	const nextOrders = orders.map((order: string[]) => {
		const price = +order[0];
		const amount = +order[1];
		depth += amount;

		return {
			key: order[0],
			price: price,
			amount: amount,
			amount2: price * amount,
			orderDepth: +depth.toFixed(8),
			progress: `${(depth / totalDepth) * 100}%`,
			last_update: Date.now(),
			unique: false,
		};
	});

	const prices = nextOrders.map((order: IOrder) =>
		formatNumberNoRounding(order.price, pricePrecision),
	);

	const pricesSliced = prices.map((price: string) => price.slice(0, -2));
	for (let i = 0; i < nextOrders.length; i++) {
		nextOrders[i].unique = false;
	}

	for (let i = 0; i < nextOrders.length; i++) {
		nextOrders[i].unique = true;
		for (let k = i; k < prices.length; k++) {
			if (pricesSliced[i] !== pricesSliced[k]) {
				i = k - 1;
				break;
			}
			i = k;
		}
	}

	return nextOrders;
};

export const placeOrderInOrderbook = (
	orders: string[][],
	newOrder: string[],
	type: "sell" | "buy",
): string[][] => {
	// order: ["price", "amount"]
	if (!Array.isArray(orders)) return [];
	if (!Array.isArray(newOrder)) return orders;

	const newState = [...orders];
	const index = newState.findIndex((item) => item[0] === newOrder[0]);
	const newOrderAmount = +newOrder[1];

	if (index !== -1) {
		const amount = +newState[index][1] + newOrderAmount;
		if (amount > 0.00000001 && amount !== 0) {
			newState[index] = [newState[index][0], `${amount}`];
		} else newState.splice(index, 1);
	} else {
		if (newOrderAmount < 0.00000001) return newState;
		// eslint-disable-next-line no-unused-expressions
		type === "sell" ? binarySellInsert(newOrder, newState) : binaryBuyInsert(newOrder, newState);
	}

	return newState;
};

const binarySellInsert = (
	value: string[],
	array: string[][],
	startVal = 0,
	endVal: number | null = null,
) => {
	const { length } = array;
	const start = startVal;
	const end = endVal ?? length - 1;
	const m = start + Math.floor((end - start) / 2);
	const price = +value[0];

	if (length === 0) {
		array.push(value);
		return;
	}

	if (price > +array[end][0]) {
		array.splice(end + 1, 0, value);
		return;
	}

	if (price < +array[start][0]) {
		array.splice(start, 0, value);
		return;
	}

	if (start >= end) {
		return;
	}

	if (price <= +array[m][0]) {
		binarySellInsert(value, array, start, m - 1);
		return;
	}

	if (price > +array[m][0]) {
		binarySellInsert(value, array, m + 1, end);
	}
};

const binaryBuyInsert = (
	value: string[],
	array: string[][],
	startVal = 0,
	endVal: number | null = null,
) => {
	const { length } = array;
	const end = startVal;
	const start = endVal ?? length - 1;
	const m = end + Math.floor((start - end) / 2);
	const price = +value[0];

	if (length === 0) {
		array.push(value);
		return;
	}

	if (price < +array[start][0]) {
		array.splice(start + 1, 0, value);
		return;
	}

	if (price > +array[end][0]) {
		array.splice(end, 0, value);
		return;
	}

	if (start <= end) {
		return;
	}

	if (price >= +array[m][0]) {
		binaryBuyInsert(value, array, end, m - 1);
		return;
	}

	if (price < +array[m][0]) {
		binaryBuyInsert(value, array, m + 1, start);
	}
};

export const formatOrdersToPrecision = (
	orders: IOrderBookOrder[],
	precision: number,
	initialPrecision: number,
): IOrderBookOrder[] => {
	const precisionOrders = new Map<string, IOrderBookOrder>();

	orders.forEach((o) => {
		const nextOrder = { ...o };
		const multiplier = 10 ** Math.abs(precision);
		const price =
			precision >= 0
				? formatNumberNoRounding(o.price, precision)
				: (Math.trunc(Math.trunc(o.price) / multiplier) * multiplier).toString();
		const prevOrder = precisionOrders.get(price);
		nextOrder.price = +price;

		if (precision !== initialPrecision) {
			nextOrder.unique = true;
		}

		if (prevOrder) {
			nextOrder.key = prevOrder.key;
			nextOrder.price = prevOrder.price;
			nextOrder.amount += prevOrder.amount;
			nextOrder.amount2 += prevOrder.amount2;
			nextOrder.orderDepth += prevOrder.last_update;
			nextOrder.progress += prevOrder.progress;
		}

		precisionOrders.set(price, nextOrder);
	});

	return Array.from(precisionOrders.values());
};

export const toPrecisionSymbol = (precision: number): string =>
	precision > 0
		? (10 ** -precision).toFixed(precision).toString() // toFixed for (.0099...)
		: (10 ** Math.abs(precision)).toString();

export const getPrecisionMap = (pairPrecision: number, pairPrice: number): Map<number, string> => {
	const list: Map<number, string> = new Map();
	const priceIntMultiplier = Math.trunc(pairPrice).toString().length;
	const diff = pairPrecision - MAX_ORDERBOOK_PRECISION_DIFF;
	const left =
		diff < 0
			? Math.max(diff, -priceIntMultiplier + 1)
			: pairPrecision - MAX_ORDERBOOK_PRECISION_DIFF;

	for (let i = pairPrecision; i > left; i--) {
		list.set(i, i > 0 ? (10 ** -i).toFixed(i).toString() : (10 ** Math.abs(i)).toString());
	}

	return list;
};
