import { IOption } from "components/UI/CurrencySelect";
import { applySnapshot, cast, flow, getSnapshot, Instance, types as t } from "mobx-state-tree";
import BuyCryptoService, { IFiatRatesParams } from "services/BuyCryptoService";
import { ISendPurchaseData } from "types/buyCrypto";

const BuyCryptoError = t.model({
	status: t.optional(t.number, 0),
	message: t.optional(t.string, ""),
});

const Channel = t.model({
	code: t.string,
	description: t.string,
	disabled_counties: t.maybeNull(t.array(t.string)),
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	label: t.string,
	ordering: t.number,
	payment_icons: t.array(t.string),
	site_domain: t.maybeNull(t.string),
	site_rules: t.maybeNull(t.string),
	site_support: t.maybeNull(t.string),
});
export type IChannel = Instance<typeof Channel>;

const Currency = t.model({
	code: t.string,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	is_fiat: t.boolean,
	name: t.maybeNull(t.string),
});
export type ICurrency = Instance<typeof Currency>;

const Rate = t.model({
	id: t.number,
	updated_at: t.string,
	channel: Channel,
	crypto_currency: Currency,
	exchange_rate: t.string,
	fiat_currency: Currency,
});
export type IRate = Instance<typeof Rate>;

export const BuyCrypto = t
	.model({
		rates: t.optional(t.array(Rate), []),
		error: t.maybeNull(BuyCryptoError),
		isLoading: t.optional(t.boolean, false),
		amount: t.optional(t.string, ""),
		amountError: t.optional(t.string, ""),
		fiatCurrency: t.optional(t.string, ""),
		cryptoCurrency: t.optional(t.string, ""),
	})
	.views((self) => ({
		get fiatOptions() {
			const formattedFiatOptions = self.rates.map((rate) => ({
				label: {
					code: rate.fiat_currency.code,
					name: rate.fiat_currency.name ?? "",
				},
				value: rate.fiat_currency.code,
			}));

			return Array.from(new Set(self.rates.map((rate) => rate.fiat_currency.code)))
				.map(
					(curr: string) =>
						formattedFiatOptions.find(
							(option: IOption) => option.value.toLowerCase() === curr.toLowerCase(),
						) as IOption,
				)
				.sort((a: IOption, b: IOption): number => {
					if (a && a.label.name && b && b.label.name) {
						return a.label.name.localeCompare(b.label.name);
					}
					return 0;
				});
		},
		get cryptoOptions() {
			const formattedCryptoOptions = self.rates.map((rate) => ({
				label: {
					code: rate.crypto_currency.code,
					name: rate.crypto_currency.name ?? "",
					image_png: rate.crypto_currency.image_png ?? "",
					image_svg: rate.crypto_currency.image_svg ?? "",
				},
				value: rate.crypto_currency.code,
			}));

			return Array.from(new Set(self.rates.map((rate): string => rate.crypto_currency.code))).map(
				(curr): IOption =>
					formattedCryptoOptions.find(
						(option: IOption) => option.value.toLowerCase() === curr.toLowerCase(),
					) as IOption,
			);
		},
	}))
	.views((self) => ({
		get currentCryptoOption() {
			return self.cryptoOptions.find(
				(option: IOption) => option.value.toUpperCase() === self.cryptoCurrency.toUpperCase(),
			);
		},
	}))
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({
		setAmount(amount: string) {
			self.amount = amount;
		},
		setAmountError(amountError: string) {
			self.amountError = amountError;
		},
		setFiatCurrency(fiatCurrency: string) {
			self.fiatCurrency = fiatCurrency;
		},
		setCryptoCurrency(cryptoCurrency: string) {
			self.cryptoCurrency = cryptoCurrency;
		},
		setLoading(value: boolean) {
			self.isLoading = value;
		},
		sendPurchase: flow(function* (data: ISendPurchaseData) {
			try {
				const result: { redirect_url?: string } = yield BuyCryptoService.sendPurchase(data);
				if (result.redirect_url) {
					window.location.replace(result.redirect_url);
				}
			} catch (err) {
				// errorHandler(err);
				console.error(err);
			}
		}),
		loadFiatRates: flow(function* (params: IFiatRatesParams) {
			try {
				self.isLoading = true;
				const data = yield BuyCryptoService.getFiatsRates(params);
				if (data) {
					self.rates = cast(data);
				}
			} catch (e) {
				console.log("BuyCrypto error: ", e);
			} finally {
				self.isLoading = false;
			}
		}),
	}));
