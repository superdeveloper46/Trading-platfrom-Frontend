import React, { useEffect, useState } from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import * as yup from "yup";
import { AnyObjectSchema } from "yup";
import { observer } from "mobx-react-lite";

import { IChangePasswordRequestBody, ISubAccount } from "types/subAccounts";
import formMessages from "messages/form";
import { yupCustomPasswordValidation } from "constants/subAccounts";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import { useMst } from "models/Root";
import { handleFormErrors } from "utils/form";
import { getErrorFromYupValidationRes } from "utils/getter";
import SubAccountsService from "services/SubAccountsService";
import errorHandler from "utils/errorHandler";
import securityMessages from "messages/security";
import subAccountsMessages from "messages/sub_accounts";
import accountMessages from "messages/account";
import paradiseMessages from "messages/paradise";
import commonMessages from "messages/common";
import Modal, {
	ActionGroup,
	Content,
	ContentForm,
	Description,
	Footer,
	SuccessScreen,
} from "components/UI/Modal";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";
import SecureToken from "components/SecureToken";
import Input from "components/UI/Input";
import { IError } from "types/general";

interface IFormBody {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
	[key: string]: string;
}

interface IProps {
	subAccount: ISubAccount;
	forSubAccount?: boolean;
	isOpen: boolean;
	onClose: () => void;
}

export const FORM_VALIDATION_SCHEMA = (
	formatMessages: (v: MessageDescriptor) => string,
): AnyObjectSchema =>
	yup.object({
		currentPassword: yup.string().required(formatMessages(formMessages.required)),
		newPassword: yupCustomPasswordValidation(formatMessages),
		confirmPassword: yupCustomPasswordValidation(formatMessages),
	});

const ChangePasswordModal: React.FC<IProps> = ({
	subAccount: { uid, login },
	onClose,
	isOpen,
	forSubAccount = false,
}) => {
	const {
		account: { profileStatus },
	} = useMst();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const [formBody, setFormBody] = useState<IFormBody>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [formErrors, setFormErrors] = useState<Partial<IFormBody>>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [delayTime, setDelayTime] = useState<string>("");
	const [slug, setSlug] = useState<string>("");

	const { formatMessage } = useIntl();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, ["old_password", "new_password1", "new_password2"]);

			setFormErrors((prevState) => ({
				...prevState,
				currentPassword: nextErrors.old_password,
				newPassword: nextErrors.new_password1,
				confirmPassword: nextErrors.new_password2,
			}));
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			sendRequest();
		}
	};

	const handleSlugChange = (slug: string) => {
		setSlug(slug);
	};

	const handleSecureTokenSuccess = () => {
		setIsSuccessful(true);
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
			}
			setSlug(res.slug || "");
		}
	};

	const sendRequest = async () => {
		await FORM_VALIDATION_SCHEMA(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then(() => {
				setFormErrors({});

				const data: IChangePasswordRequestBody = {
					sub_account: uid,
					old_password: formBody.currentPassword,
					new_password1: formBody.newPassword,
					new_password2: formBody.confirmPassword,
				};

				if (!isLoading) {
					setIsLoading(true);
					SubAccountsService.createSubAccountChangePasswordRequest(data)
						.then(handleAuthStatusRes)
						.catch(handleErrors)
						.finally(() => {
							setIsLoading(false);
						});
				}
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<IFormBody>(err));
			});
	};

	const handleCancelRequest = () => {
		if (slug) {
			SubAccountsService.cancelSubAccountChangePasswordRequest(slug).then(() => {
				onClose();
			});
		}
	};

	const handleReset = (): void => {
		setIsSuccessful(false);
		setTokenType("");
		setFormBody({ currentPassword: "", newPassword: "", confirmPassword: "" });
		setFormErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
	};

	useEffect(() => {
		handleReset();
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			label={
				isSuccessful
					? formatMessage(paradiseMessages.success_operation)
					: formatMessage(accountMessages.subaccount_password_change)
			}
			iconCode="ai ai-change"
		>
			{isSuccessful ? (
				<Content>
					<SuccessScreen>
						<span>{formatMessage(subAccountsMessages.sub_acc_successfully_changed_password)}</span>
					</SuccessScreen>
					<ActionGroup>
						<Button
							variant="text"
							color="primary"
							label={formatMessage(commonMessages.ok)}
							onClick={onClose}
							fullWidth
						/>
					</ActionGroup>
				</Content>
			) : tokenType ? (
				<Content>
					<SecureToken
						requestUrl={`web/sub-account/change-password/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/change-password/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={handleSlugChange}
						type={tokenType}
						delay={delayTime}
						shouldAutoFocus
						variant={SecureTokenVariantEnum.SPINNER}
						emailAssetName={`${formatMessage(subAccountsMessages.sub_acc_master_acc_email)}: ${
							profileStatus?.email
						}`}
						fullSize
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						label={formatMessage(commonMessages.cancel)}
						onClick={handleCancelRequest}
					/>
				</Content>
			) : (
				<>
					<Content>
						<Description noMargin>
							<span>
								{formatMessage(accountMessages.subaccount_password_change_desc)}&nbsp;
								<b>{login}</b>
							</span>
						</Description>
					</Content>
					<ContentForm>
						<Input
							name="currentPassword"
							value={formBody.currentPassword}
							error={formErrors.currentPassword}
							onChange={handleInputChange}
							password
							labelValue={formatMessage(
								forSubAccount ? securityMessages.master_pass : securityMessages.old_pass,
							)}
							onKeyDown={handleInputKeyDown}
						/>
						<Input
							name="newPassword"
							value={formBody.newPassword}
							error={formErrors.newPassword}
							onChange={handleInputChange}
							labelValue={formatMessage(subAccountsMessages.sub_acc_new_password)}
							password
							onKeyDown={handleInputKeyDown}
						/>
						<Input
							name="confirmPassword"
							value={formBody.confirmPassword}
							error={formErrors.confirmPassword}
							onChange={handleInputChange}
							labelValue={formatMessage(subAccountsMessages.sub_acc_new_password_confirm)}
							password
							onKeyDown={handleInputKeyDown}
						/>
					</ContentForm>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								onClick={sendRequest}
								isLoading={isLoading}
								fullWidth
								label={formatMessage(securityMessages.change_pass_btn)}
							/>
							<Button
								variant="outlined"
								color="primary"
								onClick={onClose}
								fullWidth
								label={formatMessage(commonMessages.cancel)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};
export default observer(ChangePasswordModal);
