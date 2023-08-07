import { cast, flow, Instance, types as t } from "mobx-state-tree";
import errorHandler from "utils/errorHandler";
import CurrenciesService, { IParams } from "services/CurrenciesService";

const LiquidityType = t.model({ id: t.number, label: t.string });

export const Currency = t.model({
	id: t.string,
	code: t.string,
	name: t.string,
	second_name: t.string,
	brand_color: t.string,
	precision: t.number,
	image_png: t.maybeNull(t.string),
	image_svg: t.maybeNull(t.string),
	liquidity_type: LiquidityType,
	is_enabled: t.boolean,
	is_internal_transfer_enabled: t.boolean,
	is_deposit_available: t.boolean,
	is_withdraw_available: t.boolean,
	is_cross_margin_available: t.boolean,
	is_convert_quote: t.boolean,
	updated_at: t.string,
});

export type ICurrency = Instance<typeof Currency>;

export const Currencies = t
	.model({
		data: t.optional(t.array(Currency), []),
		isLoading: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		loadCurrencies: flow(function* (params?: IParams) {
			try {
				self.isLoading = true;
				const data = yield CurrenciesService.loadCurrencies(params);

				if (Array.isArray(data)) {
					self.data = cast(data);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
	}));
