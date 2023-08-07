import ApiClient from "helpers/ApiClient";
import {
	ILoginBody,
	IRegisterBody,
	IResetPasswodRequestBody,
	IResetPasswordBody,
	IRestorePasswordBody,
} from "types/auth";

const AuthService = {
	login: (body: ILoginBody | IRestorePasswordBody) => ApiClient.post("web/profile/auth", body),
	logout: () => ApiClient.post("web/profile/logout"),
	register: (body: IRegisterBody) => ApiClient.post("web/profile/register", body),
	resetPasswordRequest: (body: IResetPasswodRequestBody) =>
		ApiClient.post("web/profile/reset-password-code/request", body),
	getResetPasswordToken: () => ApiClient.get("web/profile/reset-password-code/request"),
	resetPasswordConfirm: (slug: string, body: IResetPasswordBody) =>
		ApiClient.post(`web/profile/reset-password-code/${slug}/confirm`, body),
	getLoginInfo: () => ApiClient.get("web/profile/auth"),
	getRegisterInfo: () => ApiClient.get("web/profile/register"),
};

export default AuthService;
