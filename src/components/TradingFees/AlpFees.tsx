import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import styles from "styles/pages/TradingFees.module.scss";
import feesMessages from "messages/fees_trading";
import financeMessages from "messages/finance";
import accountMessages from "messages/account";
import alpCoinMessages from "messages/alp_coin";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import { IGetTradingFeesRes, ITradingFeesPersonal } from "types/tradingFees";
import TradingFeesService from "services/TradingFeesService";
import { useMst } from "models/Root";
import { getBalance } from "helpers/account";
import { FORMAT_NUMBER_MAKER_TAKER_OPTIONS, MIN_ALP_AMOUNT } from "constants/tradingFees";
import { AccountTypeEnum } from "types/account";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";
import NotEnoughAlpModal from "./AlpFees/NotEnoughAlpModal";
import { FeeRate, MakerTakerItem } from "./TradingFeesCommon";

interface IProps {
	tradingFees?: IGetTradingFeesRes;
	isLoading?: boolean;
}

const AlpFees: React.FC<IProps> = ({ tradingFees, isLoading }) => {
	const {
		account: { balances, balancesCross, balancesIsolated },
	} = useMst();
	const { formatNumber, formatMessage } = useIntl();

	const [personal, setPersonal] = useState<ITradingFeesPersonal | undefined>(undefined);
	const [isChecked, setChecked] = useState<boolean>(false);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	useEffect(() => {
		setPersonal(tradingFees?.personal);
	}, [tradingFees]);

	useEffect(() => {
		setChecked(personal?.is_token_deduction ?? false);
	}, [personal]);

	const alpBalance = getBalance(
		"ALP",
		"",
		AccountTypeEnum.SPOT,
		balances,
		balancesCross,
		balancesIsolated,
	);
	const hasMinAlpAmount = Number(alpBalance?.balance) >= MIN_ALP_AMOUNT;

	const onCheck = async (e: any) => {
		if (hasMinAlpAmount) {
			const checked = !!e.target?.checked;
			await TradingFeesService.setFeeDeduction({ is_token_deduction: checked }).catch(errorHandler);
			toast(
				formatMessage(
					checked
						? accountMessages.fee_deduction_in_alp_is_enabled
						: accountMessages.fee_deduction_in_alp_disabled,
				),
			);
			setChecked(checked);
		} else {
			setModalOpen(true);
		}
	};

	return !personal ? null : (
		<>
			{modalOpen && (
				<NotEnoughAlpModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					minimumAmount={MIN_ALP_AMOUNT}
				/>
			)}
			<div className={styles.fee_card}>
				<div className={styles.fee_header_content}>
					<div className={styles.fee_card_title}>
						{formatMessage(feesMessages.get_more_benefits)}
					</div>
					<div className={styles.fee_available}>
						<span>{formatMessage(financeMessages.available)}</span>
						<span>
							{formatNumber(Number(alpBalance?.balance ?? 0), {
								useGrouping: false,
								maximumFractionDigits: 8,
							})}
							&nbsp;<span>ALP</span>
						</span>
						<InternalLink to={routes.trade.getPair("ALP_USDT")}>
							<Button
								fullWidth
								variant="filled"
								color="quaternary"
								label={formatMessage(alpCoinMessages.buy_btn)}
								mini
							/>
						</InternalLink>
					</div>
				</div>
				<div className={styles.fee_maker_taker_container}>
					<MakerTakerItem
						rate1={
							isChecked
								? formatNumber(
										(personal?.fee_tier?.maker_fee_rate ?? 0) * 100 * 0.8,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
								: formatNumber(
										(personal?.is_fixed
											? personal.maker_fee_rate
											: personal.fee_tier?.maker_fee_rate ?? 0) * 100,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
						}
						rate2={
							isChecked
								? formatNumber(
										(personal?.is_fixed
											? personal.maker_fee_rate
											: personal.fee_tier?.maker_fee_rate ?? 0) * 100,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
								: undefined
						}
					/>
					<MakerTakerItem
						taker
						rate1={
							isChecked
								? formatNumber(
										(personal?.fee_tier?.taker_fee_rate ?? 0) * 100 * 0.8,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
								: formatNumber(
										(personal?.is_fixed
											? personal.taker_fee_rate
											: personal.fee_tier?.taker_fee_rate ?? 0) * 100,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
						}
						rate2={
							isChecked
								? formatNumber(
										(personal?.is_fixed
											? personal.taker_fee_rate
											: personal.fee_tier?.taker_fee_rate ?? 0) * 100,
										FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
								  )
								: undefined
						}
					/>
					<FeeRate checked={isChecked} onCheck={onCheck} />
				</div>
			</div>
		</>
	);
};

export default AlpFees;
