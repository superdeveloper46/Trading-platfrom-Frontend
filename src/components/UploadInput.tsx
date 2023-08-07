import cn from "classnames";
import React, { useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import Spinner from "components/UI/Spinner";
import listingMessages from "messages/listing";
import styles from "styles/components/UI/UploadInput.module.scss";
import { useIntl } from "react-intl";

export interface IDropzoneResult {
	files: File[];
	resolve: (...args: any[]) => void;
	reject: (...args: any[]) => void;
}

interface IProps {
	className?: string;
	inputClassname?: string;
	onUpload?: (args: IDropzoneResult) => void;
	onSuccess?: (...args: any[]) => void;
	onFailure?: (...args: any[]) => void;
	onBlur?: (...args: any[]) => void;
	onDropReject?: (fileRejections: FileRejection[]) => void;
	accept?: { [key: string]: string[] };
	multiple?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	children: (data: any) => React.ReactNode | React.ReactNode[];
	noDrag?: boolean;
	showLoader?: boolean;
	maxSize?: number;
	readOnly?: boolean;
	error?: string | string[];
	showErrors?: boolean;
}

const UploadInput: React.FC<IProps> = ({
	onUpload,
	onSuccess,
	onFailure,
	onDropReject,
	onBlur,
	className,
	inputClassname,
	accept,
	multiple,
	readOnly,
	children,
	onClick,
	noDrag = false,
	showLoader = true,
	maxSize,
	error,
	showErrors = false,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { formatMessage } = useIntl();

	const handleDrop = React.useCallback(
		(files: File[], fileRejections: FileRejection[]) => {
			if (fileRejections && fileRejections.length) {
				if (typeof onDropReject === "function") {
					onDropReject(fileRejections);
				}

				fileRejections.forEach((file) => {
					file.errors.forEach((err) => {
						if (err.code === "file-too-large") {
							toast.error(
								formatMessage(listingMessages.max_file_size_error, {
									size: (maxSize || 0) / 1024 / 1024,
								}),
							);
						}

						if (err.code === "file-invalid-type") {
							toast.error(formatMessage(listingMessages.wrong_file_type));
						}
					});
				});
			}

			if (files.length && typeof onUpload === "function") {
				return new Promise((resolve, reject) => {
					setIsLoading(true);
					onUpload({ files, resolve, reject });
				})
					.then((response) => {
						if (typeof onSuccess === "function") {
							onSuccess(files, response);
						}
					})
					.catch((err) => {
						if (typeof onFailure === "function") {
							onFailure(err);
						}
					})
					.finally(() => {
						setIsLoading(false);
					});
			}

			return null;
		},
		[onUpload, onSuccess, onFailure, onDropReject],
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
		maxSize,
		noDrag,
		onDrop: handleDrop,
		accept: accept || {},
		multiple,
	});

	const renderError = useMemo(() => {
		if (showErrors && error) {
			return Array.isArray(error) ? (
				<div className={styles.error_message}>
					{error.map((e) => (
						<span key={e}>{e}</span>
					))}
				</div>
			) : (
				<span className={styles.error_message}>{error}</span>
			);
		}

		return null;
	}, [showErrors, error]);

	return (
		<div className={cn(className, styles.container)}>
			<div
				{...getRootProps({ onClick, onBlur })}
				className={cn(styles.upload_input, inputClassname, {
					[styles.active_drag]: isDragActive,
					[styles.error]: !!error || isDragReject,
					[styles.read_only]: readOnly,
				})}
			>
				{showLoader && isLoading ? (
					<Spinner />
				) : (
					<>
						<input {...getInputProps()} />
						{children({ isDragActive, isDragReject })}
					</>
				)}
			</div>
			{renderError}
		</div>
	);
};

export default UploadInput;
