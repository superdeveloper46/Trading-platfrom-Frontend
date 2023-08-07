import { ValidationError } from "yup";
import * as yup from "yup";
import { FixedSizeArray } from "types/general";
import { RequiredStringSchema } from "yup/lib/string";
import { AnyObject } from "yup/lib/types";
import { RequiredNumberSchema } from "yup/lib/number";

export function errorsFromSchema<ErrorsBody>(
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

export const validateSchema = (
	body: Record<
		string,
		FixedSizeArray<
			2,
			| string
			| number
			| RequiredStringSchema<string | undefined, AnyObject>
			| RequiredNumberSchema<number | undefined, AnyObject>
			| any
		> // [fieldValue, errorMessage]
	>,
) => {
	const objSchema: Record<string, any> = {};
	const objToValidate: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(body)) {
		[objToValidate[key], objSchema[key]] = value;
	}

	return yup.object(objSchema).validate(objToValidate, { abortEarly: false });
};
