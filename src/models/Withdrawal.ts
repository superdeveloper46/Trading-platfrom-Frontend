import { cast, flow, getParent, Instance, types as t } from "mobx-state-tree";
import errorHandler from "utils/errorHandler";
import WithdrawalService from "services/WithdrawalService";
import { ICreateWithdrawReq } from "types/withdrawal";
import { IOption } from "components/UI/CurrencySelect";
import { IRootStore } from "./Root";
import { Balance, IBalance } from "./Account";

const WithdrawLimit = t.model({
	quota: t.string,
	used: t.string,
	quota_converted: t.string,
	is_hard_limited: t.boolean,
	hard_limit_until: t.maybeNull(t.string),
	used_converted: t.string,
	unused_in_currency: t.string,
	currency: t.string,
	verification_level: t.optional(t.number, 0),
	extend_verification_level: t.number,
});

export type IWithdrawLimit = Instance<typeof WithdrawLimit>;

const ActionCurrency = t.model({
	code: t.string,
	name: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
});

export type IActionCurrency = Instance<typeof ActionCurrency>;

const ActionMethodAttribute = t.model({
	label: t.maybeNull(t.string),
	max_length: t.maybeNull(t.number),
	min_length: t.maybeNull(t.number),
	name: t.string,
	type: t.string,
	required: t.maybe(t.boolean),
	regex: t.maybeNull(t.string),
	value: t.maybe(t.string),
});

export type IActionMethodAttribute = Instance<typeof ActionMethodAttribute>;

const PaymentCurrency = t.model({
	code: t.string,
	name: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
});

export type IPaymentCurrency = Instance<typeof PaymentCurrency>;

const PaymentConvertRate = t.model({
	price: t.string,
	valid_till: t.maybeNull(t.string),
});

export type IPaymentConvertRate = Instance<typeof PaymentConvertRate>;

const WithdrawMethodNote = t.model({
	type: t.string,
	message: t.string,
});

const WithdrawalMethodCurrency = t.model({
	code: t.string,
	name: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
});

const DepositMethodContract = t.model({
	name: t.maybeNull(t.string),
	type: t.maybeNull(t.string),
	address: t.maybeNull(t.string),
});

const WithdrawalMethod = t.model("WithdrawalMethodModel", {
	withdraw_fee_rate: t.string,
	withdraw_fee_amount: t.string,
	blockchain_block_interval: t.maybeNull(t.number),
	attributes: t.array(ActionMethodAttribute),
	contract: t.maybeNull(DepositMethodContract),
	currency: ActionCurrency,
	id: t.identifierNumber,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	is_withdraw_enabled: t.maybeNull(t.boolean),
	max_withdraw: t.string,
	min_verification_level: t.maybeNull(t.number),
	min_withdraw: t.string,
	name: t.string,
	network: t.maybeNull(t.model({ name: t.string })),
	notes: t.array(WithdrawMethodNote),
	withdraw_fee_currency: PaymentCurrency,
});

export type IWithdrawalMethod = Instance<typeof WithdrawalMethod>;

const WithdrawStatus = t.model({
	id: t.number,
	label: t.string,
});

const WithdrawAttributes = t.model({
	label: t.string,
	value: t.string,
});

export type IWithdrawAttributes = Instance<typeof WithdrawAttributes>;

export const Withdraw = t.model({
	id: t.number,
	date: t.string,
	amount: t.string,
	currency_id: t.maybe(t.string),
	slug: t.maybeNull(t.string),
	status: WithdrawStatus,
	payment_method_name: t.string,
	fee_amount: t.string,
	fee_currency_id: t.maybe(t.string),
	comment: t.maybeNull(t.string),
	note: t.maybeNull(t.string),
	currency: t.maybe(
		t.model({
			code: t.string,
			image_png: t.maybeNull(t.string),
			image_svg: t.maybeNull(t.string),
			name: t.string,
		}),
	),
	txid: t.maybeNull(t.string),
	txid_url: t.maybeNull(t.string),
	attributes: t.optional(t.array(WithdrawAttributes), []),
});

export type IWithdraw = Instance<typeof Withdraw>;

const PreviousWithdrawals = t.model({
	results: t.optional(t.array(Withdraw), []),
	isLoading: t.optional(t.boolean, false),
});

export const Withdrawal = t
	.model("WithdrawalModel", {
		withdraw_methods: t.optional(t.array(WithdrawalMethod), []),
		isLoading: t.optional(t.boolean, false),
		isReq: t.optional(t.boolean, false),
		currency_balance: t.optional(t.number, 0),
		currentCurrency: t.maybe(Balance),
		currentMethod: t.maybe(t.reference(WithdrawalMethod)),
		withdraw_limit: t.maybeNull(WithdrawLimit),
		previousWithdraws: t.optional(PreviousWithdrawals, {}),
	})
	.actions((self) => ({
		createWithdraw: flow(function* (params: ICreateWithdrawReq) {
			try {
				self.isReq = true;
				return yield WithdrawalService.createWithdraw(params);
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isReq = false;
			}
			return null;
		}),
		getPreviousWithdraws: flow(function* (params?: any) {
			try {
				self.previousWithdraws.isLoading = true;
				const data = yield WithdrawalService.getPreviousWithdraws(params);
				self.previousWithdraws.results = cast(Array.isArray(data.results) ? data.results : []);
			} catch (err) {
				errorHandler(err);
			} finally {
				self.previousWithdraws.isLoading = false;
			}
		}),

		setCurrentMethod(method?: IWithdrawalMethod) {
			self.currentMethod = method;
		},
		setCurrentCurrency(currency?: IBalance) {
			self.currentCurrency = currency && { ...currency };
		},
		getCurrentBalance: flow(function* (currency_id: string) {
			self.currency_balance = 0;
			try {
				const data = yield WithdrawalService.getCurrentBalance();
				const wallet = data
					? data.find((item: { currency_id: string }) => item.currency_id === currency_id)
					: null;
				if (wallet) {
					self.currency_balance = wallet.available;
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
		getWithdrawLimit: flow(function* (params: { currency: string }) {
			try {
				self.withdraw_limit = yield WithdrawalService.getWithdrawLimit(params);
			} catch (err) {
				errorHandler(err);
			}
		}),
		getWithdrawDetails: flow(function* (slug: string) {
			try {
				yield WithdrawalService.getWithdrawDetails(slug);
			} catch (err) {
				errorHandler(err);
			}
		}),
	}))
	.actions((self) => ({
		cancelWithdraw: flow(function* (slug: string) {
			try {
				yield WithdrawalService.cancelWithdraw(slug);
			} catch (err) {
				errorHandler(err);
			} finally {
				self.getWithdrawDetails(slug);
			}
		}),
		setCurrentAttributes(attributes: IActionMethodAttribute[]) {
			if (self.currentMethod) {
				self.currentMethod.attributes = cast(attributes);
			}
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
					disabled: !b.is_withdraw_enabled,
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
			// return self.currentMethod?.attributes ?? [];
			return self.currentMethod?.attributes
				? self.currentMethod?.attributes.map(
						(attr: IActionMethodAttribute): IActionMethodAttribute => ({
							...attr,
							// max_length: null,
							// min_length: null,
							// required: true,
							// regex: null,
							// value: "",
						}),
				  )
				: [];
		},
	}))
	.actions((self) => ({
		withdrawMethodsInit: flow(function* (params: { currency: string }) {
			try {
				self.isLoading = true;
				// TODO: fix it
				self.setCurrentMethod(undefined);
				const methods = yield WithdrawalService.withdrawMethodsInit(params);
				if (Array.isArray(methods)) {
					self.withdraw_methods = cast(methods);
					if (self.withdraw_methods) {
						const nextCurrentMethod = self.withdraw_methods.find(
							(method: IWithdrawalMethod) => method.is_withdraw_enabled,
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
	}))
	.actions((self) => ({
		setAttribute(name: string, value: string) {
			const attributes = self.currentMethod?.attributes;
			if (attributes) {
				const idx = attributes.findIndex(
					(attribute: IActionMethodAttribute) => attribute.name === name,
				);
				if (idx !== -1) {
					attributes[idx] = { ...attributes[idx], value };
				}
				self.setCurrentAttributes(attributes);
			}
		},
	}));
