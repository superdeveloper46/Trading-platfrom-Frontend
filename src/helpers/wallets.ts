import useMarginLevel from "hooks/useMarginLevel";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import { IBalance } from "models/Account";
import { IMarginOption, IWalletsFilter } from "models/Finance";
import { AccountTypeEnum } from "types/account";
import { FAVORITE_WALLETS_CACHE_KEY } from "utils/cacheKeys";
import { queryVars } from "constants/query";
import cache from "./cache";

const TO_LOCAL_COMPARE = ["code", "name", "pair"];
const TO_NUM_COMPARE = ["balance", "reserve", "debt"];

export const formatWallets = (
	balances: IBalance[],
	filter: IWalletsFilter,
	marginOption: IMarginOption | null,
	balancesCross: IBalance[],
	balancesIsolated: IBalance[],
): IBalance[] => {
	const nextBalances = [...balances];
	const equityCurrency = marginOption?.equity_currency;

	const [sortName, sortValue] = filter.sort.split(".");

	if (TO_LOCAL_COMPARE.includes(sortName)) {
		nextBalances.sort((b1: IBalance & Record<string, any>, b2: IBalance & Record<string, any>) =>
			sortValue === queryVars.asc
				? b1[sortName].localeCompare(b2[sortName])
				: b2[sortName].localeCompare(b1[sortName]),
		);
	} else if (sortName === "approx-btc") {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1ApproxBTC = (b1.valuation?.BTC ?? 0) * +b1.balance;
			const b2ApproxBTC = (b2.valuation?.BTC ?? 0) * +b2.balance;
			return sortValue === queryVars.asc ? b1ApproxBTC - b2ApproxBTC : b2ApproxBTC - b1ApproxBTC;
		});
	} else if (sortName === "approx-btcd") {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1ApproxBTCd = (b1.valuation?.BTCD ?? 0) * +b1.balance;
			const b2ApproxBTCd = (b2.valuation?.BTCD ?? 0) * +b2.balance;
			return sortValue === queryVars.asc
				? b1ApproxBTCd - b2ApproxBTCd
				: b2ApproxBTCd - b1ApproxBTCd;
		});
	} else if (sortName === "available") {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1Available = +b1.balance - +b1.reserve;
			const b2Available = +b2.balance - +b2.reserve;
			return sortValue === queryVars.asc
				? +b1Available - +b2Available
				: +b2Available - +b1Available;
		});
	} else if (sortName === "position") {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1Position = +b1.balance - b1.debt;
			const b2Position = +b2.balance - b2.debt;
			return sortValue === queryVars.asc ? +b1Position - +b2Position : +b2Position - +b1Position;
		});
	} else if (sortName === "position-equity") {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1Position = +b1.balance - b1.debt;
			const b2Position = +b2.balance - b2.debt;
			const b1PositionValuated =
				b1Position * (equityCurrency?.code ? b1.valuation?.[equityCurrency.code] ?? 0 : 0);
			const b2PositionValuated =
				b2Position * (equityCurrency?.code ? b2.valuation?.[equityCurrency.code] ?? 0 : 0);

			return sortValue === queryVars.asc
				? +b1PositionValuated - +b2PositionValuated
				: +b2PositionValuated - +b1PositionValuated;
		});
	} else if (sortName === "liquidation-price" && filter.isMargin && marginOption) {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1Quote = b1.paired_balance?.is_quoted ? b1.paired_balance : b1;
			const b2Quote = b2.paired_balance?.is_quoted ? b2.paired_balance : b2;

			const { liquidationPrice: b1LiquidationPrice } = useMarginLiquidationPrice(
				marginOption,
				filter.accountType as Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>,
				b1,
				(filter.isMarginCross ? null : b1Quote) as IBalance,
				balancesCross,
				balancesIsolated,
			);

			const { liquidationPrice: b2LiquidationPrice } = useMarginLiquidationPrice(
				marginOption,
				filter.accountType as Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>,
				b2,
				(filter.isMarginCross ? null : b2Quote) as IBalance,
				balancesCross,
				balancesIsolated,
			);

			return sortValue === queryVars.asc
				? +b1LiquidationPrice - +b2LiquidationPrice
				: +b2LiquidationPrice - +b1LiquidationPrice;
		});
	} else if (sortName === "margin-level" && filter.isMarginIsolated) {
		nextBalances.sort((b1: IBalance, b2: IBalance) => {
			const b1MarginLevel = b1.pair
				? useMarginLevel(
						equityCurrency?.code ?? "",
						balancesCross,
						balancesIsolated,
						AccountTypeEnum.ISOLATED,
						b1.pair.replace("/", "_"),
				  ).marginLevel
				: 999;

			const b2MarginLevel = b2.pair
				? useMarginLevel(
						equityCurrency?.code ?? "",
						balancesCross,
						balancesIsolated,
						AccountTypeEnum.ISOLATED,
						b2.pair.replace("/", "_"),
				  ).marginLevel
				: 999;

			return sortValue === queryVars.asc
				? +b1MarginLevel - +b2MarginLevel
				: +b2MarginLevel - +b1MarginLevel;
		});
	} else if (TO_NUM_COMPARE.includes(sortName)) {
		nextBalances.sort((b1: IBalance & Record<string, any>, b2: IBalance & Record<string, any>) =>
			sortValue === queryVars.asc ? +b1[sortName] - +b2[sortName] : +b2[sortName] - +b1[sortName],
		);
	}

	return nextBalances.filter(
		(b: IBalance) =>
			(filter.search
				? b.code.match(filter.search.toUpperCase()) ||
				  b.name.toUpperCase().match(filter.search.toUpperCase())
				: true) &&
			(filter.notEmpty
				? Object.keys(b.paired_balance).length > 0
					? +b.paired_balance.balance !== 0 || +b.balance !== 0
					: +b.balance !== 0
				: !filter.notEmpty) &&
			(filter.favorites ? getFavoriteWallets().includes(b.code) : true),
	);
};

export const generateCharArray = (charA: string, charZ: string) => {
	const a = [];
	let i = charA.charCodeAt(0);
	const j = charZ.charCodeAt(0);
	for (; i <= j; ++i) {
		a.push(String.fromCharCode(i));
	}
	return a;
};

export const generateNumArray = () => {
	const a = [];
	for (let i = 1; i < 10; i++) {
		a.push(i);
	}
	return a;
};

export const getFavoriteWallets = (): string[] =>
	Array.from(new Set(cache.getItem(FAVORITE_WALLETS_CACHE_KEY, "[]")));

export const moveValuableToTop = (balances: IBalance[]) => {
	const nonEmptyBalances = balances.filter((b: IBalance) => +b.balance > 0);
	const emptyBalances = balances.filter((b: IBalance) => +b.balance === 0);
	return [...nonEmptyBalances, ...emptyBalances];
};
