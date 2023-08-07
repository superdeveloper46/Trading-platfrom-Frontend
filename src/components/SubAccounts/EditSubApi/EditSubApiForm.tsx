import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import commonMessages from "messages/common";
import securityMessages from "messages/security";
import exchangeMessages from "messages/exchange";
import subAccountsMessages from "messages/sub_accounts";
import accountMessages from "messages/account";
import {
	ISubAccApiKeyEditFormBody,
	ISubAccApiKeyEditFormErrorsBody,
	ISubApi,
	IUpdateSubAccApiKeyRequestBody,
	PairsStrategyEnum,
	PermittedActionsEnum,
	PermittedIPStrategyEnum,
} from "types/subAccounts";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import {
	INITIAL_SUB_ACC_API_KEY_EDIT_FORM,
	SUB_ACC_API_KEY_EDIT_FORM_VALIDATION_SCHEMA,
} from "constants/subAccounts";
import { ITicker } from "models/Ticker";
import { getArrayOfIPsFromString, getErrorFromYupValidationRes } from "utils/getter";
import { handleFormErrors } from "utils/form";
import SubAccountsService from "services/SubAccountsService";
import { useMst } from "models/Root";
import Button from "components/UI/Button";
import RadioChoice from "components/UI/Radio";
import Textarea from "components/UI/Textarea";
import Switch from "components/UI/Switch";
import Spinner from "components/UI/Spinner";
import SecureToken from "components/SecureToken";
import styles from "styles/pages/SubAccounts/EditSubApi.module.scss";
import styleProps from "utils/styleProps";
import apiStyles from "styles/components/Profile/Api/CreateApiKey.module.scss";
import IconButton from "components/UI/IconButton";
import errorHandler from "utils/errorHandler";
import { IError } from "types/general";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

interface IProps {
	subApiKeyDetails?: ISubApi;
	isLoading?: boolean;
}

const EditApiKeyForm: React.FC<IProps> = ({ subApiKeyDetails, isLoading }) => {
	const {
		tickers: { list: tickersList },
	} = useMst();

	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const [slug, setSlug] = useState<string>("");
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [isUpdateApiKeyRequestLoading, setIsUpdateApiKeyRequestLoading] = useState<boolean>(false);
	const [delayTime, setDelayTime] = useState<string>("");
	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	const [baseCurrenciesList, setBaseCurrenciesList] = useState<IOption[]>([]);
	const [quoteCurrenciesList, setQuoteCurrenciesList] = useState<IOption[]>([]);
	const [baseCurrency, setBaseCurrency] = useState<string>("");
	const [quoteCurrency, setQuoteCurrency] = useState<string>("");

	const [formBody, setFormBody] = useState<ISubAccApiKeyEditFormBody>(
		INITIAL_SUB_ACC_API_KEY_EDIT_FORM,
	);

	const [formErrors, setFormErrors] = useState<ISubAccApiKeyEditFormErrorsBody>({});

	const resetForm = useCallback(() => {
		setFormBody({
			label: subApiKeyDetails?.label || "",
			permittedIPs: "",
			permittedIPsList: subApiKeyDetails?.limit_to_ips || [],
			permittedActions: subApiKeyDetails?.can_trade
				? PermittedActionsEnum.Trading
				: PermittedActionsEnum.Reading,
			permittedIPStrategy: subApiKeyDetails?.limit_to_ips.length
				? PermittedIPStrategyEnum.Specified
				: PermittedIPStrategyEnum.Any,
			availablePairsStrategy: subApiKeyDetails?.allowed_symbols?.length
				? PairsStrategyEnum.Specified
				: PairsStrategyEnum.Any,
			availablePairsList:
				subApiKeyDetails?.allowed_symbols?.map((symbol: string) => symbol.replace("_", "/")) ?? [],
			tradeCoins: {
				spot: true,
				margin: Boolean(subApiKeyDetails?.can_margin),
			},
		});
	}, [subApiKeyDetails]);

	const baseCurrencyOption: IOption | null =
		baseCurrenciesList.find((c: IOption) => c.value === baseCurrency) ?? null;
	const quoteCurrencyOption: IOption | null =
		quoteCurrenciesList.find((c: IOption) => c.value === quoteCurrency) ?? null;

	const handleSelectBaseCurrencyChange = (e: { value: string }) => {
		const { value } = e;
		setBaseCurrency(value);
		setQuoteCurrenciesList(
			tickersList
				.filter((t: ITicker) => t.base_currency?.code === value)
				.map((t: ITicker) => ({
					label: {
						code: t.quote_currency?.code,
					},
					value: t.quote_currency?.code,
				})),
		);
	};

	const handleSelectQuoteCurrencyChange = useCallback((e: { value: string }) => {
		setQuoteCurrency(e.value);
	}, []);

	const handlePermittedTradeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: value as PermittedActionsEnum,
		}));
	};

	const handleAvailablePairsStrategyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setFormBody((prevState) => ({
			...prevState,
			availablePairsStrategy: value as PairsStrategyEnum,
		}));
	};

	const handlePermittedIPStrategyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPStrategy: value as PermittedIPStrategyEnum,
		}));
	};

	const handleTradeCoinsChange = (e: ChangeEvent<HTMLInputElement>, name: string): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			tradeCoins: {
				...prevState.tradeCoins,
				[name]: value,
			},
		}));
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleRemovePermittedIPFromList = (
		e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		const { ip } = e.currentTarget.dataset;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: prevState.permittedIPsList.filter((permIP: string) => permIP !== ip),
		}));
	};

	const handleAddAvailablePair = (): void => {
		if (baseCurrency && quoteCurrency) {
			const nextPair = `${baseCurrency}/${quoteCurrency}`;
			const nextAvailablePairs: string[] = Array.from(
				new Set([...formBody.availablePairsList, nextPair]),
			);
			setFormBody((prevState) => ({
				...prevState,
				availablePairsList: nextAvailablePairs,
			}));
		}
	};

	const handleRemoveAvailablePairFromList = (
		e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		const { pair } = e.currentTarget.dataset;
		setFormBody((prevState) => ({
			...prevState,
			availablePairsList: prevState.availablePairsList.filter((p: string) => p !== pair),
		}));
	};

	const handleAuthStatusRes = (res: ISecureTokenRes): void => {
		if (res.is_ok) {
			// successful block seems like isn't needed there
		} else {
			if (res.is_totp_required && !res.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(res.totp_timeout);
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(res.pincode_timeout);
			}
			setSlug(res.slug || "");
		}
	};

	const validate = async () => {
		await SUB_ACC_API_KEY_EDIT_FORM_VALIDATION_SCHEMA.validate(formBody, {
			abortEarly: false,
		})
			.then(() => {
				setIsFormValid(true);
				setFormErrors({});
			})
			.catch((err) => {
				setIsFormValid(false);
				setFormErrors(getErrorFromYupValidationRes<ISubAccApiKeyEditFormErrorsBody>(err));
			});
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formErrors));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));
		}
	};

	const handleSubmit = () => {
		const data: IUpdateSubAccApiKeyRequestBody = {
			api_key: subApiKeyDetails?.slug || "",
			label: subApiKeyDetails?.label || "",
			limit_to_ips:
				formBody.permittedIPStrategy === PermittedIPStrategyEnum.Specified
					? formBody.permittedIPsList
					: [],
			use_whitelist: formBody.permittedIPStrategy === PermittedIPStrategyEnum.Specified,
			can_trade: formBody.permittedActions === PermittedActionsEnum.Trading,
			can_margin: formBody.tradeCoins.margin,
			allowed_symbols:
				formBody.availablePairsList.length &&
				formBody.availablePairsStrategy === PairsStrategyEnum.Specified
					? formBody.availablePairsList.map((p: string) => p.replace("/", "_"))
					: null,
		};

		if (isFormValid && !isUpdateApiKeyRequestLoading) {
			setIsUpdateApiKeyRequestLoading(true);
			SubAccountsService.updateSubAccApiKey(data)
				.then(handleAuthStatusRes)
				.catch(handleErrors)
				.finally(() => {
					setIsUpdateApiKeyRequestLoading(false);
				});
		}
	};

	const handleSecureTokenSuccess = () => {
		toast(formatMessage(subAccountsMessages.sub_acc_api_key_successfully_updated));
		localeNavigate(routes.subAccounts.apiManagement);
	};

	const cancelRequest = () => {
		SubAccountsService.cancelUpdateSubAccApiKey(slug);
		resetForm();
		setTokenType("");
	};

	const handleAddPermittedIPs = (): void => {
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: [
				...prevState.permittedIPsList,
				...getArrayOfIPsFromString(formBody.permittedIPs).filter(
					(ip) => !prevState.permittedIPsList.find((prevIP) => ip === prevIP),
				),
			],
			permittedIPs: "",
		}));
	};

	const handlePermittedIPsKeyDown = (e: React.KeyboardEvent<Element>): void => {
		if (e.key === "Enter") {
			handleAddPermittedIPs();
		}
	};

	const handleAppIpClick = () => {
		if (formBody.permittedIPStrategy !== PermittedIPStrategyEnum.Specified) {
			setFormBody((prevState) => ({
				...prevState,
				permittedIPStrategy: PermittedIPStrategyEnum.Specified,
			}));
		} else {
			handleAddPermittedIPs();
		}
	};

	useEffect(() => {
		const seenBaseArray: Record<string, boolean> = {};
		const seenQuoteArray: Record<string, boolean> = {};

		const newBaseCurrenciesList = tickersList
			.filter((t: ITicker) => {
				if (seenBaseArray[t.base_currency?.code]) {
					return false;
				}
				seenBaseArray[t.base_currency?.code] = true;
				return true;
			})
			.map((t: ITicker) => ({
				label: {
					code: t.base_currency?.code ?? "",
				},
				value: t.base_currency?.code ?? "",
			}));

		const newQuoteCurrenciesList = tickersList
			.filter((t: ITicker) => {
				if (seenQuoteArray[t.quote_currency?.code]) {
					return false;
				}
				seenQuoteArray[t.quote_currency?.code] = true;
				return true;
			})
			.map((t: ITicker) => ({
				label: {
					code: t.quote_currency?.code ?? "",
				},
				value: t.quote_currency?.code ?? "",
			}));

		setBaseCurrenciesList(newBaseCurrenciesList);
		setQuoteCurrenciesList(newQuoteCurrenciesList);
	}, [tickersList.length]);

	useEffect(() => {
		if (subApiKeyDetails) {
			resetForm();
		}
	}, [subApiKeyDetails]);

	useEffect(() => {
		validate();
	}, [formBody]);

	useEffect(() => {
		if (formBody.permittedActions !== PermittedActionsEnum.Trading) {
			setFormBody((prevState) => ({
				...prevState,
				tradeCoins: {
					...prevState.tradeCoins,
					margin: false,
				},
			}));
		}
	}, [formBody.permittedActions]);

	return (
		<div className={cn(styles.forms, { [styles.token]: !!tokenType })}>
			{tokenType ? (
				<div className={styles.secure_container}>
					<SecureToken
						requestUrl={`web/sub-account/api-keys/update/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/api-keys/update/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={setSlug}
						type={tokenType}
						delay={delayTime}
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						onClick={cancelRequest}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</div>
			) : isLoading ? (
				<Spinner size={50} />
			) : (
				<>
					<div className={styles.form_container}>
						<div className={styles.section}>
							<span className={styles.secondary_title}>
								{formatMessage(accountMessages.subaccount_trading_permissions)}
							</span>
							<div className={styles.radio_list}>
								<RadioChoice
									className={styles.radio_item}
									onChange={handlePermittedTradeChange}
									label={formatMessage(subAccountsMessages.sub_acc_read_only)}
									value={formBody.permittedActions}
									name="permitted-ips-strategy"
									choice="reading"
								/>
								<RadioChoice
									className={styles.radio_item}
									onChange={handlePermittedTradeChange}
									label={formatMessage(subAccountsMessages.sub_acc_allow_trading)}
									value={formBody.permittedActions}
									name="permitted-ips-strategy"
									choice="trading"
								/>
							</div>
						</div>
						<div className={styles.section}>
							<span className={styles.secondary_title}>
								{formatMessage(accountMessages.subaccount_trading_permissions)}
							</span>
							<div className={styles.switch_list}>
								<Switch
									disabled
									id="spot"
									label={formatMessage(accountMessages.spot)}
									checked={formBody.tradeCoins.spot}
									onChange={(e) => handleTradeCoinsChange(e, "spot")}
								/>
								<Switch
									disabled={formBody.permittedActions !== PermittedActionsEnum.Trading}
									id="margin"
									label={formatMessage(accountMessages.margin)}
									checked={formBody.tradeCoins.margin}
									onChange={(e) => handleTradeCoinsChange(e, "margin")}
								/>
							</div>
						</div>
						<div className={styles.section}>
							<span className={styles.secondary_title}>
								{formatMessage(subAccountsMessages.sub_acc_allowed_apis)}:
							</span>
							<div className={styles.ip_radio_list}>
								<RadioChoice
									className={styles.radio_item}
									onChange={handlePermittedIPStrategyChange}
									label={formatMessage(subAccountsMessages.sub_acc_unlimited)}
									value={formBody.permittedIPStrategy}
									name="permitted-ips-strategy"
									choice="any"
								/>
								<RadioChoice
									className={styles.radio_item}
									onChange={handlePermittedIPStrategyChange}
									label={formatMessage(
										securityMessages.restricted_access_to_only_trusted_addresses,
									)}
									value={formBody.permittedIPStrategy}
									name="permitted-ips-strategy"
									choice="specified"
								/>
							</div>
							{formBody.permittedIPStrategy === PermittedIPStrategyEnum.Specified && (
								<Textarea
									className={styles.ip_textarea_container}
									value={formBody.permittedIPs}
									labelValue={formatMessage(securityMessages.ip_address_or_ip_segment)}
									onChange={handleInputChange}
									onKeyDown={handlePermittedIPsKeyDown}
									name="permittedIPs"
									helpText={formatMessage(subAccountsMessages.sub_acc_ip_segment_help_text)}
								/>
							)}
							<div className={styles.secondary_title} style={styleProps({ marginTop: "10px" })}>
								{formatMessage(securityMessages.ip_on_this_account)}{" "}
								<Button
									className={styles.add_api_btn}
									variant="text"
									iconAlign="left"
									iconCode="listing"
									label={formatMessage(securityMessages.add_ip)}
									color="primary"
									fontVariant="bold"
									fullWidth
									mini
									onClick={handleAppIpClick}
								/>
							</div>
							{formBody.permittedIPsList.length > 0 && (
								<div className={apiStyles.selected_list}>
									{formBody.permittedIPsList.map((ip: string) => (
										<div
											className={cn(apiStyles.selected_list_item, {
												[apiStyles.disabled]:
													formBody.permittedIPStrategy !== PermittedIPStrategyEnum.Specified,
											})}
											key={ip}
										>
											{ip}
											<button type="button" data-ip={ip} onClick={handleRemovePermittedIPFromList}>
												<i className="ai ai-cancel_mini" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<div className={styles.form_container}>
						<div className={apiStyles.available_pairs}>
							<span>{formatMessage(exchangeMessages.available_pairs)}:</span>
							<div className={apiStyles.available_pairs_radio_list}>
								<RadioChoice
									className={apiStyles.available_pairs_radio_list_item}
									onChange={handleAvailablePairsStrategyChange}
									label={formatMessage(exchangeMessages.all_pairs)}
									value={formBody.availablePairsStrategy}
									name="available-pairs-strategy"
									choice="any"
								/>
								<RadioChoice
									className={apiStyles.available_pairs_radio_list_item}
									onChange={handleAvailablePairsStrategyChange}
									label={formatMessage(exchangeMessages.allowed_trading_pairs)}
									value={formBody.availablePairsStrategy}
									name="available-pairs-strategy"
									choice="specified"
								/>
							</div>
							<div
								className={cn(apiStyles.available_pairs_select_container, {
									[apiStyles.disabled]:
										formBody.availablePairsStrategy !== PairsStrategyEnum.Specified,
								})}
							>
								<CurrencySelect
									onSelectChange={handleSelectBaseCurrencyChange}
									options={baseCurrenciesList}
									value={baseCurrencyOption || undefined}
									disabled={formBody.availablePairsStrategy !== PairsStrategyEnum.Specified}
									autoFocus
									withoutLabel
								/>
								<span>/</span>
								<CurrencySelect
									onSelectChange={handleSelectQuoteCurrencyChange}
									options={quoteCurrenciesList}
									value={quoteCurrencyOption || undefined}
									disabled={formBody.availablePairsStrategy !== PairsStrategyEnum.Specified}
									autoFocus
									withoutLabel
								/>
								<IconButton
									className={styles.add_pairs_icon}
									disabled={formBody.availablePairsStrategy !== PairsStrategyEnum.Specified}
									variant="filled"
									color="primary"
									icon={<i className="ai ai-plus_mini" />}
									onClick={handleAddAvailablePair}
								/>
							</div>
							{formBody.availablePairsList.length > 0 && (
								<div className={apiStyles.selected_list}>
									{formBody.availablePairsList.map((pair: string) => (
										<div
											key={pair}
											className={cn(apiStyles.selected_list_item, {
												[apiStyles.disabled]:
													formBody.availablePairsStrategy !== PairsStrategyEnum.Specified,
											})}
										>
											{pair}
											<button
												type="button"
												data-pair={pair}
												onClick={handleRemoveAvailablePairFromList}
											>
												<i className="ai ai-cancel_mini" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
						<div className={styles.controls}>
							<Button
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.save)}
								onClick={handleSubmit}
								isLoading={isUpdateApiKeyRequestLoading}
								disabled={!isFormValid}
							/>
							<Button
								variant="text"
								color="primary"
								label={formatMessage(commonMessages.cancel)}
								onClick={() => localeNavigate(routes.subAccounts.apiManagement)}
								isLoading={isUpdateApiKeyRequestLoading}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default observer(EditApiKeyForm);
