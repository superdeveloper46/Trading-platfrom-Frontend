import { ACCOUNT_TYPE } from "constants/exchange";
import cache from "helpers/cache";
import { Instance, flow, types as t, cast } from "mobx-state-tree";
import FinanceService from "services/FinanceService";
import { AccountTypeEnum } from "types/account";
import { FAVORITE_WALLETS_CACHE_KEY, WALLET_BALANCE_VISIBILITY_CACHE_KEY } from "utils/cacheKeys";
import errorHandler from "utils/errorHandler";

export interface IMarginOptionEquityCurrency {
	code: string;
	name: string;
	brand_color: string;
	image_svg: null | string;
	image_png: null | string;
	is_fiat: boolean;
	precision: number;
}

const MarginOptionEquityCurrency = t.model({
	code: t.string,
	name: t.string,
	brand_color: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
	is_fiat: t.boolean,
	precision: t.number,
});

const MarginOptionPair = t.model({
	symbol: t.string,
	base_currency_code: t.string,
	quote_currency_code: t.string,
	price_precision: t.number,
	amount_precision: t.number,
});
export type IMarginOptionPair = Instance<typeof MarginOptionPair>;

const MarginOption = t.model({
	wallet_type: t.number,
	pair: t.maybeNull(MarginOptionPair),
	equity_currency: t.maybeNull(MarginOptionEquityCurrency),
	leverage: t.number,
	transfer_level: t.number,
	borrow_level: t.number,
	call_level: t.number,
	liquidation_level: t.number,
	is_borrow_enabled: t.boolean,
	is_interest_enabled: t.boolean,
	is_repay_enabled: t.boolean,
});
export type IMarginOption = Instance<typeof MarginOption>;

const WalletsFilter = t
	.model({
		sort: t.optional(t.string, ""),
		search: t.optional(t.string, ""),
		notEmpty: t.optional(t.boolean, false),
		accountType: t.optional(t.string, AccountTypeEnum.SPOT),
		favorites: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		setSort(nextSort: string) {
			self.sort = nextSort;
		},
		setAccountType(nextAccountType: AccountTypeEnum) {
			self.accountType = nextAccountType;
		},
		setSearch(nextSearch: string) {
			self.search = nextSearch;
		},
		setNotEmpty(nextNotEmpty: boolean) {
			self.notEmpty = nextNotEmpty;
		},
		setFavorites(nextFavorites: boolean) {
			self.favorites = nextFavorites;
		},
	}))
	.views((self) => ({
		get showFiltered() {
			return (
				!!self.favorites ||
				!!self.sort ||
				!!self.notEmpty ||
				!!self.search ||
				[AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(
					self.accountType as AccountTypeEnum,
				)
			);
		},
		get isMarginCross() {
			return self.accountType === AccountTypeEnum.CROSS;
		},
		get isMarginIsolated() {
			return self.accountType === AccountTypeEnum.ISOLATED;
		},
	}))
	.views((self) => ({
		get isMargin() {
			return self.isMarginCross || self.isMarginIsolated;
		},
	}));
export type IWalletsFilter = Instance<typeof WalletsFilter>;

const initialBalanceVisibility = cache.getItem(WALLET_BALANCE_VISIBILITY_CACHE_KEY, "true");

export const Finance = t
	.model({
		marginOptions: t.optional(t.array(MarginOption), []),
		isBalancesVisible: t.optional(
			t.boolean,
			typeof initialBalanceVisibility === "boolean" ? initialBalanceVisibility : true,
		),
		walletsFilter: t.optional(WalletsFilter, {}),
		marginRequiredVerificationLevel: t.optional(t.number, 0),
	})
	.views((self) => ({
		get crossMarginOption() {
			return self.marginOptions.find((o) => o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.CROSS]);
		},
		get favoriteWallets() {
			return Array.from(new Set(cache.getItem(FAVORITE_WALLETS_CACHE_KEY, "[]")));
		},
	}))
	.actions((self) => ({
		setIsBalancesVisible(nextIsBalancesVisible: boolean) {
			self.isBalancesVisible = nextIsBalancesVisible;
			cache.setItem(WALLET_BALANCE_VISIBILITY_CACHE_KEY, nextIsBalancesVisible.toString());
		},
		setWalletsFilter(nextWalletsFilter: IWalletsFilter) {
			self.walletsFilter = cast(nextWalletsFilter);
		},
		setMarginRequiredVerificationLevel(nextLevel: number) {
			self.marginRequiredVerificationLevel = nextLevel;
		},
	}))
	.actions((self) => ({
		loadMarginOptions: flow(function* () {
			try {
				const data = yield FinanceService.getMarginOptions();
				self.marginOptions = cast(data);
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export type IHistory = Instance<typeof History>;
