import { IError } from "types/general";

export const handleFormErrors = (err: IError, keys: string[]): Record<string, any> => {
	const { data: errors } = err;
	const nextErrors: Record<string, any> = {};
	if (errors) {
		keys.forEach((key) => {
			if (errors[key]) {
				nextErrors[key] =
					Array.isArray(errors[key]) && errors[key].length ? errors[key][0] : errors[key];
			}
		});
	}
	return nextErrors;
};
