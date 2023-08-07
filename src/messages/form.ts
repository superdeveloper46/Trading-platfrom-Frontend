import { defineMessages } from "react-intl";

export default defineMessages({
	required: {
		id: "app.components.form_errors.required",
		defaultMessage: "This field is required",
	},
	max_length: {
		id: "app.components.form_errors.max_length",
		defaultMessage: "Maximum length is",
	},
	min_length: {
		id: "app.components.form_errors.min_length",
		defaultMessage: "Minimum length is",
	},
	max_value: {
		id: "app.components.form_errors.max_value",
		defaultMessage: "Maximum value is",
	},
	min_value: {
		id: "app.components.form_errors.min_value",
		defaultMessage: "Minimum value is",
	},
	max_digits: {
		id: "app.components.form_errors.max_digits",
		defaultMessage: "Maximum digits",
	},
	min_digits: {
		id: "app.components.form_errors.man_digits",
		defaultMessage: "Minimum digits",
	},
	wrong_email: {
		id: "app.components.form_errors.form_wrong_email",
		defaultMessage: "Wrong email type",
	},
	max_size: {
		id: "app.components.form_errors.form_max_size",
		defaultMessage: "Wrong max size",
	},
	wrong_type: {
		id: "app.components.form_errors.form_wrong_type",
		defaultMessage: "Wrong type",
	},
	passwords_do_not_match: {
		id: "app.components.form_errors.passwords_do_not_match",
		defaultMessage: "Passwords do not match",
	},
	it_cant_be_email: {
		id: "app.components.form_errors.it_cant_be_email",
		defaultMessage: "It can't be email",
	},
	description_more_than_40_chars: {
		id: "app.components.form_errors.description_more_than_40_chars",
		defaultMessage: "Description should be no more than 40 characters.",
	},
	password_requirements: {
		id: "app.components.form_errors.password_requirements",
		defaultMessage:
			"Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special char",
	},
	password_is_too_short: {
		id: "app.components.form_errors.password_is_too_short",
		defaultMessage: "Password is too short - should be 8 chars minimum.",
	},
	expiry_date_can_not_be_less_than_6_months: {
		id: "app.components.form_errors.expiry_date_can_not_be_less_than_6_months",
		defaultMessage: "Expiry date can not be less than {value} months",
	},
	url_wrong_error: {
		id: "app.components.form_errors.url_wrong_error",
		defaultMessage: "URL is not valid (must start from http(s)://)",
	},
});
