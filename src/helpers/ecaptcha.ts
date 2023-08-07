import { IEcaptchaData } from "types/general";

export const processEcaptchaResponse = (res: any): IEcaptchaData => {
	if (Array.isArray(res?.form?.fields)) {
		const captcha = res.form.fields.find((f: any) => f.name === "ecaptcha");
		if (captcha) {
			return {
				site_key: captcha.site_key,
				action: captcha.action,
			};
		}
	}

	return { site_key: "", action: "" };
};
