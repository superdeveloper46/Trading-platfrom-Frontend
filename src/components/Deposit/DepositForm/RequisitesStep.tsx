import React, { useCallback, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import coinInfoMessages from "messages/exchange";
import feesMessages from "messages/fees_trading";
import Input, { Appender } from "components/UI/Input";
import InternalLink from "components/InternalLink";
import QRCode from "components/UI/QRCode";
import { useMst } from "models/Root";
import ButtonMicro from "components/UI/ButtonMicro";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IAttribute, IDepositMethod } from "models/Deposit";
import { createDeposit } from "services/DepositService";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { ICreateDepositReq } from "types/deposit";
import InfoSnack from "components/InfoSnack";
import config from "helpers/config";
import { routes } from "constants/routing";
import Button from "components/UI/Button";
import ActionMethods from "components/ActionMethods";
import useCopyClick from "hooks/useCopyClick";
import VerificationRequired from "./VerificationRequired";

const FORMAT_NUMBER_OPTIONS = {
	maximumFractionDigits: 8,
	useGrouping: false,
};

interface IFieldError {
	[key: string]: string;
}

const RequisitesStep: React.FC = () => {
	const {
		account: { profileStatus },
		deposit,
	} = useMst();
	const { deposit_methods, currentCurrency, currentMethod, attributes, isLoading } = deposit;

	const { formatNumber, formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const [amount, setAmount] = useState<string>("");
	const [depositFee, setDepositFee] = useState<number>(0);
	const [errors, setErrors] = useState<IFieldError>({});

	useEffect(() => {
		if (currentMethod) {
			let fee = parseFloat(currentMethod.deposit_fee_amount);
			const feeRate = parseFloat(currentMethod.deposit_fee_rate);
			if (feeRate > 0 && amount) {
				fee += feeRate * parseFloat(amount);
			}
			setDepositFee(fee);
		} else {
			setDepositFee(0);
		}
	}, [currentMethod, amount]);

	useEffect(() => {
		setAmount("");
	}, [currentCurrency?.code]);

	const handleSubmit = useCallback(() => {
		if (amount && currentMethod) {
			const data: ICreateDepositReq = {
				payment_type: currentMethod.id,
				amount: parseFloat(amount),
			};
			createDeposit(data).catch((errors: any) => {
				const newErrors: IFieldError = {};
				if (typeof errors === "object") {
					for (const [key, val] of Object.entries(errors)) {
						const value: string & string[] = val as string & string[];
						const errorText: string = Array.isArray(value) && value.length ? value[0] : value;
						const matched = errorText.match(/^\[ErrorDetail\(string='(.*)', code='.*'\)\]$/);
						newErrors[key] = matched && matched.length > 1 ? matched[1] : errorText;
					}
				} else {
					newErrors.non_field_errors = "Internal Server Error";
				}
				setErrors(newErrors);
			});
		}
	}, [amount, currentMethod]);

	const handleMethodChange = useCallback((newMethod: IDepositMethod) => {
		deposit.setCurrentMethod(newMethod);
	}, []);

	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>): void => {
			const { value } = e.target;
			if (currentMethod) {
				setAmount(
					!value || parseFloat(value) <= parseFloat(currentMethod.max_deposit)
						? value
						: currentMethod.max_deposit,
				);
				if (errors.amount || errors.non_field_errors) {
					setErrors((prevState: IFieldError) => ({
						...prevState,
						amount: "",
						non_field_errors: "",
					}));
				}
			}
		},
		[currentMethod, errors],
	);

	const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	}, []);

	const AverageDepositTime = () =>
		currentMethod?.blockchain_block_interval !== null ? (
			<div className={styles.info_small_secondary}>
				{formatMessage(financeMessages.average_time_to_receive_funds)}
				:&nbsp;
				{currentMethod &&
				currentMethod.deposit_confirmations_need > 0 &&
				currentMethod.blockchain_block_interval ? (
					<span>
						{dayjs(
							dayjs(Date.now()).valueOf() +
								currentMethod.blockchain_block_interval *
									1000 *
									currentMethod.deposit_confirmations_need,
						).fromNow(true)}
					</span>
				) : (
					<span>{formatMessage(commonMessages.instantly)}</span>
				)}
			</div>
		) : null;

	const handleCopyAttrToClipboard = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const { value, label } = e.currentTarget.dataset;
		if (value) {
			copyClick(value, formatMessage(commonMessages.copied_to_clipboard, { label }));
		}
	};

	const MinDeposit = () =>
		currentMethod && currentCurrency ? (
			<div className={styles.min_deposit_container}>
				<i className="ai ai-warning" />
				{formatMessage(feesMessages.deposit_withdraw_min_deposit)}:&nbsp;
				{formatNumber(parseFloat(currentMethod.min_deposit), FORMAT_NUMBER_OPTIONS)}
				&nbsp;
				{currentCurrency.code}
			</div>
		) : null;

	return (
		<div className={styles.step_container}>
			<div className={styles.step_info}>
				<span className={styles.step_info_title}>
					2.&nbsp;{formatMessage(financeMessages.payment_details)}
				</span>
			</div>
			{isLoading ? (
				<LoadingSpinner align="top" />
			) : deposit_methods?.length > 0 &&
			  deposit_methods.some((method) => method.is_deposit_enabled) ? (
				<>
					<div className={styles.form_requisites_container}>
						<ActionMethods
							title={formatMessage(financeMessages.deposit_method)}
							methods={deposit_methods}
							currentMethod={currentMethod as IDepositMethod}
							onChange={handleMethodChange}
							type="deposit"
							// withIcon={deposit_methods.every((method: IDepositMethod) => method.is_sci)}
						/>
						{currentMethod?.is_sci &&
						(profileStatus?.verification_level ?? 0) >=
							(currentMethod?.min_verification_level ?? 0) ? (
							<div className={styles.form_input_group}>
								<Input
									type="number"
									onChange={handleAmountChange}
									value={amount}
									labelValue={formatMessage(commonMessages.amount)}
									appender={<Appender>{currentCurrency?.code?.toUpperCase() ?? ""}</Appender>}
									error={errors.amount || errors.non_field_errors}
									onKeyDown={handleInputKeyDown}
								/>
								<MinDeposit />
								<AverageDepositTime />
							</div>
						) : (
							<>
								<MinDeposit />
								<AverageDepositTime />
							</>
						)}
						{currentMethod &&
						(profileStatus?.verification_level ?? 0) >=
							(currentMethod?.min_verification_level ?? 0) &&
						!currentMethod.is_sci &&
						Array.isArray(attributes) &&
						attributes.length > 1 ? (
							<div className={styles.all_requisites_required}>
								<InfoSnack color="yellow" iconCode="info_filled">
									<span>{formatMessage(financeMessages.all_requisite_required)}</span>
								</InfoSnack>
							</div>
						) : null}
					</div>
					{currentMethod ? (
						(profileStatus?.verification_level ?? 0) >=
						(currentMethod?.min_verification_level ?? 0) ? (
							currentMethod.is_sci ? (
								<div className={cn(styles.form_action_container, styles.with_padding)}>
									<div className={styles.will_be_received}>
										{formatMessage(financeMessages.receive)}:
										<span>
											{formatNumber(
												amount ? parseFloat(amount) - depositFee : 0,
												FORMAT_NUMBER_OPTIONS,
											)}
											&nbsp;
											{currentCurrency?.code ?? ""}
										</span>
									</div>
									<div className={styles.action_fee}>
										{formatMessage(financeMessages.fee)}
										<span>
											{formatNumber(depositFee, FORMAT_NUMBER_OPTIONS)}
											&nbsp;
											{currentCurrency?.code}
										</span>
									</div>
									<Button
										className={styles.submit_button}
										color="primary"
										iconCode="mini_down_right"
										iconAlign="left"
										disabled={!(amount && currentMethod)}
										onClick={() => handleSubmit()}
										label={formatMessage(coinInfoMessages.refill)}
									/>

									<div className={styles.terms_of_use}>
										<span>
											By making Deposit you agree with the&nbsp;
											<InternalLink to={routes.termsOfUse}>Terms of Use</InternalLink>
										</span>
										{config.departmentAddress ? <span>{config.departmentAddress}</span> : null}
									</div>
								</div>
							) : (
								<div className={styles.form_action_container}>
									{Array.isArray(attributes) &&
										attributes.map((attr: IAttribute) => (
											<div className={styles.attribute_container} key={attr.name}>
												{attr.show_qr ? (
													<QRCode
														value={attr.value}
														label={`${attr.label}:`}
														code={attr.value}
														size={175}
													/>
												) : (
													<div className={styles.attribute}>
														<span>{attr.label}</span>
														<span>
															{attr.value}
															<ButtonMicro
																data-value={attr.value}
																data-label={attr.label}
																onClick={handleCopyAttrToClipboard}
																primary
															>
																<i className="ai ai-copy_new" />
															</ButtonMicro>
														</span>
													</div>
												)}
											</div>
										))}
									<div className={styles.attribute_container}>
										<div className={styles.terms_of_use}>
											<span>
												By making Deposit you agree with the&nbsp;
												<InternalLink to={routes.termsOfUse}>Terms of Use</InternalLink>
											</span>
											{config.departmentAddress ? <span>{config.departmentAddress}</span> : null}
										</div>
									</div>
								</div>
							)
						) : (
							<div className={cn(styles.form_action_container, styles.with_padding)}>
								<VerificationRequired level={currentMethod?.min_verification_level ?? 0} />
							</div>
						)
					) : null}
				</>
			) : (
				<InfoSnack color="red" iconCode="warning">
					<span>{formatMessage(financeMessages.deposit_unavailable)}</span>
				</InfoSnack>
			)}
		</div>
	);
};

export default observer(RequisitesStep);
