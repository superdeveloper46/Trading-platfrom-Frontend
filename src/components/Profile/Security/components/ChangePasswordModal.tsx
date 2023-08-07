import Input, { IInputChange } from "components/UI/Input";
import Modal, { ActionGroup, SuccessScreen } from "components/UI/Modal";
import React, { useState } from "react";
import * as yup from "yup";
import { useIntl } from "react-intl";
import securityMessages from "messages/security";
import commonMessages from "messages/common";
import formMessages from "messages/form";

import modalStyles from "styles/components/UI/Modal.module.scss";
import styles from "styles/pages/ProfileSecurity.module.scss";
import Button, { ButtonsGroup } from "components/UI/Button";
import { errorsFromSchema, validateSchema } from "utils/yup";
import errorHandler from "utils/errorHandler";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import SecurityService from "services/SecurityService";
import SecureToken from "components/SecureToken";
import { IApiError } from "helpers/ApiClient";

interface IForm {
	old_password: string;
	new_password1: string;
	new_password2: string;
	[key: string]: string;
}

interface IErrors {
	[key: string]: string | string[];
}

interface IProps {
	isOpen: boolean;
	onClose(): void;
}

// TODO
const ChangePasswordModal: React.FC<IProps> = ({ isOpen, onClose }) => {
	const { formatMessage } = useIntl();
	const [isLoading, setLoading] = useState(false);
	const [isSuccessful, setSuccessful] = useState(false);
	const [slug, setSlug] = useState<string | undefined>();
	const [delayTime, setDelayTime] = useState<string>("");
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | undefined>();
	const [formBody, setFormBody] = useState<IForm>({
		old_password: "",
		new_password1: "",
		new_password2: "",
	});
	const [formErrors, setFormErrors] = useState<IErrors>({
		old_password: "",
		new_password1: "",
		new_password2: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setFormErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	};

	const validate = async () => {
		try {
			await validateSchema({
				old_password: [
					formBody.old_password,
					yup.string().required(formatMessage(formMessages.required)),
				],
				new_password1: [
					formBody.new_password1,
					yup.string().required(formatMessage(formMessages.required)),
				],
				new_password2: [
					formBody.new_password2,
					yup.string().required(formatMessage(formMessages.required)),
				],
			});
			return true;
		} catch (err) {
			setFormErrors(errorsFromSchema<IErrors>(err as any) as IErrors);
			return false;
		}
	};

	const submit = async () => {
		if (!(await validate())) return;
		try {
			setLoading(true);
			const data = await SecurityService.changePassword(formBody);
			if (!data) return;
			if (data.is_ok) {
				setSuccessful(true);
				return;
			}

			if (data.is_totp_required && !data.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(data.totp_timeout);
			} else if (data.is_pincode_required && !data.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(data.pincode_timeout);
			}

			setSlug(data.slug);
		} catch (err) {
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const onTokenSuccess = () => setSuccessful(true);

	const handleSlugChange = (slug: string) => setSlug(slug);

	return (
		<Modal label={formatMessage(securityMessages.pass_change)} onClose={onClose} isOpen={isOpen}>
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(securityMessages.password_changed_successfully)}</span>
				</SuccessScreen>
			) : tokenType != null ? (
				<div className={styles.security_modal_content}>
					<SecureToken
						requestUrl={`web/user/change-password/${slug}/confirm`}
						resendRequestUrl={`web/user/change-password/${slug}/resend`}
						onSuccess={onTokenSuccess}
						onSlugChange={handleSlugChange}
						type={tokenType}
						delay={delayTime}
						shouldAutoFocus
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						label={formatMessage(commonMessages.cancel)}
					/>
				</div>
			) : (
				<form>
					<div className={styles.security_old_info}>
						<span>{formatMessage(securityMessages.pass_change_desc)}</span>
						<Input
							placeholder={formatMessage(securityMessages.old_pass)}
							labelValue={formatMessage(securityMessages.old_pass)}
							value={formBody.old_password}
							onChange={handleInputChange}
							error={formErrors.old_password}
							autoFocus
							name="old_password"
							type="password"
						/>
					</div>
					<div className={styles.security_modal_content}>
						<div className={styles.security_form_content}>
							<Input
								name="new_password1"
								value={formBody.new_password1}
								error={
									formErrors.new_password2
										? formBody.new_password1 !== formBody.new_password2
										: formErrors.new_password1 || formErrors.new_password2
								}
								onChange={handleInputChange}
								labelValue={formatMessage(securityMessages.new_pass)}
								type="password"
							/>
							<Input
								name="new_password2"
								value={formBody.new_password2}
								error={formErrors.new_password2}
								onChange={handleInputChange}
								labelValue={formatMessage(securityMessages.new_pass_confirm)}
								type="password"
							/>
						</div>
					</div>
					<div className={modalStyles.footer}>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								isLoading={isLoading}
								fullWidth
								label={formatMessage(securityMessages.change_pass_btn)}
								onClick={submit}
							/>
							<Button
								variant="outlined"
								color="primary"
								onClick={onClose}
								fullWidth
								label={formatMessage(commonMessages.cancel)}
							/>
						</ActionGroup>
					</div>
				</form>
			)}
		</Modal>
	);
};

export default ChangePasswordModal;
