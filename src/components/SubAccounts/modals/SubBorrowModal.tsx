import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import * as yup from "yup";

import { errorsFromSchema, validateSchema } from "utils/yup";
import messages from "messages/exchange";
import commonMessages from "messages/common";
import Modal, { ActionGroup, Footer, InfoGrid, SuccessScreen } from "components/UI/Modal";
import styles from "styles/components/UI/Modal.module.scss";
import marginModalStyles from "styles/components/MarginModal.module.scss";
import Button from "components/UI/Button";
import formMessages from "messages/form";
import { AccountTypeEnum } from "types/account";
import InfoSnack from "components/InfoSnack";
import InternalLink from "components/InternalLink";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { IMarginCurrencyStatus } from "models/Terminal";
import { formatNumberNoRounding, formatRateToPercentage } from "utils/format";
import RadioChoice from "components/UI/Radio";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Tooltip from "components/UI/Tooltip";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import { ACCOUNT_TYPE } from "constants/exchange";
import useTimeout from "hooks/useTimeout";
import errorHandler from "utils/errorHandler";
import SubAccountsService from "services/SubAccountsService";
import { ISubAccountMarginBorrowBody } from "types/subAccounts";
import {
	ICrossBalanceExtended,
	IIsolatedBalanceExtended,
	IWalletExtended,
} from "components/SubAccounts/BalanceDetails/BalanceDetailsTable/BalanceDetailsTable";
import { getSelectOptionFromString } from "utils/getter";
import { routes } from "constants/routing";
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

const BorrowModal: React.FC<IProps> = ({
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
	const { formatMessage } = useIntl();
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

	const isCross = type === AccountTypeEnum.CROSS;
	const isIsolated = type === AccountTypeEnum.ISOLATED;

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
					[queryVars.wallet_type]: isIsolated
						? ACCOUNT_TYPE[AccountTypeEnum.ISOLATED]
						: ACCOUNT_TYPE[AccountTypeEnum.CROSS],
					[queryVars.currency]: isIsolated ? formBody.currency : formBody.asset,
					[queryVars.pair]: isIsolated ? formBody.pair.replace("/", "_") : undefined,
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
		const body: ISubAccountMarginBorrowBody = {
			[queryVars.amount]: +formBody.amount.replace(",", "."),
			[queryVars.wallet_type]: isIsolated ? ACCOUNT_TYPE.isolated : ACCOUNT_TYPE.cross,
			[queryVars.currency]: isIsolated ? formBody.currency : formBody.asset,
			[queryVars.pair]: isIsolated ? formBody.pair.replace("/", "_") : undefined,
			[queryVars.sub_account]: uid,
		};

		if (await validate()) {
			try {
				setIsSubmitLoading(true);
				await SubAccountsService.marginBorrow(body);
				refetchAllBalances();
				loadMarginCurrencyStatus();
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
		const amount = currencyStatus ? Math.max(0, currencyStatus.borrowable) : 0;
		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(amount, currencyStatus?.currency?.precision ?? 8),
		}));
	};

	const pairsOptions: IOption[] = Array.from(new Set(isolatedBalances.map((b) => b.pair))).map(
		getSelectOptionFromString,
	);

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
		(b) => b.code === (isCross ? formBody.asset : formBody.currency),
	);

	return (
		<Modal
			label={formatMessage(messages.borrow)}
			isOpen={isOpen}
			onClose={onClose}
			headerBorder={false}
		>
			{isSuccessful ? (
				<>
					<SuccessScreen>
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
								label={formatMessage(messages.borrow_more)}
							/>
						</ActionGroup>
					</Footer>
				</>
			) : (
				<>
					<div className={styles.body_container}>
						<InfoSnack color="yellow" plain>
							<span>
								{formatMessage(messages.borrow_warning, {
									link: (
										<InternalLink to={routes.termsOfUse} blank>
											{formatMessage(commonMessages.more)}
										</InternalLink>
									),
								})}
							</span>
						</InfoSnack>
						<div className={styles.content_form}>
							{isIsolated ? (
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
							) : null}
						</div>
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
													currencyStatus.borrowed,
													currentBalance?.precision ?? 8,
												)}
												&nbsp;
												{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
									<span>
										{formatMessage(messages.borrow_maximum)}
										<Tooltip
											id="maximum-hint"
											opener={<i className="ai ai-hint" />}
											text={formatMessage(messages.borrow_maximum_hint)}
										/>
									</span>
									<span>
										{currencyStatus ? (
											<>
												{formatNumberNoRounding(
													Math.max(0, currencyStatus.borrowable),
													currencyStatus.currency?.precision ?? 8,
												)}
												&nbsp;{currencyStatus.currency?.code ?? "--"}
											</>
										) : (
											"--"
										)}
									</span>
									<span>
										{formatMessage(messages.borrow_hourly_rate)}
										<Tooltip
											id="daily-rate-hint"
											opener={<i className="ai ai-hint" />}
											text={formatMessage(messages.borrow_hourly_rate_hint)}
										/>
									</span>
									<span>
										{currencyStatus && currencyStatus.interest_rate > 0
											? formatRateToPercentage(currencyStatus.interest_rate)
											: "--"}
									</span>
								</InfoGrid>
							)}
						</div>
						<div className={styles.content_form}>
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
						</div>
					</div>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								onClick={handleSubmit}
								isLoading={isSubmitLoading}
								label={formatMessage(messages.borrow)}
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

export default observer(BorrowModal);
