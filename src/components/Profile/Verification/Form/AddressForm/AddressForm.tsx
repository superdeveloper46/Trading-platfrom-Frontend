import { useMst } from "models/Root";
import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import commonMessages from "messages/common";
import securityMessages from "messages/security";
import CountrySelect from "components/UI/CountrySelect";
import Input from "components/UI/Input";
import Button from "components/UI/Button";
import Select, { ISelectOption } from "components/UI/Select";
import { observer } from "mobx-react-lite";
import { LevelEnum, VariantDocumentsEnum, VariantEnum } from "types/verification";
import DocImage from "assets/images/profile/verification/doc.svg";
import DocImageDark from "assets/images/profile/verification/doc-dark.svg";
import { ThemeEnum } from "types/theme";
import useAddressForm from "./useAddressForm";
import { FormSuccessfullySent } from "../FormCommon";
import { DocumentUpload } from "../DocumentUploadModal";

const AddressForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { locale, theme },
	} = useMst();
	const {
		isSubmitted,
		isSubmitting,
		formErrors,
		resetErrors,
		documentList,
		handleSubmit,
		onCountryChange,
		formBody,
		onDocumentSelect,
		updateDocuments,
		onInputChange,
	} = useAddressForm();

	return isSubmitted ? (
		<FormSuccessfullySent />
	) : (
		<div className={styles.form_container}>
			<div className={styles.form_section}>
				<span className={styles.form_label}>
					{formatMessage(verificationMessages.residential_address)}
				</span>
				<CountrySelect
					name="country"
					label={formatMessage(securityMessages.country)}
					locale={locale}
					value={formBody.country}
					onSelect={onCountryChange}
					error={formErrors.country}
				/>
				<div className={styles.form_address}>
					<Input
						name="address"
						value={formBody.address ?? ""}
						onChange={onInputChange}
						labelValue={formatMessage(verificationMessages.residential_address)}
						error={formErrors.address}
					/>
					<Input
						name="region"
						value={formBody.region ?? ""}
						onChange={onInputChange}
						labelValue={formatMessage(verificationMessages.state_province_region)}
						error={formErrors.region}
					/>
					<Input
						name="postal_code"
						value={formBody.postal_code ?? ""}
						onChange={onInputChange}
						labelValue={formatMessage(verificationMessages.zip_postal_code)}
						error={formErrors.postal_code}
					/>
					<Input
						name="city"
						value={formBody.city ?? ""}
						onChange={onInputChange}
						labelValue={formatMessage(verificationMessages.city)}
						error={formErrors.city}
					/>
				</div>
			</div>
			<div className={styles.form_section}>
				<span className={styles.form_label}>{formatMessage(verificationMessages.document)}</span>
				<Select
					isClearable
					isSearchable={false}
					error={formErrors.document_type}
					value={documentList.find((d) => d.value === formBody.document_type)}
					options={documentList}
					onChange={onDocumentSelect}
					label={formatMessage(verificationMessages.document)}
					getOptionLabel={(option: ISelectOption): string => option.label}
					getOptionValue={(option: ISelectOption): string => option.value}
				/>
				<div className={styles.form_document_upload}>
					<DocumentUpload
						verified={!!formBody.document}
						error={formErrors.document ?? undefined}
						src={theme === ThemeEnum.Light ? DocImage : DocImageDark}
						message={formatMessage(verificationMessages.upload_document_photo)}
						alt="DocImage"
						variant={VariantEnum.Document}
						documentVariant={VariantDocumentsEnum.IdentityFront}
						level={LevelEnum.Address}
						onClick={resetErrors}
						update={updateDocuments}
					/>
				</div>
			</div>
			<Button
				variant="filled"
				color="primary"
				fullWidth
				isLoading={isSubmitting}
				label={formatMessage(commonMessages.submit)}
				onClick={handleSubmit}
			/>
		</div>
	);
};

export default observer(AddressForm);
