import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import verificationMessages from "messages/verification";
import { ISelectOption } from "components/UI/Select";
import { IAddressFillBodyUpdate, IStatus, StatusEnum } from "types/verification";
import * as yup from "yup";
import { errorsFromSchema, validateSchema } from "utils/yup";
import formMessages from "messages/form";
import { IApiError } from "helpers/ApiClient";

import errorHandler from "utils/errorHandler";
import { DOCUMENT_TYPE_ADDRESS } from "constants/verification";
import VerificationService from "services/VerificationService";
import { useMst } from "models/Root";

interface IErrors {
	[key: string]: string | string[];
}

interface IForm {
	status?: IStatus;
	can_edit?: boolean;
	can_submit?: boolean;
	can_restart?: boolean;
	comment?: string;
	address?: string;
	region?: string;
	document_type?: string;
	city?: string;
	country?: string;
	postal_code?: string;
	document?: string;
}

const INITIAL_ERRORS_STATE: IErrors = {
	address: "",
	region: "",
	document_type: "",
	document: "",
	city: "",
	country: "",
	postal_code: "",
};

const useAddressForm = () => {
	const { formatMessage } = useIntl();
	const [isSubmitted, setSubmitted] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const {
		verification: { loadStates, addressState },
	} = useMst();

	const [formBody, setFormBody] = useState<IForm>({
		address: "",
		region: "",
		document_type: "",
		document: "",
		city: "",
		country: "",
		postal_code: "",
	});

	const [formErrors, setFormErrors] = useState<IErrors>(INITIAL_ERRORS_STATE);

	const resetErrors = () => {
		setFormErrors(INITIAL_ERRORS_STATE);
	};

	useEffect(() => {
		loadAddressFill();
	}, [addressState]);

	useEffect(() => {
		if (formBody.status) {
			setSubmitted(
				formBody.status?.key === StatusEnum.SUBMITTED ||
					formBody.status?.key === StatusEnum.MODERATION,
			);
		}
	}, [formBody.status]);

	const documentList: ISelectOption[] = Object.entries(DOCUMENT_TYPE_ADDRESS).map(
		(docType: [string, number]): ISelectOption => ({
			label: formatMessage((verificationMessages as any)[docType[0]]),
			value: `${docType[1]}`,
		}),
	);

	const handleSubmit = async () => {
		if (!(await validate())) return;
		try {
			setSubmitting(true);
			await update();
			await submit();
			await loadStates();
			setSubmitted(true);
		} catch (err) {
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
			errorHandler(err);
		} finally {
			setSubmitting(false);
		}
	};

	const onCountryChange = (_: string, value: string) => onChange("country", value);

	const onDocumentSelect = (e: ISelectOption) => onChange("document_type", e?.value);

	const update = async () => {
		try {
			const data = new FormData();
			const addressFillUpdate: IAddressFillBodyUpdate = {
				address: formBody.address,
				region: formBody.region,
				document_type: formBody.document_type,
				city: formBody.city,
				country: formBody.country,
				postal_code: formBody.postal_code,
			};
			Object.entries(addressFillUpdate).forEach(([key, value]) => data.append(key, `${value}`));
			await VerificationService.updateAddress(data);
		} catch (err) {
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
			errorHandler(err);
		}
	};

	const updateDocuments = async (formData: FormData) => {
		try {
			const data: IAddressFillBodyUpdate = await VerificationService.updateAddress(formData);
			if (!data) return;
			setFormBody((prev) => ({ ...prev, document: data.document }));
		} catch (err) {
			errorHandler(err);
		}
	};

	const submit = async () => {
		try {
			await VerificationService.submitAddress();
		} catch (err) {
			errorHandler(err, false);
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
		}
	};

	const loadAddressFill = async () => {
		try {
			setLoading(true);
			await loadStates();
			if (!addressState?.isDraft) return;
			const data = await VerificationService.getAddressFill();
			if (!data) return;
			setFormBody({ ...data });
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const validate = async () => {
		try {
			await validateSchema({
				address: [
					formBody.address ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				region: [
					formBody.region ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				city: [formBody.city ?? "", yup.string().required(formatMessage(formMessages.required))],
				document_type: [
					formBody.document_type ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				postal_code: [
					formBody.postal_code ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				country: [
					formBody.country ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				document: [
					formBody.document ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
			});
			return true;
		} catch (err) {
			setFormErrors(errorsFromSchema<IErrors>(err as any) as IErrors);
			return false;
		}
	};

	const onInputChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
		onChange(name, value);

	const onChange = (name: string, value: any) => {
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setFormErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	};

	useEffect(() => {
		if (formBody.status) {
			setSubmitted(
				formBody.status?.key === StatusEnum.SUBMITTED ||
					formBody.status?.key === StatusEnum.MODERATION,
			);
		}
	}, [isLoading, formBody.status]);

	return {
		isSubmitted,
		isSubmitting,
		formErrors,
		resetErrors,
		formBody,
		documentList,
		handleSubmit,
		onCountryChange,
		onDocumentSelect,
		updateDocuments,
		onInputChange,
	};
};

export default useAddressForm;
