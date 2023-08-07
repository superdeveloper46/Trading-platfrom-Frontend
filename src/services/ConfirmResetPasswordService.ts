import ApiClient from "helpers/ApiClient";

const ConfirmResetPasswordService = {
	confirm: (params: any) =>
		ApiClient.post("web/confirm/password-reset", { ...params, action: "confirm" }),
};

export default ConfirmResetPasswordService;
