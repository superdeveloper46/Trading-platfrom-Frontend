export interface ILoginBody {
	password: string;
	email: string;
	security_code?: string;
	ecaptcha?: string;
}

export interface IRestorePasswordBody {
	password: string;
	wizard_id: string;
}

export interface IResetPasswodRequestBody {
	email: string;
	ecaptcha: string;
}

export interface IRegisterBody {
	email: string;
	password: string;
	residence_country: string;
	terms_conditions: boolean;
	invite?: string;
	ecaptcha?: string;
}

export interface IResetPasswordBody {
	password: string;
	password2: string;
}

export enum RecaptchaEnum {
	LOGIN = "login",
	REGISTER = "register",
}

export interface IField {
	help_text: string;
	label: string;
	max_length: number;
	name: string;
	required: boolean;
	type: string;
}

export enum AuthFormFieldsEnum {
	LOGIN = "login",
	PASSWORD = "password",
	INVITE = "invite",
	PASSWORD_CONFIRM = "password-confirm",
	SECURITY_CODE = "security-code",
}
