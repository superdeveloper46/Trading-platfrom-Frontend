import { IFinanceFillBodyUpdate } from "types/verification";
import { applySnapshot, getSnapshot, cast, Instance, types as t } from "mobx-state-tree";
import VerificationService from "services/VerificationService";
import errorHandler from "utils/errorHandler";
import formMessages from "messages/form";
import * as yup from "yup";
import { errorsFromSchema, validateSchema } from "utils/yup";
import { MessageFormatter } from "types/general";
import { Status } from "./Status";

export const FinanceFill = t
	.model({
		status: t.maybeNull(Status),
		can_edit: t.optional(t.boolean, false),
		can_submit: t.optional(t.boolean, false),
		can_restart: t.optional(t.boolean, false),
		comment: t.maybeNull(t.string),
		kyc_agreement: t.maybeNull(t.string),
		document_type: t.maybeNull(t.number),
		document: t.maybeNull(t.string),
	})
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState: () => applySnapshot(self, initialState),
		};
	})
	.views((self) => ({
		get financeFillUpdate(): IFinanceFillBodyUpdate {
			return {
				kyc_agreement: self.kyc_agreement ?? undefined,
				document_type: self.document_type ?? undefined,
				document: self.document ?? undefined,
			};
		},
	}))
	.actions((self) => ({
		setDocumentType(type: number) {
			self.document_type = type;
		},
	}))
	.actions((self) => ({
		async update(data: FormData) {
			Object.entries(self.financeFillUpdate).forEach(([key, value]) => {
				if (value != null) {
					data.append(key, value === null ? "undefined" : `${value}`);
				}
			});
			await VerificationService.updateFinance(data);
		},
		async submit() {
			await VerificationService.submitFinance();
		},
	}));
