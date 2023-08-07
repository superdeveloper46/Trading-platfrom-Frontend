import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ORDER_SIDE, ORDER_TYPE } from "constants/orders";
import { onSubmitValidate, formatErrorFromServer } from "helpers/exchange";
import { IPair } from "models/Terminal";
import ExchangeService from "services/ExchangeService";
import { AccountTypeEnum } from "types/account";
import { ICreateOrderBody, OrderMarginActionEnum } from "types/exchange";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { formatField, formatNumberNoRounding } from "utils/format";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import { ACCOUNT_TYPE } from "constants/exchange";
import {
	ITradeFormBody,
	ISpotData,
	ITradeFormRealBody,
	IMarginData,
	InputNameEnum,
} from "types/terminal";
import useAccountType from "./useAccountType";
import useTimeout from "./useTimeout";

const formatStringToNumber = (str: string): number => +str.replace(/ /g, "").replace(/,/g, ".");
const formatFillPercentage = (value: number) => +formatNumberNoRounding(Math.min(value, 100), 0);

interface ITradeForm {
	body: ITradeFormBody;
	onUpdateFormBody: (b: ITradeFormBody) => void;
	onUpdateFormErrors: (e: Record<string, unknown>) => void;
	onSetFillPercentage: (v: number) => void;
	formErrors: Record<string, any>;
	realBody: ITradeFormRealBody;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAutoFill: (e?: number) => void;
	onAutoFillMarginDebt: () => void;
	fillPercentage: number;
	onSubmit: () => Promise<void>;
	isOnSubmitLoading: boolean;
}

const useTradeForm = (
	pair: IPair | Record<string, any> = {},
	side: OrderSideEnum,
	type: OrderTypeEnum,
	marketInputGroup: string,
	marginData: IMarginData | null = null,
	spotData: ISpotData | null = null,
	isAuthenticated: boolean,
	loadMarginCurrency?: (
		accountType: number,
		baseCurrencyCode: string,
		quoteCurrencyCode: string,
		pair?: string,
	) => Promise<void>,
	onOpenStopLimitModal?: (order: ICreateOrderBody) => void,
): ITradeForm => {
	const {
		history: { loadPositions },
	} = useMst();
	const [body, setBody] = useState<ITradeFormBody>({
		price: "",
		amount: "",
		total: "",
		stop_price: "",
	});
	const { formatNumber } = useIntl();
	const [fillPercentage, setFillPercentage] = useState<number>(0);
	const [errors, setErrors] = useState<Record<string, unknown>>({});
	const [isOnSubmitLoading, setIsOnSubmitLoading] = useState<boolean>(false);
	const accountType = useAccountType();
	const { formatMessage } = useIntl();
	const timeout = useTimeout();

	const amountPrecision = pair.amount_precision ?? 6;
	const pricePrecision = pair.price_precision ?? 6;
	const baseCurrencyCode = pair.base_currency_code || "";
	const quoteCurrencyCode = pair.quote_currency_code || "";

	const isMargin =
		marginData &&
		(accountType === AccountTypeEnum.ISOLATED || accountType === AccountTypeEnum.CROSS);
	const isMarket = type === OrderTypeEnum.MARKET;

	const realBody = {
		price: body.price ? formatStringToNumber(body.price) : 0,
		amount: body.amount ? formatStringToNumber(body.amount) : 0,
		total: body.total ? formatStringToNumber(body.total) : 0,
		stop_price: body.stop_price ? formatStringToNumber(body.stop_price) : 0,
	};

	useEffect(() => {
		setFillPercentage(0);
	}, [pair?.symbol]);

	useEffect(() => {
		if (pair.id && pricePrecision) {
			const price = pair.close ? formatNumberNoRounding(pair.close, pricePrecision) : "0";
			setBody({
				price,
				amount: "",
				total: "",
				stop_price: "",
				quote_amount: "",
			});
			setErrors({});
		}
	}, [pricePrecision, pair.id]);

	useEffect(() => {
		if (marketInputGroup) {
			setBody((prevState) => ({
				...prevState,
				quote_amount: marketInputGroup === "quote_amount" ? prevState.total : "",
			}));
		}
	}, [marketInputGroup]);

	const onUpdateFormBody = (nextFormBody: ITradeFormBody) => {
		setBody(nextFormBody);
	};

	const onSetFillPercentage = (nextFillPercentage: number) => {
		setFillPercentage(formatFillPercentage(nextFillPercentage));
	};

	const onUpdateFormErrors = (nextFormErrors: Record<string, unknown>) => {
		setErrors(nextFormErrors);
	};

	const processFillAmount = (value: number, available: number, formPrice: number) => {
		if (isAuthenticated && available > 0) {
			const currPrice = type === OrderTypeEnum.MARKET ? pair.close : formPrice;
			const totalInQuote = value * currPrice;

			switch (side) {
				case OrderSideEnum.SELL: {
					setFillPercentage(formatFillPercentage((value / available) * 100));
					break;
				}
				case OrderSideEnum.BUY: {
					setFillPercentage(formatFillPercentage((totalInQuote / available) * 100));
					break;
				}
				default:
					break;
			}
		}
	};

	const processFillQuoteAmount = (value: number, available: number) => {
		if (isAuthenticated && available > 0) {
			switch (side) {
				case OrderSideEnum.SELL: {
					const maxTotal = available * pair.close;
					setFillPercentage(formatFillPercentage((value / maxTotal) * 100));
					break;
				}
				case OrderSideEnum.BUY: {
					setFillPercentage(formatFillPercentage((value / available) * 100));
					break;
				}
				default:
					break;
			}
		}
	};

	const processFillTotal = (value: number, available: number, formPrice: number) => {
		if (isAuthenticated && available > 0) {
			switch (side) {
				case OrderSideEnum.SELL: {
					const maxTotal = available * formPrice;
					setFillPercentage(formatFillPercentage((value / maxTotal) * 100));
					break;
				}
				case OrderSideEnum.BUY: {
					setFillPercentage(formatFillPercentage((value / available) * 100));
					break;
				}
				default:
					break;
			}
		}
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextBody = { ...body };
		const { value } = e.target;
		const name = e.target.name.replace(`${side}-`, "");
		let nValue = formatStringToNumber(value);

		if (!Number.isNaN(nValue)) {
			nextBody[name] = value;
			const available =
				(isMargin
					? marginData.actionType === OrderMarginActionEnum.BORROW
						? marginData.availablePlusBorrowable
						: marginData.available
					: spotData?.currentBalance?.available ?? 0) ?? 0;

			switch (name) {
				case InputNameEnum.AMOUNT: {
					nValue = formatStringToNumber(nextBody.amount);
					const nPrice = formatStringToNumber(nextBody.price);
					nextBody.total = formatNumberNoRounding(nPrice * nValue, amountPrecision);
					processFillAmount(nValue, available, formatStringToNumber(nextBody.price));
					break;
				}
				case InputNameEnum.PRICE: {
					const nAmount = formatStringToNumber(nextBody.amount);
					nextBody.total = formatNumberNoRounding(nAmount * nValue || 0, pricePrecision);
					break;
				}
				case InputNameEnum.TOTAL: {
					if (type !== OrderTypeEnum.MARKET) {
						const nPrice = formatStringToNumber(nextBody.price);
						processFillTotal(nValue, available, nPrice);
						nextBody.amount =
							nValue !== 0 && nPrice > 0
								? formatNumberNoRounding(nValue / nPrice, amountPrecision)
								: "0";
					}
					break;
				}
				case InputNameEnum.QUOTE_AMOUNT: {
					processFillQuoteAmount(nValue, available);
					break;
				}
				default:
					break;
			}
			setBody(nextBody);
			setErrors({});
		}
	};

	const onAutoFill = (part = 1) => {
		if (isAuthenticated) {
			setFillPercentage(+formatNumberNoRounding(part * 100, 0));
			const precisionE = 10 ** amountPrecision;
			const availableBalance =
				spotData && spotData.currentBalance
					? +spotData.currentBalance.balance - +spotData.currentBalance.reserve
					: 0;
			const balance = isMargin
				? Math.trunc(
						(marginData.actionType === OrderMarginActionEnum.BORROW
							? marginData.availablePlusBorrowable
							: marginData.available) * precisionE,
				  ) / precisionE
				: Math.trunc(availableBalance * precisionE) / precisionE;
			const price = formatNumberNoRounding(realBody.price || 0, pricePrecision);
			const total = part
				? side === OrderSideEnum.BUY
					? formatField(balance * part, pricePrecision, formatNumber)
					: isMarket
					? formatField(balance * (pair.close ?? 0) * part, pricePrecision, formatNumber)
					: formatField(balance * realBody.price * part, pricePrecision, formatNumber)
				: "0";
			const amount = part
				? formatNumberNoRounding(
						side === OrderSideEnum.BUY
							? isMarket
								? (balance / (pair.close ?? 0)) * part
								: (Math.trunc((+price !== 0 ? balance / +price : 0) * precisionE) / precisionE) *
								  part
							: balance * part,
						amountPrecision,
				  )
				: "0";
			setBody({
				price: isMarket ? "" : price,
				total: total,
				quote_amount: isMarket ? total : "",
				amount: amount,
				stop_price: body.stop_price,
			});
			setErrors({});
		}
	};

	const onAutoFillMarginDebt = () => {
		if (marginData) {
			const precisionE = 10 ** amountPrecision;

			const balance =
				Math.trunc(
					(marginData.actionType === OrderMarginActionEnum.BORROW
						? marginData.availablePlusBorrowable
						: marginData.available) * precisionE,
				) / precisionE;

			const price = formatNumberNoRounding(realBody.price || 0, pricePrecision);
			const total = formatNumberNoRounding(
				Math.min(
					balance,
					side === OrderSideEnum.BUY ? marginData.debt * pair.close : marginData.debt,
				),
				pricePrecision,
			);
			const amount = formatNumberNoRounding(
				Math.min(
					balance,
					side === OrderSideEnum.BUY ? marginData.debt : marginData.debt / pair.close,
				),
				amountPrecision,
			);

			setBody({
				price: isMarket ? "" : price,
				total: total,
				amount: amount,
				stop_price: body.stop_price,
			});
			setErrors({});
		}
	};

	const onSubmit = async () => {
		if (!isOnSubmitLoading) {
			const order: ICreateOrderBody = {
				type: ORDER_TYPE[type].toString(),
				side: ORDER_SIDE[side].toString(),
				symbol: pair.symbol,
				amount: realBody.amount.toString(),
				price: realBody.price.toString(),
				pair: pair.symbol,
			};

			if (type === OrderTypeEnum.STOP_LIMIT) {
				order.stop_operator = pair.close > realBody.stop_price ? "2" : "1";
				order.stop_price = realBody.stop_price.toString();
			}

			if (isMargin && marginData.actionType) {
				if (marginData.actionType === OrderMarginActionEnum.BORROW) {
					order.side_effect = "1";
				} else if (marginData.actionType === OrderMarginActionEnum.REPAY) {
					order.side_effect = "2";
				}
			}

			order.wallet_type = ACCOUNT_TYPE[accountType].toString();

			if (isMarket) {
				delete order.price;
				if (marketInputGroup === "quote_amount") {
					delete order.amount;
					order.quote_amount = body.quote_amount ?? "0";
				}
			}

			const { isValid, errors: nextErrors } = onSubmitValidate(
				order,
				pair.minimum_order_size,
				pair.maximum_order_size,
				formatMessage,
				amountPrecision,
				pricePrecision,
			);

			// TODO REFACTOR
			if (isValid) {
				if (type === OrderTypeEnum.STOP_LIMIT) {
					if (onOpenStopLimitModal) {
						onOpenStopLimitModal(order);
					}
				} else {
					setIsOnSubmitLoading(true);
					onUpdateFormErrors({});
					try {
						await ExchangeService.createOrder(order);
						if (isMargin) {
							if (
								[OrderMarginActionEnum.BORROW, OrderMarginActionEnum.REPAY].includes(
									marginData.actionType as OrderMarginActionEnum,
								)
							) {
								loadPositions({
									[queryVars.pair]: accountType === AccountTypeEnum.CROSS ? undefined : pair.symbol,
									[queryVars.wallet_type]: ACCOUNT_TYPE[accountType],
								});
							}
							timeout(() => {
								if (loadMarginCurrency) {
									loadMarginCurrency(
										ACCOUNT_TYPE[accountType],
										baseCurrencyCode,
										quoteCurrencyCode,
										accountType === AccountTypeEnum.ISOLATED ? pair.symbol : undefined,
									);
								}
							}, 4000);
						}
					} catch (err: any) {
						const catchErrors = formatErrorFromServer(err.data);
						onUpdateFormErrors(catchErrors.serverErrors);
					} finally {
						setIsOnSubmitLoading(false);
					}
				}
			} else {
				onUpdateFormErrors(nextErrors);
			}
		}
	};

	return {
		body,
		formErrors: errors,
		realBody,
		onInputChange,
		onSetFillPercentage,
		onUpdateFormBody,
		onUpdateFormErrors,
		onAutoFill,
		onAutoFillMarginDebt,
		onSubmit,
		isOnSubmitLoading,
		fillPercentage,
	};
};

export default useTradeForm;
