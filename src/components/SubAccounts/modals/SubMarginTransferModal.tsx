import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { observer } from "mobx-react-lite";

import messages from "messages/exchange";
import commonMessages from "messages/common";
import Modal, {
	ActionGroup,
	BodyContainer,
	ContentForm,
	Footer,
	SuccessScreen,
} from "components/UI/Modal";
import marginModalStyles from "styles/components/MarginModal.module.scss";
import Button from "components/UI/Button";
import formMessages from "messages/form";
import { AccountTypeEnum } from "types/account";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { IMarginCurrencyStatus } from "models/Terminal";
import { formatNumberNoRounding } from "utils/format";
import RadioChoice from "components/UI/Radio";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import { ACCOUNT_TYPE } from "constants/exchange";
import errorHandler from "utils/errorHandler";
import { errorsFromSchema, validateSchema } from "utils/yup";
import Select, { ISelectOption } from "components/UI/Select";
import SubAccountService from "services/SubAccountsService";
import { ISubAccountMarginTransferBody } from "types/subAccounts";
import {
	ICrossBalanceExtended,
	IIsolatedBalanceExtended,
	IWalletExtended,
} from "components/SubAccounts/BalanceDetails/BalanceDetailsTable/BalanceDetailsTable";
import { getSelectOptionsFromBalances } from "utils/getter";
import { queryVars } from "constants/query";

const ACCOUNT_TYPE_OPTIONS: ISelectOption[] = [
	{ label: "Spot", value: "spot" },
	{ label: "Cross Margin", value: "cross" },
	{ label: "Isolated Margin", value: "isolated" },
];

interface IFormBody {
	from: AccountTypeEnum;
	to: AccountTypeEnum;
	asset: string;
	amount: string;
	pair: string;
	currency: string;
}

interface IFormBodyErrors {
	asset: string;
	amount: string;
	pair: string;
	currency: string;
}

interface IProps {
	uid: string;
	refetchAllBalances: () => void;
	spotBalances: IWalletExtended[];
	crossBalances: ICrossBalanceExtended[];
	isolatedBalances: IIsolatedBalanceExtended[];
	isOpen: boolean;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
	onClose: () => void;
	pair?: string;
	asset?: string;
	currency?: string;
	onSuccess?: () => void;
	onBorrowModalOpen?: () => void;
}

const SubMarginTransferModal: React.FC<IProps> = ({
	isOpen,
	uid,
	refetchAllBalances,
	spotBalances,
	crossBalances,
	isolatedBalances,
	onClose,
	type,
	pair,
	asset,
	currency,
	onSuccess,
	onBorrowModalOpen,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [formBody, setFormBody] = useState<IFormBody>({
		from: AccountTypeEnum.SPOT,
		to: type as AccountTypeEnum,
		asset: asset ?? "",
		amount: "",
		pair: pair ?? "",
		currency: currency ?? "",
	});
	const [formErrors, setFormErrors] = useState<IFormBodyErrors>({
		asset: "",
		amount: "",
		pair: "",
		currency: "",
	});
	const [currentTransferable, setCurrentTransferable] = useState<number>(0);
	const [currencyStatus, setCurrencyStatus] = useState<IMarginCurrencyStatus | null>(null);

	const isIsolated =
		formBody.from === AccountTypeEnum.ISOLATED || formBody.to === AccountTypeEnum.ISOLATED;
	const isCross = formBody.from === AccountTypeEnum.CROSS || formBody.to === AccountTypeEnum.CROSS;
	const marginBalances = isIsolated ? isolatedBalances : crossBalances;
	const currentBalances =
		formBody.from === AccountTypeEnum.SPOT
			? spotBalances.filter((b) => b.is_cross_margin_available)
			: marginBalances;

	const assetsOptions: IOption[] = currentBalances.map(
		(b): IOption => ({
			label: {
				code: b.code,
				name: b.name,
				available: `${+b.balance - +b.reserve}`,
				precision: b.precision ?? 8,
				image_png: b.image_png ?? "",
				image_svg: b.image_svg ?? "",
			},
			value: b.code,
		}),
	);

	const pairsOptions: IOption[] = getSelectOptionsFromBalances(isolatedBalances);

	pairsOptions.forEach((o) => {
		o.label.image_png = isolatedBalances.find((b) => b.pair === o.value)?.image_png ?? "";
		o.label.image_svg = isolatedBalances.find((b) => b.pair === o.value)?.image_svg ?? "";
	});

	const balanceFrom =
		formBody.from !== AccountTypeEnum.SPOT
			? marginBalances.find((b) => b.code === (isIsolated ? formBody.currency : formBody.asset))
			: spotBalances.find((b) => b.code === (isIsolated ? formBody.currency : formBody.asset));

	useEffect(() => {
		if (formBody.from === AccountTypeEnum.SPOT) {
			if (formBody.asset || formBody.currency) {
				const currentBalance = spotBalances.find(
					(b) =>
						b.code ===
						(formBody.to === AccountTypeEnum.ISOLATED ? formBody.currency : formBody.asset),
				);
				setCurrentTransferable(currentBalance ? +currentBalance.available : 0);
			} else {
				setCurrentTransferable(0);
			}
		} else if ((isCross && formBody.asset) || (isIsolated && formBody.pair && formBody.currency)) {
			loadMarginCurrencyStatus();
		}
	}, [formBody.asset, formBody.currency, formBody.from, formBody.pair, spotBalances]);

	const handleFromChange = (o: ISelectOption): void => {
		const value = o.value as AccountTypeEnum;
		setFormBody((prevState) => ({
			...prevState,
			from: value,
			to:
				value === AccountTypeEnum.SPOT
					? prevState.to !== AccountTypeEnum.SPOT
						? prevState.to
						: AccountTypeEnum.CROSS
					: AccountTypeEnum.SPOT,
		}));
	};

	const handleToChange = (o: ISelectOption): void => {
		const value = o.value as AccountTypeEnum;
		setFormBody((prevState) => ({
			...prevState,
			to: value,
			from: prevState.from === value ? prevState.to : prevState.from,
		}));
	};

	const handleAssetChange = (o: IOption): void => {
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			asset: value,
		}));
	};

	const handlePairChange = (o: IOption): void => {
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			pair: value,
		}));
	};

	const handleSwapFromTo = (): void => {
		setFormBody((prevState) => ({
			...prevState,
			from: prevState.to,
			to: prevState.from,
		}));
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			amount: value,
		}));
	};

	const handlePairCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			currency: value,
		}));
	};

	const handleMaxAmountClick = (): void => {
		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(currentTransferable, 8),
		}));
	};

	const handleOpenBorrowModal = (): void => {
		if (onBorrowModalOpen) {
			onBorrowModalOpen();
		}
	};

	const validate = async (): Promise<boolean> => {
		try {
			await validateSchema({
				amount: [formBody.amount, yup.string().required(formatMessage(formMessages.required))],
			});
			return true;
		} catch (err) {
			setFormErrors(errorsFromSchema<IFormBody>(err as any) as IFormBody);
			return false;
		}
	};

	const loadMarginCurrencyStatus = async (): Promise<void> => {
		if ((isCross && formBody.asset) || (isIsolated && formBody.pair && formBody.currency)) {
			try {
				const params = {
					[queryVars.sub_account]: uid,
					[queryVars.wallet_type]:
						type === AccountTypeEnum.ISOLATED
							? ACCOUNT_TYPE[AccountTypeEnum.ISOLATED]
							: ACCOUNT_TYPE[AccountTypeEnum.CROSS],
					[queryVars.currency]:
						type === AccountTypeEnum.ISOLATED ? formBody.currency : formBody.asset,
					[queryVars.pair]:
						type === AccountTypeEnum.ISOLATED ? formBody.pair.replace("/", "_") : undefined,
				};
				const res: IMarginCurrencyStatus = await SubAccountService.getCurrencyStatus(params);
				setCurrencyStatus(res);
				setCurrentTransferable(+res.transferable);
			} catch (err) {
				errorHandler(err);
			}
		}
	};

	const handleSubmit = async () => {
		const body: ISubAccountMarginTransferBody = {
			direction: formBody.from === AccountTypeEnum.SPOT ? 0 : 1,
			wallet_type: isIsolated ? ACCOUNT_TYPE.isolated : ACCOUNT_TYPE.cross,
			currency: isIsolated ? formBody.currency : formBody.asset,
			amount: +formBody.amount.replace(",", "."),
			pair: isIsolated ? formBody.pair.replace("/", "_") : undefined,
			sub_account: uid,
		};

		if (await validate()) {
			try {
				setIsSubmitLoading(true);
				await SubAccountService.marginTransfer(body);
				refetchAllBalances();
				loadMarginCurrencyStatus();
				setIsSuccessful(true);
				if (onSuccess) {
					onSuccess();
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				setIsSubmitLoading(false);
			}
		}
	};

	return (
		<Modal label={formatMessage(messages.transfer)} isOpen={isOpen} onClose={onClose}>
			{isSuccessful ? (
				<>
					<SuccessScreen>
						<b>
							{formatNumberNoRounding(+formBody.amount.replace(",", "."), 8)}
							&nbsp;
							{isIsolated ? formBody.currency : formBody.asset}
						</b>
						<span>{formatMessage(messages.amount_successfuly_submitted)}</span>
						<span>
							{formatMessage(
								formBody.to === AccountTypeEnum.SPOT
									? messages.transfer_to_spot_success
									: messages.transfer_to_margin_success,
							)}
						</span>
					</SuccessScreen>
					<Footer>
						<ActionGroup>
							{formBody.to !== AccountTypeEnum.SPOT && onBorrowModalOpen ? (
								<Button
									fullWidth
									variant="filled"
									color="primary"
									onClick={handleOpenBorrowModal}
									label={`Borrow ${
										isIsolated ? `${formBody.pair} - ${formBody.currency}` : `${formBody.asset}`
									}`}
								/>
							) : null}
							<Button
								fullWidth
								variant="text"
								color="primary"
								onClick={onClose}
								label={formatMessage(commonMessages.close)}
							/>
						</ActionGroup>
					</Footer>
				</>
			) : (
				<>
					<BodyContainer>
						<ContentForm>
							{formBody.from === AccountTypeEnum.ISOLATED ? (
								<div className={marginModalStyles.isolated_select_container}>
									<Select
										options={ACCOUNT_TYPE_OPTIONS}
										onChange={handleFromChange}
										isSearchable={false}
										label={formatMessage(messages.from)}
										labeled
										value={ACCOUNT_TYPE_OPTIONS.find(
											(o: ISelectOption) => o.value === formBody.from,
										)}
									/>
									<CurrencySelect
										onSelectChange={handlePairChange}
										options={pairsOptions}
										value={pairsOptions.find((o: IOption) => o.value === formBody.pair)}
										autoFocus
										label={formatMessage(messages.trade_pair)}
									/>
								</div>
							) : (
								<Select
									options={ACCOUNT_TYPE_OPTIONS}
									onChange={handleFromChange}
									isSearchable={false}
									label={formatMessage(messages.from)}
									labeled
									value={ACCOUNT_TYPE_OPTIONS.find((o: ISelectOption) => o.value === formBody.from)}
								/>
							)}
							<div className={marginModalStyles.transfer_to_container}>
								<button type="button" aria-label="swap-to" onClick={handleSwapFromTo}>
									<i className="ai ai-change_arrows" />
								</button>
								{formBody.to === AccountTypeEnum.ISOLATED ? (
									<div className={marginModalStyles.isolated_select_container}>
										<Select
											options={ACCOUNT_TYPE_OPTIONS.filter((o: ISelectOption) =>
												formBody.from === AccountTypeEnum.SPOT
													? o.value !== AccountTypeEnum.SPOT
													: o.value === AccountTypeEnum.SPOT,
											)}
											onChange={handleToChange}
											isSearchable={false}
											labeled
											label={formatMessage(messages.to)}
											value={ACCOUNT_TYPE_OPTIONS.find(
												(o: ISelectOption) => o.value === formBody.to,
											)}
										/>
										<CurrencySelect
											onSelectChange={(option) => handlePairChange(option as IOption)}
											options={pairsOptions}
											value={pairsOptions.find((o: IOption) => o.value === formBody.pair)}
											autoFocus
											label={formatMessage(messages.trade_pair)}
										/>
									</div>
								) : (
									<Select
										options={ACCOUNT_TYPE_OPTIONS.filter((o: ISelectOption) =>
											formBody.from === AccountTypeEnum.SPOT
												? o.value !== AccountTypeEnum.SPOT
												: o.value === AccountTypeEnum.SPOT,
										)}
										labeled
										onChange={handleToChange}
										isSearchable={false}
										label="To"
										value={ACCOUNT_TYPE_OPTIONS.find((o: ISelectOption) => o.value === formBody.to)}
									/>
								)}
							</div>
							{isIsolated && formBody.pair ? (
								<div className={marginModalStyles.coins_container}>
									<div className={marginModalStyles.coins}>
										<RadioChoice
											onChange={handlePairCurrencyChange}
											label={formBody.pair.split("/")[0]}
											value={formBody.currency}
											choice={formBody.pair.split("/")[0]}
											name="currency"
										/>
										<RadioChoice
											onChange={handlePairCurrencyChange}
											label={formBody.pair.split("/")[1]}
											value={formBody.currency}
											choice={formBody.pair.split("/")[1]}
											name="currency"
										/>
									</div>
								</div>
							) : isCross ? (
								<CurrencySelect
									onSelectChange={(option) => handleAssetChange(option as IOption)}
									options={assetsOptions}
									value={assetsOptions.find((o: IOption) => o.value === formBody.asset)}
									autoFocus
									label="Asset"
								/>
							) : null}
							<div className={marginModalStyles.amount_container}>
								{balanceFrom ? (
									<div className={marginModalStyles.available_amount}>
										{formatNumberNoRounding(Math.max(0, currentTransferable), 8)}
										&nbsp;
										{isIsolated ? formBody.currency : formBody.asset}
									</div>
								) : null}
								<Input
									value={formBody.amount}
									error={formErrors.amount}
									onChange={handleAmountChange}
									onEnter={handleSubmit}
									autoFocus
									labelValue={formatMessage(messages.amount)}
									appender={
										<Appender>
											{isIsolated ? formBody.currency : formBody.asset}
											<AppenderDivider />
											<AppenderButton onClick={handleMaxAmountClick}>max</AppenderButton>
										</Appender>
									}
								/>
							</div>
						</ContentForm>
						{currencyStatus && formBody.to === AccountTypeEnum.SPOT ? (
							<div className={marginModalStyles.transfer_info_container}>
								<span>{formatMessage(messages.borrowed)}</span>
								<span>
									{formatNumber(currencyStatus.borrowed, {
										useGrouping: false,
										maximumFractionDigits: currencyStatus.currency?.precision ?? 8,
										minimumFractionDigits: currencyStatus.currency?.precision ?? 0,
									})}
									&nbsp;{currencyStatus.currency?.code ?? "--"}
								</span>
								<span>{formatMessage(messages.margin_level)}</span>
								<span>
									{formatNumber(Math.min(currencyStatus.margin_level, 999), {
										useGrouping: false,
										maximumFractionDigits: 2,
										minimumFractionDigits: 2,
									})}
								</span>
							</div>
						) : null}
					</BodyContainer>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								onClick={handleSubmit}
								isLoading={isSubmitLoading}
								label={formatMessage(commonMessages.submit)}
							/>
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								onClick={onClose}
								label={formatMessage(commonMessages.back_btn)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default observer(SubMarginTransferModal);
