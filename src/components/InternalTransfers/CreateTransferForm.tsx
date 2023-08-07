import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import TransferCreatedImg from "assets/images/internal_transfers/transfer-activated.svg";
import styles from "styles/components/InternalTransfers/CreateTransferForm.module.scss";
import * as yup from "yup";
import internalTransfersMessages from "messages/transfers";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import formMessages from "messages/form";
import Breadcrumbs from "components/Breadcrumbs";
import InternalLink from "components/InternalLink";
import Button, { ButtonsGroup } from "components/UI/Button";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import Input, { Appender, AppenderButton } from "components/UI/Input";
import CheckBox from "components/UI/CheckBox";
import Textarea from "components/UI/Textarea";
import { ICreateTransferRes, IInternalTransferDetails } from "types/internal_transfers";
import { SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import { observer } from "mobx-react-lite";
import { formatNumberNoRounding } from "utils/format";
import { errorsFromSchema, validateSchema } from "utils/yup";
import errorHandler from "utils/errorHandler";
import InternalTransferService from "services/InternalTransferService";
import useParamQuery from "hooks/useSearchQuery";
import SecureToken from "components/SecureToken";
import { IApiError } from "helpers/ApiClient";
import { IBalance } from "models/Account";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import { TransferInfoItem } from "./TransferCommon";
import { processBalances } from "./InternalTransfersUtil";

interface IFormBody {
	currency: string;
	amount: string;
	receiver: string;
	valid_days: string;
	message: string;
	note: string;
	[key: string]: string;
}

interface IFormErrors {
	currency: string;
	amount: string;
	receiver: string;
	message: string;
	note: string;
	[key: string]: string;
}

const CreateTransferForm: React.FC = () => {
	const { formatMessage } = useIntl();
	const [delayTime, setDelayTime] = useState<string>("");
	const [slug, setSlug] = useState<string | undefined>("");
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | undefined>();
	const [isSubmitting, setSubmitting] = useState(false);
	const [isSuccessful, setSuccessful] = useState<boolean>(false);
	const [securityCode, setSecurityCode] = useState<boolean>(false);
	const query = useParamQuery();
	const [details, setDetails] = useState<IInternalTransferDetails | null>(null);
	const [note, setNote] = useState<boolean>(false);
	const initialCurrency = query.get(queryVars.curr);
	const [isLoading, setLoading] = useState<boolean>(false);

	const {
		account: { loadBalances, balances, isBalancesLoaded, loadRates },
		tickers: { list: tickers, loadTickers },
	} = useMst();

	const [formBody, setFormBody] = useState<IFormBody>({
		currency: initialCurrency ?? "",
		amount: "",
		receiver: "",
		valid_days: "",
		message: "",
		note: "",
	});
	const [formErrors, setFormErrors] = useState<IFormErrors>({
		currency: "",
		amount: "",
		receiver: "",
		message: "",
		note: "",
	});

	const [currencies, setCurrencies] = useState<IOption[]>([]);

	useEffect(() => {
		getBalances();
	}, []);

	useEffect(() => {
		setCurrencies([...processBalances(balances as IBalance[])]);
	}, [isLoading, isBalancesLoaded, tickers.length]);

	const currencyOption = currencies.find((c) => c.value === formBody.currency);

	const toggleSecurityCode = () => setSecurityCode(!securityCode);

	const toggleNote = () => {
		setNote(!note);
		if (note) return;
		setFormBody((f) => ({ ...f, note: "" }));
		setFormErrors((e) => ({ ...e, note: "" }));
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (name === "valid_days") {
			setFormBody((form) => ({
				...form,
				valid_days: value ? Math.min(Math.max(0, +value), 366).toString() : "",
			}));
		} else {
			setFormBody((form) => ({
				...form,
				[name]: value,
			}));
		}

		setFormErrors((errors) => (errors[name] ? { ...errors, [name]: "" } : errors));
	};

	const onSlugChange = (slug: string) => setSlug(slug);

	const onCurrencySelect = (e: IOption) => {
		const { value } = e;

		if (value !== formBody.currency) {
			setFormBody((prevState) => ({
				...prevState,
				currency: value,
				amount: "",
			}));
			setFormErrors((prevState) => ({
				...prevState,
				currency: "",
			}));
		}
	};

	const onMaxClick = () => {
		if (!currencyOption?.label?.available) return;

		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(
				+(currencyOption?.label?.available ?? 0),
				currencyOption.label.precision,
			),
		}));

		setFormErrors((prevState) => ({
			...prevState,
			amount: "",
		}));
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter") return;
		submit();
	};

	const onSecureTokenSuccess = (res: ICreateTransferRes) => {
		setSuccessful(true);
		setDetails(res.transfer);
	};

	const onCancelTransferRequest = async () => {
		if (!slug) return;
		try {
			await InternalTransferService.cancelCreateTransferRequest(slug);
			setTokenType(undefined);
			setDelayTime("");
		} catch (err) {
			errorHandler(err);
		}
	};

	const onReset = () => {
		getBalances();
		setFormBody({
			currency: "",
			amount: "",
			receiver: "",
			valid_days: "",
			message: "",
			note: "",
		});
		setFormErrors({
			currency: "",
			amount: "",
			receiver: "",
			message: "",
			note: "",
			valid_days: "",
		});
		setSubmitting(false);
		setSuccessful(false);
		setNote(false);
		setSecurityCode(false);
		setTokenType(undefined);
		setDelayTime("");
		setSlug("");
		setDetails(null);
	};

	const getBalances = async () => {
		try {
			setLoading(true);
			await loadRates();
			await loadTickers();
			await loadBalances();
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const validate = async () => {
		try {
			await validateSchema({
				currency: [formBody.currency, yup.string().required(formatMessage(formMessages.required))],
				amount: [formBody.amount, yup.string().required(formatMessage(formMessages.required))],
				receiver: [formBody.receiver, yup.string().required(formatMessage(formMessages.required))],
			});
			return true;
		} catch (err) {
			setFormErrors(errorsFromSchema<IFormErrors>(err as any) as IFormErrors);
			return false;
		}
	};

	const submit = async () => {
		if (!(await validate())) return;
		try {
			const data = await InternalTransferService.createTransferRequest({
				...formBody,
				amount: +formBody.amount,
				valid_days: +formBody.valid_days || undefined,
			});
			if (data.is_ok) {
				setSuccessful(true);
				return;
			}

			if (data.is_totp_required && !data.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(data.totp_timeout);
			} else if (data.is_pincode_required && !data.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(data.pincode_timeout);
			}

			setSlug(data.slug);
		} catch (err) {
			const e = err as IApiError;
			if (e.data) {
				setFormErrors({ ...e.data });
			}
			errorHandler(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.page_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.transfers.root,
						label: formatMessage(commonMessages.transfer),
					},
				]}
				current={formatMessage(internalTransfersMessages.transfer_creation)}
			/>
			<div className={styles.card}>
				<h3 className={styles.card_title}>
					{formatMessage(
						isSuccessful
							? internalTransfersMessages.transfer_sent
							: tokenType
							? internalTransfersMessages.transfer_confirming
							: internalTransfersMessages.transfer_creation,
					)}
				</h3>

				{isSuccessful ? (
					<>
						{details?.valid_till && (
							<span>{formatMessage(internalTransfersMessages.secure_transfer_await_receiver)}</span>
						)}
						<div className={styles.created_transfer_container}>
							<img
								src={TransferCreatedImg}
								alt="Transfer Created"
								title="Transfer Created"
								width="250"
								height="88"
							/>
							{details && (
								<div className={styles.created_transfer_info}>
									<TransferInfoItem
										title={<>{formatMessage(commonMessages.amount)}:</>}
										subtitle={
											<>
												<b>
													{formatNumberNoRounding(
														+details.amount,
														details.currency?.precision ?? 8,
													)}
												</b>
												&nbsp;
												{details.currency?.code ?? "--"}
											</>
										}
									/>
									<TransferInfoItem
										title={<>{formatMessage(commonMessages.sender)}&nbsp;User ID:</>}
										subtitle={details.sender}
									/>
									<TransferInfoItem
										title={<>{formatMessage(commonMessages.receiver)}&nbsp;User ID:</>}
										subtitle={details.receiver.uid ?? "--"}
									/>
								</div>
							)}
						</div>
						<ButtonsGroup>
							<Button
								fullWidth
								variant="text"
								color="primary"
								onClick={onReset}
								label={formatMessage(internalTransfersMessages.create_transfer)}
							/>
							<InternalLink to={routes.transfers.root}>
								<Button
									fullWidth
									variant="text"
									color="primary"
									label={formatMessage(commonMessages.back_btn)}
								/>
							</InternalLink>
						</ButtonsGroup>
					</>
				) : tokenType ? (
					<>
						<SecureToken
							requestUrl={`web/transfer/create/${slug}/confirm`}
							resendRequestUrl={`web/transfer/create/${slug}/resend`}
							onSuccess={onSecureTokenSuccess}
							onSlugChange={onSlugChange}
							type={tokenType}
							delay={delayTime}
							shouldAutoFocus
							variant={SecureTokenVariantEnum.SPINNER}
							fullSize
						/>
						<Button
							variant="text"
							color="primary"
							fullWidth
							onClick={onCancelTransferRequest}
							label={formatMessage(commonMessages.cancel)}
						/>
					</>
				) : (
					<>
						<div className={styles.form_container}>
							<CurrencySelect
								options={currencies}
								value={currencyOption}
								onSelectChange={onCurrencySelect}
								isLoading={!isBalancesLoaded || isLoading}
								autoFocus
								placeholder={formatMessage(financeMessages.select_currency)}
								withoutLabel
								error={formErrors.currency}
							/>
							<Input
								name="amount"
								type="number"
								value={formBody.amount}
								error={formErrors.amount}
								onChange={onChange}
								onKeyDown={onKeyDown}
								labelValue={formatMessage(commonMessages.amount)}
								appender={
									currencyOption?.label && (
										<Appender>
											<AppenderButton onClick={onMaxClick}>max</AppenderButton>
										</Appender>
									)
								}
								helpText={
									currencyOption?.label &&
									`${formatNumberNoRounding(
										+(currencyOption?.label?.available ?? 0),
										currencyOption.label.precision,
									)} ${currencyOption.label.code}`
								}
							/>
							<Input
								name="receiver"
								value={formBody.receiver}
								error={formErrors.receiver}
								onChange={onChange}
								onKeyDown={onKeyDown}
								labelValue={`${formatMessage(commonMessages.receiver)} - User ID`}
							/>
							<CheckBox
								name="add-security-code"
								checked={securityCode}
								onChange={toggleSecurityCode}
							>
								{formatMessage(internalTransfersMessages.add_security_code)}
							</CheckBox>
							{securityCode && (
								<div className={styles.security_code_container}>
									<Input
										name="security_code"
										type="text"
										value={formBody.security_code}
										error={formErrors.security_code}
										onChange={onChange}
										onKeyDown={onKeyDown}
										labelValue={formatMessage(internalTransfersMessages.security_code)}
									/>
									<Input
										name="valid_days"
										type="number"
										value={formBody.valid_days}
										error={formErrors.valid_days}
										onChange={onChange}
										onKeyDown={onKeyDown}
										labelValue={formatMessage(internalTransfersMessages.days_active)}
									/>
								</div>
							)}
							<Textarea
								name="message"
								value={formBody.message}
								error={formErrors.message}
								onChange={onChange}
								labelValue={formatMessage(internalTransfersMessages.description)}
								expand={false}
							/>
							<CheckBox name="add-note" checked={note} onChange={toggleNote}>
								{formatMessage(internalTransfersMessages.add_note)}
							</CheckBox>
							{note && (
								<Textarea
									name="note"
									value={formBody.note}
									error={formErrors.note}
									onChange={onChange}
									labelValue={formatMessage(commonMessages.note)}
									expand={false}
								/>
							)}
						</div>
						<ButtonsGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(internalTransfersMessages.create_transfer)}
								isLoading={isSubmitting}
								onClick={submit}
							/>
							<InternalLink to={routes.transfers.root}>
								<Button
									fullWidth
									variant="text"
									color="primary"
									label={formatMessage(commonMessages.back_btn)}
								/>
							</InternalLink>
						</ButtonsGroup>
					</>
				)}
			</div>
		</div>
	);
};

export default observer(CreateTransferForm);
