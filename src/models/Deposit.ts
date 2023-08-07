import { cast, flow, getParent, Instance, types as t } from "mobx-state-tree";
import errorHandler from "utils/errorHandler";
import DepositService from "services/DepositService";
import { IOption } from "components/UI/CurrencySelect";
import { IRootStore } from "./Root";
import { Balance, IBalance } from "./Account";

const DepositStatus = t.model({
	id: t.number,
	label: t.string,
});

const CurrencyShort = t.model({
	code: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	name: t.maybeNull(t.string),
});

export const Deposit = t.model({
	amount: t.string,
	confirmations: t.maybeNull(t.number),
	currency: t.maybe(CurrencyShort),
	currency_id: t.maybe(t.string),
	id: t.number,
	date: t.string,
	fee_rate: t.string,
	fee_value: t.string,
	payment_method_name: t.string,
	status: DepositStatus,
	required_confirmations: t.number,
	txid: t.maybeNull(t.string),
	txid_url: t.maybeNull(t.string),
	reject_reason: t.optional(t.maybeNull(t.string), null),
});

export type IDeposit = Instance<typeof Deposit>;

const DepositMethodContract = t.model({
	name: t.maybeNull(t.string),
	type: t.maybeNull(t.string),
	address: t.maybeNull(t.string),
});

export type IDepositMethodContract = Instance<typeof DepositMethodContract>;

const DepositMethodCurrency = t.model({
	code: t.string,
	name: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
});

export type IDepositMethodCurrency = Instance<typeof DepositMethodCurrency>;

const DepositMethodNetwork = t.model({
	name: t.string,
});

export type IDepositMethodNetwork = Instance<typeof DepositMethodNetwork>;

const DepositMethodNote = t.model({
	type: t.string,
	message: t.string,
});

export type IDepositMethodNote = Instance<typeof DepositMethodNote>;

const DepositMethodConvertRate = t.model({
	price: t.string,
	valid_till: t.string,
});

export type IDepositMethodConvertRate = Instance<typeof DepositMethodConvertRate>;

const Attribute = t.model({
	label: t.string,
	value: t.string,
	name: t.string,
	show_qr: t.boolean,
});

export type IAttribute = Instance<typeof Attribute>;

export const DepositMethod = t.model({
	id: t.identifierNumber,
	attributes: t.maybeNull(t.array(Attribute)),
	blockchain_block_interval: t.maybeNull(t.number),
	contract: t.maybeNull(DepositMethodContract),
	currency: DepositMethodCurrency,
	deposit_confirmations_need: t.number, // removed
	deposit_fee_amount: t.string,
	deposit_fee_rate: t.string,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	is_deposit_enabled: t.maybeNull(t.boolean),
	is_sci: t.boolean,
	max_deposit: t.string,
	min_deposit: t.string,
	min_verification_level: t.maybeNull(t.number),
	name: t.string,
	network: t.maybeNull(DepositMethodNetwork),
	notes: t.maybeNull(t.array(DepositMethodNote)),
});

export type IDepositMethod = Instance<typeof DepositMethod>;

const PreviousDeposits = t.model({
	results: t.optional(t.array(Deposit), []),
	isLoading: t.optional(t.boolean, false),
});

export const DepositModel = t
	.model({
		deposit_methods: t.optional(t.array(DepositMethod), []),
		isLoading: t.optional(t.boolean, false),
		currentCurrency: t.maybe(Balance),
		currentMethod: t.maybe(t.reference(DepositMethod)),
		previousDeposits: t.optional(PreviousDeposits, {}),
	})
	.actions((self) => ({
		getPreviousDeposits: flow(function* (params?: any) {
			try {
				self.previousDeposits.isLoading = true;
				const data = yield DepositService.getPreviousDeposits(params);
				if (Array.isArray(data.results)) {
					self.previousDeposits.results = cast(data.results);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.previousDeposits.isLoading = false;
			}
		}),
		setCurrentMethod(method?: IDepositMethod) {
			self.currentMethod = method;
		},
		setCurrentCurrency(currency?: IBalance) {
			self.currentCurrency = currency && { ...currency };
		},
	}))
	.views((self) => ({
		get processedCurrencies() {
			const account = getParent<IRootStore>(self).account;
			if (!Array.isArray(account.balances)) return [];
			const formattedOptions: IOption[] = account.balances.map((b) => ({
				label: {
					code: b.code,
					name: b.name,
					available: b.available.toString(),
					precision: b.precision ?? 8,
					disabled: !b.is_deposit_enabled,
					image_svg: b.image_svg ?? undefined,
					image_png: b.image_png ?? undefined,
				},
				value: b.code,
			}));

			const withAvailable = formattedOptions.filter((o: IOption) =>
				o.label.available ? parseFloat(o.label.available) > 0 : false,
			);
			const withoutAvailable = formattedOptions
				.filter((o: IOption) => (o.label.available ? parseFloat(o.label.available) <= 0 : false))
				.sort((a: IOption, b: IOption) => a.label.code.localeCompare(b.label.code));

			return [...withAvailable, ...withoutAvailable];
		},
		get attributes() {
			return self.currentMethod?.attributes ?? [];
		},
	}))
	.actions((self) => ({
		depositMethodsInit: flow(function* (params: { currency: string }) {
			try {
				self.isLoading = true;
				self.setCurrentMethod(undefined);
				const methods = yield DepositService.depositMethodsInit(params);
				if (Array.isArray(methods)) {
					self.deposit_methods = cast(methods);
					if (self.deposit_methods) {
						const nextCurrentMethod = self.deposit_methods.find(
							(method: IDepositMethod) => method.is_deposit_enabled,
						);
						if (nextCurrentMethod) {
							self.setCurrentMethod(cast(nextCurrentMethod));
						}
					}
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
	}));
