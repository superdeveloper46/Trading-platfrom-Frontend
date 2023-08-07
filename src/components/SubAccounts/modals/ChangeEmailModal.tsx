import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import formMessages from "messages/form";
import accountMessages from "messages/account";
import subAccountsMessages from "messages/sub_accounts";
import commonMessages from "messages/common";
import paradiseMessages from "messages/paradise";
import { IChangeEmailRequestBody, ISubAccount } from "types/subAccounts";
import Button from "components/UI/Button";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import { useMst } from "models/Root";
import { handleFormErrors } from "utils/form";
import SubAccountsService from "services/SubAccountsService";
import Modal, {
	ActionGroup,
	Content,
	ContentForm,
	Description,
	Footer,
	SuccessScreen,
} from "components/UI/Modal";
import Input from "components/UI/Input";
import SecureToken from "components/SecureToken";
import errorHandler from "utils/errorHandler";
import stylesModal from "styles/components/UI/Modal.module.scss";
import { IError } from "types/general";

interface Props {
	subAccount: ISubAccount;
	isOpen: boolean;
	onClose: () => void;
}

const ChangeEmailModal: React.FC<Props> = ({ subAccount: { uid, login }, onClose, isOpen }) => {
	const {
		account: { profileStatus },
	} = useMst();

	const [email, setEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [delayTime, setDelayTime] = useState<string>("");
	const [slug, setSlug] = useState<string>("");

	const { formatMessage } = useIntl();

	const loadingTimeout = useRef<number>(0);

	useEffect(
		() => () => {
			if (loadingTimeout.current) {
				clearTimeout(loadingTimeout.current);
			}
		},
		[loadingTimeout],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);

		if (emailError) {
			setEmailError("");
		}
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

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, ["email"]);
			setEmailError(nextErrors.email || "");
		}
	};

	const validate = (): boolean => {
		if (email.length) {
			return true;
		}
		setEmailError(formatMessage(formMessages.required));
		return false;
	};

	const handleSubmit = async () => {
		if (validate()) {
			const body: IChangeEmailRequestBody = {
				sub_account: uid,
				email: email,
			};

			setIsLoading(true);
			SubAccountsService.createSubAccountChangeEmailRequest(body)
				.then(handleAuthStatusRes)
				.catch(handleErrors)
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	const handleSlugChange = (slug: string) => {
		setSlug(slug);
	};

	const handleSecureTokenSuccess = () => {
		setIsSuccessful(true);
	};

	const handleCancelRequest = () => {
		if (slug) {
			SubAccountsService.cancelSubAccountChangeEmailRequest(slug).then(() => {
				onClose();
			});
		}
	};

	const handleReset = (): void => {
		setEmailError("");
		setIsSuccessful(false);
		setEmail("");
		setTokenType("");
	};

	useEffect(() => {
		handleReset();
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(accountMessages.subaccount_subacc_email_change)}
			iconCode="ai ai-change"
		>
			{isSuccessful ? (
				<Content>
					<SuccessScreen>
						<span>{formatMessage(paradiseMessages.success_operation)}</span>
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
						requestUrl={`web/sub-account/change-email/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/change-email/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={handleSlugChange}
						type={tokenType}
						delay={delayTime}
						shouldAutoFocus
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
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
						label={formatMessage(commonMessages.cancel)}
					/>
				</Content>
			) : (
				<>
					<Content>
						<Description noMargin>
							<span>
								{formatMessage(accountMessages.subaccount_email_change_desc)}&nbsp;
								<b>{login}</b>
							</span>
						</Description>
					</Content>
					<ContentForm>
						<Input
							labelValue={formatMessage(commonMessages.email)}
							onChange={handleInputChange}
							onKeyDown={handleInputKeyDown}
							value={email}
						/>
					</ContentForm>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								onClick={handleSubmit}
								isLoading={isLoading}
								fullWidth
								label={formatMessage(commonMessages.submit)}
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

export default observer(ChangeEmailModal);
