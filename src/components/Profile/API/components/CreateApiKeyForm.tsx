import React, { useCallback, useEffect, useState } from "react";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import Button from "components/UI/Button";
import { IP_REGEX } from "constants/common";
import styles from "styles/components/Profile/Api/CreateApiKey.module.scss";
import cn from "classnames";
import { ITicker } from "models/Ticker";
import { useMst } from "models/Root";
import { ICreateApiKeyRequestBody } from "types/profile";
import { useIntl } from "react-intl";
import subAccountsMessages from "messages/sub_accounts";
import { cancelApiKeyCreating, createApiKey } from "services/ApiService";
import Input, { IInputChange } from "components/UI/Input";
import Switch from "components/UI/Switch";
import RadioChoice from "components/UI/Radio";
import IconButton from "components/UI/IconButton";
import { observer } from "mobx-react-lite";
import errorHandler from "utils/errorHandler";
import InfoSnack from "components/InfoSnack";
import { ConfirmCreateUpdateApiKeyModal } from "./modals";

type TPermittedIPStrategy = "any" | "specified";
type TAvailablePairsStrategy = "any" | "specified";

interface IFormBody {
	apiKeyName: string;
	permittedActions: {
		withdraw: boolean;
		margin: boolean;
		trading: boolean;
	};
	permittedIPStrategy: TPermittedIPStrategy;
	permittedIPs: string;
	permittedIPsList: string[];
	availablePairsStrategy: TAvailablePairsStrategy;
	availablePairsList: string[];
}

const CreateApiKeyForm: React.FC = () => {
	const {
		tickers,
		account: { profileStatus },
	} = useMst();

	const [formBody, setFormBody] = useState<IFormBody>({
		apiKeyName: "",
		permittedActions: {
			withdraw: false,
			margin: false,
			trading: false,
		},
		permittedIPStrategy: "any",
		permittedIPs: "",
		permittedIPsList: [],
		availablePairsStrategy: "any",
		availablePairsList: [],
	});
	const [baseCurrenciesList, setBaseCurrenciesList] = useState<IOption[]>([]);
	const [quoteCurrenciesList, setQuoteCurrenciesList] = useState<IOption[]>([]);
	const [baseCurrency, setBaseCurrency] = useState<string>("");
	const [quoteCurrency, setQuoteCurrency] = useState<string>("");
	const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [slug, setSlug] = useState<string>("");
	const { formatMessage } = useIntl();

	const isSubmitDisabled =
		!profileStatus?.two_factor_enabled ||
		!formBody.apiKeyName ||
		(formBody.permittedIPStrategy === "specified" && !formBody.permittedIPsList.length) ||
		(formBody.availablePairsStrategy === "specified" && !formBody.availablePairsList.length);

	useEffect(() => {
		setBaseCurrenciesList(
			tickers.list.map((t: ITicker) => ({
				label: {
					code: t.base_currency?.code ?? "",
				},
				value: t.base_currency?.code ?? "",
			})),
		);
		setQuoteCurrenciesList(
			tickers.list.map((t: ITicker) => ({
				label: {
					code: t.quote_currency?.code ?? "",
				},
				value: t.quote_currency?.code ?? "",
			})),
		);
	}, [tickers.list.length]);

	const baseCurrencyOption: IOption | undefined =
		baseCurrenciesList.find((c: IOption) => c.value === baseCurrency) ?? undefined;
	const quoteCurrencyOption: IOption | undefined =
		quoteCurrenciesList.find((c: IOption) => c.value === quoteCurrency) ?? undefined;

	const handleApiKeyNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			apiKeyName: value,
		}));
	};

	const handlePermittedActionsWithdrawChange = (e: IInputChange): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				withdraw: value,
			},
		}));
	};

	const handlePermittedActionsMarginChange = (e: IInputChange): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				margin: value,
			},
		}));
	};

	const handlePermittedActionsTradingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				trading: value,
			},
		}));
	};

	const handlePermittedIPStrategyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value: TPermittedIPStrategy = e.target.value as TPermittedIPStrategy;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPStrategy: value,
			permittedIPsList: value === "any" ? [] : prevState.permittedIPsList,
		}));
	};

	const handlePermittedIPsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPs: value,
		}));
	};

	const handleAddPermittedIPs = (): void => {
		const permittedIPs: string[] = Array.from(
			new Set(formBody.permittedIPs.replace(/\s/g, "").split(",")),
		);
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: [
				...prevState.permittedIPsList,
				...permittedIPs.filter((ip: string) => IP_REGEX.test(ip)),
			],
			permittedIPs: "",
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

	const handleAvailablePairsStrategyChange = (e: IInputChange): void => {
		const value: TAvailablePairsStrategy = e.target.value as TPermittedIPStrategy;
		setFormBody((prevState) => ({
			...prevState,
			availablePairsStrategy: value,
			availablePairsList: value === "any" ? [] : prevState.availablePairsList,
		}));
	};

	const handleSelectBaseCurrencyChange = (e: { value: string }) => {
		const { value } = e;
		setBaseCurrency(value);
		setQuoteCurrenciesList(
			tickers.list
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

	const handleSendCreateRequest = async (): Promise<void> => {
		const data: ICreateApiKeyRequestBody = {
			label: formBody.apiKeyName,
			can_trade: formBody.permittedActions.trading,
			can_withdraw: formBody.permittedActions.withdraw,
			can_margin: formBody.permittedActions.margin,
			allowed_symbols:
				formBody.availablePairsStrategy === "specified" && formBody.availablePairsList.length
					? formBody.availablePairsList.map((p: string) => p.replace("/", "_"))
					: undefined,
			limit_to_ips: formBody.permittedIPsList.length ? formBody.permittedIPsList : undefined,
		};

		try {
			setIsRequestLoading(true);
			const slug = await createApiKey(data);
			setSlug(slug);
			setShowModal(true);
		} catch (err) {
			errorHandler(err);
		} finally {
			setIsRequestLoading(false);
		}
	};

	const handlePermittedIPsKeyDown = (e: React.KeyboardEvent<Element>): void => {
		if (e.key === "Enter") {
			handleAddPermittedIPs();
		}
	};

	const handleCloseModal = (): void => {
		setShowModal(false);
		cancelApiKeyCreating(slug);
		setSlug("");
	};

	return (
		<div className={styles.create_apikey_container}>
			{showModal && (
				<ConfirmCreateUpdateApiKeyModal
					isOpen={showModal}
					onClose={handleCloseModal}
					slug={slug}
					variant="create"
				/>
			)}
			<div className={styles.create_apikey_column}>
				<h3 className={styles.create_apikey_title}>Create API key</h3>
				<Input
					type="text"
					labelValue="API key name"
					value={formBody.apiKeyName}
					onChange={handleApiKeyNameChange}
					maxLength={50}
				/>
				<div className={styles.permitted_actions}>
					<span>Permitted actions:</span>
					<div className={styles.permitted_actions_list}>
						<Switch id="reading" label="Enable Reading" disabled checked />
						<Switch
							id="trading"
							label="Enable Trading"
							checked={formBody.permittedActions.trading}
							onChange={handlePermittedActionsTradingChange}
						/>
						<Switch
							id="withdraw"
							disabled
							label="Enable Withdraw"
							checked={formBody.permittedActions.withdraw}
							onChange={handlePermittedActionsWithdrawChange}
						/>
						<Switch
							id="margin"
							disabled
							label="Enable Margin"
							checked={formBody.permittedActions.margin}
							onChange={handlePermittedActionsMarginChange}
						/>
					</div>
				</div>
				<div className={styles.permitted_ips}>
					<span>{formatMessage(subAccountsMessages.sub_acc_allowed_apis)}:</span>
					<div className={styles.permitted_ips_radio_list}>
						<div className={styles.permitted_ips_radio_list_item}>
							<RadioChoice
								onChange={handlePermittedIPStrategyChange}
								label="API key can be used from any IP address (not recommended)"
								value={formBody.permittedIPStrategy}
								name="permitted-ips-strategy"
								choice="any"
							/>
						</div>
						<div className={styles.permitted_ips_radio_list_item}>
							<RadioChoice
								onChange={handlePermittedIPStrategyChange}
								label="Only specified IPs (recommended)"
								value={formBody.permittedIPStrategy}
								name="permitted-ips-strategy"
								choice="specified"
							/>
						</div>
					</div>
					<div className={styles.permitted_ips_input}>
						<Input
							type="text"
							disabled={formBody.permittedIPStrategy !== "specified"}
							labelValue="Enter IP"
							helpText="To enter multiple IPs, separate them with a coma: 1.2.3.4, 1.1.1.1"
							value={formBody.permittedIPs}
							onChange={handlePermittedIPsChange}
							onKeyDown={handlePermittedIPsKeyDown}
						/>
						<IconButton
							disabled={formBody.permittedIPStrategy !== "specified"}
							onClick={handleAddPermittedIPs}
							variant="filled"
							color="primary"
							icon={<i className="ai ai-plus_mini" />}
						/>
					</div>
					{formBody.permittedIPsList.length > 0 && (
						<div className={styles.selected_list}>
							{formBody.permittedIPsList.map((ip: string) => (
								<div className={styles.selected_list_item} key={ip}>
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
			<div className={styles.create_apikey_column}>
				<div className={styles.available_pairs}>
					<span>Available pairs:</span>
					<div className={styles.available_pairs_radio_list}>
						<div className={styles.available_pairs_radio_list_item}>
							<RadioChoice
								onChange={handleAvailablePairsStrategyChange}
								label="All pairs"
								value={formBody.availablePairsStrategy}
								name="available-pairs-strategy"
								choice="any"
							/>
						</div>
						<div className={styles.available_pairs_radio_list_item}>
							<RadioChoice
								onChange={handleAvailablePairsStrategyChange}
								label="Allowed trading pairs"
								value={formBody.availablePairsStrategy}
								name="available-pairs-strategy"
								choice="specified"
							/>
						</div>
					</div>
					<div
						className={cn(styles.available_pairs_select_container, {
							[styles.disabled]: formBody.availablePairsStrategy !== "specified",
						})}
					>
						<CurrencySelect
							onSelectChange={handleSelectBaseCurrencyChange}
							options={baseCurrenciesList}
							value={baseCurrencyOption}
							disabled={formBody.availablePairsStrategy !== "specified"}
							autoFocus
							withoutLabel
							style={{ zIndex: 10 }}
						/>
						<span>/</span>
						<CurrencySelect
							onSelectChange={handleSelectQuoteCurrencyChange}
							options={quoteCurrenciesList}
							value={quoteCurrencyOption}
							disabled={formBody.availablePairsStrategy !== "specified"}
							autoFocus
							withoutLabel
							style={{ zIndex: 5 }}
						/>
						<IconButton
							disabled={formBody.availablePairsStrategy !== "specified"}
							variant="filled"
							color="primary"
							icon={<i className="ai ai-plus_mini" />}
							onClick={handleAddAvailablePair}
						/>
					</div>
					{formBody.availablePairsList.length > 0 && (
						<div className={styles.selected_list}>
							{formBody.availablePairsList.map((pair: string) => (
								<div className={styles.selected_list_item} key={pair}>
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
			</div>
			<div className={styles.create_apikey_column}>
				<div className={styles.submit}>
					<Button
						variant="filled"
						color="primary"
						label="Create API key"
						fullWidth
						onClick={handleSendCreateRequest}
						isLoading={isRequestLoading}
						disabled={isSubmitDisabled}
					/>
					{profileStatus && !profileStatus.two_factor_enabled && (
						<span className={styles.submit_info}>
							<i className="ai ai-error_outline" />
							To create an API key, 2FA must be connected
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default observer(CreateApiKeyForm);
