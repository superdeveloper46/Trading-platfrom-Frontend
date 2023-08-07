import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import * as yup from "yup";

import { errorsFromSchema, validateSchema } from "utils/yup";
import messages from "messages/exchange";
import commonMessages from "messages/common";
import Modal, {
	ActionGroup,
	BodyContainer,
	ContentForm,
	Footer,
	InfoGrid,
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
import LoadingSpinner from "components/UI/LoadingSpinner";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import { ACCOUNT_TYPE } from "constants/exchange";
import useTimeout from "hooks/useTimeout";
import errorHandler from "utils/errorHandler";
import {
	ICrossBalanceExtended,
	IIsolatedBalanceExtended,
	IWalletExtended,
} from "components/SubAccounts/BalanceDetails/BalanceDetailsTable/BalanceDetailsTable";
import SubAccountsService from "services/SubAccountsService";
import { ISubAccountMarginRepayBody } from "types/subAccounts";
import { getSelectOptionsFromBalances } from "utils/getter";
import { queryVars } from "constants/query";

interface IFormBody {
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
}

const RepayModal: React.FC<IProps> = ({
	uid,
	refetchAllBalances,
	spotBalances,
	crossBalances,
	isolatedBalances,
	isOpen,
	onClose,
	type,
	pair,
	asset,
	currency,
	onSuccess,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [formBody, setFormBody] = useState<IFormBody>({
		asset: asset ?? "",
		amount: "",
		pair: pair ?? "",
		currency: currency ?? "",
	});
	const [formErrors, setFormErrors] = useState<IFormBody>({
		asset: "",
		amount: "",
		pair: "",
		currency: "",
	});
	const [isCurrencyStatusLoading, setIsCurrencyStatusLoading] = useState<boolean>(false);
	const [currencyStatus, setCurrencyStatus] = useState<IMarginCurrencyStatus | null>(null);
	const timeout = useTimeout();

	const isIsolated = type === AccountTypeEnum.ISOLATED;
	const isCross = type === AccountTypeEnum.CROSS;

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
				setIsCurrencyStatusLoading(true);
				const res: IMarginCurrencyStatus = await SubAccountsService.getCurrencyStatus(params);
				setCurrencyStatus(res);
			} catch (err) {
				errorHandler(err);
			} finally {
				setIsCurrencyStatusLoading(false);
			}
		}
	};

	useEffect(() => {
		loadMarginCurrencyStatus();
	}, [formBody.asset, formBody.currency, formBody.pair, type]);

	const handleSubmit = async () => {
		const body: ISubAccountMarginRepayBody = {
			[queryVars.amount]: +formBody.amount.replace(",", "."),
			[queryVars.wallet_type]: isIsolated ? ACCOUNT_TYPE.isolated : ACCOUNT_TYPE.cross,
			[queryVars.currency]: isIsolated ? formBody.currency : formBody.asset,
			[queryVars.pair]: isIsolated ? formBody.pair.replace("/", "_") : undefined,
			[queryVars.sub_account]: uid,
		};

		if (await validate()) {
			try {
				setIsSubmitLoading(true);
				await SubAccountsService.marginRepay(body);
				loadMarginCurrencyStatus();
				refetchAllBalances();
				setIsSuccessful(true);
				if (onSuccess) {
					timeout(onSuccess, 250);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				setIsSubmitLoading(false);
			}
		}
	};

	const handleResetState = () => {
		loadMarginCurrencyStatus();
		setFormBody((prevState) => ({
			...prevState,
			amount: "",
		}));
		setIsSuccessful(false);
	};

	const handlePairChange = (o: IOption): void => {
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			pair: value,
		}));
	};

	const handleAssetChange = (o: IOption): void => {
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			asset: value,
		}));
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			amount: value,
		}));
		setFormErrors((prevState) => ({
			...prevState,
			amount: "",
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
		const amount = currencyStatus
			? Math.min(
					+currencyStatus.balance - +currencyStatus.reserve,
					+currencyStatus.borrowed + +currencyStatus.interest,
			  )
			: 0;
		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(amount, 8),
		}));
	};

	const pairsOptions: IOption[] = getSelectOptionsFromBalances(isolatedBalances);

	pairsOptions.forEach((o) => {
		o.label.image_png = isolatedBalances.find((b) => b.pair === o.value)?.image_png ?? "";
		o.label.image_svg = isolatedBalances.find((b) => b.pair === o.value)?.image_svg ?? "";
	});

	const assetsOptions: IOption[] = spotBalances
		.filter((b) => b.is_cross_margin_available)
		.map((b) => ({
			label: {
				code: b.code,
				name: b.name,
				image_png: b.image_png ?? "",
				image_svg: b.image_svg ?? "",
			},
			value: b.code,
		}));

	const selectedAsset = assetsOptions.find((o: IOption) => o.value === formBody.asset);

	const selectedPair = pairsOptions.find((o: IOption) => o.value === formBody.pair);

	const marginBalances = crossBalances.concat(isolatedBalances);

	const currentBalance = marginBalances.find(
		(b) => b.code === (type === AccountTypeEnum.CROSS ? formBody.asset : formBody.currency),
	);

	return (
		<Modal label={formatMessage(messages.repay)} isOpen={isOpen} onClose={onClose}>
			{isSuccessful ? (
				<>
					<SuccessScreen>
						<span>
							{formatNumber(+formBody.amount.replace(",", "."), {
								useGrouping: false,
								maximumFractionDigits: 8,
							})}
							&nbsp;
							{isCross ? formBody.asset : formBody.currency}
						</span>
						<span>{formatMessage(messages.amount_successfuly_submitted)}</span>
					</SuccessScreen>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								onClick={onClose}
								label={formatMessage(commonMessages.ok)}
							/>
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								onClick={handleResetState}
								label={formatMessage(messages.repay_more)}
							/>
						</ActionGroup>
					</Footer>
				</>
			) : (
				<>
					<BodyContainer>
						<ContentForm>
							{type === AccountTypeEnum.ISOLATED ? (
								<CurrencySelect
									onSelectChange={handlePairChange}
									options={pairsOptions}
									value={selectedPair}
									autoFocus
									label={formatMessage(messages.trade_pair)}
								/>
							) : (
								<CurrencySelect
									onSelectChange={handleAssetChange}
									options={assetsOptions}
									value={selectedAsset}
									autoFocus
									label={formatMessage(messages.asset)}
								/>
							)}
							{type === AccountTypeEnum.ISOLATED && formBody.pair ? (
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
							) : null}
						</ContentForm>
						<div className={marginModalStyles.info_container}>
							{isCurrencyStatusLoading ? (
								<LoadingSpinner />
							) : (
								<InfoGrid>
									<span>{formatMessage(messages.borrowed)}</span>
									<span>
										{currencyStatus ? (
											<>
												{formatNumberNoRounding(
													+currencyStatus.borrowed,
													currentBalance?.precision ?? 8,
												)}
												&nbsp;
												{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
									<span>{formatMessage(messages.interest)}</span>
									<span>
										{currencyStatus ? (
											<>
												{formatNumber(currencyStatus.interest, {
													useGrouping: false,
													maximumFractionDigits: 8,
													minimumFractionDigits: 8,
												})}
												&nbsp;{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
									<span>{formatMessage(messages.total_debt)}</span>
									<span>
										{currencyStatus ? (
											<>
												{formatNumber(+currencyStatus.borrowed + +currencyStatus.interest, {
													useGrouping: false,
													maximumFractionDigits: 8,
													minimumFractionDigits: 8,
												})}
												&nbsp;{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
									<span>{formatMessage(messages.available)}</span>
									<span>
										{currencyStatus ? (
											<>
												{formatNumber(currencyStatus.balance - currencyStatus.reserve, {
													useGrouping: false,
													maximumFractionDigits: 8,
													minimumFractionDigits: 8,
												})}
												&nbsp;{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
								</InfoGrid>
							)}
						</div>
						<ContentForm>
							<Input
								value={formBody.amount}
								onChange={handleAmountChange}
								onEnter={handleSubmit}
								error={formErrors.amount}
								autoFocus
								type="number"
								labelValue="Amount"
								appender={
									<Appender>
										{formBody.asset}
										<AppenderDivider />
										<AppenderButton onClick={handleMaxAmountClick}>max</AppenderButton>
									</Appender>
								}
							/>
						</ContentForm>
					</BodyContainer>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								onClick={handleSubmit}
								isLoading={isSubmitLoading}
								label={formatMessage(messages.repay)}
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

export default observer(RepayModal);
