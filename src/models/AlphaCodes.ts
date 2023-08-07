import { cast, flow, getParent, Instance, types as t } from "mobx-state-tree";
import { IGetCodesRequestBody } from "types/alphaCodes";
import AlphaCodesService from "services/AlphaCodesService";
import { formatAlphaCodes } from "helpers/alphaCodes";
import { IOption } from "components/UI/CurrencySelect";
import errorHandler from "../utils/errorHandler";
import { IRootStore } from "./Root";

const Currency = t.model({
	available: t.string,
	balance: t.string,
	code: t.string,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	is_defi: t.boolean,
	is_demo: t.boolean,
	is_deposit_enabled: t.maybeNull(t.boolean),
	is_enabled: t.boolean,
	is_fiat: t.boolean,
	is_internal_transfer_enabled: t.boolean,
	is_withdraw_enabled: t.maybeNull(t.boolean),
	liquidity_type: t.maybeNull(t.number),
	name: t.string,
	precision: t.number,
	reserve: t.string,
});

const AlphaCode = t.model({
	amount: t.number,
	code_search: t.string,
	currency_id: t.string,
	date: t.number,
	recipient_email: t.string,
	is_active: t.boolean,
});

export type IAlphaCodes = Instance<typeof AlphaCodes>;
export type IAlphaCode = Instance<typeof AlphaCode>;
export type ICurrency = Instance<typeof Currency>;

export const AlphaCodes = t
	.model({
		results: t.optional(t.array(AlphaCode), []),
		currencies: t.maybeNull(t.array(Currency)),
		isLoading: t.optional(t.boolean, false),
		codesCount: t.optional(t.number, 0),
	})
	.actions((self) => ({
		getCreatedAlphaCodes: flow(function* (params: IGetCodesRequestBody) {
			try {
				self.isLoading = true;
				const alphaCodes = yield AlphaCodesService.fetchCreatedAlphaCodes(params);
				if (Array.isArray(alphaCodes.results)) {
					self.results = cast(formatAlphaCodes(alphaCodes.results));
					self.codesCount = alphaCodes.count;
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
		getActivatedAlphaCodes: flow(function* (params: IGetCodesRequestBody) {
			try {
				self.isLoading = true;
				const alphaCodes = yield AlphaCodesService.fetchActivatedAlphaCodes(params);
				if (Array.isArray(alphaCodes.results)) {
					self.results = cast(formatAlphaCodes(alphaCodes.results));
					self.codesCount = alphaCodes.count;
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
		getCurrencies: flow(function* () {
			try {
				const data: ICurrency[] = yield AlphaCodesService.fetchCurrencies();
				self.currencies = cast(data);
			} catch (err) {
				errorHandler(err);
			}
		}),
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
	}));
