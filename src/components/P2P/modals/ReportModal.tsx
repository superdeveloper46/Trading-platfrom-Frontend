import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { AnyObjectSchema } from "yup";
import cn from "classnames";

import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Input from "components/UI/Input";
import Textarea from "components/UI/Textarea";
import Select, { ISelectOption } from "components/UI/Select";
import listingMessages from "messages/listing";
import UploadInput, { IDropzoneResult } from "components/UploadInput";
import { IReportRequestFormBody, IReportRequestFormErrorsBody } from "types/p2p";
import {
	INITIAL_REPORT_REQUEST_FORM,
	MAX_REPORT_FILE_SIZE,
	REASON_MAX_SYMBOLS,
	REPORT_REQUEST_VALIDATION_SCHEMA,
	ReportReasonsEnum,
} from "constants/p2p";
import { getErrorFromYupValidationRes } from "utils/getter";
import { IError } from "types/general";
import errorHandler from "utils/errorHandler";
import { handleFormErrors } from "utils/form";
import P2PService from "services/P2PService";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	orderId?: number;
	nickname: string;
}

const ReportModal: React.FC<IProps> = ({ onClose, isOpen, orderId, nickname }) => {
	const { formatMessage } = useIntl();

	const [formBody, setFormBody] = useState<IReportRequestFormBody>(INITIAL_REPORT_REQUEST_FORM);
	const [formErrors, setFormErrors] = useState<IReportRequestFormErrorsBody>({});

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const REASON_OPTIONS: ISelectOption[] = [
		{
			value: ReportReasonsEnum.Scam,
			label: formatMessage(p2pMessages.report_reason_scam),
		},
		{
			value: ReportReasonsEnum.UnreasonableConditions,
			label: formatMessage(p2pMessages.report_reason_unreasonable),
		},
		{
			value: ReportReasonsEnum.Other,
			label: formatMessage(p2pMessages.other_reasons),
		},
	];

	const reasonValue = useMemo(
		() => REASON_OPTIONS.find((o) => o.value === formBody.reason),
		[formBody.reason],
	);

	const onUpload = (name: keyof Pick<IReportRequestFormBody, "proof">, res: IDropzoneResult) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: res.files[0],
		}));
		res.resolve();
	};

	const handleReasonChange = (o: ISelectOption) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			reason: o.value,
		}));
	};

	const validateStep = async (
		schema: (formatMessages: (v: MessageDescriptor) => string) => AnyObjectSchema,
		resolve: (...args: any[]) => void,
		reject: (...args: any[]) => void,
	) => {
		await schema(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then((res) => {
				setFormErrors({});
				resolve(res);
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<IReportRequestFormErrorsBody>(err));
				reject(err);
			});
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formBody));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));
		}
	};

	const handleSubmit = () =>
		new Promise((resolve, reject) => {
			validateStep(REPORT_REQUEST_VALIDATION_SCHEMA, resolve, reject);
		})
			.then(() => {
				const formData = new FormData();
				const { ...body } = formBody;

				Object.entries(body).forEach(([key, value]) =>
					value !== null && value !== undefined
						? formData.append(key, value as string | Blob)
						: null,
				);

				if (!isSubmitting) {
					setIsSubmitting(true);
					P2PService.reportUser(formData)
						.then(() => {
							onClose();
						})
						.catch(handleErrors)
						.finally(() => setIsSubmitting(false));
				}
			})
			.catch((err) => console.log(err));

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		setFormErrors({});
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (orderId) {
			setFormBody((prev) => ({ ...prev, deal: orderId.toString() }));
		}
	}, [orderId]);

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={`${formatMessage(p2pMessages.report)} @${nickname}`}
		>
			<>
				<Content>
					<Description noMargin>
						<div className={styles.warning_container}>
							<div className={styles.modal_title}>
								<i className="ai ai-error_circle" />
								<span>{formatMessage(p2pMessages.malicious_reports)}</span>
							</div>
						</div>
					</Description>
				</Content>
				<ContentForm>
					<Select
						options={REASON_OPTIONS}
						onChange={handleReasonChange}
						value={reasonValue}
						error={formErrors.reason}
						isSearchable={false}
						label={formatMessage(p2pMessages.report_reason)}
					/>
					<Input
						name="deal"
						error={formErrors.deal}
						value={formBody.deal}
						labelValue={formatMessage(p2pMessages.order_number)}
						onChange={handleInputChange}
					/>
					<Textarea
						placeholder={formatMessage(commonMessages.description)}
						name="description"
						error={formErrors.description}
						value={formBody.description}
						maxLength={REASON_MAX_SYMBOLS}
						helpText={formatMessage(
							{ ...commonMessages.symbols_remaining },
							{ amount: REASON_MAX_SYMBOLS - formBody.description.length },
						)}
						onChange={handleInputChange}
					/>
					<div className={styles.notification_container}>
						<span className={styles.modal_title}>Upload Proof</span>
						<span className={p2pStyles.default_text}>
							{formatMessage(p2pMessages.report_upload_desc)}
						</span>
					</div>
					<UploadInput
						maxSize={MAX_REPORT_FILE_SIZE}
						onUpload={(data) => onUpload("proof", data)}
						accept={{
							"image/svg+xml": [".svg", ".png", ".jpeg", ".jpg"],
							"image/png": [".png"],
							"image/jpeg": [".jpeg"],
							"image/jpg": [".jpg"],
						}}
						error={formErrors.proof}
						showErrors
					>
						{({ isDragActive, isDragReject }) =>
							isDragActive ? (
								isDragReject ? (
									formatMessage(listingMessages.wrong_file_type)
								) : (
									formatMessage(listingMessages.drop_files_here)
								)
							) : (
								<div className={styles.file}>
									<i className={cn(styles.icon, "ai ai-attachment")} />
									<span>
										{formBody.proof
											? formBody.proof.name
											: formatMessage(p2pMessages.upload_report_text)}
									</span>
								</div>
							)
						}
					</UploadInput>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isSubmitting}
							fullWidth
							label={formatMessage(p2pMessages.report)}
						/>
						<Button
							variant="outlined"
							color="primary"
							disabled={isSubmitting}
							onClick={onClose}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default ReportModal;
