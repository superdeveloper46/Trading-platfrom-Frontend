import { ValidationError } from "yup";
import { IP_REGEX } from "constants/common";
import { IOption } from "../components/UI/CurrencySelect";

export const getArrayOfIPsFromString = (stringOfIps: string): string[] => {
	const permittedIPs: string[] = Array.from(new Set(stringOfIps.replace(/\s/g, "").split(",")));

	return permittedIPs.filter((ip: string) => IP_REGEX.test(ip));
};

export function getErrorFromYupValidationRes<ErrorsBody>(
	formValidationRes: Record<string, never> & { inner: ValidationError[] },
): Partial<ErrorsBody> {
	const errors: Record<string, unknown> = {};
	formValidationRes.inner.forEach(({ path, message }) => {
		if (path) {
			errors[path] = message;
		}
	});
	return errors as Partial<ErrorsBody>;
}

export const getSelectOptionFromString = (pair?: string): IOption => ({
	label: {
		code: pair ?? "",
	},
	value: pair ?? "",
});

export const getSelectOptionsFromBalances = (
	arr?: Record<string, any> & { pair?: string }[],
): IOption[] => {
	if (!arr) {
		return [] as IOption[];
	}
	return Array.from(new Set(arr.map((b) => b.pair))).map(getSelectOptionFromString);
};

export const chunkArray = (arr: any[], size: number): any[][] =>
	arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr];
