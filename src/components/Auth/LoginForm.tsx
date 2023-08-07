import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import cookies from "js-cookie";
import { useIntl } from "react-intl";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import styles from "styles/pages/Auth.module.scss";
import mobileAppLogo from "assets/images/logos/mobile-app-logo.svg";
import InternalLink from "components/InternalLink";
import Input from "components/UI/Input";
import securityMessages from "messages/security";
import config from "helpers/config";
import Button from "components/UI/Button";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import SecureToken from "components/SecureToken";
import QRCode from "components/UI/QRCode";
import { WizardStepEnum } from "models/Auth";
import Tooltip from "components/UI/Tooltip";
import googleAuthenticatorAppImg from "assets/images/auth/google_authenticator.svg";
import alpAuthenticatorAppImg from "assets/images/auth/alp_authenticator.svg";
import { routes } from "constants/routing";
import Captcha from "components/Captcha";
import { AuthFormFieldsEnum } from "types/auth";
import useTimeout from "hooks/useTimeout";

const LoginForm: React.FC = () => {
	const { auth, global, render } = useMst();
	const { formatMessage } = useIntl();
	const timeout = useTimeout();

	useEffect(() => () => auth.resetState(), []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		switch (name) {
			case AuthFormFieldsEnum.LOGIN:
				auth.setLogin(value);
				break;
			case AuthFormFieldsEnum.PASSWORD:
				auth.setPassword(value);
				break;
			case AuthFormFieldsEnum.PASSWORD_CONFIRM:
				auth.setPasswordConfirm(value);
				break;
			case AuthFormFieldsEnum.SECURITY_CODE:
				auth.setSecurityCode(value);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (auth.isAuthSuccess) {
			global.setIsAuthenticated(true);
		}
	}, [auth.isAuthSuccess]);

	const handleSubmit = async () => {
		if (await auth.validateLogin(formatMessage)) {
			await auth.onLogin();
		}
		auth.setIsAuthLoading(false);
	};

	const handleRestorePasswordSubmit = async () => {
		auth.setIsAuthLoading(true);
		if (await auth.validateRestorePassword(formatMessage)) {
			await auth.onRestorePassword();
		}
		auth.setIsAuthLoading(false);
	};

	useEffect(() => {
		if (auth.recaptchaToken) {
			handleSubmit();
		}
	}, [auth.recaptchaToken]);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		auth.setIsAuthLoading(true);

		if (!auth.recaptchaSiteKey || !auth.recaptchaAction) {
			handleSubmit();
		}
	};

	const handleLoginSuccess = (res: ISecureTokenRes) => {
		if (res.done?.token) {
			cookies.set(config.sessionCookieName, res.done.token);
			global.setIsAuthenticated(true);
		}
	};

	const handleCaptchaTokenChange = (token: string) => {
		if (auth.isAuthLoading) {
			auth.setRecaptchaToken(token);
		}
	};

	const AuthenticatorApps = (
		<div className={styles.two_fa_apps}>
			<Tooltip
				id="alp-authenticator"
				place="top"
				text="2FA Alp Authenticator"
				opener={
					<a
						href="https://play.google.com/store/apps/details?id=com.alp.two_fa&hl=en&gl=US"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={alpAuthenticatorAppImg} alt="Alp Authenticator" width="80" height="80" />
					</a>
				}
			/>
			<Tooltip
				id="google-authenticator"
				place="top"
				text="Google Authenticator"
				opener={
					<a
						href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={googleAuthenticatorAppImg}
							alt="Google Authenticator"
							width="80"
							height="80"
						/>
					</a>
				}
			/>
		</div>
	);

	return (
		<div className={styles.auth_form}>
			<InternalLink to={routes.trade.root}>
				<img src={mobileAppLogo} width="70" height="34" alt={config.department} />
			</InternalLink>
			<h1>
				{auth.isRestoring2FA
					? formatMessage(securityMessages.scan_the_qr_code)
					: auth.isRestoringPassword
					? formatMessage(securityMessages.password_change)
					: formatMessage(commonMessages.login)}
			</h1>
			{auth.isRestoring2FA && (
				<div className={styles.restore_2fa_container}>
					{AuthenticatorApps}
					<QRCode value={auth.restore2FATokenURL} code={auth.restore2FAKey} />
				</div>
			)}
			{auth.secureTokenType ? (
				<SecureToken
					requestUrl="web/profile/auth"
					resendRequestUrl="web/resend-pincode"
					onResponse={auth.onAuthRes}
					onSuccess={handleLoginSuccess}
					body={{ email: auth.login, password: auth.password, wizard_id: auth.wizardId }}
					shouldAutoFocus
					error={auth.secureTokenError}
					delay={auth.secureTokenDelay}
					emailAssetName={auth.login}
					type={auth.secureTokenType as SecureTokenTypeEnum}
					pincodeTriesleft={auth.secureTokenLeft}
					variant={SecureTokenVariantEnum.SPINNER}
					fullSize={!auth.isRestoring2FA}
				/>
			) : auth.wizardStep === WizardStepEnum.RESTORE_PASSWORD ? (
				<form onSubmit={handleRestorePasswordSubmit}>
					<Input
						placeholder={formatMessage(securityMessages.new_pass)}
						labelValue={formatMessage(securityMessages.new_pass)}
						value={auth.password}
						onChange={handleInputChange}
						error={auth.errors.password}
						name={AuthFormFieldsEnum.PASSWORD}
						autoComplete="off"
						password
					/>
					<Input
						placeholder={formatMessage(securityMessages.new_pass_confirm)}
						labelValue={formatMessage(securityMessages.new_pass_confirm)}
						value={auth.passwordConfirm}
						onChange={handleInputChange}
						error={auth.errors.passwordConfirm}
						name={AuthFormFieldsEnum.PASSWORD_CONFIRM}
						autoComplete="off"
						password
					/>
					<Button
						fullWidth
						type="submit"
						variant="filled"
						label={formatMessage(commonMessages.submit)}
						isLoading={auth.isAuthLoading}
					/>
				</form>
			) : (
				<form onSubmit={handleFormSubmit}>
					<Input
						placeholder={formatMessage(
							render.subAccounts ? commonMessages.email_or_login : commonMessages.enter_email,
						)}
						labelValue={formatMessage(
							render.subAccounts ? commonMessages.email_or_login : commonMessages.email,
						)}
						value={auth.login}
						onChange={handleInputChange}
						error={auth.errors.login}
						autoFocus
						autoComplete="on"
						name={AuthFormFieldsEnum.LOGIN}
					/>
					<Input
						placeholder={formatMessage(commonMessages.enter_password)}
						labelValue={formatMessage(commonMessages.password)}
						value={auth.password}
						onChange={handleInputChange}
						error={auth.errors.password}
						name={AuthFormFieldsEnum.PASSWORD}
						autoComplete="on"
						password
					/>
					{auth.hasSecurityCode && (
						<Input
							placeholder={formatMessage(commonMessages.security_code)}
							labelValue={formatMessage(commonMessages.security_code)}
							helpText={formatMessage(commonMessages.security_code_desc)}
							value={auth.securityCode}
							onChange={handleInputChange}
							error={auth.errors.securityCode}
							name={AuthFormFieldsEnum.SECURITY_CODE}
						/>
					)}
					<Button
						fullWidth
						type="submit"
						variant="filled"
						label={formatMessage(commonMessages.login)}
						isLoading={auth.isAuthLoading}
					/>
					<Captcha
						execute={auth.isAuthLoading}
						siteKey={auth.recaptchaSiteKey}
						action={auth.recaptchaAction}
						onTokenChange={handleCaptchaTokenChange}
					/>
				</form>
			)}
			{auth.wizardStep === WizardStepEnum.AUTH && (
				<>
					<span>
						{formatMessage(commonMessages.first_time_message)}&nbsp;
						<InternalLink to={routes.register.root}>
							{formatMessage(commonMessages.register)}
						</InternalLink>
					</span>
					<InternalLink to={routes.resetPassword}>
						<Button
							fullWidth
							variant="text"
							color="primary"
							label={formatMessage(commonMessages.reset_password)}
						/>
					</InternalLink>
				</>
			)}
		</div>
	);
};

export default observer(LoginForm);
