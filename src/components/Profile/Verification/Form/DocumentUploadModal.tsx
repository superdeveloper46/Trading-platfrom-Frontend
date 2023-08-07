import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import stylesModal from "styles/components/UI/Modal.module.scss";
import styles from "styles/components/Profile/Verification/DocumentUploadModal.module.scss";
import verificationMessages from "messages/verification";
import commonMessages from "messages/common";
import Modal, { ActionGroup, BodyContainer, Content, Footer } from "components/UI/Modal";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import DocImage from "assets/images/profile/verification/doc.svg";
import DocImageDark from "assets/images/profile/verification/doc-dark.svg";
import DocInvalidImage from "assets/images/profile/verification/doc-invalid.svg";
import DocInvalidImageDark from "assets/images/profile/verification/doc-invalid-dark.svg";
import { useDropzone } from "react-dropzone";
import SelfieImage from "assets/images/profile/verification/selfie.svg";
import SelfieImageDark from "assets/images/profile/verification/selfie-dark.svg";
import SelfieInvalidImage from "assets/images/profile/verification/selfie-invalid.svg";
import SelfieInvalidImageDark from "assets/images/profile/verification/selfie-invalid-dark.svg";
import { MAX_UPLOAD_FILE_SIZE_MB } from "utils/constants";
import { ThemeEnum } from "types/theme";
import SuccessScreen from "components/UI/SuccessScreen";
import Button, { ButtonsGroup } from "components/UI/Button";
import { validateFileSize } from "utils/fileHelper";
import { IFile, LevelEnum, VariantDocumentsEnum, VariantEnum } from "types/verification";
import classnames from "classnames";
import ButtonMicro from "components/UI/Button/ButtonMicro";
import errorHandler from "utils/errorHandler";
import { isSafari } from "utils/browser";

interface IProps {
	variant: VariantEnum;
	documentVariant: VariantDocumentsEnum;
	level: LevelEnum;
	isOpen: boolean;
	amountOfFiles?: number;
	update?(data: FormData): void;
	onClose(): void;
}

const DocumentUploadModal: React.FC<IProps> = ({
	variant,
	documentVariant,
	level,
	amountOfFiles = 1,
	update,
	isOpen,
	onClose,
}) => {
	const { formatMessage } = useIntl();
	const {
		global: { theme },
	} = useMst();

	const [files, setFiles] = useState<IFile[]>([]);
	const [fileError, setFileError] = useState<string>("");
	const [isUploading, setUploading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const isDocument = variant === "document";
	const isSelfie = variant === "selfie";
	const isLight = theme === ThemeEnum.Light;

	useEffect(() => {
		setIsSuccessful(false);
	}, [isOpen]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const acceptedFile = acceptedFiles.length > 0 ? acceptedFiles[0] : null;
			if (!acceptedFile) {
				setFileError(formatMessage(commonMessages.invalid_file_type));
				return;
			}
			if (!validateFileSize(acceptedFile, MAX_UPLOAD_FILE_SIZE_MB)) {
				setFileError(
					`${formatMessage(verificationMessages.maximum_size)}: ${MAX_UPLOAD_FILE_SIZE_MB}MB`,
				);
				return;
			}
			const reader = new FileReader();
			reader.readAsDataURL(acceptedFile);
			reader.onload = () => {
				const file: IFile = {
					file: acceptedFile,
					preview: reader.result,
				};
				if (file === null) return;
				setFiles((state: IFile[]) => [...state, file]);
				setUploading(false);
			};
			reader.onerror = () => {
				console.error(reader.error);
			};
			setFileError("");
		},
		[variant, level],
	);

	const handleSave = async () => {
		try {
			if (!files.length) return;

			setUploading(true);
			const data = new FormData();
			switch (level) {
				case LevelEnum.Personal:
					if (isDocument) {
						const file = files[0]?.file;
						if (file != null) {
							data.append(documentVariant, file);
						}
					}
					if (isSelfie) {
						const selfie = files[0]?.file;
						if (selfie != null) {
							data.append(VariantDocumentsEnum.Selfie, selfie);
						}
					}

					break;
				case LevelEnum.Address:
					if (files[0].file != null) {
						data.append("document", files[0].file);
					}
					break;
				case LevelEnum.Finance:
					if (files[0].file != null) {
						data.append("document", files[0].file);
					}
					break;
				default:
					break;
			}
			await update?.(data);
			setIsSuccessful(true);
			setUploading(false);
		} catch (err: any) {
			setIsSuccessful(false);
			if (!err) return;
			errorHandler(err);
		} finally {
			setUploading(false);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true,
		accept: {
			"image/jpeg": [".jpeg", ".png", ".jpg"],
		},
	});

	const onDeleteFile = (index: number) => {
		setFiles((f) => {
			f.splice(index, 1);
			return [...f];
		});
	};

	return (
		<Modal
			iconCode="camera_on"
			className={styles.modal_container}
			label={
				isDocument
					? formatMessage(verificationMessages.upload_document_photo)
					: formatMessage(verificationMessages.upload_selfie_with_document)
			}
			onClose={onClose}
			isOpen={isOpen}
		>
			{isSuccessful && (
				<div className={stylesModal.content}>
					<SuccessScreen>{formatMessage(commonMessages.photo_added_successfully)}</SuccessScreen>
				</div>
			)}

			{!isSuccessful && (
				<>
					<BodyContainer>
						<Content className={styles.modal_content}>
							<div className={styles.modal_label}>
								{isDocument
									? formatMessage(verificationMessages.upload_a_photo_of_your_documents)
									: formatMessage(verificationMessages.upload_a_selfie_with_documents)}
							</div>
							<div className={styles.modal_instruction}>
								<i className={classnames(styles.check, "ai ai-check_filled")} />
								<i className={classnames(styles.cancel, "ai ai-cancel_filled")} />
								<img
									className={styles.check}
									src={
										isDocument
											? isLight
												? DocImage
												: DocImageDark
											: isLight
											? SelfieImage
											: SelfieImageDark
									}
									width="160px"
									height="126px"
									alt="Doc"
								/>
								<img
									className={styles.cancel}
									src={
										isDocument
											? isLight
												? DocInvalidImage
												: DocInvalidImageDark
											: isLight
											? SelfieInvalidImage
											: SelfieInvalidImageDark
									}
									width="160px"
									height="126px"
									alt="Doc"
								/>
								<span>
									{formatMessage(verificationMessages.supported_file_types)}
									&nbsp; JPG, PNG. {formatMessage(verificationMessages.maximum_size)}
									:&nbsp;
									{MAX_UPLOAD_FILE_SIZE_MB} MB
								</span>
							</div>
							{files.length !== 0 && (
								<div className={classnames(styles.modal_upload_file, "aa-fade-in")}>
									{files.map((file: IFile, index) => (
										<div
											key={index}
											className={classnames(styles.modal_upload_file_preview, "aa-fade-in")}
										>
											<div className={styles.modal_upload_file_preivew_content}>
												<ButtonMicro
													className={styles.delete_button}
													onClick={() => onDeleteFile(index)}
												>
													<i className="ai ai-close" />
												</ButtonMicro>
												<img
													src={file.preview as string}
													alt={`preview${index}_${file?.file?.name}`}
													width="250"
													height="140"
												/>
											</div>
										</div>
									))}
								</div>
							)}
							{files.length < amountOfFiles && (
								<div className={styles.upload_file_zone_container}>
									<label
										htmlFor="upload_input"
										{...getRootProps()}
										className={classnames(styles.modal_upload_file_zone, {
											[styles.safari]: isSafari,
										})}
									>
										<i className="ai ai-image" />
										{isDragActive
											? formatMessage(verificationMessages.drop_the_file_here)
											: formatMessage(
													verificationMessages.drag_and_drop_file_or_select_on_your_device,
											  )}
										<input
											id="upload_input"
											name="upload_input"
											type="file"
											{...getInputProps()}
											style={{ display: isSafari ? "block" : "none" }}
											accept="image/png, image/jpeg, image/jpg"
										/>
									</label>
									{fileError && (
										<div className={styles.modal_upload_file_error}>
											<i className="ai ai-warning" />
											{fileError}
										</div>
									)}
								</div>
							)}
						</Content>
					</BodyContainer>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								label={formatMessage(commonMessages.save)}
								onClick={handleSave}
								isLoading={isUploading}
								disabled={!files.length}
							/>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								onClick={onClose}
								disabled={isUploading}
								label={formatMessage(commonMessages.cancel)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default observer(DocumentUploadModal);

interface IDocumentUploadProps {
	verified: boolean;
	src: string;
	alt: string;
	message: string;
	level: LevelEnum;
	variant: VariantEnum;
	disabled?: boolean;
	error?: string | string[];
	amountOfFiles?: number;
	update?(data: FormData): void;
	onClick?(): void;
	documentVariant: VariantDocumentsEnum;
}

export const DocumentUpload: React.FC<IDocumentUploadProps> = ({
	verified,
	src,
	documentVariant,
	message,
	alt,
	variant,
	amountOfFiles = 1,
	level,
	disabled,
	error,
	update,
	onClick,
}) => {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	return (
		<>
			{isModalOpen && (
				<DocumentUploadModal
					amountOfFiles={amountOfFiles}
					isOpen={isModalOpen}
					onClose={() => setModalOpen(false)}
					variant={variant}
					level={level}
					update={update}
					documentVariant={documentVariant}
				/>
			)}
			<div className={styles.form_preview_image}>
				{verified && <i className="ai ai-check_outline" />}
				{!verified && <img src={src} width="120" height="94" alt={alt} />}
			</div>
			<button
				className={classnames(styles.form_upload_button, {
					[styles.verified]: verified,
					[styles.error]: !disabled && !!error,
					[styles.disabled]: disabled,
				})}
				type="button"
				onClick={() => {
					if (onClick) {
						onClick();
					}
					if (!disabled) {
						setModalOpen(true);
					}
				}}
			>
				{message}
			</button>
		</>
	);
};
