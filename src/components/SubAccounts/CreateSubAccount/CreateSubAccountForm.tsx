import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import formMessages from "messages/form";
import subAccountsMessages from "messages/sub_accounts";
import accountsMessages from "messages/account";
import commonMessages from "messages/common";
import { useMst } from "models/Root";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import { ICreateSubAccountBody, ISubAccCreateFormBody } from "types/subAccounts";
import {
	INITIAL_SUB_ACC_CREATE_FORM,
	SUB_ACC_CREATE_FORM_VALIDATION_SCHEMA,
} from "constants/subAccounts";
import { handleFormErrors } from "utils/form";
import { getErrorFromYupValidationRes } from "utils/getter";
import SubAccountsService from "services/SubAccountsService";
import Button, { ButtonsGroup } from "components/UI/Button";
import SecureToken from "components/SecureToken";
import Input, { Appender, AppenderButton } from "components/UI/Input";
import CheckBox from "components/UI/CheckBox";
import Spinner from "components/UI/Spinner";
import Textarea from "components/UI/Textarea";
import InternalLink from "components/InternalLink";
import { SuccessScreen } from "components/UI/Modal";
import styles from "styles/pages/SubAccounts/CreateSubAccount.module.scss";
import subAccountStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import errorHandler from "utils/errorHandler";
import { IError } from "types/general";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const CreateSubAccountForm: React.FC = () => {
	const {
		account: { profileStatus },
	} = useMst();

	const [isLoginAvailable, setIsLoginAvailable] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [hasPassword, setHasPassword] = useState<boolean>(false);
	const [hasDescription, setHasDescription] = useState<boolean>(false);

	const [formBody, setFormBody] = useState<ISubAccCreateFormBody>(INITIAL_SUB_ACC_CREATE_FORM);
	const [formErrors, setFormErrors] = useState<Partial<ISubAccCreateFormBody>>(
		INITIAL_SUB_ACC_CREATE_FORM,
	);

	const [isLoginCheckingLoading, setIsLoginCheckingLoading] = useState<boolean>(false);
	const [isCreateSubAccRequestLoading, setIsCreateSubAccRequestLoading] = useState<boolean>(false);

	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [delayTime, setDelayTime] = useState<string>("");
	const [pincodeTriesLeft, setPincodeTriesLeft] = useState<number>(3);
	const [slug, setSlug] = useState<string | undefined>("");

	const localeNavigate = useLocaleNavigate();

	const { formatMessage } = useIntl();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));

		if (formErrors[name]) {
			setFormErrors((prevState) => ({
				...prevState,
				[name]: "",
			}));
		}

		if (name === "login") {
			setIsLoginAvailable(false);
		}
	};

	const handleHasPasswordActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasPassword(e.target.checked);

		if (!e.target.checked) {
			setFormBody((prevState) => ({
				...prevState,
				password: "",
			}));
		}
	};

	const handleHasDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasDescription(e.target.checked);

		if (!e.target.checked) {
			setFormBody((prevState) => ({
				...prevState,
				description: "",
			}));
		}
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formErrors));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));
		}
	};

	const handleSecureTokenSuccess = () => {
		setIsSuccessful(true);
	};

	const handleSlugChange = (slug: string) => {
		setSlug(slug);
	};

	const handleAuthStatusRes = (res: ISecureTokenRes): void => {
		if (res.is_ok) {
			setIsSuccessful(true);
		} else {
			if (res.is_totp_required && !res.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(res.totp_timeout);
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(res.pincode_timeout);
				setPincodeTriesLeft(res.pincode_tries_left);
			}
			setSlug(res.slug);
		}
	};

	const checkLoginAvailability = () => {
		if (!isLoginAvailable) {
			if (formBody.login) {
				setIsLoginCheckingLoading(true);
				SubAccountsService.checkLogin({ login: formBody.login })
					.then(() => {
						setIsLoginAvailable(true);
					})
					.catch(handleErrors)
					.finally(() => {
						setIsLoginCheckingLoading(false);
					});
			} else {
				setFormErrors((prevState) => ({
					...prevState,
					login: formatMessage(formMessages.required),
				}));
			}
		}
	};

	const resetState = () => {
		setFormBody({
			login: "",
			email: "",
			password: "",
			description: "",
		});
		setFormErrors({
			login: "",
			email: "",
			password: "",
			description: "",
		});
		setIsSuccessful(false);
		setHasPassword(false);
		setIsLoginAvailable(false);
		setTokenType("");
		setDelayTime("");
		setSlug("");
	};

	const handleCancelRequest = () => {
		if (slug) {
			SubAccountsService.cancelSubAccountRegisterRequest(slug).catch(errorHandler);
		}
		resetState();
	};

	const createSubAccount = async () => {
		await SUB_ACC_CREATE_FORM_VALIDATION_SCHEMA(formatMessage, hasPassword)
			.validate(formBody, {
				abortEarly: false,
			})
			.then(() => {
				setFormErrors({});

				const data: ICreateSubAccountBody = {
					login: formBody.login,
					email: formBody.email,
					password: formBody.password || undefined,
					description: formBody.description || undefined,
				};

				if (!isCreateSubAccRequestLoading) {
					setIsCreateSubAccRequestLoading(true);
					SubAccountsService.createSubAccountRegisterRequest(data)
						.then(handleAuthStatusRes)
						.catch(handleErrors)
						.finally(() => {
							setIsCreateSubAccRequestLoading(false);
						});
				}
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<Partial<ISubAccCreateFormBody>>(err));
			});
	};

	const handleBackBtn = () => {
		localeNavigate(routes.subAccounts.accountManagement);
	};

	return (
		<div className={cn(subAccountStyles.card_container, styles.container)}>
			<span className={subAccountStyles.card_title}>
				{isSuccessful
					? formatMessage(subAccountsMessages.sub_account_create_success)
					: formatMessage(subAccountsMessages.add_sub_account)}
			</span>
			{isSuccessful ? (
				<>
					<SuccessScreen />
					<Button
						variant="text"
						color="primary"
						fullWidth
						onClick={handleBackBtn}
						label={formatMessage(subAccountsMessages.back_to_account_management)}
					/>
				</>
			) : tokenType ? (
				<>
					<SecureToken
						requestUrl={`web/sub-account/register/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/register/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={handleSlugChange}
						type={tokenType}
						delay={delayTime}
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
						pincodeTriesleft={pincodeTriesLeft}
						emailAssetName={`${formatMessage(subAccountsMessages.sub_acc_master_acc_email)}: ${
							profileStatus?.email
						}`}
						authenticatorAssetName={`${formatMessage(
							subAccountsMessages.sub_acc_master_account_code,
						)}: ${profileStatus?.email}`}
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						onClick={handleCancelRequest}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</>
			) : (
				<>
					<span className={subAccountStyles.card_subtitle}>
						{formatMessage(
							subAccountsMessages.information_for_reliable_identification_of_account_owner,
						)}
					</span>
					<div className={styles.form_input_group}>
						<Input
							labelValue={formatMessage(subAccountsMessages.login)}
							value={formBody.login}
							onChange={handleInputChange}
							name="login"
							type="text"
							error={formErrors.login}
							onEnter={checkLoginAvailability}
							appender={
								<Appender className={styles.login_check_appender}>
									{isLoginCheckingLoading ? (
										<Spinner size={24} />
									) : isLoginAvailable ? (
										<i className="ai ai-check_filled" />
									) : (
										<AppenderButton onClick={checkLoginAvailability}>
											{formatMessage(subAccountsMessages.check_availability)}
										</AppenderButton>
									)}
								</Appender>
							}
						/>
						<Input
							labelValue={formatMessage(commonMessages.email)}
							value={formBody.email}
							onChange={handleInputChange}
							name="email"
							type="email"
							error={formErrors.email}
							onEnter={createSubAccount}
						/>
						<CheckBox
							name="add-password"
							checked={hasPassword}
							onChange={handleHasPasswordActiveChange}
						>
							{formatMessage(subAccountsMessages.set_password)}
						</CheckBox>
						{hasPassword && (
							<Input
								password
								labelValue={formatMessage(commonMessages.password)}
								value={formBody.password}
								onChange={handleInputChange}
								name="password"
								error={formErrors.password}
								onEnter={createSubAccount}
							/>
						)}
						<CheckBox
							name="add-note"
							checked={hasDescription}
							onChange={handleHasDescriptionChange}
						>
							{formatMessage(subAccountsMessages.add_note)}
						</CheckBox>
						{hasDescription && (
							<Textarea
								name="description"
								onChange={handleInputChange}
								value={formBody.description}
								error={formErrors.description}
								labelValue={formatMessage(commonMessages.note)}
							/>
						)}
						<ButtonsGroup>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								onClick={createSubAccount}
								isLoading={isCreateSubAccRequestLoading}
								label={formatMessage(accountsMessages.subaccount_create_subaccount)}
							/>
							<InternalLink to={routes.subAccounts.accountManagement}>
								<Button
									variant="text"
									color="primary"
									fullWidth
									label={formatMessage(commonMessages.back_btn)}
								/>
							</InternalLink>
						</ButtonsGroup>
					</div>
				</>
			)}
		</div>
	);
};

export default observer(CreateSubAccountForm);
