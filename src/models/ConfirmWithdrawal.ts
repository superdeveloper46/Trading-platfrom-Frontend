import { types as t, flow, Instance, cast } from "mobx-state-tree";
import errorHandler from "utils/errorHandler";
import ConfirmWithdrawalService from "services/ConfirmWithdrawalService";

const Currency = t.model({
	code: t.string,
	name: t.string,
	image_svg: t.maybeNull(t.string),
	image_png: t.maybeNull(t.string),
});

const AttributesLabel = t.model({
	label: t.string,
	value: t.string,
});
export interface IAttributesLabel extends Instance<typeof AttributesLabel> {}

const Attributes = t.model({
	address: t.maybe(t.string),
});

const ConfirmWithdrawalInfo = t.model({
	amount: t.string,
	attributes: t.maybeNull(Attributes),
	attributes_labeled: t.array(AttributesLabel),
	currency: Currency,
	deadline_at: t.string,
	is_ok: t.boolean,
	is_pincode_confirmed: t.boolean,
	is_pincode_ok: t.boolean,
	is_pincode_required: t.boolean,
	is_totp_confirmed: t.boolean,
	is_totp_ok: t.boolean,
	is_totp_required: t.boolean,
	note: t.string,
	payment_type: t.maybe(t.number),
	payment_type_id: t.number,
	pincode_generated_at: t.maybeNull(t.string),
	pincode_timeout: t.maybeNull(t.string),
	pincode_tries_left: t.maybeNull(t.number),
	totp_timeout: t.maybeNull(t.string),
	slug: t.string,
	fee_amount: t.string,
	payment_method_name: t.string,
});

export type IConfirmWithdrawalInfo = Instance<typeof ConfirmWithdrawalInfo>;

export const ConfirmWithdrawal = t
	.model({
		info: t.optional(t.maybeNull(ConfirmWithdrawalInfo), null),
		isLoading: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		getWithdrawDetails: flow(function* (slug: string) {
			try {
				self.isLoading = true;
				const data = yield ConfirmWithdrawalService.getWithdrawDetails(slug);
				self.info = cast(data);
			} catch (err: any) {
				errorHandler(err);
			} finally {
				self.isLoading = false;
			}
		}),
		cancelWithdraw: flow(function* (slug: string) {
			try {
				yield ConfirmWithdrawalService.cancelWithdraw(slug);
			} catch (err: any) {
				errorHandler(err);
			}
		}),
		setWithdrawInfo(nextInfo: IConfirmWithdrawalInfo | null) {
			self.info = cast(nextInfo);
		},
	}));
