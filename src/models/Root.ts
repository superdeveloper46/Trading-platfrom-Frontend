/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext } from "react";
import { Instance, onSnapshot, types as t } from "mobx-state-tree";
import { Auth } from "./Auth";
import { Global } from "./Global";
import { Render } from "./Render";
import { Tickers } from "./Ticker";
import { BuyCrypto } from "./BuyCrypto";
import { Account } from "./Account";
import { Terminal } from "./Terminal";
import { History } from "./History";
import { Finance } from "./Finance";
import { Verification } from "./Verification";
import { ProfileApiKeys } from "./ApiKeys";
import { Notifications } from "./Notifications";
import { SubAccounts } from "./SubAccounts";
import { Referrals } from "./Referrals";
import { AlphaCodes } from "./AlphaCodes";
import { Currencies } from "./Currencies";
import { DepositModel } from "./Deposit";
import { Withdrawal } from "./Withdrawal";
import { ConfirmWithdrawal } from "./ConfirmWithdrawal";
import { Promo } from "./Promo";

const RootModel = t.model({
	auth: Auth,
	global: Global,
	render: Render,
	tickers: Tickers,
	terminal: Terminal,
	buyCrypto: BuyCrypto,
	verification: Verification,
	account: Account,
	history: History,
	apiKeys: ProfileApiKeys,
	finance: Finance,
	notifications: Notifications,
	subAccounts: SubAccounts,
	alphaCodes: AlphaCodes,
	referrals: Referrals,
	currencies: Currencies,
	deposit: DepositModel,
	withdrawal: Withdrawal,
	confirmWithdrawal: ConfirmWithdrawal,
	promo: Promo,
});

const initialState = RootModel.create({
	auth: {},
	global: {},
	render: {},
	tickers: {},
	verification: {},
	terminal: {},
	buyCrypto: {},
	account: {},
	history: {},
	apiKeys: {},
	finance: {},
	notifications: {},
	alphaCodes: {},
	referrals: {},
	currencies: {},
	deposit: {},
	withdrawal: {},
	confirmWithdrawal: {},
	subAccounts: {},
	promo: {},
});

// @ts-ignore
// const data = localStorage.getItem("rootState");
// if (data) {
//   const json = JSON.parse(data)
//   if (RootModel.is(json)) {
//     initialState = RootModel.create(json)
//   }
// }

export const rootStore = initialState;
export type IRootStore = typeof rootStore;

if (process.env.NODE_ENV !== "production" && process.env.REACT_APP_DEBUG === "true") {
	onSnapshot(rootStore, (snapshot) => {
		// console.log("Snapshot: ", snapshot);
		// localStorage.setItem("rootState", JSON.stringify(snapshot))
	});
}
const RootStoreContext = createContext<RootInstance | null>(null);

export type RootInstance = Instance<typeof RootModel>;
export const { Provider } = RootStoreContext;

export function useMst() {
	const store = useContext(RootStoreContext);

	if (store === null) {
		throw new Error("store cannot be null, please add a context provider");
	}

	return store;
}
