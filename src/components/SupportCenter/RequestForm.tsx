import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";

import Input from "components/UI/Input";
import messages from "messages/support";
import Button from "components/UI/Button";
import styles from "styles/pages/SupportCenter.module.scss";
import commonMessages from "messages/common";
import { sendReport, useSupportRequestFormData } from "services/SupportCenterService";
import Textarea from "components/UI/Textarea";
import { useMst } from "models/Root";
import useAutoFetch from "hooks/useAutoFetch";
import { removeCaptchaBadge } from "utils/browser";
import Selector from "./Selector";

interface IErrors {
	author_name: string;
	author_email: string;
	subject: string;
	message: string;
}

// TODO: is it needed to fill these options from response? or they are fixed?
const getOptionsListValues = () => {
	const { data } = useSupportRequestFormData();
	const selectorData = data?.form?.fields?.find((el: { type: string }) => el.type === "choice");
	return selectorData?.choices
		? selectorData.choices.map((choiceItem: [number, string]) => ({
				value: String(choiceItem[0]),
				label: choiceItem[1],
		  }))
		: [];
};

// TODO REFACTOR

const useRecaptcha = () => {
	const { data } = useSupportRequestFormData();
	const recaptchaData = data?.form?.fields?.find(
		(el: { type: string }) => el.type === "recaptcha_v3",
	);
	const isRecaptchaEnabled = !!recaptchaData;
	const siteKey = recaptchaData?.site_key;

	useEffect(() => {
		if (isRecaptchaEnabled && siteKey) {
			loadReCaptcha(siteKey);
		}
	}, [isRecaptchaEnabled, siteKey]);

	const refreshReCaptcha = () => {
		if (siteKey) {
			loadReCaptcha(siteKey);
		}
	};

	return { isRecaptchaEnabled, refreshReCaptcha, siteKey };
};

const inputsInitialState = {
	author_name: "",
	author_email: "",
	subject: "",
	message: "",
};

const RequestForm: React.FC = () => {
	const {
		global: { department },
	} = useMst();
	const { formatMessage } = useIntl();
	const { isRecaptchaEnabled, refreshReCaptcha, siteKey } = useRecaptcha();
	const [inputs, setInputs] = useState<Record<string, string | number>>(inputsInitialState);
	const [errors, setErrors] = useState<IErrors>({
		author_name: "",
		author_email: "",
		subject: "",
		message: "",
	});
	const [disableButton, setDisableButton] = useState(false);
	const [captcha, setCaptcha] = useState("");
	const listOptions = getOptionsListValues();
	const activeOption =
		listOptions.find(
			(element: { value: string; label: string }) => element.value === String(inputs.subject),
		) || null;

	useAutoFetch(refreshReCaptcha, true, 60000);

	const handleSubmit = useCallback(async () => {
		try {
			setDisableButton(true);
			let params = { ...inputs };
			if (isRecaptchaEnabled) {
				params = { ...params, ecaptcha: captcha };
			}

			const result = await sendReport(params);
			refreshReCaptcha();
			const formErrors = result?.form?.errors;
			if (formErrors && Object.keys(formErrors).length !== 0) {
				for (const key in formErrors) {
					if (key in errors) {
						setErrors((prevState) => ({ ...prevState, [key]: formErrors[key][0] }));
					}
				}
			} else {
				setInputs(inputsInitialState);
			}
			if (result.message) {
				toast(result.message);
			}
		} finally {
			setDisableButton(false);
		}
	}, [errors, captcha, inputs, isRecaptchaEnabled]);

	const handleFieldsChange = useCallback((name: string, value: string | number) => {
		if (["author_name", "author_email", "subject", "message"].includes(name)) {
			setErrors((prevState) => ({ ...prevState, [name]: "" }));
			setInputs((prevState) => ({ ...prevState, [name]: value }));
		}
	}, []);

	const handleSelectChange = useCallback(
		({ value }: { value: string }) => {
			handleFieldsChange("subject", Number(value));
		},
		[handleFieldsChange],
	);

	const handleInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			handleFieldsChange(name, value);
		},
		[handleFieldsChange],
	);

	useEffect(() => () => removeCaptchaBadge(), []);

	return (
		<div className={styles.form_wrapper}>
			<div className={styles.form_title}>
				<i className="ai ai-mail" />
				{formatMessage(messages.support_request_form_header)}
			</div>
			<div className={styles.request_form}>
				<Input
					labelValue={formatMessage(messages.support_request_name)}
					value={inputs.author_name}
					onChange={handleInputChange}
					error={errors.author_name}
					autoFocus
					name="author_name"
				/>
				<Input
					labelValue={formatMessage(commonMessages.email)}
					value={inputs.author_email}
					onChange={handleInputChange}
					error={errors.author_email}
					name="author_email"
				/>
				<Selector
					placeholder={formatMessage(messages.support_request_list_placeholder)}
					defaultValue={null}
					value={activeOption}
					name="select"
					options={listOptions}
					onChange={handleSelectChange}
					error={errors.subject}
				/>
				<Textarea
					name="message"
					value={inputs.message}
					key="message"
					onChange={handleInputChange}
					labelValue="Message"
					expand
					error={errors.message}
				/>
				<Button
					color="primary"
					type="submit"
					iconCode="send"
					iconAlign="right"
					disabled={disableButton}
					label={formatMessage(messages.support_send_feedback)}
					onClick={handleSubmit}
				/>
				<div className={styles.form_email_text}>
					<span>
						<i className="ai ai-info_outlined" />
						{formatMessage(messages.support_email_label)}:&nbsp;
					</span>
					<a href={`mailto:${department.support_email}`}>{department.support_email}</a>
				</div>
				{isRecaptchaEnabled && (
					<ReCaptcha
						action="support/create_issue"
						sitekey={siteKey}
						verifyCallback={(token) => {
							setCaptcha(token);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default observer(RequestForm);
