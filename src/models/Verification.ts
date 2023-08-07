import { cast, flow, Instance, types as t } from "mobx-state-tree";
import { StatusEnum } from "types/verification";
import VerificationService from "services/VerificationService";
import { Status } from "./Verification/Status";

export const StateType = t.model({
	status: Status,
	can_edit: t.boolean,
	can_submit: t.boolean,
	can_restart: t.boolean,
	comment: t.maybeNull(t.string),
});

const Limit = t.model({
	quota: t.string,
	currency: t.string,
});

const State = t
	.model({
		approved: t.maybeNull(StateType),
		latest: t.maybeNull(StateType),
		limit: Limit,
	})
	.views((self) => ({
		get isApproved() {
			return self.approved?.status.key === StatusEnum.APPROVED;
		},
		get isRejected() {
			return [StatusEnum.REJECTED, StatusEnum.REVOKED].includes(self.latest?.status.key ?? 0);
		},
		get canUpdate() {
			const progress = self.approved || self.latest;
			return progress?.can_restart && progress?.status?.key !== StatusEnum.REJECTED;
		},
		get isDraft() {
			return self.latest?.status.key === StatusEnum.DRAFT;
		},
		get isModeration() {
			const progress = self.latest;
			return progress
				? progress.status?.key === StatusEnum.MODERATION ||
						progress.status?.key === StatusEnum.SUBMITTED
				: false;
		},
		get isCancelled() {
			return self.approved?.status.key === StatusEnum.CANCELLED;
		},
		get needStart() {
			const progress = self.latest;
			return progress?.can_edit
				? false
				: [
						StatusEnum.NOT_STARTED,
						StatusEnum.APPROVED,
						StatusEnum.CANCELLED,
						StatusEnum.REJECTED,
						StatusEnum.REVOKED,
				  ].find((s) => s === progress?.status.key) !== null;
		},
	}));

export const Verification = t
	.model({
		isIdentityLoading: t.optional(t.boolean, false),
		isAddressLoading: t.optional(t.boolean, false),
		isFinanceLoading: t.optional(t.boolean, false),
		identityState: t.maybeNull(State),
		addressState: t.maybeNull(State),
		financeState: t.maybeNull(State),
	})
	.actions((self) => ({
		loadStates: flow(function* () {
			try {
				self.isIdentityLoading = true;
				const data = yield VerificationService.getVerificationState();
				if (!data) return;
				const { person, address, finance } = data;
				self.identityState = cast(person);
				self.addressState = cast(address);
				self.financeState = cast(finance);
			} catch (e) {
				console.error("Verification error", e);
			} finally {
				self.isIdentityLoading = false;
			}
		}),
	}));

export type IVerification = Instance<typeof Verification>;
