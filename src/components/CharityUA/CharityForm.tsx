import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Input, { Appender, AppenderDivider, AppenderButton } from "components/UI/Input";
import Textarea from "components/UI/Textarea";
import Button, { ButtonsGroup } from "components/UI/Button";
import styles from "styles/components/CharityForm.module.scss";
import peaceFundMessages from "messages/charityUA";
import peaceFundImg from "assets/images/peace_fund/ukraine.svg";
import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import errorHandler from "utils/errorHandler";
import { formatNumberNoRounding } from "utils/format";
import { ISelectOption } from "components/UI/Select";
import Tabs from "components/UI/Tabs";
import Tab from "components/UI/Tab";
import ActionMethods from "components/ActionMethods";
import QRCode from "components/UI/QRCode";
import ButtonMicro from "components/UI/ButtonMicro";
import { ICurrency, IDonate, IFormBody } from "types/charity";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import CharityService from "services/CharityService";
import { IAttribute, IDepositMethod } from "models/Deposit";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";

const formBodyInitialState: IFormBody = {
	currency: "",
	amount: "",
	note: "",
	paymentMethod: undefined,
};

const CharityForm: React.FC = () => {
	const {
		global: { isAuthenticated },
		account: { balances },
	} = useMst();
	const [activeTab, setActiveTab] = useState<string>("external");
	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const [paymentMethods, setPaymentMethods] = useState<IDepositMethod[]>([]);
	const [isSendLoading, setIsSendLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [formBody, setFormBody] = useState<IFormBody>(formBodyInitialState);
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();
	const copyClick = useCopyClick();

	const currenciesOptions: IOption[] = currencies.map(
		(curr): IOption => ({
			label: {
				code: curr.code,
				name: curr.name,
				available: activeTab === "alpha" ? curr.available : undefined,
				precision: 8,
				image_svg: curr.image_svg,
				image_png: curr.image_png,
			},
			value: curr.code,
		}),
	);

	const selectedCurrencyOption: IOption | undefined =
		currenciesOptions.find((o) => o.value === formBody.currency) ?? undefined;

	const handleCurrencySelectChange = (e: IOption | ISelectOption): void => {
		const { value } = e;
		const nextPaymentMethod = paymentMethods.find((m) => m.currency?.code === value) ?? undefined;

		setFormBody((prevState) => ({
			...prevState,
			currency: value,
			paymentMethod: nextPaymentMethod,
		}));
	};

	const filteredPaymentMethods = paymentMethods.filter(
		(pm) => pm.currency?.code === formBody.currency,
	);

	const handleActiveTabChange = (tabName: string) => {
		setActiveTab(tabName);
		setIsSuccessful(false);
		setFormBody((prevState) => ({
			...formBodyInitialState,
			currency: prevState.currency,
		}));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: e.target.value,
		}));
	};

	const handlePaymentMethodChange = useCallback((nextMethod: IDepositMethod) => {
		setFormBody((prevState) => ({
			...prevState,
			paymentMethod: nextMethod,
		}));
	}, []);

	const loadPaymentMethods = async () => {
		try {
			const methods = await CharityService.getPaymentMethods();
			if (Array.isArray(methods)) {
				setPaymentMethods(methods);
			}
		} catch (err) {
			errorHandler(err);
		}
	};

	const loadCurrencies = async () => {
		try {
			const currencies = await CharityService.getCurrencies();
			if (Array.isArray(currencies)) {
				setCurrencies(currencies);
			}
		} catch (err) {
			errorHandler(err);
		}
	};

	useEffect(() => {
		if (currencies.length && balances.length) {
			setCurrencies((prevState) => {
				const nextCurrencies = [...prevState];
				nextCurrencies.forEach((c) => {
					c.available = formatNumberNoRounding(
						+(balances.find((b) => b.code === c.code)?.available ?? 0),
						8,
					);
				});
				return nextCurrencies;
			});
		}
	}, [balances, currencies.length]);

	useEffect(() => {
		loadPaymentMethods().then(loadCurrencies);
	}, []);

	useEffect(() => {
		if (currencies.length && paymentMethods.length) {
			const nextDepositMethod = paymentMethods.find(
				(method: IDepositMethod) => method.currency?.code === currencies[0].code,
			);
			if (nextDepositMethod) {
				setFormBody((prevState) => ({
					...prevState,
					currency: currencies[0].code,
					paymentMethod: nextDepositMethod,
				}));
			}
		} else {
			setFormBody((prevState) => ({
				...prevState,
				paymentMethod: undefined,
			}));
		}
	}, [paymentMethods.length, currencies.length, activeTab]);

	const handleCopyAttrToClipboard = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const { value, label } = e.currentTarget.dataset;
		if (value) {
			copyClick(
				value,
				formatMessage(commonMessages.copied_to_clipboard, {
					label,
				}),
			);
		}
	};

	const handleMaxAmountClick = (): void => {
		const amount = currencies.find((c) => c.code === formBody.currency)?.available ?? 0;
		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(+amount, 8),
		}));
	};

	const sendFunds = async () => {
		try {
			const body: IDonate = {
				amount: formBody.amount,
				currency: formBody.currency,
				message: formBody.note || undefined,
			};
			setIsSendLoading(true);
			await CharityService.sendDonate(body);
			setIsSuccessful(true);
		} catch (err) {
			errorHandler(err);
		} finally {
			setIsSendLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<img
				src={peaceFundImg}
				width="142"
				height="142"
				alt="Reserve fund of Ukraine"
				title="Reserve fund of Ukraine"
			/>
			<div className={styles.header}>
				<h1>{formatMessage(peaceFundMessages.alpha_for_ukraine)}</h1>
			</div>
			<Tabs>
				<Tab onClick={handleActiveTabChange} isActive={activeTab === "external"} name="external">
					{formatMessage(peaceFundMessages.external_wallet)}
				</Tab>
				<Tab onClick={handleActiveTabChange} isActive={activeTab === "alpha"} name="alpha">
					{formatMessage(peaceFundMessages.alpha_wallet)}
				</Tab>
			</Tabs>
			<div className={styles.description}>{formatMessage(peaceFundMessages.description)}</div>
			{isSuccessful ? (
				<div className={styles.success_screen}>
					<i className="ai ai-check_outline" />
					<span>{formatMessage(peaceFundMessages.thank_you_for_your_contribution)}</span>
				</div>
			) : (
				<div className={styles.form_container}>
					{activeTab === "alpha" ? (
						isAuthenticated ? (
							<>
								<CurrencySelect
									onSelectChange={handleCurrencySelectChange}
									options={currenciesOptions}
									value={selectedCurrencyOption}
									autoFocus
									label={formatMessage(financeMessages.select_currency)}
								/>
								<Input
									type="number"
									name="amount"
									onEnter={sendFunds}
									value={formBody.amount}
									onChange={handleInputChange}
									labelValue={formatMessage(commonMessages.amount)}
									appender={
										<Appender>
											{formBody.currency}
											{formBody.currency ? (
												<>
													<AppenderDivider />
													<AppenderButton onClick={handleMaxAmountClick}>max</AppenderButton>
												</>
											) : null}
										</Appender>
									}
								/>
								<Textarea
									name="note"
									value={formBody.note}
									onChange={handleInputChange}
									labelValue={formatMessage(commonMessages.note)}
								/>
								<Button
									onClick={sendFunds}
									label={formatMessage(commonMessages.send)}
									fullWidth
									variant="filled"
									color="primary"
									isLoading={isSendLoading}
								/>
							</>
						) : (
							<ButtonsGroup>
								<InternalLink to={routes.login.redirect(pathname)}>
									<Button
										variant="text"
										color="primary"
										fullWidth
										label={formatMessage(peaceFundMessages.please_login_to_continue)}
									/>
								</InternalLink>
							</ButtonsGroup>
						)
					) : (
						<>
							<CurrencySelect
								onSelectChange={handleCurrencySelectChange}
								options={currenciesOptions}
								value={selectedCurrencyOption}
								autoFocus
								label={formatMessage(financeMessages.select_currency)}
							/>
							{filteredPaymentMethods.length > 0 && (
								<ActionMethods
									title={formatMessage(financeMessages.deposit_method)}
									methods={filteredPaymentMethods}
									currentMethod={formBody.paymentMethod}
									onChange={handlePaymentMethodChange}
									type="deposit"
								/>
							)}
							{formBody.paymentMethod?.attributes ? (
								<div className={styles.form_attributes_container}>
									{formBody.paymentMethod.attributes.map((attr: IAttribute) => (
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
									<a
										href="https://nowarua.com/pages/reports/reports.html"
										target="_blank"
										rel="noopener noreferrer"
										className={styles.external_link}
									>
										&nbsp;
										{formatMessage(peaceFundMessages.see_reports)}&nbsp;
									</a>
								</div>
							) : null}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default observer(CharityForm);
