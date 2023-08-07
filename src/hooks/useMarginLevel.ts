import { IBalance } from "models/Account";
import { AccountTypeEnum } from "types/account";

export const calcBalance = (b: IBalance | undefined, currency: string): number =>
	b && currency ? (b.valuation?.[currency] ?? 0) * +b.balance : 0;

export const calcDebt = (b: IBalance | undefined, currency: string): number =>
	b && currency ? (b.valuation?.[currency] ?? 0) * b.debt : 0;

export const reduceBalance = (balances: IBalance[], currency: string): number =>
	currency
		? balances.reduce((total: number, b: IBalance): number => total + calcBalance(b, currency), 0)
		: 0;

export const reduceDebt = (balances: IBalance[], currency: string): number =>
	currency
		? balances.reduce((total: number, b: IBalance): number => total + calcDebt(b, currency), 0)
		: 0;

interface IMarginLevelRes {
	marginLevel: number;
	totalBTC: number;
	totalUSDT: number;
	totalDebtBTC: number;
	totalDebtUSDT: number;
}

const useMarginLevel = (
	equityCurrency: string,
	balancesCross: IBalance[],
	balancesIsolated: IBalance[],
	type: AccountTypeEnum,
	symbol = "",
): IMarginLevelRes => {
	const [baseCurrency, quoteCurrency] = symbol.split("_");

	let totalIsolatedBalanceBTC = reduceBalance(balancesIsolated, "BTC");
	let totalIsolatedBalanceUSDT = reduceBalance(balancesIsolated, "USDT");

	let totalIsolatedDebtBTC = reduceDebt(balancesIsolated, "BTC");
	let totalIsolatedDebtUSDT = reduceDebt(balancesIsolated, "USDT");

	const equityCurr = equityCurrency?.toUpperCase() ?? "";

	let totalIsolatedBalanceEquityCurrency = reduceBalance(balancesIsolated, equityCurr);
	let totalIsolatedDebtEquityCurrency = reduceDebt(balancesIsolated, equityCurr);

	if (symbol) {
		const isolatedQuote = balancesIsolated.find(
			(b) => b.pair?.replace("/", "_") === symbol && b.code === quoteCurrency,
		);
		const isolatedBase = balancesIsolated.find(
			(b) => b.pair?.replace("/", "_") === symbol && b.code === baseCurrency,
		);

		totalIsolatedBalanceBTC = calcBalance(isolatedQuote, "BTC") + calcBalance(isolatedBase, "BTC");

		totalIsolatedBalanceUSDT =
			calcBalance(isolatedQuote, "USDT") + calcBalance(isolatedBase, "USDT");
		totalIsolatedDebtBTC = calcDebt(isolatedQuote, "BTC") + calcDebt(isolatedBase, "BTC");
		totalIsolatedDebtUSDT = calcDebt(isolatedQuote, "USDT") + calcDebt(isolatedBase, "USDT");

		totalIsolatedBalanceEquityCurrency =
			calcBalance(isolatedQuote, equityCurr) + calcBalance(isolatedBase, equityCurr);
		totalIsolatedDebtEquityCurrency =
			calcDebt(isolatedQuote, equityCurr) + calcDebt(isolatedBase, equityCurr);
	}

	let totalAccountBalanceBTC = 0;
	let totalAccountBalanceUSDT = 0;
	let totalAccountDebtBTC = 0;
	let totalAccountDebtUSDT = 0;

	switch (type) {
		case AccountTypeEnum.CROSS:
			totalAccountBalanceBTC = reduceBalance(balancesCross, "BTC");
			totalAccountBalanceUSDT = reduceBalance(balancesCross, "USDT");
			totalAccountDebtBTC = reduceDebt(balancesCross, "BTC");
			totalAccountDebtUSDT = reduceDebt(balancesCross, "USDT");
			break;
		case AccountTypeEnum.ISOLATED:
			totalAccountBalanceBTC = totalIsolatedBalanceBTC;
			totalAccountBalanceUSDT = totalIsolatedBalanceUSDT;
			totalAccountDebtBTC = totalIsolatedDebtBTC;
			totalAccountDebtUSDT = totalIsolatedDebtUSDT;
			break;
		default:
			break;
	}

	const totalAccountBalanceEquityCurrency =
		type === AccountTypeEnum.CROSS
			? reduceBalance(balancesCross, equityCurr)
			: totalIsolatedBalanceEquityCurrency;

	const totalAccountDebtEquityCurrency =
		type === AccountTypeEnum.CROSS
			? reduceDebt(balancesCross, equityCurr)
			: totalIsolatedDebtEquityCurrency;

	const nextMarginLevel = Math.min(
		totalAccountDebtEquityCurrency > 0
			? +Math.max(0, totalAccountBalanceEquityCurrency / totalAccountDebtEquityCurrency).toFixed(2)
			: 999,
		999,
	);

	return {
		marginLevel: nextMarginLevel,
		totalBTC: totalAccountBalanceBTC,
		totalUSDT: totalAccountBalanceUSDT,
		totalDebtBTC: totalAccountDebtBTC,
		totalDebtUSDT: totalAccountDebtUSDT,
	};
};

export default useMarginLevel;
