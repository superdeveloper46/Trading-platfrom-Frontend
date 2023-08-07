import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import * as yup from "yup";
import verificationMessages from "messages/verification";
import { ISelectOption } from "components/UI/Select";
import formMessages from "messages/form";
import { errorsFromSchema, validateSchema } from "utils/yup";
import { DOCUMENT_TYPE_PERSON } from "constants/verification";
import { IApiError } from "helpers/ApiClient";
import errorHandler from "utils/errorHandler";
import VerificationService from "services/VerificationService";
import dayjs from "utils/dayjs";
import { IPersonFillBodyUpdate, IStatus, StatusEnum } from "types/verification";
import { useMst } from "models/Root";

interface IErrors {
	[key: string]: string | string[];
}

interface IForm {
	status?: IStatus;
	name?: string;
	second_name?: string;
	middle_name?: string;
	birthday?: string;
	contact_phone_number?: string;
	identity_document_type?: number;
	identity_front_document?: string;
	identity_back_document?: string;
	issuing_country?: string;
	document_number?: string;
	expire_date?: string;
	selfie?: string;
	gender?: number;
	non_expiring_document?: boolean;
}

const INITIAL_ERRORS_STATE: IErrors = {
	name: "",
	second_name: "",
	middle_name: "",
	birthday: "",
	contact_phone_number: "",
	identity_document_type: "",
	identity_front_document: "",
	identity_back_document: "",
	issuing_country: "",
	document_number: "",
	selfie: "",
	gender: "",
	non_field_errors: "",
};

export const useIdentityForm = () => {
	const { formatMessage } = useIntl();
	const [isSubmitted, setSubmitted] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const {
		verification: { loadStates, identityState },
	} = useMst();

	const [formBody, setFormBody] = useState<IForm>({
		name: "",
		second_name: "",
		middle_name: "",
		birthday: "",
		contact_phone_number: "",
		identity_document_type: -1,
		identity_front_document: "",
		identity_back_document: "",
		issuing_country: "",
		document_number: "",
		non_expiring_document: false,
		selfie: "",
		gender: -1,
	});
	const [formErrors, setFormErrors] = useState<IErrors>(INITIAL_ERRORS_STATE);

	const resetErrors = () => {
		setFormErrors(INITIAL_ERRORS_STATE);
	};

	const onPhoneChange = (value: string) => onChange("contact_phone_number", value);

	const onCountryChange = (_: string, value: string) => onChange("issuing_country", value);

	const onDocumentSelect = (e: ISelectOption) => onChange("identity_document_type", e?.value);

	const onDateChange = (name: string, date: string) => onChange(name, date);

	const onInputChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
		onChange(name, value);

	const onCheck = ({ target: { name, checked } }: React.ChangeEvent<HTMLInputElement>) =>
		onChange(name, checked);

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

	const loadPersonalFill = async () => {
		try {
			await loadStates();
			if (!identityState?.isDraft) return;
			setLoading(true);
			const data = await VerificationService.getPersonalFill();
			if (!data) return;
			setFormBody({ ...data });
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!(await validate())) return;
		try {
			setSubmitting(true);
			await update();
			await submit();
			loadStates();
			setSubmitted(true);
		} catch (err) {
			errorHandler(err);
		} finally {
			setSubmitting(false);
		}
	};

	const update = async () => {
		try {
			const formData = new FormData();
			const personFillUpdate: IPersonFillBodyUpdate = {
				name: formBody.name,
				second_name: formBody.second_name,
				middle_name: formBody.middle_name,
				birthday: formBody.birthday,
				contact_phone_number: `+${formBody.contact_phone_number}`,
				identity_document_type: `${formBody.identity_document_type}`,
				issuing_country: formBody.issuing_country,
				document_number: formBody.document_number,
				non_expiring_document: formBody.non_expiring_document ?? false,
				gender: formBody.gender,
			};
			Object.entries(
				formBody.non_expiring_document
					? personFillUpdate
					: { ...personFillUpdate, expire_date: formBody.expire_date },
			).forEach(([key, value]) => formData.append(key, `${value}`));
			const data = await VerificationService.updatePerson(formData);
			if (!data) return;
			setFormBody({ ...data });
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
			const data = await VerificationService.updatePerson(formData);
			if (!data) return;
			setFormBody((prev) => ({
				...prev,
				identity_front_document: data.identity_front_document,
				identity_back_document: data.identity_back_document,
				selfie: data.selfie,
			}));
		} catch (err) {
			errorHandler(err);
		}
	};

	const submit = async () => {
		try {
			await VerificationService.submitPerson();
		} catch (err) {
			errorHandler(err, false);
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
		}
	};

	const validate = async () => {
		const isDocumentTypeCard = [
			DOCUMENT_TYPE_PERSON.id_card,
			DOCUMENT_TYPE_PERSON.drive_license,
		].includes(+(formBody.identity_document_type ?? 0));

		try {
			await validateSchema({
				name: [formBody.name ?? "", yup.string().required(formatMessage(formMessages.required))],
				second_name: [
					formBody.second_name ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				document_number: [
					formBody.document_number ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				contact_phone_number: [
					formBody.contact_phone_number ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				identity_document_type: [
					formBody.identity_document_type ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				issuing_country: [
					formBody.issuing_country ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				birthday: [
					formBody.birthday ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				identity_front_document: [
					formBody.identity_front_document ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				identity_back_document: [
					formBody.identity_back_document ?? "",
					isDocumentTypeCard
						? yup.string().required(formatMessage(formMessages.required))
						: yup.string(),
				],
				selfie: [
					formBody.selfie ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				gender: [
					formBody.gender === -1 ? "" : formBody.gender?.toString() ?? "",
					yup.string().required(formatMessage(formMessages.required)),
				],
				expire_date: [
					formBody.expire_date ?? "",
					formBody.non_expiring_document
						? yup.string().optional()
						: yup
								.string()
								.test(
									"Date checking",
									formatMessage(formMessages.expiry_date_can_not_be_less_than_6_months),
									(value) => dayjs(value).isAfter(dayjs().add(6, "month").subtract(1, "day")),
								)
								.required(formatMessage(formMessages.required)),
				],
			});

			return true;
		} catch (err) {
			setFormErrors(errorsFromSchema<IErrors>(err as any) as IErrors);
			return false;
		}
	};

	const documentList: ISelectOption[] = Object.entries(DOCUMENT_TYPE_PERSON).map(
		(docType: [string, number]): ISelectOption => ({
			label: formatMessage((verificationMessages as any)[docType[0]]),
			value: `${docType[1]}`,
		}),
	);

	useEffect(() => {
		loadPersonalFill();
	}, [identityState]);

	useEffect(() => {
		if (formBody.status) {
			setSubmitted(
				formBody.status?.key === StatusEnum.SUBMITTED ||
					formBody.status?.key === StatusEnum.MODERATION,
			);
		}
	}, [formBody.status]);

	return {
		formBody,
		formErrors,
		loadPersonalFill,
		onChange,
		onDateChange,
		onDocumentSelect,
		documentList,
		updateDocuments,
		onInputChange,
		onCountryChange,
		onPhoneChange,
		resetErrors,
		isLoading,
		isSubmitting,
		isSubmitted,
		handleSubmit,
		onCheck,
	};
};
