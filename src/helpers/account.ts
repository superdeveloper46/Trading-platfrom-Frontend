import { IBalance, IRateAlgo } from "models/Account";
import { ITicker } from "models/Ticker";
import { AccountTypeEnum, RateAlgoPlanEnum } from "types/account";

export const formatBalance = (balance: IBalance): IBalance => {
	const b = { ...balance };

	b.borrowed = b.borrowed ?? "0";
	b.interest = b.interest ?? "0";
	b.balance = b.balance ?? "0";

	return b;
};

export const formatBalances = (balances: IBalance[]): IBalance[] => {
	const nextBalances: IBalance[] = [];

	balances
		.filter((b) => !b.is_demo)
		.forEach((b) => {
			nextBalances.push(formatBalance(b));
		});

	return [...nextBalances];
};

export const getBalance = (
	code: string,
	pair: string,
	type: AccountTypeEnum = AccountTypeEnum.SPOT,
	balances: IBalance[],
	balancesCross: IBalance[],
	balancesIsolated: IBalance[],
) => {
	switch (type) {
		case AccountTypeEnum.CROSS:
			return balancesCross.find((b) => b.code === code);
		case AccountTypeEnum.ISOLATED:
			return balancesIsolated.find((b) => b.code === code && b.pair?.replace("/", "_") === pair);
		default:
			return balances.find((b) => b.code === code) ?? null;
	}
};

export const getBalancesFilled = (
	type: AccountTypeEnum = AccountTypeEnum.SPOT,
	balancesFilled: IBalance[],
	balancesCrossFilled: IBalance[],
	balancesIsolatedFilled: IBalance[],
) => {
	switch (type) {
		case AccountTypeEnum.CROSS:
			return balancesCrossFilled;
		case AccountTypeEnum.ISOLATED:
			return balancesIsolatedFilled;
		default:
			return balancesFilled;
	}
};

export const convertRatePrice = (plan: IRateAlgo, tickers: ITicker[] = []): number => {
	if (!tickers?.length) {
		return 0;
	}

	const getTickerPrice = (symbol: string): number => {
		const ticker = tickers.find((t: ITicker) => t.symbol === symbol);
		return ticker?.close ?? plan.rate ?? 0;
	};

	return getPriceByRate(
		plan.type as RateAlgoPlanEnum,
		getTickerPrice(plan.params?.[0] ?? ""),
		getTickerPrice(plan.params?.[1] ?? ""),
	);
};

export const getPriceByRate = (
	planType: RateAlgoPlanEnum,
	firstPrice: number,
	secondPrice: number,
) => {
	switch (planType) {
		case RateAlgoPlanEnum.CONSTANT:
			return 1;
		case RateAlgoPlanEnum.DIRECT:
			return firstPrice;
		case RateAlgoPlanEnum.DIV: {
			const hasPrice = firstPrice !== 0 && secondPrice !== 0;

			return hasPrice ? firstPrice / secondPrice : 0;
		}
		case RateAlgoPlanEnum.MUL: {
			const hasPrice = firstPrice !== 0 && secondPrice !== 0;

			return hasPrice ? firstPrice * secondPrice : 0;
		}
		case RateAlgoPlanEnum.REVERSED: {
			return firstPrice !== 0 ? 1 / firstPrice : 0;
		}
		case RateAlgoPlanEnum.MUL_REVERSED: {
			const hasPrice = firstPrice !== 0 && secondPrice !== 0;

			return hasPrice ? 1 / (firstPrice * secondPrice) : 0;
		}
		default:
			return 0;
	}
};
