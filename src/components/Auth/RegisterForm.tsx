import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import cookies from "js-cookie";
import cn from "classnames";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import securityMessages from "messages/security";
import welcomeMessages from "messages/welcome_bonus";
import styles from "styles/pages/Auth.module.scss";
import mobileAppLogo from "assets/images/logos/mobile-app-logo.svg";
import InternalLink from "components/InternalLink";
import Input from "components/UI/Input";
import SuccessRegisterImg from "assets/images/auth/register_successful.svg";
import CheckBox from "components/UI/CheckBox";
import Button, { ButtonsGroup } from "components/UI/Button";
import CountrySelect from "components/UI/CountrySelect";
import useParamQuery from "hooks/useSearchQuery";
import config from "helpers/config";
import { REFERRAL_CODE_KEY } from "utils/constants";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import Captcha from "components/Captcha";
import { AuthFormFieldsEnum } from "types/auth";
import useTimeout from "hooks/useTimeout";

const RegisterForm: React.FC = () => {
	const {
		auth,
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();
	const [hasInviteCode, setHasInviteCode] = useState<boolean>(false);
	const query = useParamQuery();
	const referralCode = query.get(REFERRAL_CODE_KEY) || cookies.get(REFERRAL_CODE_KEY);
	const timeout = useTimeout();

	useEffect(() => {
		auth.setLogin(query.get(queryVars.email) ?? "");
		if (referralCode) {
			setHasInviteCode(true);
			auth.setInvite(referralCode);
		}
		return () => auth.resetState();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		switch (name) {
			case AuthFormFieldsEnum.LOGIN:
				auth.setLogin(value);
				break;
			case AuthFormFieldsEnum.PASSWORD:
				auth.setPassword(value);
				break;
			case AuthFormFieldsEnum.INVITE:
				auth.setInvite(value);
				break;
			default:
				break;
		}
	};

	const handleTermsConditionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		auth.setIsConditionAccepted(checked);
	};

	const handleSubmit = async () => {
		if (await auth.validateRegister(formatMessage)) {
			await auth.onRegister();
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

		timeout(() => {
			if (auth.isAuthLoading) {
				auth.setIsAuthLoading(false);
			}
		}, 5000);
	};

	const toggleHasInvite = () => {
		setHasInviteCode((prevState) => !prevState);
		auth.setInvite("");
	};

	const handleCountryChange = useCallback((_, value) => {
		auth.setCountryCode(value ?? "");
	}, []);

	const handleCaptchaTokenChange = (token: string) => {
		if (auth.isAuthLoading) {
			auth.setRecaptchaToken(token);
		}
	};

	return (
		<div className={styles.auth_form}>
			<InternalLink to={routes.trade.root}>
				<img src={mobileAppLogo} width="70" height="34" alt={config.department} />
			</InternalLink>
			<h1>
				{formatMessage(
					auth.isAuthSuccess ? welcomeMessages.congrats_header : commonMessages.create_account,
				)}
			</h1>
			{auth.isAuthSuccess ? (
				<div className={styles.register_successful}>
					<span>{formatMessage(welcomeMessages.congrats_subheader)}</span>
					<img src={SuccessRegisterImg} alt="success register" width="293" height="172" />
					<ButtonsGroup fullWidth>
						<InternalLink to={routes.login.root}>
							<Button
								fullWidth
								variant="text"
								color="primary"
								label={formatMessage(commonMessages.login)}
							/>
						</InternalLink>
					</ButtonsGroup>
				</div>
			) : (
				<form onSubmit={handleFormSubmit}>
					<Input
						placeholder={formatMessage(commonMessages.enter_email)}
						labelValue={formatMessage(commonMessages.email)}
						value={auth.login}
						onChange={handleInputChange}
						error={auth.errors.login}
						autoFocus
						name={AuthFormFieldsEnum.LOGIN}
					/>
					<Input
						placeholder={formatMessage(commonMessages.enter_password)}
						labelValue={formatMessage(commonMessages.password)}
						value={auth.password}
						onChange={handleInputChange}
						error={auth.errors.password}
						name={AuthFormFieldsEnum.PASSWORD}
						password
					/>
					<CountrySelect
						value={auth.countryCode}
						label={formatMessage(securityMessages.country)}
						name="residence"
						locale={locale}
						onSelect={handleCountryChange}
						error={auth.errors.countryCode}
					/>
					<div className={styles.invite_code}>
						<button
							type="button"
							className={cn(styles.invite_code_button, hasInviteCode && styles.active)}
							onClick={toggleHasInvite}
						>
							<i className="ai ai-plus_mini" />
							<span>{formatMessage(commonMessages.i_have_ref_link)}</span>
						</button>
						{hasInviteCode && (
							<Input
								placeholder={formatMessage(commonMessages.invite)}
								labelValue={formatMessage(commonMessages.invite)}
								value={auth.invite}
								onChange={handleInputChange}
								name={AuthFormFieldsEnum.INVITE}
								error={auth.errors.invite}
							/>
						)}
					</div>
					<CheckBox
						name="terms-conditions"
						checked={auth.isConditionsAccepted}
						onChange={handleTermsConditionsChange}
						required
					>
						{formatMessage(commonMessages.terms_conditions, {
							privacy_policy: (
								<InternalLink to={routes.privacyPolicy}>
									{formatMessage(commonMessages.privacy_policy_context)}
								</InternalLink>
							),
							terms_of_use: (
								<InternalLink to={routes.termsOfUse}>
									{formatMessage(commonMessages.terms_of_use_context)}
								</InternalLink>
							),
						})}
					</CheckBox>
					<ButtonsGroup fullWidth>
						<Button
							fullWidth
							type="submit"
							variant="filled"
							label={formatMessage(commonMessages.register)}
							isLoading={auth.isAuthLoading}
						/>
						<InternalLink to={routes.login.root}>
							<Button
								fullWidth
								variant="text"
								color="primary"
								label={formatMessage(commonMessages.login)}
							/>
						</InternalLink>
					</ButtonsGroup>
					<Captcha
						execute={auth.isAuthLoading}
						siteKey={auth.recaptchaSiteKey}
						action={auth.recaptchaAction}
						onTokenChange={handleCaptchaTokenChange}
					/>
				</form>
			)}
		</div>
	);
};

export default observer(RegisterForm);
