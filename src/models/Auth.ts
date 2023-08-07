import {
	applySnapshot,
	cast,
	flow,
	getParent,
	getSnapshot,
	Instance,
	types as t,
} from "mobx-state-tree";
import * as yup from "yup";
import formMessages from "messages/form";
import cookies from "js-cookie";
import config from "helpers/config";
import AuthService from "services/AuthService";
import { IField, ILoginBody, IRegisterBody, IRestorePasswordBody, RecaptchaEnum } from "types/auth";
import { errorsFromSchema, validateSchema } from "utils/yup";
import { MessageFormatter } from "types/general";
import { IApiError } from "helpers/ApiClient";
import { SecureTokenTypeEnum } from "types/secureToken";
import { transformErrorFromResponse } from "utils/error";
import errorHandler from "utils/errorHandler";
import cache from "helpers/cache";
import { AUTH_REQUEST_TRIES_LEFT_CACHE_KEY } from "utils/cacheKeys";
import { PASSWORD_MAX_SYMBOLS } from "constants/common";
import { COOKIE_P2P_SCAMMER_ATTENTION } from "constants/p2p";
import { IRootStore } from "./Root";

export enum WizardStepEnum {
	RESTORE_2FA = "restore_2fa",
	TOKEN = "token",
	RESTORE_PASSWORD = "restore_password",
	RESTORE_PINCODE = "restore_pincode",
	PINCODE = "pincode",
	AUTH = "auth",
}

const AuthErrors = t.model({
	login: t.optional(t.string, ""),
	password: t.optional(t.string, ""),
	passwordConfirm: t.optional(t.string, ""),
	countryCode: t.optional(t.string, ""),
	invite: t.optional(t.string, ""),
	securityCode: t.optional(t.string, ""),
});
interface IAuthErrors extends Instance<typeof AuthErrors> {}

export const Auth = t
	.model({
		login: t.optional(t.string, ""),
		password: t.optional(t.string, ""),
		passwordConfirm: t.optional(t.string, ""),
		invite: t.optional(t.string, ""),
		securityCode: t.optional(t.string, ""),
		countryCode: t.optional(t.string, ""),
		isConditionsAccepted: t.optional(t.boolean, false),
		errors: t.optional(AuthErrors, {}),
		isAuthLoading: t.optional(t.boolean, false),
		restore2FATokenURL: t.optional(t.string, ""),
		restore2FAKey: t.optional(t.string, ""),
		secureTokenLeft: t.optional(t.number, 3),
		secureTokenDelay: t.optional(t.string, ""),
		secureTokenError: t.optional(t.string, ""),
		isAuthSuccess: t.optional(t.boolean, false),
		hasSecurityCode: t.optional(t.boolean, false),
		recaptchaAction: t.optional(t.string, ""),
		recaptchaSiteKey: t.optional(t.string, ""),
		recaptchaToken: t.optional(t.string, ""),
		wizardStep: t.optional(t.string, WizardStepEnum.AUTH),
		wizardId: t.optional(t.string, ""),
	})
	.views((self) => ({
		get isRestoring2FA() {
			return (
				self.wizardStep === WizardStepEnum.RESTORE_2FA &&
				!!(self.restore2FAKey && self.restore2FATokenURL)
			);
		},
		get isRestoringPassword() {
			return self.wizardStep === WizardStepEnum.RESTORE_PASSWORD;
		},
		get secureTokenType() {
			return [WizardStepEnum.TOKEN, WizardStepEnum.RESTORE_2FA].includes(
				self.wizardStep as WizardStepEnum,
			)
				? SecureTokenTypeEnum.OTPCODE
				: [WizardStepEnum.PINCODE, WizardStepEnum.RESTORE_PINCODE].includes(
						self.wizardStep as WizardStepEnum,
				  )
				? SecureTokenTypeEnum.PINCODE
				: "";
		},
	}))
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({
		setLogin(nextLogin: string) {
			self.login = nextLogin;
			self.errors.login = "";
		},
		setPassword(nextPassword: string) {
			self.password = nextPassword;
			self.errors.password = "";
		},
		setPasswordConfirm(nextPasswordConfirm: string) {
			self.passwordConfirm = nextPasswordConfirm;
			self.errors.passwordConfirm = "";
		},
		setInvite(nextInvite: string) {
			self.invite = nextInvite;
		},
		setCountryCode(nextCountryCode: string) {
			self.countryCode = nextCountryCode;
			self.errors.countryCode = "";
		},
		setSecurityCode(nextSecurityCode: string) {
			self.securityCode = nextSecurityCode;
			self.errors.securityCode = "";
		},
		setIsConditionAccepted(nextIsConditionsAccepted: boolean) {
			self.isConditionsAccepted = nextIsConditionsAccepted;
		},
		setHasSecurityCode(has: boolean) {
			self.hasSecurityCode = has;
		},
		setErrors(nextErrors: IAuthErrors) {
			self.errors = cast(nextErrors);
		},
		setRecaptchaToken(recaptchaToken: string) {
			self.recaptchaToken = recaptchaToken;
		},
		setIsAuthLoading(v: boolean) {
			self.isAuthLoading = v;
		},
	}))
	.actions((self) => ({
		onAuthRes(res: any) {
			if (res?.done) {
				cookies.set(config.sessionCookieName, res.done.token);
				self.isAuthSuccess = true;
				cache.setItem(AUTH_REQUEST_TRIES_LEFT_CACHE_KEY, 3);
			} else if (res?.wizard?.id) {
				self.wizardStep = res.wizard.step;
				self.wizardId = res.wizard.id;
				switch (res.wizard.step) {
					case WizardStepEnum.RESTORE_2FA:
						self.restore2FATokenURL = res.form.values?.otpauth_url ?? "";
						self.restore2FAKey = res.form.values?.key ?? "";
						break;
					case WizardStepEnum.RESTORE_PASSWORD:
						self.login = "";
						break;
					default:
						self.password = "";
						self.passwordConfirm = "";
						break;
				}
				const formErrors = res.form?.errors;
				self.secureTokenError = formErrors
					? formErrors.token?.[0] ?? formErrors.pincode?.[0] ?? formErrors.non_field_errors?.[0]
					: "";
				if (res.form?.fields) {
					Object.values(res.form.fields).forEach((field: any) => {
						if (
							[
								SecureTokenTypeEnum.OTPCODE,
								SecureTokenTypeEnum.TOKEN,
								SecureTokenTypeEnum.PINCODE,
							].includes(field.name)
						) {
							self.secureTokenLeft = field.left ?? 0;
							self.secureTokenDelay = field.delay ?? "";
						}
						if (field.name === "security_code") {
							self.setHasSecurityCode(true);
						}
					});
				}
			} else {
				self.secureTokenError = res.description ?? "Server error";
				self.setErrors({
					...self.errors,
					password: res.description ?? "Server error",
				});
			}
		},
		async validateLogin(formatMessage: MessageFormatter): Promise<boolean> {
			try {
				await validateSchema({
					login: [self.login, yup.string().required(formatMessage(formMessages.required))],
					password: [
						self.password,
						yup.string().required(formatMessage(formMessages.required)).max(PASSWORD_MAX_SYMBOLS),
					],
				});
				return true;
			} catch (err) {
				self.setErrors(errorsFromSchema<IAuthErrors>(err as any) as IAuthErrors);
				return false;
			}
		},
		async validateResetPassword(formatMessage: MessageFormatter): Promise<boolean> {
			try {
				await validateSchema({
					login: [self.login, yup.string().required(formatMessage(formMessages.required))],
				});
				return true;
			} catch (err) {
				self.setErrors(errorsFromSchema<IAuthErrors>(err as any) as IAuthErrors);
				return false;
			}
		},
		async validateRestorePassword(formatMessage: MessageFormatter): Promise<boolean> {
			try {
				await validateSchema({
					password: [
						self.password,
						yup.string().required(formatMessage(formMessages.required)).max(PASSWORD_MAX_SYMBOLS),
					],
					passwordConfirm: [
						self.passwordConfirm,
						yup
							.string()
							.required(formatMessage(formMessages.required))
							.test({
								message: formatMessage(formMessages.passwords_do_not_match),
								test: (value) => value === self.password,
							})
							.max(PASSWORD_MAX_SYMBOLS),
					],
				});
				return true;
			} catch (err) {
				self.setErrors(errorsFromSchema<IAuthErrors>(err as any) as IAuthErrors);
				return false;
			}
		},
		async validateRegister(formatMessage: MessageFormatter): Promise<boolean> {
			try {
				await validateSchema({
					login: [self.login, yup.string().required(formatMessage(formMessages.required))],
					password: [
						self.password,
						yup.string().required(formatMessage(formMessages.required)).max(PASSWORD_MAX_SYMBOLS),
					],
					countryCode: [
						self.countryCode,
						yup.string().required(formatMessage(formMessages.required)),
					],
				});
				return true;
			} catch (err) {
				self.setErrors(errorsFromSchema<IAuthErrors>(err as any) as IAuthErrors);
				return false;
			}
		},
	}))
	.actions((self) => ({
		processErrors(errors: Record<string, any>) {
			if (errors) {
				const nextEmailError = transformErrorFromResponse(errors.email);
				const nextInviteError = transformErrorFromResponse(errors.invite);
				const nextSecurityCodeError = transformErrorFromResponse(errors.security_code);
				const nextPasswordError = transformErrorFromResponse(
					errors.password || errors.non_field_errors || errors.ecaptcha,
				);

				self.setErrors({
					...self.errors,
					login: nextEmailError,
					invite: nextInviteError,
					password: nextPasswordError,
					securityCode: self.hasSecurityCode ? nextSecurityCodeError : "",
				});

				if (nextSecurityCodeError) {
					self.setHasSecurityCode(true);
				}
			}
		},
	}))
	.actions((self) => ({
		onLogin: flow(function* () {
			try {
				const body: ILoginBody = {
					email: self.login,
					password: self.password,
					security_code: self.hasSecurityCode ? self.securityCode : undefined,
					ecaptcha: self.recaptchaToken ? self.recaptchaToken : undefined,
				};
				const res = yield AuthService.login(body);
				if (!res) {
					return;
				}
				if (res?.form?.errors) {
					self.processErrors(res.form.errors);
				}
				self.onAuthRes(res);
			} catch (err) {
				const error = err as IApiError;
				const fields = ((err as any)?.data?.form?.fields ?? []) as IField[];
				if (fields.some((f) => f.name === "security_code")) {
					self.setHasSecurityCode(true);
				}
				if (error.data?.form?.errors) {
					self.processErrors(error.data.form.errors);
				}
			}
		}),
		onRestorePassword: flow(function* () {
			try {
				const body: IRestorePasswordBody = {
					password: self.password,
					wizard_id: self.wizardId,
				};
				const res = yield AuthService.login(body);
				if (!res) {
					return;
				}
				if (res?.form?.errors) {
					self.processErrors(res.form.errors);
				}
				self.onAuthRes(res);
			} catch (err) {
				const error = err as IApiError;
				if (error.data?.form?.errors) {
					self.processErrors(error.data.form.errors);
				}
			}
		}),
		onLogout: flow(function* () {
			try {
				self.isAuthLoading = true;
				const res = yield AuthService.logout();
				if (!res) {
					return;
				}
				cookies.remove(config.sessionCookieName);
				cookies.remove(COOKIE_P2P_SCAMMER_ATTENTION);
				const global = getParent<IRootStore>(self).global;
				global.setIsAuthenticated(false);
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isAuthLoading = false;
			}
		}),
		onRegister: flow(function* () {
			try {
				const body: IRegisterBody = {
					email: self.login,
					password: self.password,
					terms_conditions: self.isConditionsAccepted,
					residence_country: self.countryCode,
					invite: self.invite || undefined,
					ecaptcha: self.recaptchaToken ? self.recaptchaToken : undefined,
				};
				const res = yield AuthService.register(body);
				if (res?.form?.errors) {
					self.processErrors(res.form.errors);
				} else {
					self.isAuthSuccess = true;
				}
			} catch (err) {
				const error = err as IApiError;
				if (error.data?.form?.errors) {
					self.processErrors(error.data.form.errors);
				}
			}
		}),
		loadRecaptcha: flow(function* (type: RecaptchaEnum) {
			try {
				const data =
					type === RecaptchaEnum.LOGIN
						? yield AuthService.getLoginInfo()
						: yield AuthService.getRegisterInfo();
				const fields = data?.form?.fields ?? [];
				if (Array.isArray(fields)) {
					const captcha = fields.find((f) => f.name === "ecaptcha" || f.name === "recaptcha_v3");
					if (captcha) {
						self.recaptchaAction = captcha.action;
						self.recaptchaSiteKey = captcha.site_key;
					}
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export type IAuth = Instance<typeof Auth>;
