import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import verificationMessages from "messages/verification";
import commonMessages from "messages/common";
import formMessages from "messages/form";
import { ISelectOption } from "components/UI/Select";
import * as yup from "yup";
import { errorsFromSchema, validateSchema } from "utils/yup";
import { useDropzone } from "react-dropzone";
import { MAX_UPLOAD_FILE_SIZE_MB } from "utils/constants";
import { validateFileSize, validateFileType } from "utils/fileHelper";
import errorHandler from "utils/errorHandler";
import { IApiError } from "helpers/ApiClient";
import {
	IFile,
	IFinanceFillBodyUpdate,
	IStatus,
	StatusEnum,
	VariantDocumentsEnum,
} from "types/verification";
import VerificationService from "services/VerificationService";
import { DOCUMENT_TYPE_FINANCE } from "constants/verification";
import { useMst } from "models/Root";

interface IErrors {
	[key: string]: string | string[];
}

interface IForm {
	status?: IStatus;
	kyc_agreement?: string;
	document_type?: number;
	document?: string;
}

const useFinanceForm = () => {
	const { formatMessage } = useIntl();
	const [file, setFile] = useState<IFile>();
	const [fileError, setFileError] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSubmitted, setSubmitted] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const {
		verification: { loadStates, financeState },
	} = useMst();

	const [formBody, setFormBody] = useState<IForm>({
		kyc_agreement: "",
		document_type: 0,
		document: "",
	});
	const [formErrors, setFormErrors] = useState<IErrors>({
		kyc_agreement: "",
		document_type: "",
		document: "",
		non_field_errors: "",
	});

	useEffect(() => {
		loadFinanceFill();
	}, [financeState]);

	useEffect(() => {
		if (formBody.status) {
			setSubmitted(
				formBody.status?.key === StatusEnum.SUBMITTED ||
					formBody.status?.key === StatusEnum.MODERATION,
			);
		}
	}, [formBody.status]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const nextFile = acceptedFiles.length > 0 ? acceptedFiles[0] : null;
		if (nextFile && validateFileType(nextFile, ["image/jpeg", "image/jpg", "image/png"])) {
			setFileError("");
			if (validateFileSize(nextFile, MAX_UPLOAD_FILE_SIZE_MB)) {
				const reader = new FileReader();
				setLoading(true);
				reader.readAsDataURL(nextFile);
				reader.onload = () => {
					setFile({
						file: nextFile,
						preview: reader.result,
					});
					setFileError("");
					setLoading(false);
				};
				reader.onerror = () => {
					setLoading(false);
					setFileError(formatMessage(commonMessages.error_occurred));
				};
			} else {
				setFileError(
					`${formatMessage(verificationMessages.maximum_size)}: ${MAX_UPLOAD_FILE_SIZE_MB}MB`,
				);
			}
		} else {
			setFileError(formatMessage(commonMessages.invalid_file_type));
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	});

	const handleSubmit = async () => {
		try {
			setSubmitting(true);
			if (!file || !file.file) {
				setFileError(formatMessage(formMessages.required));
				return;
			}
			if (!(await validate())) return;
			const data = new FormData();
			data.append(VariantDocumentsEnum.KycAgreement, file.file);
			await update(data);
			await submit();
			await loadStates();
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

	const update = async (data: FormData) => {
		try {
			const financeFillUpdate: IFinanceFillBodyUpdate = {
				document_type: formBody.document_type,
			};
			Object.entries(financeFillUpdate).forEach(([key, value]) => data.append(key, `${value}`));
			await VerificationService.updateFinance(data);
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
			const data = await VerificationService.updateFinance(formData);
			if (!data) return;
			setFormBody({ ...data });
		} catch (err) {
			errorHandler(err);
		}
	};

	const submit = async () => {
		try {
			await VerificationService.submitFinance();
		} catch (err) {
			errorHandler(err, false);
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
		}
	};

	const documentList: ISelectOption[] = Object.entries(DOCUMENT_TYPE_FINANCE).map(
		(docType: [string, number]): ISelectOption => ({
			label: formatMessage((verificationMessages as any)[docType[0]]),
			value: `${docType[1]}`,
		}),
	);

	const onDocumentSelect = (e: ISelectOption) => onChange("document_type", e?.value);

	const validate = async () => {
		try {
			await validateSchema({
				document_type: [
					formBody.document_type ?? "",
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

	const loadFinanceFill = async () => {
		try {
			setLoading(true);
			await loadStates();
			if (!financeState?.isDraft) return;
			const data = await VerificationService.getFinanceFill();
			if (!data) return;
			setFormBody({ ...data });
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		file,
		formBody,
		fileError,
		isLoading,
		isSubmitted,
		isSubmitting,
		formErrors,
		getRootProps,
		getInputProps,
		isDragActive,
		handleSubmit,
		update,
		updateDocuments,
		documentList,
		onDocumentSelect,
		onChange,
	};
};

export default useFinanceForm;
