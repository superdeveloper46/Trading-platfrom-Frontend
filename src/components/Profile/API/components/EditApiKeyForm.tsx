import React, { useEffect, useState, useCallback } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import Button, { ButtonsGroup } from "components/UI/Button";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import commonMessages from "messages/common";
import subAccountsMessages from "messages/sub_accounts";
import styles from "styles/components/Profile/Api/EditApiKey.module.scss";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import { IApiKeyDetails } from "models/ApiKeys";
import { ITicker } from "models/Ticker";
import Input, { IInputChange } from "components/UI/Input";
import { IP_REGEX } from "constants/common";
import { IUpdateApiKeyRequestBody } from "types/profile";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Switch from "components/UI/Switch";
import RadioChoice from "components/UI/Radio";
import IconButton from "components/UI/IconButton";
import { cancelApiKeyUpdating, getApiKeyDetails, updateApiKey } from "services/ApiService";
import { ellipsisInsideWord } from "utils/format";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
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

const EditApiKeyForm: React.FC = () => {
	const { tickers } = useMst();
	const { slug } = useParams<{ slug: string }>();
	const copyClick = useCopyClick();
	const [details, setDetails] = useState<IApiKeyDetails | null>(null);
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
	const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(true);
	const [baseCurrenciesList, setBaseCurrenciesList] = useState<IOption[]>([]);
	const [quoteCurrenciesList, setQuoteCurrenciesList] = useState<IOption[]>([]);
	const [baseCurrency, setBaseCurrency] = useState<string>("");
	const [quoteCurrency, setQuoteCurrency] = useState<string>("");
	const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [requestSlug, setRequestSlug] = useState<string>("");

	const handleClickCopy = (value: string): void => {
		copyClick(value);
	};

	const isSubmitDisabled =
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

	useEffect(() => {
		(async function () {
			if (slug) {
				setIsDetailsLoading(true);
				const details = await getApiKeyDetails(slug);
				if (details) {
					setDetails(details);
					setFormBody((prevState) => ({
						...prevState,
						apiKeyName: details.label,
						permittedActions: {
							withdraw: details.can_withdraw,
							margin: details.can_margin,
							trading: details.can_trade,
						},
						permittedIPStrategy: details.limit_to_ips?.length ? "specified" : "any",
						permittedIPsList: details.limit_to_ips ?? [],
						availablePairsStrategy: details.allowed_symbols?.length ? "specified" : "any",
						availablePairsList:
							details.allowed_symbols?.map((symbol: string) => symbol.replace("_", "/")) ?? [],
					}));
				}
				setIsDetailsLoading(false);
			}
		})();
	}, [slug]);

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

	const handleApiKeyNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			apiKeyName: value,
		}));
	};

	const handlePermittedActionsWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				withdraw: value,
			},
		}));
	};

	const handlePermittedActionsMarginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				margin: value,
			},
		}));
	};

	const handlePermittedActionsTradingChange = (e: IInputChange): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: {
				...prevState.permittedActions,
				trading: value,
			},
		}));
	};

	const handleRemoveAvailablePairFromList = (
		e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
	) => {
		const { pair } = e.currentTarget.dataset;
		setFormBody((prevState) => ({
			...prevState,
			availablePairsList: prevState.availablePairsList.filter((p: string) => p !== pair),
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

	const handlePermittedIPStrategyChange = (e: IInputChange): void => {
		const value: TPermittedIPStrategy = e.target.value as TPermittedIPStrategy;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPStrategy: value,
		}));
	};

	const handlePermittedIPsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPs: value,
			permittedIPsList: value === "any" ? [] : prevState.permittedIPsList,
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

	const handleRemovePermittedIPFromList = (
		e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		const { ip } = e.currentTarget.dataset;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: prevState.permittedIPsList.filter((permIP: string) => permIP !== ip),
		}));
	};

	const handleCloseModal = (): void => {
		setShowModal(false);
		cancelApiKeyUpdating(requestSlug);
		setRequestSlug("");
	};

	const handleSendCreateUpdateRequest = async (): Promise<void> => {
		const data: IUpdateApiKeyRequestBody = {
			api_key: slug!,
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
		setIsRequestLoading(true);
		const rs = await updateApiKey(data);
		setRequestSlug(rs);
		setIsRequestLoading(false);
		setShowModal(true);
	};

	return (
		<>
			{showModal && (
				<ConfirmCreateUpdateApiKeyModal
					isOpen={showModal}
					onClose={handleCloseModal}
					slug={requestSlug}
					variant="update"
				/>
			)}
			<div className={styles.container}>
				<h3 className={styles.title}>Edit Api Key</h3>
				{isDetailsLoading ? (
					<LoadingSpinner />
				) : details ? (
					<>
						<div className={styles.key}>
							<span>API key:</span>
							<span
								className={styles.api_key_value}
								title={details.key}
								onClick={() => handleClickCopy(details.key)}
							>
								{ellipsisInsideWord(details.key)}
							</span>
						</div>
						<Input
							type="text"
							labelValue="API key name"
							value={formBody.apiKeyName}
							onChange={handleApiKeyNameChange}
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
									label="Enable Withdraw"
									disabled
									checked={formBody.permittedActions.withdraw}
									onChange={handlePermittedActionsWithdrawChange}
								/>
								<Switch
									id="margin"
									label="Enable Margin"
									disabled
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
								/>
								<span>/</span>
								<CurrencySelect
									onSelectChange={handleSelectQuoteCurrencyChange}
									options={quoteCurrenciesList}
									value={quoteCurrencyOption}
									disabled={formBody.availablePairsStrategy !== "specified"}
									autoFocus
									withoutLabel
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
					</>
				) : null}
			</div>
			{!isDetailsLoading && (
				<ButtonsGroup style={{ maxWidth: "340px" }}>
					<Button
						label={formatMessage(commonMessages.save)}
						variant="filled"
						color="primary"
						fullWidth
						onClick={handleSendCreateUpdateRequest}
						isLoading={isRequestLoading}
						disabled={isSubmitDisabled}
					/>
					{!isRequestLoading && (
						<InternalLink to={routes.api.root}>
							<Button
								label={formatMessage(commonMessages.back_btn)}
								variant="text"
								color="primary"
								fullWidth
							/>
						</InternalLink>
					)}
				</ButtonsGroup>
			)}
		</>
	);
};

export default observer(EditApiKeyForm);
