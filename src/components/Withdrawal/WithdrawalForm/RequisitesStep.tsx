import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import { IActionMethodAttribute, IWithdrawalMethod } from "models/Withdrawal";
import { ICreateWithdrawReq, ICreateWithdrawRes } from "types/withdrawal";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/DepositWithdrawal.module.scss";
import ActionMethods from "components/ActionMethods";
import InfoSnack from "components/InfoSnack";
import Button from "components/UI/Button";
import TextareaWithToggle from "components/UI/TextareaWithToggle";
import config from "helpers/config";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import HelpInfo from "./HelpInfo";
import WithdrawalFee from "./WithdrawalFee";

const FORMAT_NUMBER_OPTIONS = {
	maximumFractionDigits: 8,
	useGrouping: false,
};

interface IFieldError {
	[key: string]: string;
}

const RequisitesStep: React.FC = () => {
	const {
		withdrawal: {
			withdraw_methods,
			withdraw_limit,
			attributes,
			currentCurrency,
			isLoading,
			createWithdraw,
			setAttribute,
			setCurrentMethod,
			currentMethod,
		},
		global: { locale },
		render,
	} = useMst();

	const { formatMessage, formatNumber } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const { mobile } = useWindowSize();
	const [note, setNote] = useState<string>("");
	const [amount, setAmount] = useState<string>("");
	const [submitIsDisabled, setSubmitIsDisabled] = useState<boolean>(true);
	const [errors, setErrors] = useState<IFieldError>({});
	const [withdrawalFee, setWithdrawalFee] = useState<number>(0);
	const [willBeReceived, setWillBeReceived] = useState<number>(0);

	const hardLimitUntil =
		withdraw_limit && withdraw_limit.is_hard_limited && withdraw_limit.hard_limit_until
			? dayjs(withdraw_limit.hard_limit_until).format("DD/MM/YYYY HH:mm")
			: null;

	const getInfoSnackLink = useCallback(() => {
		if (currentCurrency) {
			const { code } = currentCurrency;
			if (code === "ALC") {
				return `/${locale}/social-listing`;
			}
		}
		return "";
	}, [locale, currentCurrency]);

	const getInfoSnackColor = useCallback((): "yellow" | "red" => {
		if (currentCurrency) {
			const { name, code } = currentCurrency;
			if (name.toUpperCase().split(" ").includes("DEMO") || code === "ALC") {
				return "yellow";
			}
		}
		return "red";
	}, [currentCurrency]);

	const getInfoSnackText = useCallback((): string => {
		if (currentCurrency) {
			const { name, code } = currentCurrency;
			if (name.toUpperCase().split(" ").includes("DEMO")) {
				return formatMessage(financeMessages.withdraw_is_impossible_demo);
			}
			if (code === "ALC") {
				return formatMessage(financeMessages.withdraw_is_impossible_alc);
			}
		}
		return formatMessage(financeMessages.withdrawal_is_not_available);
	}, [currentCurrency]);

	useEffect(() => {
		setAmount("");
		handleErrors({}, false);
	}, [currentCurrency?.code]);

	useEffect(() => {
		if (currentMethod) {
			const feeRate = parseFloat(currentMethod.withdraw_fee_rate);
			let fee = parseFloat(currentMethod.withdraw_fee_amount);
			if (feeRate > 0 && amount) {
				fee += feeRate * parseFloat(amount);
			}
			setWithdrawalFee(fee);
		} else {
			setWithdrawalFee(0);
		}
	}, [currentMethod, amount]);

	useEffect(() => {
		let fieldsNotEmpty = true;
		for (let i = 0; i < attributes.length; i++) {
			if (attributes[i].required && !attributes[i].value) {
				fieldsNotEmpty = false;
				break;
			}
		}
		setSubmitIsDisabled(!(currentCurrency && currentMethod && fieldsNotEmpty && amount));
	}, [currentCurrency, currentMethod, attributes, amount]);

	useEffect(() => {
		const subtractor =
			currentMethod?.withdraw_fee_currency?.code === currentCurrency?.code ? withdrawalFee : 0;
		setWillBeReceived(amount ? parseFloat(amount) - subtractor : 0);
	}, [amount, withdrawalFee, currentMethod, currentCurrency]);

	const handleMethodChange = useCallback(
		(newMethod: IWithdrawalMethod) => {
			setAttribute("address", "");

			setCurrentMethod(newMethod);
		},
		[currentMethod?.id],
	);

	const handleAllAmountFill = (): void => {
		// console.log(currentCurrency?.available);
		// console.log(currentCurrency?.available.toFixed(8));
		setAmount(currentCurrency ? currentCurrency.available.toFixed(8) : "");
	};

	const handleNoteChange = (note: string) => {
		setNote(note);
	};

	const handleErrors = useCallback((errors: IFieldError, append = true) => {
		setErrors((prevState) => {
			if (append) {
				return {
					...prevState,
					...errors,
				};
			}
			return {
				...errors,
			};
		});
	}, []);

	const getAddressRegExp = useCallback(
		(attributes: IActionMethodAttribute[]) =>
			attributes?.find((attr: IActionMethodAttribute) => attr.name === "address")?.regex,
		[],
	);

	const handleFieldChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			if (name) {
				// auto complete method via address attr value
				if (name === "address") {
					// const regExps = withdraw_methods.map((method) => getAddressRegExp(method.attributes));
					// const hasDuplicates = regExps.some(
					// 	(element) => regExps.indexOf(element) !== regExps.lastIndexOf(element),
					// );

					// if (!hasDuplicates) {
					const matchedMethod = withdraw_methods.find((method: IWithdrawalMethod) => {
						const regex = getAddressRegExp(method.attributes);
						if (regex) {
							const regExp = new RegExp(regex);
							if (regExp.test(value)) {
								return true;
							}
						}
						return false;
					});
					if (matchedMethod && matchedMethod.is_withdraw_enabled) {
						setCurrentMethod(matchedMethod);
					}
					// }
				}
				setAttribute(name, value);
				if (errors[name]) {
					handleErrors({ [name]: "" });
				}
			}
		},
		[errors, withdraw_methods],
	);

	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			if (currentMethod) {
				setAmount(
					!value || parseFloat(value) <= parseFloat(currentMethod.max_withdraw)
						? value
						: currentMethod.max_withdraw,
				);
				if (errors.amount || errors.non_field_errors) {
					handleErrors({ amount: "", non_field_errors: "" });
				}
			}
		},
		[currentMethod, errors],
	);

	const handleSubmit = async () => {
		if (!submitIsDisabled && validateFields(attributes) && currentMethod?.id) {
			const data: ICreateWithdrawReq = {
				payment_type: currentMethod.id,
				amount,
				note,
				attributes: attributes.reduce(
					(obj, item) =>
						!item.required && !item.value ? { ...obj } : { ...obj, [item.name]: item.value },
					{},
				),
			};
			try {
				const res: ICreateWithdrawRes = await createWithdraw(data);
				localeNavigate(routes.confirm.getWithdrawConfirm(res.slug));
			} catch (errors) {
				const nextErrors: IFieldError = {};
				if (typeof errors === "object") {
					for (const [key, val] of Object.entries(errors as IFieldError)) {
						const value = val as string & string[];
						const errorText = Array.isArray(value) && value.length ? value[0] : value;
						const matched = errorText.match(/^\[ErrorDetail\(string='(.*)', code='.*'\)\]$/);
						nextErrors[key] = matched && matched.length > 1 ? matched[1] : errorText;
					}
				} else {
					nextErrors.non_field_errors = "Internal Server Error";
				}
				handleErrors(nextErrors);
			}
		}
	};

	const handleInputKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleSubmit();
			}
		},
		[handleSubmit],
	);

	const validateFields = useCallback(
		(attributes: IActionMethodAttribute[]): boolean => {
			let isValid = true;
			if (!currentMethod) return false;
			for (let i = 0; i < attributes.length; i++) {
				const { max_length, min_length, regex, type, value, name, label } = attributes[i];
				if (type === "number" && Number.isNaN(value)) {
					handleErrors({ [name]: formatMessage(financeMessages.error_use_only_digits) });
					isValid = false;
					// eslint-disable-next-line no-continue
					continue;
				}
				if (max_length !== null && value && value.length > max_length) {
					handleErrors({
						[name]: formatMessage(financeMessages.error_invalid_length_max, {
							field: `'${label}'`,
							length: max_length,
						}),
					});
					isValid = false;
					// eslint-disable-next-line no-continue
					continue;
				}
				if (min_length !== null && value && value.length < min_length) {
					handleErrors({
						[name]: formatMessage(financeMessages.error_invalid_length_min, {
							field: `'${label}'`,
							length: max_length,
						}),
					});
					isValid = false;
					// eslint-disable-next-line no-continue
					continue;
				}
				if (regex !== null) {
					const regExp = new RegExp(regex);
					if (value && !regExp.test(value)) {
						handleErrors({
							[name]: formatMessage(financeMessages.error_invalid_field, {
								field: `'${label}'`,
							}),
						});
						isValid = false;
					}
				}
			}
			return isValid;
		},
		[currentMethod, errors],
	);

	return (
		<div className={styles.step_container}>
			<div className={styles.step_info}>
				<span className={styles.step_info_title}>
					2.&nbsp;{formatMessage(financeMessages.enter_recipient_details)}
				</span>
				{/* <StepInfoLink to={`${locale}/profile/wallets`}>
					<i className="ai ai-file_text" />
					<span>{intl.formatMessage({ ...financeMessages.address_book })}</span>
					<i className="ai ai-chevron_right" />
				</StepInfoLink> */}
			</div>
			{isLoading ? (
				<LoadingSpinner align="top" />
			) : withdraw_methods?.length > 0 && withdraw_methods.some((m) => m.is_withdraw_enabled) ? (
				<>
					{hardLimitUntil && (
						<InfoSnack color="yellow" iconCode="warning" className={styles.info_snack}>
							<span>
								{formatMessage(financeMessages.withdrawal_time_warning, {
									datetime: hardLimitUntil,
								})}
							</span>
						</InfoSnack>
					)}
					<div className={styles.form_requisites_container}>
						<ActionMethods
							title={formatMessage(financeMessages.withdrawal_method)}
							methods={withdraw_methods}
							currentMethod={currentMethod as IWithdrawalMethod}
							type="withdraw"
							onChange={handleMethodChange}
						/>
						{attributes.map((field: IActionMethodAttribute) => (
							<div className={styles.form_input_group} key={field.name}>
								<Input
									name={field.name}
									value={field.value}
									onChange={handleFieldChange}
									labelValue={`${field.label}${
										!field.required ? ` (${formatMessage(commonMessages.optional)})` : ""
									}`}
									error={errors[field.name]}
									onKeyDown={handleInputKeyDown}
								/>
							</div>
						))}
						<div className={styles.form_input_group}>
							<Input
								name="amount_input"
								type="number"
								onChange={handleAmountChange}
								value={amount}
								labelValue={formatMessage(commonMessages.amount)}
								appender={
									<Appender>
										{currentCurrency?.code?.toUpperCase() ?? ""}
										<AppenderDivider />
										<AppenderButton onClick={handleAllAmountFill}>all</AppenderButton>
									</Appender>
								}
								helpText={`${formatMessage(financeMessages.withdraw_min_sum)} ${
									formatNumber(
										parseFloat(currentMethod?.min_withdraw?.replace(",", ".") ?? "0"),
										FORMAT_NUMBER_OPTIONS,
									) ?? "0"
								} ${currentMethod?.currency?.code?.toUpperCase() ?? ""}`}
								error={errors.amount || errors.non_field_errors}
								onKeyDown={handleInputKeyDown}
							/>
						</div>
						<TextareaWithToggle
							title={formatMessage(financeMessages.make_a_note)}
							titleIconClass="ai ai-edit"
							tooltipIconClass="ai ai-hint"
							tooltipText={formatMessage(financeMessages.note_tooltip)}
							placeholder={formatMessage(commonMessages.enter_text)}
							value={note}
							onChange={handleNoteChange}
						/>
					</div>
					<div className={cn(styles.form_action_container, styles.with_padding)}>
						<div className={styles.will_be_received}>
							{formatMessage(financeMessages.receive)}:
							<span>
								{formatNumber(willBeReceived, FORMAT_NUMBER_OPTIONS)}
								&nbsp;
								{currentCurrency?.code ?? ""}
							</span>
						</div>
						<WithdrawalFee
							fee={withdrawalFee}
							currencyCode={currentMethod?.withdraw_fee_currency?.code ?? ""}
						/>
						<div className={styles.submit_button_container}>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								disabled={submitIsDisabled}
								onClick={() => handleSubmit()}
								iconAlign="left"
								iconCode="mini_up_right"
								label={formatMessage(financeMessages.withdraw_action)}
							/>
						</div>
						<div className={styles.terms_of_use}>
							<span>
								By making Withdraw you agree with the&nbsp;
								<InternalLink to={routes.termsOfUse}>Terms of Use</InternalLink>
							</span>
							{config.departmentAddress ? <span>{config.departmentAddress}</span> : null}
						</div>
					</div>
					{mobile && render.supportCenter && <HelpInfo />}
				</>
			) : (
				<InfoSnack color={getInfoSnackColor()} link={getInfoSnackLink()} iconCode="warning">
					<span>{getInfoSnackText()}</span>
				</InfoSnack>
			)}
		</div>
	);
};

export default observer(RequisitesStep);
