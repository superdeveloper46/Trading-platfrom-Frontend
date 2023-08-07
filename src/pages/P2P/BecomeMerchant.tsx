import React, { useEffect, useState } from "react";
import cn from "classnames";
import { MessageDescriptor, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import styles from "styles/pages/P2P/Merchant.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Input from "components/UI/Input";
import UploadInput, { IDropzoneResult } from "components/UploadInput";
import Button from "components/UI/Button";
import listingMessages from "messages/listing";
import RadioChoice from "components/UI/Radio";
import commonMessages from "messages/common";
import { YesNoEnum, IError } from "types/general";
import {
	IMerchantRequestFormBody,
	IMerchantRequestFormErrorsBody,
	MerchantStatusEnum,
} from "types/p2p";
import {
	INITIAL_MERCHANT_REQUEST_FORM,
	MAX_VIDEO_FILE_SIZE,
	MERCHANT_REQUEST_VALIDATION_SCHEMA,
} from "constants/p2p";
import { AnyObjectSchema } from "yup";
import { getErrorFromYupValidationRes } from "utils/getter";
import errorHandler from "utils/errorHandler";
import { handleFormErrors } from "utils/form";
import P2PService, { useMerchantRequestStatus } from "services/P2PService";
import { routes } from "constants/routing";
import { queryVars } from "constants/query";
import LoadingSpinner from "components/UI/LoadingSpinner";
import p2pMessages from "messages/p2p";

const BecomeMerchant = () => {
	const { formatMessage } = useIntl();
	const localeNavigate = useNavigate();

	const title = `P2P ${formatMessage(p2pMessages.become_merchant)} | ALP.COM`;

	const { data: status, isFetching } = useMerchantRequestStatus();

	const [formBody, setFormBody] = useState<IMerchantRequestFormBody>(INITIAL_MERCHANT_REQUEST_FORM);
	const [formErrors, setFormErrors] = useState<IMerchantRequestFormErrorsBody>({});

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setFormBody((prevState) => ({
			...prevState,
			[queryVars.is_familiar]: e.target.value as YesNoEnum,
		}));
	};
	const onUpload = (name: keyof Pick<IMerchantRequestFormBody, "video">, res: IDropzoneResult) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: res.files[0],
		}));
		res.resolve();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: e.target.value,
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
				setFormErrors(getErrorFromYupValidationRes<IMerchantRequestFormErrorsBody>(err));
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
			validateStep(MERCHANT_REQUEST_VALIDATION_SCHEMA, resolve, reject);
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
					P2PService.merchantRequest(formData)
						.then(() => {
							toast.success("Merchant request sent!");
							localeNavigate(routes.p2p.merchant);
						})
						.catch(handleErrors)
						.finally(() => setIsSubmitting(false));
				}
			})
			.catch((err) => console.log(err));

	useEffect(() => {
		if (
			status &&
			![MerchantStatusEnum.DEFAULT, MerchantStatusEnum.CANCELLED_BY_MODERATOR].includes(
				status.status,
			)
		) {
			localeNavigate(routes.p2p.merchant);
		}
	}, [status?.status]);

	return isFetching && !(status?.status === MerchantStatusEnum.DEFAULT) ? (
		<LoadingSpinner />
	) : (
		<div className={styles.form_container}>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<span className={styles.card_title}>P2P Merchant Application Form</span>
			<div className={styles.form_block}>
				<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
					Enter your Telegram tag. Our Agents might use it for communication with you:
				</span>
				<Input
					labelValue="@telegram"
					value={formBody.telegram}
					error={formErrors.telegram}
					name={queryVars.telegram}
					onChange={handleInputChange}
				/>
			</div>
			<div className={styles.form_block}>
				<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
					I am familiar with OTC/P2P Trading
				</span>
				<div className={styles.switch_container}>
					<RadioChoice
						onChange={handleRadioChange}
						label={formatMessage(commonMessages.yes)}
						value={formBody.is_familiar}
						name="is_already_listed"
						choice={YesNoEnum.Yes}
					/>
					<RadioChoice
						onChange={handleRadioChange}
						label={formatMessage(commonMessages.no)}
						value={formBody.is_familiar}
						name="is_already_listed"
						choice={YesNoEnum.No}
					/>
				</div>
				{formErrors.is_familiar && <span className={styles.error}>{formErrors.is_familiar}</span>}
			</div>
			<div className={styles.form_block}>
				<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
					Please hold the front of the ID card and shoot a video with the following content:
				</span>
				<div className={styles.instruction_container}>
					I am “Your Name”, I trade Bitcoin / Ethereum and other cryptocurrencies. I promise that
					the source of funds is legal, and I guarantee that any information or materials submitted
					is true, legal, and compete. Cryptocurrency or fiat money is not used for any illegal
					purpose. I bear legal responsibility for my actions.
				</div>
			</div>
			<div className={styles.video_container} />
			<UploadInput
				maxSize={MAX_VIDEO_FILE_SIZE}
				onUpload={(data) => onUpload(queryVars.video, data)}
				accept={{
					"application/mp4": [".mp4", ".mkv", ".rmvb", ".mov"],
					"video/mp4": [".mp4"],
				}}
				error={formErrors.video}
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
								{formBody.video
									? formBody.video.name
									: "Upload .mp4 , .rmvb , .mkv , .mov , up to 10 mb. The recommended duration is less than 3 minutes and the resolution be over 360p."}
							</span>
						</div>
					)
				}
			</UploadInput>
			<Button
				onClick={handleSubmit}
				isLoading={isSubmitting}
				className={styles.submit_btn}
				fullWidth
				label="Submit"
			/>
		</div>
	);
};

export default BecomeMerchant;
