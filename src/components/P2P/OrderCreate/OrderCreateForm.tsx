import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";
import { MessageDescriptor, useIntl } from "react-intl";
import { AnyObjectSchema } from "yup";

import styles from "styles/pages/P2P/OrderCreate.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Button from "components/UI/Button";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import Select, { ISelectOption } from "components/UI/Select";
import Textarea from "components/UI/Textarea";
import {
	CREATE_AD_FIRST_STEP_VALIDATION_SCHEMA,
	CREATE_AD_SECOND_STEP_VALIDATION_SCHEMA,
	CREATE_AD_THIRD_STEP_VALIDATION_SCHEMA,
	CREATE_ORDER_FIRST_STEP_KEYS,
	CREATE_ORDER_SECOND_STEP_KEYS,
	CREATE_ORDER_THIRD_STEP_KEYS,
	INITIAL_CREATE_AD_FORM,
	StepsEnum,
	TERMS_MAX_SYMBOLS,
} from "constants/p2p";
import {
	ICreateAdFormBody,
	ICreateAdFormErrors,
	ICreateAdRequestBody,
	P2PPaymentTimeEnum,
	P2PSideEnum,
	PriceTypeEnum,
	TCreateAdFirstStepKey,
	TCreateAdSecondStepKey,
	TCreateAdThirdStepKey,
} from "types/p2p";
import P2PService, {
	useBalances,
	usePairs,
	usePaymentMethods,
	usePaymentRequisites,
} from "services/P2PService";
import { queryVars } from "constants/query";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import errorHandler from "utils/errorHandler";
import { getErrorFromYupValidationRes } from "utils/getter";
import { IError } from "types/general";
import { handleFormErrors } from "utils/form";
import commonMessages from "messages/common";
import exchangeMessages from "messages/exchange";
import p2pMessages from "messages/p2p";
import { getRoundedNumber, limitDecimals } from "utils/format";
import { MAX_PRICE_PRECISION } from "utils/constants";
import buyCryptoMessages from "messages/buy_crypto";
import TradingRequirementsModal from "../modals/TradingRequirementsModal";
import CannotPostModal from "../modals/CannotPostModal";
import SetPaymentMethodModal from "../modals/SetPaymentMethodModal";

const OrderCreateForm = () => {
	const { formatMessage, formatNumber } = useIntl();
	const [step, setStep] = useState<StepsEnum>(StepsEnum.FirstStep);

	const localeNavigate = useLocaleNavigate();

	const [formBody, setFormBody] = useState<ICreateAdFormBody>(INITIAL_CREATE_AD_FORM);
	const [formErrors, setFormErrors] = useState<ICreateAdFormErrors>({});

	const [isModalOpened, toggleModal] = useState(false);
	const [isAddMethodModalOpened, toggleAddMethodModal] = useState(false);
	const [isCannotModalOpened, toggleCannotModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const pairSymbol = `${formBody.base_currency}_${formBody.quote_currency}`;

	const { data: balances } = useBalances();
	const { data: pairs, isFetching: isPairsLoading } = usePairs();
	const { data: paymentMethods, isFetching: isMethodsLoading } = usePaymentMethods();
	const {
		data: requisites,
		isFetching: isRequisitesLoading,
		refetch: refetchRequisites,
	} = usePaymentRequisites(formBody.side === P2PSideEnum.Sell);

	const ref = useRef<HTMLDivElement | null>(null);

	const balanceOfBaseCurrency = useMemo(
		() => balances?.find(({ code }) => code === formBody.base_currency),
		[balances, formBody.base_currency],
	);

	const handleSideChange = (side: P2PSideEnum) => {
		setFormBody((prevState) => ({
			...prevState,
			[queryVars.side]: side,
		}));
	};

	const handleSelectChange = (
		name: keyof ICreateAdFormBody,
		v: IOption | ISelectOption | null,
	): void => {
		setFormErrors({});
		const value = v?.value ?? "";
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleMultiSelectChange = (name: keyof ICreateAdFormBody, o: ISelectOption[]) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: o.map(({ value }) => +value),
		}));
	};

	const handleNumberInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
		precision: number = MAX_PRICE_PRECISION,
	) => {
		setFormErrors({});
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: limitDecimals(value, precision),
		}));
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		setFormErrors({});
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const setMaxLimit = () => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[queryVars.maximum]: prevState.amount * prevState.price,
		}));
	};

	const methodsOptions: ISelectOption[] =
		paymentMethods?.results
			.filter((m) => m.currencies.some(({ code }) => code === formBody.quote_currency))
			.map(({ name, id }) => ({
				value: id.toString(),
				label: name,
			})) || [];

	const requisitesOptions: ISelectOption[] =
		requisites?.results
			.filter((r) =>
				r.payment_method.currencies.some(({ code }) => code === formBody.quote_currency),
			)
			.map(({ name, payment_method, id }) => ({
				value: id.toString(),
				label: `${payment_method.name} (${name})`,
			})) || [];

	const priceTypeOptions: ISelectOption[] = [
		{ value: PriceTypeEnum.Fixed.toString(), label: formatMessage(p2pMessages.fixed) },
		{ value: PriceTypeEnum.Floating.toString(), label: formatMessage(p2pMessages.floating) },
	];

	const paymentTimeOptions: ISelectOption[] = [
		{
			value: P2PPaymentTimeEnum.Minutes15.toString(),
			label: formatMessage(p2pMessages.minutes, { value: 15 }),
		},
		{
			value: P2PPaymentTimeEnum.Minutes30.toString(),
			label: formatMessage(p2pMessages.minutes, { value: 30 }),
		},
		{
			value: P2PPaymentTimeEnum.Minutes45.toString(),
			label: formatMessage(p2pMessages.minutes, { value: 45 }),
		},
	];

	const priceTypeValue = priceTypeOptions.find((o) => o.value === formBody.price_type) ?? null;

	const paymentTimeValue =
		paymentTimeOptions.find((o) => o.value === formBody.payment_time) ?? null;

	const baseOptions: IOption[] = useMemo(() => {
		const uniqueCoins: string[] = [];
		if (pairs?.results) {
			return pairs.results
				.filter((v) => {
					if (!uniqueCoins.includes(v.base_currency.code)) {
						uniqueCoins.push(v.base_currency.code);
						return true;
					}
					return false;
				})
				.filter((v) =>
					formBody.quote_currency
						? pairs.results
								.filter(({ quote_currency }) => quote_currency.code === formBody.quote_currency)
								.some((p) => p.base_currency.code === v.base_currency.code)
						: true,
				)
				.map(({ base_currency }) => ({
					value: base_currency.code,
					label: {
						code: base_currency.code,
						name: base_currency.name,
						image_png: base_currency.image_png,
						image_svg: base_currency.image_svg,
						precision: base_currency.precision,
					},
				}));
		}
		return [];
	}, [pairs?.results, formBody.quote_currency]);

	const quoteOptions: IOption[] = useMemo(() => {
		if (pairs?.results) {
			const uniqueCoins: string[] = [];
			return pairs.results
				.filter((v) => {
					if (!uniqueCoins.includes(v.quote_currency.code)) {
						uniqueCoins.push(v.quote_currency.code);
						return true;
					}
					return false;
				})
				.filter((v) =>
					formBody.base_currency
						? pairs.results
								.filter(({ base_currency }) => base_currency.code === formBody.base_currency)
								.some((p) => p.quote_currency.code === v.quote_currency.code)
						: true,
				)
				.map(({ quote_currency }) => ({
					value: quote_currency.code,
					label: {
						code: quote_currency.code,
						name: quote_currency.name,
						image_png: quote_currency.image_png,
						image_svg: quote_currency.image_svg,
						precision: quote_currency.precision,
					},
				}));
		}
		return [];
	}, [pairs?.results, formBody.base_currency]);

	const baseCurrencyValue =
		baseOptions.find((o) => o.label.code === formBody.base_currency) ?? undefined;

	const quoteCurrencyValue =
		quoteOptions.find((o) => o.label.code === formBody.quote_currency) ?? undefined;

	const methodsValue = useMemo(
		() =>
			formBody.payment_methods?.map((value) => {
				const val = methodsOptions.find((o) => +o.value === value);

				return {
					value: val ? val.value : "",
					label: val ? val?.label : "",
				};
			}),
		[formBody.payment_methods],
	);

	const requisitesValue = useMemo(
		() =>
			formBody.payment_requisites?.map((value) => {
				const val = requisitesOptions.find((o) => +o.value === value);

				return {
					value: val ? val.value : "",
					label: val ? val?.label : "",
				};
			}),
		[formBody.payment_requisites],
	);

	const validateStep = async (
		schema: (formatMessages: (v: MessageDescriptor) => string) => AnyObjectSchema,
		resolve: (...args: any[]) => void,
		reject: (...args: any[]) => void,
	) => {
		await schema(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then((res) => {
				setFormErrors({});
				resolve(res);
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<ICreateAdFormErrors>(err));
				reject(err);
			});
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formBody));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));

			const is_first_step_intersection = Object.keys(nextErrors).some((k) =>
				CREATE_ORDER_FIRST_STEP_KEYS.includes(k as TCreateAdFirstStepKey),
			);
			const is_second_step_intersection = Object.keys(nextErrors).some((k) =>
				CREATE_ORDER_SECOND_STEP_KEYS.includes(k as TCreateAdSecondStepKey),
			);
			const is_third_step_intersection = Object.keys(nextErrors).some((k) =>
				CREATE_ORDER_THIRD_STEP_KEYS.includes(k as TCreateAdThirdStepKey),
			);

			if (is_first_step_intersection) {
				setStep(StepsEnum.FirstStep);
			} else if (is_second_step_intersection) {
				setStep(StepsEnum.SecondStep);
			} else if (is_third_step_intersection) {
				setStep(StepsEnum.ThirdStep);
			}
		}
	};

	const handleSubmitButton = () => {
		if (step === StepsEnum.FirstStep) {
			return new Promise((resolve, reject) => {
				validateStep(CREATE_AD_FIRST_STEP_VALIDATION_SCHEMA, resolve, reject);
			})
				.then(() => setStep((prevState) => prevState + 1))
				.catch((err) => console.log(err));
		}
		if (step === StepsEnum.SecondStep) {
			return new Promise((resolve, reject) => {
				validateStep(
					(formatter) =>
						CREATE_AD_SECOND_STEP_VALIDATION_SCHEMA(
							formatter,
							formBody.side,
							+(balanceOfBaseCurrency?.balance || 0),
							formBody.amount * formBody.price,
						),
					resolve,
					reject,
				);
			})
				.then(() => setStep((prevState) => prevState + 1))
				.catch((err) => console.log(err));
		}

		if (step === StepsEnum.ThirdStep) {
			return new Promise((resolve, reject) => {
				validateStep(CREATE_AD_THIRD_STEP_VALIDATION_SCHEMA, resolve, reject);
			})
				.then(() => {
					const body: ICreateAdRequestBody = {
						pair: pairSymbol,
						limit: {
							minimal: getRoundedNumber(
								formBody.minimal / formBody.price,
								baseCurrencyValue?.label.precision,
							),
							maximum: getRoundedNumber(
								formBody.maximum / formBody.price,
								baseCurrencyValue?.label.precision,
							),
						},
						side: formBody.side,
						price: formBody.price,
						price_type: +formBody.price_type,
						payment_time: +formBody.payment_time,
						amount: formBody.amount,
						...(formBody.side === P2PSideEnum.Buy
							? { payment_methods: formBody.payment_methods }
							: { payment_requisites: formBody.payment_requisites }),
						terms: formBody.terms,
					};

					if (!isSubmitting) {
						setIsSubmitting(true);
						P2PService.createAd(body)
							.then(() => {
								localeNavigate(routes.p2p.ads);
								toast.success(formatMessage(p2pMessages.ad_created));
							})
							.catch(handleErrors)
							.finally(() => setIsSubmitting(false));
					}
				})
				.catch((err) => console.log(err));
		}

		return null;
	};

	const cancelStep = () => {
		if (step === StepsEnum.FirstStep) {
			localeNavigate(routes.p2p.main);
		}
		return setStep((currStep) => currStep - 1);
	};

	const handleAddMethodModalClose = () => {
		toggleAddMethodModal(false);
	};

	const firstStepSummary = [
		{
			label: formatMessage(exchangeMessages.asset),
			value: formBody.base_currency,
		},
		{
			label: formatMessage(p2pMessages.cash),
			value: formBody.quote_currency,
		},
		{
			label: formatMessage(p2pMessages.price_type),
			value: priceTypeValue?.label,
		},
		{
			label: formatMessage(p2pMessages.your_price),
			value: `${formBody.price} ${formBody.quote_currency}`,
		},
		{
			label: formatMessage(commonMessages.type),
			value:
				formBody.side === P2PSideEnum.Buy
					? formatMessage(buyCryptoMessages.buy)
					: formatMessage(buyCryptoMessages.sell),
			className: formBody.side === P2PSideEnum.Buy ? styles.buy : styles.sell,
		},
	];

	const secondStepSummary = [
		{
			label: formatMessage(p2pMessages.total_amount),
			value: `${formBody.amount} ${formBody.base_currency}`,
		},
		{
			label: formatMessage(p2pMessages.payment_time_limit),
			value: paymentTimeValue?.label,
		},
		{
			label: formatMessage(p2pMessages.order_limit_from),
			value: `${formBody.minimal} ${formBody.quote_currency}`,
		},
		{
			label: formatMessage(p2pMessages.order_limit_to),
			value: `${formBody.maximum} ${formBody.quote_currency}`,
		},
		...[
			formBody.side === P2PSideEnum.Buy
				? {
						label: formatMessage(p2pMessages.payment_method),
						value: methodsValue.map(({ label }) => label).join(", "),
				  }
				: {
						label: formatMessage(p2pMessages.requisites),
						value: requisitesValue.map(({ label }) => label).join(", "),
				  },
		],
	];

	const handleAllClick = () => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[queryVars.amount]: +(balanceOfBaseCurrency?.balance || 0),
		}));
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmitButton();
		}
	};

	// useEffect(() => {
	// 	setFormBody((prevState) => ({
	// 		...prevState,
	// 		[queryVars.base_currency]: "USDT",
	// 		[queryVars.quote_currency]: "UAH",
	// 		[queryVars.price]: "0",
	// 	}));
	// }, []);

	const handleAddNewMethod = () => {
		ref?.current?.blur(); // Workaround to blur from select when opening new modal (fixing https://alpcomteam.atlassian.net/browse/ALPHA-2661 (cooments))
		toggleAddMethodModal(true);
	};

	const controlsBlock = (
		<div className={styles.controls_container}>
			<Button
				isLoading={isSubmitting}
				onClick={handleSubmitButton}
				fullWidth
				label={
					step === StepsEnum.ThirdStep
						? formatMessage(p2pMessages.publish)
						: formatMessage(p2pMessages.next_step)
				}
			/>
			<Button
				disabled={isSubmitting}
				fullWidth
				onClick={cancelStep}
				variant="outlined"
				label={formatMessage(commonMessages.back_btn)}
			/>
		</div>
	);

	const firstStep = (
		<div className={styles.form_container}>
			<span className={styles.form_title}>{formatMessage(p2pMessages.type_and_price)}</span>
			{step <= StepsEnum.FirstStep ? (
				<>
					<div className={styles.your_price}>
						<span className={cn(p2pStyles.default_text, p2pStyles.smallcaps)}>
							{formatMessage(p2pMessages.your_price)}
						</span>
						<span className={styles.price}>
							{formBody.price || 0} {formBody.quote_currency}
						</span>
					</div>
					<div
						className={cn(p2pStyles.side_selector, {
							[p2pStyles.right]: formBody.side === P2PSideEnum.Sell,
						})}
					>
						<div
							onClick={() => handleSideChange(P2PSideEnum.Buy)}
							className={p2pStyles.side_button}
						>
							{formatMessage(buyCryptoMessages.buy)}
						</div>
						<div
							onClick={() => handleSideChange(P2PSideEnum.Sell)}
							className={p2pStyles.side_button}
						>
							{formatMessage(buyCryptoMessages.sell)}
						</div>
					</div>
					<div className={styles.form_double_row}>
						<CurrencySelect
							isClearable
							value={baseCurrencyValue}
							onSelectChange={(o) => handleSelectChange(queryVars.base_currency, o)}
							options={baseOptions}
							isLoading={isPairsLoading}
							label={formatMessage(exchangeMessages.asset)}
							error={formErrors.base_currency}
							autoFocus
						/>
						<CurrencySelect
							isClearable
							label={formatMessage(p2pMessages.with_cash)}
							value={quoteCurrencyValue}
							onSelectChange={(o) => handleSelectChange(queryVars.quote_currency, o)}
							options={quoteOptions}
							isLoading={isPairsLoading}
							error={formErrors.quote_currency}
							autoFocus
						/>
					</div>
					<Select
						options={priceTypeOptions}
						labeled
						onChange={(o: ISelectOption) => handleSelectChange(queryVars.price_type, o)}
						isSearchable={false}
						label={formatMessage(p2pMessages.price_type)}
						value={priceTypeValue}
						error={formErrors.price_type}
						disabled
					/>
					<Input
						name={queryVars.price}
						type="number"
						onChange={(e) => handleNumberInputChange(e, quoteCurrencyValue?.label.precision)}
						value={formBody.price}
						labelValue={formatMessage(p2pMessages.fixed_price)}
						error={formErrors.price}
						onKeyDown={handleInputKeyDown}
					/>
					{/* <div className={styles.floating_input_container}> */}
					{/*	<span className={styles.label}>Floating Price Margin</span> */}
					{/*	/!* eslint-disable-next-line jsx-a11y/control-has-associated-label *!/ */}
					{/*	<i role="button" className="ai ai-minus_mini" /> */}
					{/*	<span>101,1 %</span> */}
					{/*	/!* eslint-disable-next-line jsx-a11y/control-has-associated-label *!/ */}
					{/*	<i role="button" className="ai ai-plus_mini" /> */}
					{/* </div> */}
					{/* <span className={styles.form_secondary_text}> */}
					{/*	Highest Order Price: <strong> 35.85 UAH </strong> */}
					{/* </span> */}
					{controlsBlock}
				</>
			) : (
				<div className={styles.summary_container}>
					{firstStepSummary.map(({ value, label, className }, i) => (
						<div key={i} className={styles.summary_item}>
							<span className={p2pStyles.smallcaps_label}>{label}</span>
							<span className={cn(styles.summary_value, className)}>{value}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const secondStep = (
		<div className={cn(styles.form_container, { [styles.disabled]: step < StepsEnum.SecondStep })}>
			<span className={styles.form_title}>
				{formatMessage(p2pMessages.total_amount_and_payment_method)}
			</span>
			{step === StepsEnum.SecondStep ? (
				<>
					<Input
						name={queryVars.amount}
						type="number"
						labelValue={formatMessage(p2pMessages.total_amount)}
						value={formBody.amount}
						onChange={(e) => handleNumberInputChange(e, baseCurrencyValue?.label.precision)}
						error={formErrors.amount}
						appender={
							formBody.side === P2PSideEnum.Sell ? (
								<Appender>
									{formBody.base_currency}
									<AppenderDivider />
									<AppenderButton onClick={handleAllClick}>All</AppenderButton>
								</Appender>
							) : null
						}
						helpText={
							formBody.side === P2PSideEnum.Sell ? (
								<span className={p2pStyles.help_text}>
									{formatMessage(commonMessages.available_balance)}{" "}
									<strong>
										{formatNumber(+(balanceOfBaseCurrency?.balance || 0), {
											maximumFractionDigits: balanceOfBaseCurrency?.precision,
										})}{" "}
										{formBody.base_currency}
									</strong>
								</span>
							) : null
						}
					/>
					<div className={styles.form_double_row}>
						<Input
							name={queryVars.minimal}
							value={formBody.minimal}
							type="number"
							labelValue={formatMessage(p2pMessages.order_limit_from)}
							onChange={(e) => handleNumberInputChange(e, quoteCurrencyValue?.label.precision)}
							error={formErrors.minimal}
							appender={<Appender>{formBody.quote_currency}</Appender>}
						/>
						<Input
							name={queryVars.maximum}
							value={formBody.maximum}
							error={formErrors.maximum}
							type="number"
							labelValue={formatMessage(p2pMessages.order_limit_to)}
							onKeyDown={handleInputKeyDown}
							onChange={(e) => handleNumberInputChange(e, quoteCurrencyValue?.label.precision)}
							appender={
								<Appender>
									{formBody.quote_currency} <AppenderDivider />
									<AppenderButton onClick={setMaxLimit}>max</AppenderButton>
								</Appender>
							}
						/>
					</div>
					{formBody.side === P2PSideEnum.Buy ? (
						<Select
							onChange={(o: ISelectOption[]) =>
								handleMultiSelectChange(queryVars.payment_methods, o)
							}
							options={methodsOptions}
							value={methodsValue}
							error={formErrors.payment_methods}
							noOptionsMessage={() => formatMessage(p2pMessages.no_pms)}
							isMulti
							isLoading={isMethodsLoading}
							label={formatMessage(p2pMessages.payment_method)}
						/>
					) : (
						<Select
							selectRef={ref}
							onChange={(o: ISelectOption[]) =>
								handleMultiSelectChange(queryVars.payment_requisites, o)
							}
							options={requisitesOptions}
							value={requisitesValue}
							error={formErrors.payment_requisites}
							noOptionsMessage={() => formatMessage(p2pMessages.no_requisites)}
							isMulti
							isLoading={isRequisitesLoading}
							label={formatMessage(p2pMessages.terms_optional)}
							additionalOption={
								// eslint-disable-next-line jsx-a11y/interactive-supports-focus
								<div
									role="button"
									onClick={handleAddNewMethod}
									className={p2pStyles.additional_option}
								>
									<i className="ai ai-circle_plus" />
									{formatMessage(p2pMessages.set_new_pm)}
								</div>
							}
						/>
					)}
					<Select
						options={paymentTimeOptions}
						labeled
						onChange={(o: ISelectOption) => handleSelectChange(queryVars.payment_time, o)}
						isSearchable={false}
						label={formatMessage(p2pMessages.payment_time_limit)}
						value={paymentTimeValue}
						error={formErrors.payment_time}
					/>
					{controlsBlock}
				</>
			) : (
				<div className={styles.summary_container}>
					{secondStepSummary.map(({ value, label }, i) => (
						<div key={i} className={styles.summary_item}>
							<span className={p2pStyles.smallcaps_label}>{label}</span>
							<span className={styles.summary_value}>{value}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const thirdStep = (
		<div className={cn(styles.form_container, { [styles.disabled]: step < StepsEnum.ThirdStep })}>
			<span className={styles.form_title}>{formatMessage(p2pMessages.terms)}</span>
			{/* <Input */}
			{/*	name="terms" */}
			{/*	labelValue="Terms (Optional)" */}
			{/*	onChange={() => console.log("amount")} */}
			{/*	appender={<Appender>0/1000</Appender>} */}
			{/* /> */}
			<Textarea
				labelValue={formatMessage(p2pMessages.terms_optional)}
				name={queryVars.terms}
				value={formBody.terms}
				maxLength={TERMS_MAX_SYMBOLS}
				onChange={handleInputChange}
				onKeyDown={handleInputKeyDown}
				helpText={formatMessage(
					{ ...commonMessages.symbols_remaining },
					{ amount: TERMS_MAX_SYMBOLS - formBody.terms.length },
				)}
				error={formErrors.terms}
			/>
			{controlsBlock}
		</div>
	);

	return (
		<div className={styles.form_wrapper}>
			{firstStep}
			{secondStep}
			{thirdStep}
			<TradingRequirementsModal isOpen={isModalOpened} onClose={() => toggleModal(false)} />
			<CannotPostModal isOpen={isCannotModalOpened} onClose={() => toggleCannotModal(false)} />
			{isAddMethodModalOpened && (
				<SetPaymentMethodModal
					refetch={refetchRequisites}
					isOpen={isAddMethodModalOpened}
					onClose={handleAddMethodModalClose}
				/>
			)}
		</div>
	);
};

export default OrderCreateForm;
