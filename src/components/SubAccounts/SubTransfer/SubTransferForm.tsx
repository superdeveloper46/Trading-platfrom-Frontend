import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import cn from "classnames";

import accountMessages from "messages/account";
import transferMessages from "messages/transfers";
import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import subAccountsMessages from "messages/sub_accounts";
import coinMessages from "messages/exchange";
import { useMst } from "models/Root";
import { SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import {
	ICreateSubAccTransferRequestBody,
	ISubAccountWallet,
	ISubAccTransferCreateFormBody,
	ISubAccTransferCreateFormErrorsBody,
} from "types/subAccounts";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import {
	INITIAL_SUB_ACC_TRANSFER_CREATE_FORM,
	SUB_ACC_TRANSFER_CREATE_FORM_VALIDATION_SCHEMA,
} from "constants/subAccounts";
import { getErrorFromYupValidationRes } from "utils/getter";
import SubAccountsService from "services/SubAccountsService";
import errorHandler from "utils/errorHandler";
import { handleFormErrors } from "utils/form";
import AccountSelect, { IAccountSelectOption } from "components/UI/AccountSelect";
import { formatNumberNoRounding } from "utils/format";
import { setArray } from "utils/setter";
import styles from "styles/pages/SubAccounts/CreateSubTransfer.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Breadcrumbs from "components/Breadcrumbs";
import SecureToken from "components/SecureToken";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import { RowSkeleton, Table } from "components/UI/Table";
import { IHeader } from "components/UI/Table/Table";
import { useCurrencies, useWallets } from "services/FinanceService";
import useParamQuery from "hooks/useSearchQuery";
import { IError } from "types/general";
import { queryVars } from "constants/query";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const SubTransferForm: React.FC = () => {
	const {
		account: { profileStatus, totalBalance: masterAccTotalBalance, loadRates },
		tickers: { loadTickers },
		subAccounts: { balances, getBalances, isBalancesLoading, isAccountsLoading },
	} = useMst();

	const { isFetching: isCurrenciesLoading, data: currenciesList } = useCurrencies({
		format: "json",
		currencies: true,
		is_internal_transfer_enabled: true,
	});
	const { isFetching: isMasterWalletsLoading, data: masterWallets } = useWallets({
		is_demo: false,
		non_empty: true,
	});

	const localeNavigate = useLocaleNavigate();
	const { formatMessage, formatNumber } = useIntl();

	const query = useParamQuery();
	const querySenderUid = query.get(queryVars.out);
	const queryReceiverUid = query.get(queryVars.in);
	const queryCurrencyCode = query.get(queryVars.currency);

	const [slug, setSlug] = useState<string>("");
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [isCreateTransferRequestLoading, setIsCreateTransferRequestLoading] =
		useState<boolean>(false);
	const [delayTime, setDelayTime] = useState<string>("");
	const [wallets, setWallets] = useState<
		(ISubAccountWallet & { [queryVars.currency_id]: string })[]
	>([]);
	const [isWalletsLoading, setIsWalletsLoading] = useState<boolean>(false);
	const [currenciesOptions, setCurrenciesOptions] = useState<IOption[]>();

	const [formBody, setFormBody] = useState<ISubAccTransferCreateFormBody>(
		INITIAL_SUB_ACC_TRANSFER_CREATE_FORM,
	);
	const [formErrors, setFormErrors] = useState<ISubAccTransferCreateFormErrorsBody>({});

	const [subAccountBalanceOption, setSubAccountOption] = useState<IAccountSelectOption | null>(
		null,
	);

	const isMasterAccountChosen = useMemo(
		() => formBody.sender === profileStatus?.uid,
		[formBody.sender, profileStatus?.uid],
	);

	const balancesList = useMemo(
		() => [
			{
				uid: profileStatus?.uid,
				login: "Master account",
				email: profileStatus?.email,
				total_balance: masterAccTotalBalance?.BTC,
			},
			...balances,
		],
		[balances.length, profileStatus, masterAccTotalBalance.BTC],
	);

	useEffect(() => {
		const newArr: IOption[] = [];
		wallets.forEach((wallet) => {
			const currency = currenciesList?.find(
				(curr) => wallet.code === curr.code || wallet.currency_id === curr.code,
			);
			if (currency) {
				newArr.push({
					label: {
						code: currency.code,
						name: currency.name,
						available: wallet.available.toString(),
					},
					value: currency.code,
				});
			}
		});
		setCurrenciesOptions([...newArr]);
	}, [wallets, currenciesList]);

	useEffect(() => {
		if (queryReceiverUid || querySenderUid || queryCurrencyCode) {
			setFormBody((prevState) => ({
				...prevState,
				...(querySenderUid ? { sender: querySenderUid } : {}),
				...(queryReceiverUid ? { receiver: queryReceiverUid } : {}),
				...(queryCurrencyCode ? { currency: queryCurrencyCode } : {}),
			}));
		}
	}, [queryReceiverUid, querySenderUid, queryCurrencyCode]);

	useEffect(() => {
		if (currenciesOptions && currenciesOptions.length) {
			setCurrenciesOptions((prev) =>
				prev?.sort((o1, o2) => +(o2.label.available || 0) - +(o1.label.available || 0)),
			);
		}
	}, [currenciesOptions]);

	const currencyOption = useMemo(() => {
		if (currenciesOptions && currenciesOptions.length) {
			return currenciesOptions.find((o) => o.value === formBody.currency);
		}
		return null;
	}, [currenciesOptions, formBody.currency]);

	const subAccountOptions: IAccountSelectOption[] = useMemo(
		() => [
			{
				label: { login: "Master Account", email: profileStatus?.email || "" },
				value: profileStatus?.uid || "",
			},
			...balances.map(({ login, email, uid }) => ({
				label: { login, email },
				value: uid,
			})),
		],
		[balances, balances.length, profileStatus, formBody.sender, formBody.receiver],
	);

	const resetState = () => {
		setFormBody(INITIAL_SUB_ACC_TRANSFER_CREATE_FORM);
		setFormErrors({});
		setTokenType("");
		setDelayTime("");
		setSlug("");
	};

	const handleSubmit = async () => {
		await SUB_ACC_TRANSFER_CREATE_FORM_VALIDATION_SCHEMA(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then(() => {
				setFormErrors({});

				const data: ICreateSubAccTransferRequestBody = {
					sender: formBody.sender,
					// sender_type: formBody.sender_type,
					receiver: formBody.receiver,
					// receiver_type: formBody.receiver_type,
					currency: formBody.currency,
					amount: +formBody.amount,
				};

				if (!isCreateTransferRequestLoading) {
					setIsCreateTransferRequestLoading(true);
					SubAccountsService.createSubAccTransfer(data)
						.then(handleAuthStatusRes)
						.catch(handleErrors)
						.finally(() => {
							setIsCreateTransferRequestLoading(false);
						});
				}
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<ISubAccTransferCreateFormErrorsBody>(err));
			});
	};

	// const handleAuthStatusRes = (res: ISecureTokenRes): void => {
	// 	if (res.is_ok) {
	// 		// successful block seems like isn't needed there
	// 	} else {
	// 		if (res.is_totp_required && !res.is_totp_ok) {
	// 			setTokenType("otpcode");
	// 			setDelayTime(res.totp_timeout);
	// 		} else if (res.is_pincode_required && !res.is_pincode_ok) {
	// 			setTokenType("pincode");
	// 			setDelayTime(res.pincode_timeout);
	// 		}
	// 		setSlug(res.slug);
	// 	}
	// };

	const handleAuthStatusRes = (): void => {
		toast.success(formatMessage(transferMessages.transfer_sent));
		localeNavigate(routes.subAccounts.transferHistory);
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

	const handleSelectChange = (
		name: keyof ISubAccTransferCreateFormBody,
		o: IAccountSelectOption,
	) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: o.value,
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

	const handleCurrencySelectChange = (o: IOption) => {
		setFormErrors({});
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			currency: value,
		}));
	};

	const handleSwapAccounts = () => {
		setFormBody((prevState) => ({
			...prevState,
			sender: prevState.receiver,
			// sender_type: prevState.receiver_type,
			receiver: prevState.sender,
			// receiver_type: prevState.sender_type,
			amount: "",
			currency: "",
		}));
	};

	const handleMaxAmountClick = () => {
		if (currencyOption?.label?.available) {
			setFormBody((prevState) => ({
				...prevState,
				amount: formatNumberNoRounding(
					+(currencyOption?.label?.available || 0),
					currencyOption.label.precision,
				),
			}));

			setFormErrors((prevState) => ({
				...prevState,
				amount: "",
			}));
		}
	};

	const handleSecureTokenSuccess = () => {
		toast.success(formatMessage(transferMessages.transfer_sent));
		localeNavigate(routes.subAccounts.transferHistory);
	};

	const cancelRequest = () => {
		SubAccountsService.cancelSubAccTransferCreate(slug);
		resetState();
	};

	useEffect(() => {
		if (formBody.sender && profileStatus?.uid) {
			if (formBody.sender === profileStatus?.uid) {
				setWallets(setArray(masterWallets));
			} else {
				setIsWalletsLoading(true);
				SubAccountsService.getSubAccountWallets(formBody.sender)
					.then((nextWallets) => {
						setWallets(setArray(nextWallets));
					})
					.finally(() => {
						setIsWalletsLoading(false);
					});
			}
		}
	}, [formBody.sender, masterWallets, profileStatus?.uid]);

	const headerOptions: IHeader = {
		primary: true,
		className: styles.account_table_row,
		columns: [
			{
				label: formatMessage(accountMessages.subaccount_table_account),
			},
			{
				label: formatMessage(commonMessages.email),
			},
			{
				label: formatMessage(commonMessages.available_balance),
			},
		],
	};

	useEffect(() => {
		getBalances();
		loadTickers();
		loadRates();
	}, []);

	return (
		<div className={styles.container}>
			<div className={subAccountsStyles.breadcrumbs_container}>
				<Breadcrumbs
					links={[
						{
							link: routes.subAccounts.balances,
							label: formatMessage(accountMessages.subaccount_table_account),
						},
					]}
					current={formatMessage(accountMessages.subaccount_account_management)}
				/>
			</div>
			<div className={subAccountsStyles.separator} />
			{tokenType ? (
				<div className={styles.secure_container}>
					<SecureToken
						requestUrl={`web/sub-account/transfer/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/transfer/${slug}/resend`}
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
			) : (
				<div className={styles.form_wrapper}>
					<span className={subAccountsStyles.card_title} style={styleProps({ margin: "0 0 30px" })}>
						{formatMessage(financeMessages.transfer)}
					</span>
					<div className={styles.form_container}>
						<div className={styles.transfer_form_container}>
							<div className={styles.input_container}>
								<AccountSelect
									isLoading={isAccountsLoading}
									label={formatMessage(commonMessages.from)}
									options={subAccountOptions.filter(({ value }) => value !== formBody.receiver)}
									onChange={(o: IAccountSelectOption) => handleSelectChange("sender", o)}
									placeholder={formatMessage(commonMessages.from)}
									value={subAccountOptions.find(({ value }) => value === formBody.sender) || null}
									error={formErrors.sender}
								/>
								{/* <Select */}
								{/*	label="Wallet type" */}
								{/*	options={SUB_ACC_WALLET_TYPES} */}
								{/*	onChange={(o: ISelectOption) => handleSelectChange("sender_type", o)} */}
								{/*	placeholder="Wallet type" */}
								{/*	value={ */}
								{/*		SUB_ACC_WALLET_TYPES.find(({ value }) => value === formBody.sender_type) || null */}
								{/*	} */}
								{/*	error={formErrors.sender_type} */}
								{/* /> */}
							</div>
							<i
								onClick={handleSwapAccounts}
								className={cn(styles.swap_icon, "ai ai-switch-horizontal-01")}
							/>
							<div className={styles.input_container} style={styleProps({ margin: "0 0 50px" })}>
								<AccountSelect
									isLoading={isAccountsLoading}
									label={formatMessage(commonMessages.to)}
									options={subAccountOptions.filter(({ value }) => value !== formBody.sender)}
									onChange={(o: IAccountSelectOption) => handleSelectChange("receiver", o)}
									placeholder={formatMessage(commonMessages.to)}
									value={subAccountOptions.find(({ value }) => value === formBody.receiver) || null}
									error={formErrors.receiver}
								/>
								{/* <Select */}
								{/*	label="Wallet type" */}
								{/*	options={SUB_ACC_WALLET_TYPES} */}
								{/*	onChange={(o: ISelectOption) => handleSelectChange("receiver_type", o)} */}
								{/*	placeholder="Wallet type" */}
								{/*	value={ */}
								{/*		SUB_ACC_WALLET_TYPES.find(({ value }) => value === formBody.receiver_type) || */}
								{/*		null */}
								{/*	} */}
								{/*	error={formErrors.receiver_type} */}
								{/* /> */}
							</div>
							<div className={styles.input_container} style={styleProps({ margin: "0 0 40px" })}>
								<CurrencySelect
									onSelectChange={handleCurrencySelectChange}
									options={currenciesOptions || []}
									value={currencyOption || undefined}
									disabled={currenciesOptions?.length === 0 || isWalletsLoading}
									autoFocus
									isLoading={isWalletsLoading || isCurrenciesLoading || isMasterWalletsLoading}
									placeholder={formatMessage(financeMessages.select_currency)}
									withoutLabel
									error={formErrors.currency}
								/>
								<Input
									name="amount"
									type="number"
									onChange={handleInputChange}
									value={formBody.amount}
									labelValue={formatMessage(commonMessages.amount)}
									error={formErrors.amount}
									appender={
										currencyOption?.value ? (
											<Appender>
												<AppenderButton onClick={handleMaxAmountClick}>max</AppenderButton>
												<AppenderDivider />
												{currencyOption.value.toUpperCase()}
											</Appender>
										) : null
									}
									helpText={
										formBody.sender ? (
											<span>
												{currencyOption
													? formatMessage(commonMessages.available_balance)
													: formatMessage(financeMessages.overall_balance)}{" "}
												{currencyOption ? (
													<strong>{`${
														currencyOption.label.available
													} ${currencyOption.label.code.toUpperCase()}`}</strong>
												) : (
													<strong>
														{isMasterAccountChosen
															? masterAccTotalBalance?.BTC
															: balances.find(({ uid }) => uid === formBody.sender)
																	?.total_balance}{" "}
														BTC
													</strong>
												)}
											</span>
										) : null
									}
								/>
							</div>
							<div className={styles.button_wrapper}>
								<Button
									fullWidth
									label={formatMessage(commonMessages.continue)}
									onClick={handleSubmit}
									isLoading={isCreateTransferRequestLoading}
								/>
							</div>
						</div>
						<div className={styles.transfer_form_container}>
							<span className={styles.form_title}>
								{formatMessage(subAccountsMessages.sub_acc_accs_balances)}
							</span>
							<div
								className={styles.input_container}
								style={styleProps({ gap: "10px", margin: "0 0 40px 0" })}
							>
								<AccountSelect
									labeled
									labeledAbsolute
									label={formatMessage(accountMessages.subaccount_table_account)}
									isSearchable
									isClearable
									options={subAccountOptions}
									onChange={setSubAccountOption}
									placeholder={formatMessage(coinMessages.all_accounts)}
									value={subAccountBalanceOption}
								/>
							</div>
							<Table className={styles.table} header={headerOptions}>
								{isBalancesLoading
									? [...new Array(5)].map((_, i) => (
											<RowSkeleton key={i} cells={headerOptions.columns} />
									  ))
									: balancesList
											.filter(({ uid }) =>
												subAccountBalanceOption && subAccountBalanceOption.value
													? uid === subAccountBalanceOption.value
													: true,
											)
											.map((acc, i) => (
												<div className={styles.account_table_row} key={i}>
													<div className={styles.account_table_cell}>{acc.login}</div>
													<div className={styles.account_table_cell}>{acc.email}</div>
													<div className={styles.account_table_cell}>
														{+(acc.total_balance || 0) > 0
															? formatNumber(+(acc.total_balance || 0), {
																	useGrouping: false,
																	maximumFractionDigits: 8,
															  })
															: "--"}
													</div>
												</div>
											))}
							</Table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default observer(SubTransferForm);
