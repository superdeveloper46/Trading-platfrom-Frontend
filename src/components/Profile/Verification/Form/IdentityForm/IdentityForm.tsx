import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import classnames from "classnames";

import styles from "styles/pages/ProfileVerification.module.scss";
import stylesInput from "styles/components/UI/Input.module.scss";
import verificationMessages from "messages/verification";
import securityMessages from "messages/security";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import Select, { ISelectOption } from "components/UI/Select";
import Input from "components/UI/Input";
import RadioChoice from "components/UI/Radio";
import PhoneCountryInput from "components/UI/PhoneCountryInput";
import CountrySelect from "components/UI/CountrySelect";
import { useMst } from "models/Root";
import CheckBox from "components/UI/CheckBox";
import DocImage from "assets/images/profile/verification/doc.svg";
import DocImageDark from "assets/images/profile/verification/doc-dark.svg";
import SelfieImage from "assets/images/profile/verification/selfie.svg";
import VerificationService from "services/VerificationService";
import errorHandler from "utils/errorHandler";
import { DOCUMENT_TYPE_PERSON } from "constants/verification";
import SelfieImageDark from "assets/images/profile/verification/selfie-dark.svg";
import { GenderEnum, LevelEnum, VariantDocumentsEnum, VariantEnum } from "types/verification";
import { routes, URL_VARS } from "constants/routing";
import useWindowSize from "hooks/useWindowSize";
import { useIdentityForm } from "./useIdentityForm";
import { DocumentUpload } from "../DocumentUploadModal";
import { FormDateInput } from "../FormDateInput";
import { FormSuccessfullySent } from "../FormCommon";

const IdentityForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { locale, theme },
		verification: { addressState },
	} = useMst();
	const { medium } = useWindowSize();
	const navigate = useNavigate();

	const {
		formBody,
		formErrors,
		onDateChange,
		onDocumentSelect,
		documentList,
		updateDocuments,
		onInputChange,
		onCheck,
		onCountryChange,
		onPhoneChange,
		resetErrors,
		isSubmitting,
		isSubmitted,
		handleSubmit,
	} = useIdentityForm();

	const isDocumentTypeCard = [
		DOCUMENT_TYPE_PERSON.id_card,
		DOCUMENT_TYPE_PERSON.drive_license,
	].includes(+(formBody.identity_document_type ?? 0));

	const handleStart = async () => {
		try {
			if (addressState?.needStart) await VerificationService.startAddress();
			navigate(routes.verification.getVerificationType(URL_VARS.ADDRESS));
		} catch (err) {
			errorHandler(err);
		}
	};

	return isSubmitted ? (
		<FormSuccessfullySent onClick={handleStart} />
	) : (
		<div className={styles.form_container}>
			<div className={styles.form_section}>
				<span className={styles.form_label}>
					{formatMessage(verificationMessages.general_information)}
				</span>
				<Input
					name="name"
					value={formBody.name ?? ""}
					labelValue={formatMessage(verificationMessages.first_name)}
					onChange={onInputChange}
					error={formErrors?.name}
				/>
				<Input
					name="second_name"
					value={formBody.second_name ?? ""}
					labelValue={formatMessage(verificationMessages.last_name)}
					onChange={onInputChange}
					error={formErrors?.second_name}
				/>
				<Input
					name="middle_name"
					value={formBody.middle_name ?? ""}
					labelValue={`${formatMessage(verificationMessages.middle_name)} (${formatMessage(
						commonMessages.optional,
					)})`}
					onChange={onInputChange}
					error={formErrors?.middle_name}
				/>
				<FormDateInput
					title={formatMessage(verificationMessages.date_of_birth)}
					name="birthday"
					disabled={false}
					isBefore
					value={formBody.birthday ? new Date(formBody.birthday) : undefined}
					onChange={onDateChange}
					onTouch={resetErrors}
					error={formErrors.birthday as string}
				/>
				<div className={styles.form_gender}>
					<span className={styles.label}>{formatMessage(verificationMessages.gender)}</span>
					<div className={styles.input}>
						<RadioChoice
							name="gender"
							label={formatMessage(verificationMessages.male)}
							choice={`${GenderEnum.MALE}`}
							onChange={onInputChange}
							value={`${formBody.gender}`}
							error={!!formErrors?.gender}
						/>
						<RadioChoice
							name="gender"
							label={formatMessage(verificationMessages.female)}
							choice={`${GenderEnum.FEMALE}`}
							onChange={onInputChange}
							value={`${formBody.gender}`}
							error={!!formErrors?.gender}
						/>
					</div>
					{formErrors?.gender && (
						<span className={classnames(stylesInput.help_text, stylesInput.error)}>
							{formErrors?.gender}
						</span>
					)}
				</div>
				<div className={styles.form_phone}>
					<span>{formatMessage(verificationMessages.contact_number)}</span>
					<PhoneCountryInput
						value={formBody.contact_phone_number}
						onChange={onPhoneChange}
						label={medium ? undefined : formatMessage(commonMessages.enter_phone_number)}
						error={formErrors?.contact_phone_number ?? undefined}
					/>
				</div>
			</div>
			<div className={styles.form_section}>
				<span className={styles.form_label}>{formatMessage(verificationMessages.document)}</span>
				<Select
					isClearable
					isSearchable={false}
					value={documentList.find((d) => +d.value === formBody.identity_document_type)}
					onChange={onDocumentSelect}
					options={documentList}
					error={formErrors?.identity_document_type}
					label={formatMessage(verificationMessages.document)}
					getOptionLabel={(option: ISelectOption): string => option.label}
					getOptionValue={(option: ISelectOption): string => option.value}
				/>
				<CountrySelect
					name="country"
					value={formBody.issuing_country}
					onSelect={onCountryChange}
					label={formatMessage(securityMessages.country)}
					locale={locale}
					error={formErrors?.issuing_country}
				/>
				<Input
					name="document_number"
					labelValue={formatMessage(verificationMessages.document_number)}
					onChange={onInputChange}
					value={formBody.document_number ?? ""}
					error={formErrors?.document_number}
				/>
				<FormDateInput
					title={formatMessage(verificationMessages.document_expiry_date)}
					name="expire_date"
					value={formBody.expire_date ? new Date(formBody.expire_date) : undefined}
					disabled={formBody.non_expiring_document ?? false}
					onChange={onDateChange}
					onTouch={resetErrors}
					error={formErrors?.expire_date as string}
					isAfter
					additionalNode={
						<CheckBox
							name="non_expiring_document"
							checked={formBody.non_expiring_document ?? false}
							onChange={onCheck}
						>
							{formatMessage(verificationMessages.documents_without_expiration_date)}
						</CheckBox>
					}
				/>
				<div className={styles.form_document_upload}>
					{isDocumentTypeCard ? (
						<>
							<DocumentUpload
								verified={!!formBody.identity_front_document}
								src={theme === "light" ? DocImage : DocImageDark}
								message={formatMessage(verificationMessages.upload_front_side_photo)}
								alt="Identity Front Document"
								level={LevelEnum.Personal}
								documentVariant={VariantDocumentsEnum.IdentityFront}
								variant={VariantEnum.Document}
								error={formErrors?.identity_front_document ?? undefined}
								onClick={resetErrors}
								update={updateDocuments}
							/>
							<DocumentUpload
								verified={!!formBody.identity_back_document}
								src={theme === "light" ? DocImage : DocImageDark}
								message={formatMessage(verificationMessages.upload_backside_photo)}
								alt="Identity Back Document"
								level={LevelEnum.Personal}
								documentVariant={VariantDocumentsEnum.IdentityBack}
								variant={VariantEnum.Document}
								error={formErrors?.identity_back_document ?? undefined}
								onClick={resetErrors}
								update={updateDocuments}
							/>
						</>
					) : (
						<DocumentUpload
							verified={!!formBody.identity_front_document}
							src={theme === "light" ? DocImage : DocImageDark}
							message={formatMessage(verificationMessages.upload_document_photo)}
							alt="Identity Document"
							documentVariant={VariantDocumentsEnum.IdentityFront}
							level={LevelEnum.Personal}
							variant={VariantEnum.Document}
							error={formErrors?.identity_front_document ?? undefined}
							onClick={resetErrors}
							update={updateDocuments}
						/>
					)}
					<DocumentUpload
						verified={!!formBody.selfie}
						src={theme === "light" ? SelfieImage : SelfieImageDark}
						message={formatMessage(verificationMessages.upload_selfie_with_document)}
						alt="Selfie"
						documentVariant={VariantDocumentsEnum.Selfie}
						level={LevelEnum.Personal}
						variant={VariantEnum.Selfie}
						error={formErrors?.selfie ?? undefined}
						onClick={resetErrors}
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

export default observer(IdentityForm);
