import { IBalance } from "models/Account";
import { IMarginOption } from "models/Finance";
import { AccountTypeEnum } from "types/account";
import { calcDebt, reduceBalance, reduceDebt } from "./useMarginLevel";

interface IUseMarginLiqPriceRes {
	liquidationPrice: number;
	hasLiquidationPrice: boolean;
}

const emptyState = {
	liquidationPrice: 0,
	hasLiquidationPrice: false,
};

const ACCOUNT_TYPES_MARGIN = [AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED];

const useMarginLiquidationPrice = (
	marginOption: IMarginOption,
	variant: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>,
	balanceBase: IBalance | null | undefined,
	balanceQuote: IBalance | null | undefined,
	balancesCross: IBalance[],
	balancesIsolated: IBalance[],
): IUseMarginLiqPriceRes => {
	if (
		!ACCOUNT_TYPES_MARGIN.includes(variant) ||
		!marginOption?.equity_currency?.code ||
		!balanceBase
	) {
		return emptyState;
	}

	const marginBalances = variant === AccountTypeEnum.CROSS ? balancesCross : balancesIsolated;
	const equityCurrencyCode = marginOption.equity_currency.code.toUpperCase();
	const liquidationLevel = marginOption.liquidation_level;

	const debtTotalEquity = reduceDebt(marginBalances, equityCurrencyCode);
	const balanceTotalEquity = reduceBalance(marginBalances, equityCurrencyCode);
	const debtEquity = calcDebt(balanceBase, equityCurrencyCode);

	const balancePriceEquity = balanceBase?.valuation?.[equityCurrencyCode] ?? 0;
	const balanceEquity = balanceBase ? balancePriceEquity * +balanceBase.balance : 0;

	// ISOLATED
	const debtBase = +(balanceBase?.borrowed ?? 0) + +(balanceBase?.interest ?? 0);
	const equityBase = +balanceBase.balance - debtBase;

	const debtQuote = balanceQuote
		? +(balanceQuote.borrowed ?? 0) + +(balanceQuote.interest ?? 0)
		: 0;
	const equityQuote = balanceQuote ? +balanceQuote.balance - debtQuote : 0;
	// ISOLATED

	let liquidationPrice = 0;

	switch (variant) {
		case AccountTypeEnum.CROSS: {
			if (balanceEquity - liquidationLevel * debtEquity === 0) {
				return emptyState;
			}
			liquidationPrice = debtTotalEquity
				? (balancePriceEquity *
						(liquidationLevel * (debtTotalEquity - debtEquity) -
							(balanceTotalEquity - balanceEquity))) /
				  (balanceEquity - liquidationLevel * debtEquity)
				: 0;
			break;
		}
		case AccountTypeEnum.ISOLATED: {
			if ((equityQuote > 0 && equityBase > 0) || (equityQuote < 0 && equityBase < 0)) {
				return emptyState;
			}

			if (equityBase < 0 && equityQuote > 0) {
				liquidationPrice = equityQuote / -equityBase / liquidationLevel;
			} else if (equityQuote < 0 && equityBase > 0) {
				liquidationPrice = (-equityQuote / equityBase) * liquidationLevel;
			}
			break;
		}
		default:
			break;
	}

	if (liquidationPrice <= 0) {
		return emptyState;
	}

	return {
		liquidationPrice,
		hasLiquidationPrice: true,
	};
};

export default useMarginLiquidationPrice;
