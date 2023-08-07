import { cast, flow, Instance, types as t } from "mobx-state-tree";
import SubAccountsService from "services/SubAccountsService";
import { ILoadSubAccountParams } from "types/subAccounts";
import errorHandler from "utils/errorHandler";
import { convertRatePrice } from "../helpers/account";
import { IRate, IRateAlgo } from "./Account";
import { ITicker } from "./Ticker";

const SubAccount = t.model({
	uid: t.string,
	login: t.string,
	email: t.string,
	created_at: t.string,
	description: t.maybeNull(t.string),
	is_spot_enabled: t.boolean,
	is_margin_enabled: t.boolean,
	is_login_enabled: t.boolean,
	is_api_enabled: t.boolean,
	is_deposit_enabled: t.boolean,
	is_withdraw_enabled: t.boolean,
	is_active: t.boolean,
	two_factor_enabled: t.boolean,
});

const SubAccBalance = t
	.model({
		uid: t.string,
		login: t.string,
		email: t.string,
		description: t.maybeNull(t.string),
		total_balance: t.maybeNull(t.string),
		is_active: t.boolean,
	})
	.volatile(() => ({
		valuation: {} as { [key: string]: number },
	}));

export type ISubAccBalance = Instance<typeof SubAccBalance>;

export const SubAccounts = t
	.model({
		accounts: t.array(SubAccount),
		isAccountsLoading: t.optional(t.boolean, false),
		balances: t.array(SubAccBalance),
		isBalancesLoading: t.optional(t.boolean, false),
	})
	.volatile(() => ({
		totalBalance: {} as { [key: string]: number },
	}))
	.actions((self) => ({
		updateBalancesValuations(tickers: ITicker[], rates: IRate[]) {
			const nextBalances: ISubAccBalance[] = [...self.balances];

			if (rates.length) {
				rates.forEach((rate: IRate) => {
					rate.rates.forEach((plan: IRateAlgo) => {
						if (plan.currency === "BTC") {
							const price = convertRatePrice(plan, tickers);
							nextBalances.forEach((b) => {
								b.valuation = {
									...b.valuation,
									[rate.currency]: price,
								};
							});
						}
					});
				});

				self.balances = cast(nextBalances);
			}

			self.totalBalance = cast({
				BTC: nextBalances.reduce((total, b) => total + +(b?.total_balance || 0), 0),
				USDT: nextBalances.reduce(
					(total, b) => total + +(b?.total_balance || 0) * (b.valuation?.USDT ?? 0),
					0,
				),
			});
		},
	}))
	.actions((self) => ({
		getSubAccounts: flow(function* (params?: ILoadSubAccountParams) {
			try {
				self.isAccountsLoading = true;
				const subAccounts = yield SubAccountsService.getSubAccounts(params);
				if (Array.isArray(subAccounts)) {
					self.accounts = cast(subAccounts);
				}
			} catch (err) {
				console.error(err);
			} finally {
				self.isAccountsLoading = false;
			}
		}),
		getBalances: flow(function* () {
			try {
				self.isBalancesLoading = true;
				const subAccBalances: ISubAccBalance[] = yield SubAccountsService.getBalances();
				if (Array.isArray(subAccBalances)) {
					self.balances = cast(subAccBalances);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isBalancesLoading = false;
			}
		}),
	}));
