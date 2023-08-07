import { convertRatePrice, formatBalances } from "helpers/account";
import config from "helpers/config";
import { cast, flow, getParent, Instance, types as t } from "mobx-state-tree";
import AccountService from "services/AccountService";
import { AccountTypeEnum, IBalanceWS, IGetMarginStatusParams, WalletTypeEnum } from "types/account";
import { AccountModelNamesEnum } from "types/models";
import { RenderModuleEnum } from "types/render";
import errorHandler from "utils/errorHandler";
import { getAvatarColor } from "utils/user";
import { IRootStore } from "./Root";

const RATES_QUOTED_CURRENCIES = config.ratesQuotedCurrencies.split(",");

const RateAlgo = t.model(AccountModelNamesEnum.RATE_ALGO, {
	type: t.string,
	currency: t.string,
	rate: t.number,
	params: t.optional(t.maybeNull(t.array(t.string)), null),
});
export interface IRateAlgo extends Instance<typeof RateAlgo> {}

const Rate = t.model(AccountModelNamesEnum.RATE, {
	currency: t.string,
	rates: t.optional(t.array(RateAlgo), []),
});
export interface IRate extends Instance<typeof Rate> {}

export const Balance = t
	.model(AccountModelNamesEnum.BALANCE, {
		balance: t.string,
		code: t.string,
		image_png: t.maybeNull(t.string),
		image_svg: t.maybeNull(t.string),
		is_defi: t.boolean,
		is_enabled: t.boolean,
		is_fiat: t.boolean,
		is_demo: t.frozen(t.boolean),
		is_deposit_enabled: t.maybeNull(t.boolean),
		is_internal_transfer_enabled: t.maybeNull(t.boolean),
		is_withdraw_enabled: t.maybeNull(t.boolean),
		is_cross_margin_available: t.maybeNull(t.boolean),
		liquidity_type: t.maybeNull(t.number),
		name: t.string,
		precision: t.maybeNull(t.number),
		reserve: t.string,

		// MARGIN
		pair: t.optional(t.maybe(t.string), ""),
		is_quoted: t.optional(t.boolean, false),
		borrowed: t.maybe(t.string),
		interest: t.maybe(t.string),
	})
	.volatile(() => ({
		valuation: {} as { [key: string]: number },
		paired_balance: {} as { [key: string]: any },
	}))
	.views((self) => ({
		get available() {
			return +(self.balance || 0) - +(self.reserve || 0);
		},
		get debt() {
			return +(self.borrowed || 0) + +(self.interest || 0);
		},
	}));
export interface IBalance extends Instance<typeof Balance> {}

const MarginStatus = t.model(AccountModelNamesEnum.MARGIN_STATUS, {
	wallet_type: t.number,
	symbol: t.maybe(t.string),
	code: t.maybe(t.string),
	leverage: t.number,
	total_balance: t.string,
	total_debt: t.string,
	loan_available: t.string,
	transfer_available: t.string,
	margin_level: t.number,
	call_level: t.number,
	liquidation_level: t.number,
	transfer_level: t.number,
	borrow_level: t.number,
});
export interface IMarginStatus extends Instance<typeof MarginStatus> {}

const ExtraLink = t.model({
	icon: t.maybeNull(t.string),
	text: t.maybeNull(t.string),
	url: t.maybeNull(t.string),
});

const ProfileStatus = t
	.model(AccountModelNamesEnum.PROFILE_STATUS, {
		address_whitelist_enabled: t.boolean,
		anti_phishing_code: t.maybeNull(t.string),
		email: t.string,
		extra_links: t.array(ExtraLink),
		is_api_enabled: t.boolean,
		is_deposit_enabled: t.boolean,
		is_withdraw_enabled: t.boolean,
		is_email_confirmed: t.boolean,
		is_login_enabled: t.boolean,
		is_margin_accepted: t.boolean,
		is_margin_enabled: t.boolean,
		is_sub_account: t.boolean,
		language: t.string,
		send_marketing_email: t.boolean,
		timezone: t.maybeNull(t.string),
		two_factor_enabled: t.boolean,
		residence_country: t.maybeNull(t.string),
		uid: t.string,
		use_ip_whitelist: t.boolean,
		username: t.maybeNull(t.string),
		verification_level: t.number,
		p2p_terms_accepted: t.boolean,
		name: t.maybeNull(t.string),
		second_name: t.maybeNull(t.string),
	})
	.views((self) => ({
		get isMarginRulesAcceptRequired() {
			return !self.is_margin_accepted || !self.is_margin_enabled;
		},
	}));
export interface IProfileStatus extends Instance<typeof ProfileStatus> {}

export const Account = t
	.model({
		profileStatus: t.optional(t.maybeNull(ProfileStatus), null),
		balances: t.optional(t.array(Balance), []),
		balancesCross: t.optional(t.array(Balance), []),
		balancesIsolated: t.optional(t.array(Balance), []),
		isBalancesLoaded: t.optional(t.boolean, false),
		isProfileStatusLoaded: t.optional(t.boolean, false),
		marginStatus: t.optional(t.maybeNull(MarginStatus), null),
		rates: t.optional(t.array(Rate), []),
	})
	.volatile(() => ({
		totalBalance: {} as { [key: string]: number },
	}))
	.views((self) => ({
		get isBalanceOperationsEnabled() {
			return (
				!self.profileStatus?.is_sub_account ||
				self.profileStatus?.is_deposit_enabled ||
				self.profileStatus?.is_withdraw_enabled
			);
		},
		get isTransferEnabled() {
			return !self.profileStatus?.is_sub_account;
		},
		get isDepositEnabled() {
			return self.profileStatus?.is_deposit_enabled;
		},
		get isWithdrawEnabled() {
			return self.profileStatus?.is_withdraw_enabled;
		},
		get isAlphaCodeEnabled() {
			return !self.profileStatus?.is_sub_account && self.profileStatus?.is_withdraw_enabled;
		},
		get avatarColor() {
			return getAvatarColor(self.profileStatus?.username || self.profileStatus?.email);
		},
		get balancesFilled() {
			return self.balances.filter((b) => b.available > 0);
		},
		get balancesCrossFilled() {
			return self.balancesCross.filter((b) => b.available > 0);
		},
		get balancesIsolatedFilled() {
			return self.balancesIsolated.filter((b) => b.available > 0);
		},
		get balancesIsolatedPaired(): IBalance[] {
			const pairedBalances: IBalance[] = [];
			const uniqueIsolatedPairs = Array.from(
				new Set(self.balancesIsolated.map((b: IBalance) => b.pair)),
			);
			uniqueIsolatedPairs.forEach((pair?: string) => {
				if (pair) {
					const nextBalancesIsolated = self.balancesIsolated.filter(
						(b: IBalance) => b.pair === pair,
					);
					if (nextBalancesIsolated.length) {
						const b = nextBalancesIsolated[0];
						const paired = nextBalancesIsolated[1];

						const [, quoteCurrencyCode] = pair.split("/");
						const isQuoted = quoteCurrencyCode === paired.code;

						pairedBalances.push({
							...b,
							available: +(b.balance || 0) - +(b.reserve || 0),
							debt: +(b.borrowed || 0) + +(b.interest || 0),
							paired_balance: {
								...paired,
								available: +(paired.balance || 0) - +(paired.reserve || 0),
								debt: +(paired.borrowed || 0) + +(paired.interest || 0),
								is_quoted: isQuoted,
							},
						});
					}
				}
			});

			return pairedBalances;
		},
	}))
	.actions((self) => ({
		getBalancesByType(type: AccountTypeEnum) {
			switch (type) {
				case AccountTypeEnum.ISOLATED:
					return self.balancesIsolated;
				case AccountTypeEnum.CROSS:
					return self.balancesCross;
				default:
					return self.balances;
			}
		},
		getWalletBalancesByType(type: AccountTypeEnum) {
			switch (type) {
				case AccountTypeEnum.ISOLATED:
					return self.balancesIsolatedPaired;
				case AccountTypeEnum.CROSS:
					return self.balancesCross;
				default:
					return self.balances;
			}
		},
		updateBalancesValuations() {
			const nextBalances: IBalance[] = [...self.balances];
			const nextBalancesCross: IBalance[] = [...self.balancesCross];
			const nextBalancesIsolated: IBalance[] = [...self.balancesIsolated];
			const tickers = getParent<IRootStore>(self).tickers.list;

			if (self.rates.length) {
				self.rates.forEach((rate: IRate) => {
					rate.rates.forEach((plan: IRateAlgo) => {
						const price = convertRatePrice(plan, tickers);

						const filteredBalances = nextBalances.filter((b: IBalance) => b.code === plan.currency);
						filteredBalances.forEach((b: IBalance) => {
							b.valuation = {
								...b.valuation,
								[rate.currency]: Number.isNaN(price) ? 0 : price,
							};
						});

						if (config.isModuleOn(RenderModuleEnum.MARGIN)) {
							const filteredBalancesCross = nextBalancesCross.filter(
								(b: IBalance) => b.code === plan.currency,
							);
							filteredBalancesCross.forEach((b: IBalance) => {
								b.valuation = {
									...b.valuation,
									[rate.currency]: Number.isNaN(price) ? 0 : price,
								};
							});

							const filteredBalancesIsolated = nextBalancesIsolated.filter(
								(b: IBalance) => b.code === plan.currency,
							);
							filteredBalancesIsolated.forEach((b: IBalance) => {
								b.valuation = {
									...b.valuation,
									[rate.currency]: Number.isNaN(price) ? 0 : price,
								};
							});
						}
					});
				});

				self.balances = cast(nextBalances);
				self.balancesCross = cast(nextBalancesCross);
				self.balancesIsolated = cast(nextBalancesIsolated);

				// Setting totalBalance
				const totalBalances = nextBalancesCross.concat(nextBalancesIsolated).concat(nextBalances);

				self.totalBalance = cast({
					USDT: calcTotalUSDT(totalBalances),
					BTC: calcTotalBTC(totalBalances),
				});
			}
		},
		updateBalance(nextBalance: IBalanceWS) {
			switch (nextBalance.type) {
				case WalletTypeEnum.SPOT: {
					const idx = self.balances.findIndex((b) => b.code === nextBalance.code);
					if (idx !== -1) {
						const valuation = { ...self.balances[idx].valuation };
						const pairedBalance = { ...self.balances[idx].paired_balance };
						self.balances[idx] = cast({
							...self.balances[idx],
							balance: nextBalance.balance,
							reserve: nextBalance.reserve,
						});
						self.balances[idx].valuation = valuation;
						self.balances[idx].paired_balance = pairedBalance;
					}
					break;
				}
				case WalletTypeEnum.CROSS_MARGIN: {
					const idx = self.balancesCross.findIndex((b) => b.code === nextBalance.code);
					if (idx !== -1) {
						const valuation = { ...self.balancesCross[idx].valuation };
						const pairedBalance = { ...self.balancesCross[idx].paired_balance };
						self.balancesCross[idx] = cast({
							...self.balancesCross[idx],
							balance: nextBalance.balance,
							reserve: nextBalance.reserve,
						});
						self.balancesCross[idx].valuation = valuation;
						self.balancesCross[idx].paired_balance = pairedBalance;
					}
					break;
				}
				case WalletTypeEnum.ISOLATED_MARGIN: {
					const idx = self.balancesIsolated.findIndex(
						(b) => b.code === nextBalance.code && b.pair?.replace("/", "_") === nextBalance.market,
					);
					if (idx !== -1) {
						const valuation = { ...self.balancesIsolated[idx].valuation };
						const pairedBalance = { ...self.balancesCross[idx].paired_balance };
						self.balancesIsolated[idx] = cast({
							...self.balancesIsolated[idx],
							balance: nextBalance.balance,
							reserve: nextBalance.reserve,
						});
						self.balancesIsolated[idx].valuation = valuation;
						self.balancesIsolated[idx].paired_balance = pairedBalance;
					}
					break;
				}
				default:
					break;
			}
		},
	}))
	.actions((self) => ({
		loadProfileStatus: flow(function* () {
			try {
				self.isProfileStatusLoaded = false;
				const status = yield AccountService.getProfileStatus();
				if (!status) return;
				self.profileStatus = cast(status);
				self.isProfileStatusLoaded = true;
			} catch (err) {
				errorHandler(err);
			}
		}),
		loadMarginStatus: flow(function* (params: IGetMarginStatusParams) {
			try {
				const status = yield AccountService.getMarginStatus(params);
				if (typeof status === "object") {
					self.marginStatus = cast(status);
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
		loadBalances: flow(function* () {
			try {
				const balances = yield AccountService.getBalances();
				if (Array.isArray(balances)) {
					self.balances = cast(formatBalances(balances));
				}
				if (config.isModuleOn(RenderModuleEnum.MARGIN)) {
					const balancesCross = yield AccountService.getBalancesCross();
					if (Array.isArray(balancesCross)) {
						self.balancesCross = cast(formatBalances(balancesCross));
					}
					const balancesIsolated = yield AccountService.getBalancesIsolated();
					if (Array.isArray(balancesIsolated)) {
						self.balancesIsolated = cast(formatBalances(balancesIsolated));
					}
				}
				self.updateBalancesValuations();
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isBalancesLoaded = true;
			}
		}),
		loadRates: flow(function* () {
			try {
				const requests: Promise<IRateAlgo[]>[] = [];

				RATES_QUOTED_CURRENCIES.forEach((curr) => {
					requests.push(AccountService.getRates(curr));
				});

				const ratesList = yield Promise.all(requests);
				const nextRates: any[] = [];
				ratesList.forEach((rate: IRateAlgo[], idx: number) => {
					const curr = RATES_QUOTED_CURRENCIES[idx];
					if (curr) {
						nextRates.push({
							currency: curr.toUpperCase(),
							rates: rate,
						});
					}
				});
				self.rates = cast(nextRates);
				self.updateBalancesValuations();
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export interface IAccount extends Instance<typeof Account> {}

const calcTotalBTC = (balances: IBalance[]): number =>
	balances.reduce((total, b) => total + +b.balance * (b.valuation?.BTC ?? 0), 0);

const calcTotalUSDT = (balances: IBalance[]): number =>
	balances.reduce((total, b) => total + +b.balance * (b.valuation?.USDT ?? 0), 0);
