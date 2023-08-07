import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import * as yup from "yup";
import commonMessages from "messages/common";
import authMessages from "messages/auth";
import styles from "styles/pages/Auth.module.scss";
import resetPasswordImg from "assets/images/settings/password-reset.svg";
import InternalLink from "components/InternalLink";
import Input from "components/UI/Input";
import Button, { ButtonsGroup } from "components/UI/Button";
import { routes } from "constants/routing";
import formMessages from "messages/form";
import AuthService from "services/AuthService";
import SecureToken from "components/SecureToken";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import { errorsFromSchema, validateSchema } from "utils/yup";
import SuccessScreen from "components/UI/SuccessScreen";
import { PASSWORD_MAX_SYMBOLS } from "constants/common";
import errorHandler from "utils/errorHandler";
import { processEcaptchaResponse } from "helpers/ecaptcha";
import { IEcaptchaData } from "types/general";
import Captcha from "components/Captcha";

interface IFormBody {
	email: string;
	password: string;
	password2: string;
}

interface IFormErrors {
	email?: string;
	password?: string;
	password2?: string;
}

const getErrorsFromResponse = (responseErrors: any, errorName: string) => {
	const err = responseErrors[errorName];
	if (Array.isArray(err) && err.length) {
		return err[0];
	}
	return "";
};

const ResetPasswordForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | null>(null);
	const [slug, setSlug] = useState<string>("");
	const [delayTime, setDelayTime] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [isPincodeSubmitted, setIsPincodeSubmitted] = useState<boolean>(false);
	const [body, setBody] = useState<IFormBody>({ email: "", password: "", password2: "" });
	const [errors, setErrors] = useState<IFormErrors>({});
	const [captchaData, setCaptchaData] = useState<IEcaptchaData>({ site_key: "", action: "" });
	const [captchaToken, setCaptchaToken] = useState<string>("");

	useEffect(() => {
		loadResetToken();
	}, []);

	const loadResetToken = async () => {
		try {
			const res = await AuthService.getResetPasswordToken();
			setCaptchaData(processEcaptchaResponse(res));
		} catch (err) {
			errorHandler(err);
		}
	};

	const processRequestResponse = (res: ISecureTokenRes) => {
		if (res.slug) {
			setSlug(res.slug);
			if (res.is_totp_required && !res.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(res.totp_timeout);
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(res.pincode_timeout);
			}
		}
	};

	const processRequestErrors = (err: Record<string, unknown>) => {
		if (err) {
			const nextErrors: IFormErrors = {
				email: getErrorsFromResponse(err, "email") || getErrorsFromResponse(err, "ecaptcha"),
				password: getErrorsFromResponse(err, "password"),
				password2:
					getErrorsFromResponse(err, "password2") || getErrorsFromResponse(err, "non_field_errors"),
			};
			setErrors(nextErrors);
		}
	};

	const validateEmail = async () => {
		try {
			await validateSchema({
				email: [body.email, yup.string().required(formatMessage(formMessages.required))],
			});
			return true;
		} catch (err: IFormErrors & any) {
			setErrors(errorsFromSchema<IFormErrors>(err));
			return false;
		}
	};

	const validatePassword = async () => {
		try {
			await validateSchema({
				password: [
					body.password,
					yup.string().required(formatMessage(formMessages.required)).max(PASSWORD_MAX_SYMBOLS),
				],
				password2: [
					body.password2,
					yup
						.string()
						.required(formatMessage(formMessages.required))
						.test({
							message: formatMessage(formMessages.passwords_do_not_match),
							test: (value) => value === body.password,
						})
						.max(PASSWORD_MAX_SYMBOLS),
				],
			});
			return true;
		} catch (err: IFormErrors & any) {
			setErrors(errorsFromSchema<IFormErrors>(err));
			return false;
		}
	};

	const handleSubmit = async () => {
		try {
			if (await validateEmail()) {
				const res = await AuthService.resetPasswordRequest({
					email: body.email,
					ecaptcha: captchaToken,
				});
				processRequestResponse(res);
			}
		} catch (err: any) {
			if (err) {
				processRequestErrors(err.data);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (captchaToken) {
			handleSubmit();
		}
	}, [captchaToken]);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		if (!captchaData.site_key || !captchaData.action) {
			handleSubmit();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setBody((prevState) => ({ ...prevState, [name]: value }));
		setErrors((prevState) => ({ ...prevState, [name]: "" }));
	};

	const handlePasswordSubmit = async () => {
		try {
			if (await validatePassword()) {
				setIsLoading(true);
				await AuthService.resetPasswordConfirm(slug, {
					password: body.password,
					password2: body.password2,
				});
				setIsSuccessful(true);
			}
		} catch (err: any) {
			if (err) {
				processRequestErrors(err.data);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfirmErrors = (err: any) => {
		const nextErrors: Record<string, unknown> = {};
		Object.entries(err).forEach(([key, value]) => {
			if (value) {
				nextErrors[key] = value;
			}
		});
		setErrors(nextErrors);
	};

	const handleSecureTokenSuccess = () => {
		setIsPincodeSubmitted(true);
	};

	const handleCaptchaTokenChange = (token: string) => {
		if (isLoading) {
			setCaptchaToken(token);
		}
	};

	return (
		<div className={styles.auth_form}>
			<h1>{formatMessage(commonMessages.reset_password)}</h1>
			{!isSuccessful && (
				<>
					<img src={resetPasswordImg} width="257" height="132" alt="Reset Password" />
					<span>
						{isPincodeSubmitted
							? formatMessage(authMessages.reset_password_confirmation_description)
							: tokenType
							? ""
							: formatMessage(authMessages.reset_password_desc)}
					</span>
				</>
			)}
			{isSuccessful ? (
				<div className={styles.reset_password_success_container}>
					<SuccessScreen>
						<p>{formatMessage(authMessages.reset_password_confirmation_success)}</p>
					</SuccessScreen>
					<InternalLink to={routes.login.root}>
						<Button
							color="primary"
							variant="outlined"
							label={formatMessage(commonMessages.login)}
							fullWidth
						/>
					</InternalLink>
				</div>
			) : tokenType ? (
				<div className={styles.reset_password_form_container}>
					{isPincodeSubmitted ? (
						<>
							<Input
								placeholder={formatMessage(
									authMessages.reset_password_confirmation_input_placeholder,
								)}
								labelValue={formatMessage(
									authMessages.reset_password_confirmation_input_placeholder,
								)}
								value={body.password}
								onChange={handleInputChange}
								error={errors.password}
								name="password"
								password
								autoFocus
								onEnter={handlePasswordSubmit}
							/>
							<Input
								placeholder={formatMessage(
									authMessages.reset_password_confirmation_input_placeholder2,
								)}
								labelValue={formatMessage(
									authMessages.reset_password_confirmation_input_placeholder2,
								)}
								value={body.password2}
								onChange={handleInputChange}
								error={errors.password2}
								name="password2"
								password
								onEnter={handlePasswordSubmit}
							/>
							<Button
								fullWidth
								type="submit"
								variant="filled"
								isLoading={isLoading}
								onClick={handlePasswordSubmit}
								label={formatMessage(commonMessages.continue)}
							/>
						</>
					) : (
						<SecureToken
							onSuccess={handleSecureTokenSuccess}
							requestUrl={`web/profile/reset-password-code/${slug}/confirm`}
							resendRequestUrl={`web/profile/reset-password-code/${slug}/resend`}
							type={tokenType}
							delay={delayTime}
							onError={handleConfirmErrors}
							shouldAutoFocus
							variant={SecureTokenVariantEnum.BUTTON}
						/>
					)}
				</div>
			) : (
				<form onSubmit={handleFormSubmit}>
					<Input
						placeholder={formatMessage(commonMessages.enter_email)}
						labelValue={formatMessage(commonMessages.email)}
						value={body.email}
						error={errors.email}
						onChange={handleInputChange}
						name="email"
						autoFocus
					/>
					<ButtonsGroup fullWidth>
						<Button
							fullWidth
							type="submit"
							variant="filled"
							isLoading={isLoading}
							label={formatMessage(commonMessages.reset_password)}
						/>
						<InternalLink to={routes.login.root}>
							<Button fullWidth variant="text" label={formatMessage(commonMessages.login)} />
						</InternalLink>
					</ButtonsGroup>
					<Captcha
						execute={isLoading}
						siteKey={captchaData.site_key}
						action={captchaData.action}
						onTokenChange={handleCaptchaTokenChange}
					/>
				</form>
			)}
		</div>
	);
};

export default observer(ResetPasswordForm);
