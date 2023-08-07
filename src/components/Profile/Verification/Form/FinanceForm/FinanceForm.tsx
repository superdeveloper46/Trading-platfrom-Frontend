import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import commonMessages from "messages/common";
import Select, { ISelectOption } from "components/UI/Select";
import Button from "components/UI/Button";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import DocImage from "assets/images/profile/verification/doc.svg";
import DocImageDark from "assets/images/profile/verification/doc-dark.svg";
import { LevelEnum, VariantDocumentsEnum, VariantEnum } from "types/verification";
import classnames from "classnames";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useFinanceForm from "./useFinanceForm";
import { DocumentUpload } from "../DocumentUploadModal";
import { FormSuccessfullySent } from "../FormCommon";

const FinanceForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { theme },
	} = useMst();

	const {
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
		updateDocuments,
		documentList,
		onDocumentSelect,
	} = useFinanceForm();

	return isSubmitted ? (
		<FormSuccessfullySent />
	) : (
		<div className={styles.form_container}>
			<div className={styles.form_section}>
				<span className={styles.form_label}>
					1.&nbsp;
					{formatMessage(verificationMessages.download_and_complete_the_questionnaire)}
				</span>
				<div
					className={classnames(styles.form_download_questionnaire, {
						[styles.error]: !!fileError,
					})}
				>
					<i className="ai ai-dok_empty" />
					<a href="/s/ALP_KYC.pdf" target="_blank" rel="noopener noreferrer">
						{formatMessage(verificationMessages.download_and_complete_the_questionnaire)}
					</a>
				</div>
				<span className={styles.form_label}>
					2.&nbsp;
					{formatMessage(verificationMessages.upload_the_completed_questionnaire)}
				</span>
				<label
					htmlFor="upload_input"
					className={classnames(styles.form_upload_questionnaire, {
						[styles.error]: !!fileError,
					})}
					{...getRootProps()}
				>
					{file?.preview ? (
						<div className={styles.form_questionnaire_preview}>
							<img
								src={file.preview as string}
								alt={`preview_${file.file?.name}`}
								width="250"
								height="140"
							/>
						</div>
					) : !isLoading ? (
						<>
							<i className="ai ai-file_text" />
							<span>
								{isDragActive
									? formatMessage(verificationMessages.drop_the_file_here)
									: formatMessage(verificationMessages.drag_and_drop_file_or_select_on_your_device)}
							</span>
						</>
					) : (
						<LoadingSpinner />
					)}
					<input
						id="upload_input"
						accept="image/png, image/jpeg"
						type="file"
						{...getInputProps()}
					/>
				</label>
				{fileError && <span className={styles.form_questionnaire_error}>{fileError}</span>}
			</div>
			<div className={styles.form_section}>
				<div className={styles.form_label}>{formatMessage(verificationMessages.document)}</div>
				<Select
					value={documentList.find((d) => +d.value === formBody.document_type)}
					onChange={onDocumentSelect}
					options={documentList}
					error={formErrors.document_type ?? undefined}
					isClearable
					isSearchable={false}
					label={formatMessage(verificationMessages.document)}
					getOptionLabel={(option: ISelectOption): string => option.label}
					getOptionValue={(option: ISelectOption): string => option.value}
				/>
				<div className={styles.form_document_upload}>
					<DocumentUpload
						verified={!!formBody.document}
						error={formErrors.document ?? undefined}
						src={theme === "light" ? DocImage : DocImageDark}
						message={formatMessage(verificationMessages.upload_document_photo)}
						alt="DocImage"
						level={LevelEnum.Finance}
						documentVariant={VariantDocumentsEnum.Selfie}
						variant={VariantEnum.Selfie}
						update={updateDocuments}
					/>
				</div>
			</div>
			<Button
				variant="filled"
				color="primary"
				isLoading={isSubmitting}
				fullWidth
				label={formatMessage(commonMessages.submit)}
				onClick={handleSubmit}
			/>
		</div>
	);
};

export default observer(FinanceForm);
