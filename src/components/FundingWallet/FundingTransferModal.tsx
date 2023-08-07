import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import * as yup from "yup";

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
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { useMst } from "models/Root";
import { formatNumberNoRounding } from "utils/format";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import errorHandler from "utils/errorHandler";
import { errorsFromSchema, validateSchema } from "utils/yup";
import Select, { ISelectOption } from "components/UI/Select";
import { IP2PBalance, ITransferParams } from "types/p2p";
import P2PService from "services/P2PService";
import styles from "styles/pages/P2P/Modals.module.scss";

enum WalletTypeEnum {
	Spot = "spot",
	Funding = "funding",
}

const ACCOUNT_TYPE_OPTIONS: ISelectOption[] = [
	{ label: "Spot", value: WalletTypeEnum.Spot },
	{ label: "Funding", value: WalletTypeEnum.Funding },
];

interface IFormBody {
	from: WalletTypeEnum;
	to: WalletTypeEnum;
	asset: string;
	amount: string;
}

interface IFormBodyErrors {
	from: string;
	to: string;
	asset: string;
	amount: string;
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	asset?: string;
	onSuccess?: () => void;
	fundingBalances: IP2PBalance[];
	refetchFundingBalances: () => void;
}

const TransferModal: React.FC<IProps> = ({
	isOpen,
	onClose,
	asset,
	onSuccess,
	fundingBalances,
	refetchFundingBalances,
}) => {
	const {
		account: { balances, loadBalances },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [formBody, setFormBody] = useState<IFormBody>({
		from: WalletTypeEnum.Spot,
		to: WalletTypeEnum.Funding,
		asset: asset ?? "",
		amount: "",
	});

	const [formErrors, setFormErrors] = useState<IFormBodyErrors>({
		from: "",
		to: "",
		asset: "",
		amount: "",
	});

	const [currentTransferable, setCurrentTransferable] = useState<number>(0);

	const currentBalances = formBody.from === WalletTypeEnum.Spot ? balances : fundingBalances;

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

	const balanceFrom =
		formBody.from !== WalletTypeEnum.Spot
			? fundingBalances.find((b) => b.code === formBody.asset)
			: balances.find((b) => b.code === formBody.asset);

	const handleFromChange = (o: ISelectOption): void => {
		const value = o.value as WalletTypeEnum;
		setFormBody((prevState) => ({
			...prevState,
			from: value,
			to: prevState.from,
		}));
	};

	const handleToChange = (o: ISelectOption): void => {
		const value = o.value as WalletTypeEnum;
		setFormBody((prevState) => ({
			...prevState,
			to: value,
			from: prevState.to,
		}));
	};

	const handleAssetChange = (o: IOption): void => {
		const { value } = o;
		setFormBody((prevState) => ({
			...prevState,
			asset: value,
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
		setFormErrors((prevState) => ({
			...prevState,
			amount: "",
		}));
	};

	const handleMaxAmountClick = (): void => {
		setFormBody((prevState) => ({
			...prevState,
			amount: formatNumberNoRounding(currentTransferable, 8),
		}));
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

	const handleSubmit = async () => {
		const body: ITransferParams = {
			direction: formBody.from === WalletTypeEnum.Spot ? 0 : 1,
			currency: formBody.asset,
			amount: +formBody.amount.replace(",", "."),
		};

		if (await validate()) {
			try {
				setIsSubmitLoading(true);
				await P2PService.fundingTransfer(body);
				loadBalances();
				refetchFundingBalances();
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

	useEffect(() => {
		if (!formBody.asset) {
			setCurrentTransferable(0);
		}
		if (formBody.from === WalletTypeEnum.Spot) {
			const currentBalance = balances.find((b) => b.code === formBody.asset);
			setCurrentTransferable(currentBalance ? +currentBalance.available : 0);
		} else {
			const currentBalance = fundingBalances.find((b) => b.code === formBody.asset);
			setCurrentTransferable(currentBalance ? +currentBalance.balance : 0);
		}
	}, [formBody.asset, balances, fundingBalances, formBody.from]);

	useEffect(() => {
		setFormBody((prevState) => ({
			...prevState,
			asset: asset ?? "",
		}));
	}, [asset]);

	useEffect(() => {
		if (!isOpen) {
			setFormBody({
				asset: "",
				amount: "",
				from: WalletTypeEnum.Spot,
				to: WalletTypeEnum.Funding,
			});
		}
	}, [isOpen]);

	return (
		<Modal
			className={cn(styles.p2p_modal_container, styles.add_method_modal, styles.overflow)}
			label={formatMessage(messages.transfer)}
			isOpen={isOpen}
			onClose={onClose}
		>
			{isSuccessful ? (
				<>
					<SuccessScreen>
						<b>
							{formatNumberNoRounding(+formBody.amount.replace(",", "."), 8)}
							&nbsp;
							{formBody.asset}
						</b>
						<span>{formatMessage(messages.amount_successfuly_submitted)}</span>
						<span>
							{formatMessage(
								formBody.to === WalletTypeEnum.Spot
									? messages.transfer_to_spot_success
									: messages.transfer_to_margin_success,
							)}
						</span>
					</SuccessScreen>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="outlined"
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
							<Select
								options={ACCOUNT_TYPE_OPTIONS}
								onChange={handleFromChange}
								isSearchable={false}
								label={formatMessage(messages.from)}
								labeled
								labeledAbsolute
								value={ACCOUNT_TYPE_OPTIONS.find((o: ISelectOption) => o.value === formBody.from)}
							/>
							<div className={marginModalStyles.transfer_to_container}>
								<button type="button" aria-label="swap-to" onClick={handleSwapFromTo}>
									<i className="ai ai-change_arrows" />
								</button>
								<Select
									options={ACCOUNT_TYPE_OPTIONS.filter((o: ISelectOption) =>
										formBody.from === WalletTypeEnum.Spot
											? o.value !== WalletTypeEnum.Spot
											: o.value === WalletTypeEnum.Spot,
									)}
									disabled={ACCOUNT_TYPE_OPTIONS.filter((o: ISelectOption) =>
										formBody.from === WalletTypeEnum.Spot
											? o.value !== WalletTypeEnum.Spot
											: o.value === WalletTypeEnum.Spot,
									)}
									labeled
									labeledAbsolute
									onChange={handleToChange}
									isSearchable={false}
									label="To"
									value={ACCOUNT_TYPE_OPTIONS.find((o: ISelectOption) => o.value === formBody.to)}
								/>
							</div>
							<CurrencySelect
								onSelectChange={(option) => handleAssetChange(option as IOption)}
								options={assetsOptions}
								value={assetsOptions.find((o: IOption) => o.value === formBody.asset)}
								autoFocus
								label="Asset"
							/>
							<div className={marginModalStyles.amount_container}>
								<Input
									value={formBody.amount}
									error={formErrors.amount}
									onChange={handleAmountChange}
									onEnter={handleSubmit}
									helpText={
										balanceFrom ? (
											<div className={marginModalStyles.available_amount}>
												{formatNumberNoRounding(Math.max(0, currentTransferable), 8)}
												&nbsp;
												{formBody.asset}
											</div>
										) : null
									}
									type="number"
									labelValue={formatMessage(messages.amount)}
									appender={
										<Appender>
											{formBody.asset}
											<AppenderDivider />
											<AppenderButton onClick={handleMaxAmountClick}>max</AppenderButton>
										</Appender>
									}
								/>
							</div>
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

export default observer(TransferModal);
