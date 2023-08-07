import React, { ChangeEvent, useMemo, useState } from "react";
import cn from "classnames";
import { MessageDescriptor, useIntl } from "react-intl";
import { AnyObjectSchema } from "yup";

import { IListingRequestFormBody, IListingRequestFormErrorsBody, StepsEnum } from "types/listing";
import {
	GENERAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA,
	GENERAL_STEP_KEYS,
	INITIAL_LISTING_REQUEST_FORM,
	MarketValuesEnum,
	MAX_LEGAL_OPINION_FILE_SIZE,
	MAX_LOGO_FILE_SIZE,
	TECH_STEP_KEYS,
	TECHNICAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA,
	TGeneralStepKey,
	TTechStepKey,
} from "constants/listing";
import listingMessages from "messages/listing";
import commonMessages from "messages/common";
import paradiseMessages from "messages/paradise";
import Input from "components/UI/Input";
import Select, { ISelectOption } from "components/UI/Select";
import CheckBox from "components/UI/CheckBox";
import RadioChoice from "components/UI/Radio";
import Button from "components/UI/Button";
import Stepper, { IStep } from "components/Stepper";
import ListingService from "services/ListingService";
import { getErrorFromYupValidationRes } from "utils/getter";
import errorHandler from "utils/errorHandler";
import { handleFormErrors } from "utils/form";
import styles from "styles/pages/ListingRequest.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import UploadInput, { IDropzoneResult } from "components/UploadInput";
// import ListingRequestSuccessModal from "./ListingRequestSuccessModal";
import SuccessScreen from "components/UI/SuccessScreen";
import { IError, YesNoEnum } from "types/general";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";

const ListingRequestForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const [step, setStep] = useState<StepsEnum>(StepsEnum.GeneralInfo);

	const [formBody, setFormBody] = useState<IListingRequestFormBody>(INITIAL_LISTING_REQUEST_FORM);
	const [formErrors, setFormErrors] = useState<IListingRequestFormErrorsBody>({});

	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const MARKET_OPTIONS: ISelectOption[] = [
		{
			value: MarketValuesEnum.BTCPair,
			label: formatMessage(listingMessages.btc_pair),
		},
		{
			value: MarketValuesEnum.USDTPair,
			label: formatMessage(listingMessages.usdt_pair),
		},
	];

	const marketsValue = useMemo(
		() =>
			formBody.markets?.map((value) => {
				const val = MARKET_OPTIONS.find((o) => o.value === value);

				return {
					value: val ? val.value : "",
					label: val ? val?.label : "",
				};
			}),
		[formBody.markets],
	);

	const isGeneralStepValid = useMemo(
		() => GENERAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA(formatMessage).isValidSync(formBody),
		[formBody],
	);

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

	const handleMarketsChange = (o: ISelectOption[]) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			markets: o.map(({ value }) => value),
		}));
	};

	const handleSecurityCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;

		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			is_not_security_token: checked,
		}));
	};

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		const name = e.target.name;
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: (value as YesNoEnum) === YesNoEnum.Yes,
		}));
	};

	const onUpload = (
		name: keyof Pick<IListingRequestFormBody, "icon" | "legal_opinion">,
		res: IDropzoneResult,
	) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: res.files[0],
		}));
		res.resolve();
	};

	const handleBackClick = () => {
		if (step === 0) {
			return localeNavigate(routes.listing.root);
		}
		return setStep((prevState) => prevState - 1);
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
				setFormErrors(getErrorFromYupValidationRes<IListingRequestFormErrorsBody>(err));
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

			const is_general_step_intersection = Object.keys(nextErrors).some((k) =>
				GENERAL_STEP_KEYS.includes(k as TGeneralStepKey),
			);
			const is_tech_step_intersection = Object.keys(nextErrors).some((k) =>
				TECH_STEP_KEYS.includes(k as TTechStepKey),
			);

			if (is_general_step_intersection) {
				setStep(StepsEnum.GeneralInfo);
			} else if (is_tech_step_intersection) {
				setStep(StepsEnum.TechnicalInfo);
			}
		}
	};

	const handleSubmitButton = () => {
		if (step === StepsEnum.GeneralInfo) {
			return new Promise((resolve, reject) => {
				validateStep(GENERAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA, resolve, reject);
			})
				.then(() => setStep((prevState) => prevState + 1))
				.catch((err) => console.log(err));
		}
		if (step === StepsEnum.TechnicalInfo) {
			return new Promise((resolve, reject) => {
				validateStep(TECHNICAL_INFO_LISTING_REQUEST_VALIDATION_SCHEMA, resolve, reject);
			})
				.then(() => {
					const formData = new FormData();
					const { is_not_security_token: _, ...body } = formBody;

					Object.entries(body).forEach(([key, value]) =>
						value !== null && value !== undefined
							? formData.append(key, value as string | Blob)
							: null,
					);

					if (!isSubmitting) {
						setIsSubmitting(true);
						ListingService.sendRequest(formData)
							.then(() => {
								// setIsModalOpened(true);
								setIsSuccess(true);
							})
							.catch(handleErrors)
							.finally(() => setIsSubmitting(false));
					}
				})
				.catch((err) => console.log(err));
		}

		return null;
	};

	const stepsInfo = {
		[StepsEnum.GeneralInfo]: {
			title: formatMessage(listingMessages.step_1),
			description: formatMessage(listingMessages.general_info_step_desc),
		},
		[StepsEnum.TechnicalInfo]: {
			title: formatMessage(listingMessages.step_2),
			description: formatMessage(listingMessages.technical_info_step_desc),
		},
	};

	const stepperArray: IStep[] = [
		{
			id: StepsEnum.GeneralInfo,
			label: formatMessage(listingMessages.general_info_title),
			onClick: () => setStep(StepsEnum.GeneralInfo),
		},
		{
			id: StepsEnum.TechnicalInfo,
			label: formatMessage(listingMessages.technical_info_title),
			onClick: () => setStep(StepsEnum.TechnicalInfo),
			disabled: !isGeneralStepValid,
		},
	];

	const titleContainer = useMemo(
		() => (
			<div className={styles.step_heading}>
				<span className={styles.step_title}>
					{isSuccess ? formatMessage(paradiseMessages.success_operation) : stepsInfo[step].title}
				</span>
				<span className={styles.step_desc}>
					{isSuccess
						? formatMessage(listingMessages.listing_request_sent)
						: stepsInfo[step].description}
				</span>
			</div>
		),
		[stepsInfo, step, isSuccess],
	);

	const generalInfoForm = (
		<>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.project_name}
					name="project_name"
					error={formErrors.project_name}
					labelValue={formatMessage(listingMessages.project_name)}
					placeholder={formatMessage(listingMessages.project_name_placeholder)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.currency_name}
					name="currency_name"
					error={formErrors.currency_name}
					labelValue={formatMessage(listingMessages.token_full_name)}
					placeholder={formatMessage(listingMessages.enter_full_name)}
				/>
			</div>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.currency_code}
					name="currency_code"
					error={formErrors.currency_code}
					labelValue={formatMessage(listingMessages.coin_ticker)}
					placeholder={formatMessage(listingMessages.ticker)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.website_url}
					name="website_url"
					error={formErrors.website_url}
					labelValue={formatMessage(listingMessages.website)}
					placeholder={formatMessage(listingMessages.website_url)}
				/>
			</div>
			<div className={styles.form_input_group}>
				<Select
					onChange={handleMarketsChange}
					isMulti
					options={MARKET_OPTIONS}
					value={marketsValue}
					label={formatMessage(listingMessages.markets)}
					placeholder={formatMessage(listingMessages.choose_markets)}
					error={formErrors.markets}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.coin_market_cap_url}
					name="coin_market_cap_url"
					error={formErrors.coin_market_cap_url}
					labelValue={formatMessage(listingMessages.coin_market_cap)}
					placeholder={formatMessage(listingMessages.coin_market_cap_url)}
				/>
			</div>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.email}
					name="email"
					error={formErrors.email}
					labelValue={formatMessage(listingMessages.contact_email)}
					placeholder={formatMessage(listingMessages.contact_email_placeholder)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.telegram_contact}
					name="telegram_contact"
					error={formErrors.telegram_contact}
					labelValue={formatMessage(listingMessages.contact_telegram)}
					placeholder={formatMessage(listingMessages.contact_telegram_placeholder)}
				/>
			</div>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.telegram_community}
					name="telegram_community"
					error={formErrors.telegram_community}
					labelValue={formatMessage(listingMessages.telegram_community)}
					placeholder={formatMessage(listingMessages.telegram_community_placeholder)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.twitter}
					name="twitter"
					error={formErrors.twitter}
					labelValue={formatMessage(listingMessages.twitter_url)}
					placeholder={formatMessage(listingMessages.twitter_url_placeholder)}
				/>
			</div>
		</>
	);

	const technicalInfoForm = (
		<>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.blockchain_type}
					name="blockchain_type"
					error={formErrors.blockchain_type}
					labelValue={formatMessage(listingMessages.blockchain_type)}
					placeholder={formatMessage(listingMessages.blockchain_type_placeholder)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.explorer_url}
					name="explorer_url"
					error={formErrors.explorer_url}
					labelValue={formatMessage(listingMessages.blockexplorer)}
					placeholder={formatMessage(listingMessages.blockexplorer_placeholder)}
				/>
			</div>
			<div className={styles.form_input_group}>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.source_code_url}
					name="source_code_url"
					error={formErrors.source_code_url}
					labelValue={formatMessage(listingMessages.github_repo)}
					placeholder={formatMessage(listingMessages.github_repo_placeholder)}
				/>
				<Input
					onChange={handleInputChange}
					type="text"
					value={formBody.smart_contact_address}
					name="smart_contact_address"
					error={formErrors.smart_contact_address}
					labelValue={formatMessage(listingMessages.smart_contract_address)}
					placeholder={formatMessage(listingMessages.smart_contract_address_placeholder)}
				/>
			</div>
			<div className={cn(styles.form_input_group, styles.stretch)}>
				<UploadInput
					maxSize={MAX_LEGAL_OPINION_FILE_SIZE}
					onUpload={(data) => onUpload("legal_opinion", data)}
					accept={{ "application/pdf": [".pdf"] }}
					error={formErrors.legal_opinion}
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
									{formBody.legal_opinion
										? formBody.legal_opinion.name
										: formatMessage(listingMessages.upload_legal_opinion)}
								</span>
							</div>
						)
					}
				</UploadInput>
				<UploadInput
					maxSize={MAX_LOGO_FILE_SIZE}
					onUpload={(data) => onUpload("icon", data)}
					accept={{
						"image/svg+xml": [".svg", ".png", ".jpeg", ".jpg"],
						"image/png": [".png"],
						"image/jpeg": [".jpeg"],
						"image/jpg": [".jpg"],
					}}
					error={formErrors.icon}
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
									{formBody.icon
										? formBody.icon.name
										: formatMessage(listingMessages.upload_token_logo)}
								</span>
							</div>
						)
					}
				</UploadInput>
			</div>
			<CheckBox
				className={styles.checkbox}
				name="is_not_security_token"
				checked={formBody.is_not_security_token}
				onChange={handleSecurityCheckbox}
				required
				error={formErrors.is_not_security_token}
			>
				{formatMessage(listingMessages.confirm_that_token_is_not_security)}
			</CheckBox>
			<span className={styles.radio_group_title}>
				{formatMessage(listingMessages.are_you_listed)}
			</span>
			<div className={cn(styles.radio_group, styles.form_input_group)}>
				<RadioChoice
					className={styles.radio_item}
					onChange={handleRadioChange}
					label={formatMessage(commonMessages.yes)}
					value={formBody.is_already_listed ? YesNoEnum.Yes : YesNoEnum.No}
					name="is_already_listed"
					choice={YesNoEnum.Yes}
				/>
				<RadioChoice
					className={styles.radio_item}
					onChange={handleRadioChange}
					label={formatMessage(commonMessages.no)}
					value={formBody.is_already_listed ? YesNoEnum.Yes : YesNoEnum.No}
					name="is_already_listed"
					choice={YesNoEnum.No}
				/>
			</div>
		</>
	);

	const controlButtons = (
		<div className={cn(styles.form_input_group, styles.buttons_container)}>
			<Button
				className={styles.back}
				variant="text"
				color="primary"
				fullWidth
				onClick={handleBackClick}
				label={formatMessage(commonMessages.back_btn)}
			/>
			<Button
				variant="filled"
				color="primary"
				fullWidth
				onClick={handleSubmitButton}
				isLoading={isSubmitting}
				label={
					step === StepsEnum.TechnicalInfo
						? formatMessage(commonMessages.submit)
						: formatMessage(commonMessages.continue)
				}
			/>
		</div>
	);

	const currentStepForm = useMemo(() => {
		switch (step) {
			case StepsEnum.GeneralInfo:
				return generalInfoForm;
			case StepsEnum.TechnicalInfo:
				return technicalInfoForm;
			default:
				return null;
		}
	}, [step, technicalInfoForm, generalInfoForm]);

	return (
		<div className={cn(styles.form, pageStyles.card)}>
			<div className={cn(styles.form_inner, { [styles.isSuccess]: isSuccess })}>
				{isSuccess ? (
					<>
						{titleContainer}
						<SuccessScreen />
					</>
				) : (
					<>
						<Stepper active={step} className={styles.stepper} steps={stepperArray} />
						{titleContainer}
						{currentStepForm}
						{controlButtons}
					</>
				)}
			</div>
			{/* <ListingRequestSuccessModal isOpen={isModalOpened} onClose={() => setIsModalOpened(false)} /> */}
		</div>
	);
};

export default ListingRequestForm;
