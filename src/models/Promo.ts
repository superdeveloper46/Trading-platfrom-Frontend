import { cast, flow, Instance, types as t } from "mobx-state-tree";
import PromoService from "services/PromoService";
import errorHandler from "utils/errorHandler";

export const PromoStatus = t.model({
	amount_total: t.maybeNull(t.string),
	amount_unlocked: t.maybeNull(t.string),
	amount_paid: t.maybeNull(t.string),
	action_verification_and_deposit: t.boolean,
	action_trade5k: t.boolean,
	action_trade10k: t.boolean,
	action_social_activity: t.boolean,
	action_trade30k: t.boolean,
	action_trade50k: t.boolean,
	paid_at: t.maybeNull(t.Date),
	end_at: t.maybeNull(t.Date),
	is_active: t.boolean,
});

export type IPromoStatus = Instance<typeof PromoStatus>;

export const Promo = t
	.model({
		status: t.maybeNull(PromoStatus),
		isLoading: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		loadPromo: flow(function* () {
			try {
				self.isLoading = true;
				const promoStatus: IPromoStatus = yield PromoService.getPromoStatus();
				if (promoStatus) {
					self.status = cast(promoStatus);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
	}));
