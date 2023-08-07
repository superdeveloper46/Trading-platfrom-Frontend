import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import styles from "styles/components/Profile/Dashboard/DashboardFeeLevel.module.scss";
import { ITradingFeesPersonal, ITradingFeesTier } from "types/tradingFees";
import accountMessages from "messages/account";
import {
	MakerTakerItem,
	FeeRate,
	BalanceProgress,
	sortTiers,
} from "components/TradingFees/TradingFeesCommon";
import { FORMAT_NUMBER_MAKER_TAKER_OPTIONS, MIN_ALP_AMOUNT } from "constants/tradingFees";
import { IBalance } from "models/Account";
import { AccountTypeEnum } from "types/account";
import { getBalance } from "helpers/account";
import TradingFeesService, { useTradingFees } from "services/TradingFeesService";
import { useMst } from "models/Root";
import NotEnoughAlpModal from "components/TradingFees/AlpFees/NotEnoughAlpModal";
import LoadingSpinner from "components/UI/LoadingSpinner";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader } from "./DashboardCard";

interface IProps {
	balances: IBalance[];
	balancesIsolated: IBalance[];
	balancesCross: IBalance[];
}

const DashboardFeeLevel: React.FC<IProps> = ({ balances, balancesIsolated, balancesCross }) => {
	const { render } = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const [personal, setPersonal] = useState<ITradingFeesPersonal | undefined>(undefined);
	const [isChecked, setChecked] = useState<boolean>(false);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [currentFeeTier, setCurrentFeeTier] = useState<ITradingFeesTier | null>(null);
	const [tiers, setTiers] = useState<ITradingFeesTier[]>([]);
	const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
	const [nextFeeTier, setNextFeeTier] = useState<ITradingFeesTier | null>();
	const [progressVolume, setProgressVolume] = useState<number>(0);
	const [progressToken, setProgressToken] = useState<number>(0);
	const [isLoading, setLoading] = useState(true);
	const { status, data } = useTradingFees();

	useEffect(() => {
		setLoading(status === "loading");
	}, [status]);

	useEffect(() => {
		setPersonal(data?.personal);
		setTiers([...(data?.tiers ?? [])]);
	}, [isLoading, data]);

	useEffect(() => {
		setChecked(personal?.is_token_deduction ?? false);
		setCurrentFeeTier(personal?.fee_tier ?? null);
	}, [personal]);

	useEffect(() => {
		setCurrentLevelIdx(
			currentFeeTier
				? tiers
						.sort(sortTiers)
						.findIndex((tier: ITradingFeesTier) => tier.code === currentFeeTier.code)
				: -1,
		);
	}, [currentFeeTier]);

	useEffect(() => {
		setNextFeeTier(
			currentLevelIdx !== -1 && currentLevelIdx < tiers.length - 1
				? tiers[currentLevelIdx + 1]
				: null,
		);
	}, [currentLevelIdx, tiers.length]);

	useEffect(() => {
		setProgressVolume(
			personal && nextFeeTier?.min_volume ? (personal.volume / nextFeeTier.min_volume) * 100 : 0,
		);
	}, [personal, nextFeeTier?.min_volume]);

	useEffect(() => {
		setProgressToken(
			personal && nextFeeTier?.min_token
				? (personal.token_balance / nextFeeTier.min_token) * 100
				: 0,
		);
	}, [personal, nextFeeTier?.min_token]);

	const alpBalance = getBalance(
		"ALP",
		"",
		AccountTypeEnum.SPOT,
		balances,
		balancesCross,
		balancesIsolated,
	);
	const hasMinAlpAmount =
		Number(alpBalance?.balance) - Number(alpBalance?.reserve) >= MIN_ALP_AMOUNT;

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

	return (
		<>
			{modalOpen && (
				<NotEnoughAlpModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					minimumAmount={MIN_ALP_AMOUNT}
				/>
			)}
			<DashboardCard>
				<DashboardCardHeader link={routes.tradingFees}>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<>
							<div className={styles.card_title}>
								{formatMessage(accountMessages.your_commission_level)}:&nbsp;
								{currentFeeTier?.name ?? "-"}
							</div>
							<span className={styles.all_fees_link}>
								{formatMessage(accountMessages.all_commissions)}
								<i className="ai ai-chevron_right" />
							</span>
						</>
					)}
				</DashboardCardHeader>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<div className={styles.maker_taker_container}>
							<div className={styles.maker_taker_stats}>
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
														: personal?.fee_tier?.maker_fee_rate ?? 0) * 100,
													FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
											  )
									}
									rate2={
										isChecked
											? formatNumber(
													(personal?.is_fixed
														? personal.maker_fee_rate
														: personal?.fee_tier?.maker_fee_rate ?? 0) * 100,
													FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
											  )
											: undefined
									}
									centered
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
														: personal?.fee_tier?.taker_fee_rate ?? 0) * 100,
													FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
											  )
									}
									rate2={
										isChecked
											? formatNumber(
													(personal?.is_fixed
														? personal.taker_fee_rate
														: personal?.fee_tier?.taker_fee_rate ?? 0) * 100,
													FORMAT_NUMBER_MAKER_TAKER_OPTIONS,
											  )
											: undefined
									}
									centered
								/>
							</div>
							{render.alpCoin && (
								<div className={styles.maker_taker_switch_container}>
									<FeeRate checked={isChecked} onCheck={onCheck} noTitle />
								</div>
							)}
						</div>
						<div className={styles.commission_stats_wrapper}>
							<div className={styles.commission_stats_container}>
								<span className={styles.commission_stats_note}>
									{formatMessage(accountMessages.statistics_are_updated_approximately_every_hour)}
								</span>
								{nextFeeTier && (
									<span className={styles.commission_stats_label}>
										{formatMessage(accountMessages.get_the_vip, {
											level: currentLevelIdx + 2,
										})}
									</span>
								)}
								<CommissionStatsLevel
									ccy="BTC"
									title={formatMessage(accountMessages.result_in_30_days)}
									volume={personal?.volume ?? 0}
									progressVolume={progressVolume}
									nextFeeTier={nextFeeTier ?? undefined}
									currentFeeTier={currentFeeTier ?? undefined}
									maxDigits={8}
									primary
								/>
								{render.alpCoin && (
									<CommissionStatsLevel
										ccy="ALP"
										title={formatMessage(accountMessages.your_alp_balance)}
										volume={personal?.token_balance ?? 0}
										progressVolume={progressToken}
										nextFeeTier={nextFeeTier ?? undefined}
										currentFeeTier={currentFeeTier ?? undefined}
										maxDigits={2}
										isToken
									/>
								)}
							</div>
						</div>
					</>
				)}
			</DashboardCard>
		</>
	);
};

export default DashboardFeeLevel;

interface ICommissionStatsLevelProps {
	ccy: string;
	title: string;
	volume: number;
	progressVolume: number;
	maxDigits: number;
	currentFeeTier?: ITradingFeesTier;
	nextFeeTier?: ITradingFeesTier;
	isToken?: boolean;
	primary?: boolean;
}

const CommissionStatsLevel: React.FC<ICommissionStatsLevelProps> = ({
	ccy,
	title,
	volume,
	progressVolume,
	currentFeeTier,
	nextFeeTier,
	maxDigits,
	isToken,
	primary,
}) => {
	const { formatNumber } = useIntl();
	return (
		<div className={styles.commission_stats_level}>
			<span className={styles.commission_stats_level_label}>{title}</span>
			<div className={styles.commission_stats_level_value}>
				<span>
					{formatNumber(volume ?? 0, {
						maximumFractionDigits: maxDigits,
					})}
					&nbsp;
					<span>
						{ccy}&nbsp;
						<span>
							/&nbsp;
							{progressVolume < 100
								? formatNumber(progressVolume, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: "100.00"}
							%
						</span>
					</span>
				</span>
				<span>
					{nextFeeTier
						? formatNumber((isToken ? nextFeeTier.min_token : nextFeeTier?.min_volume) ?? 0, {
								maximumFractionDigits: 8,
						  })
						: "max"}
					&nbsp;{ccy}
				</span>
			</div>
			<BalanceProgress progress={progressVolume} primary={primary} />
			<div className={styles.commission_stats_level_range_extreme}>
				<span>{currentFeeTier?.name ?? "-"}</span>
				<span>{nextFeeTier?.name ?? "-"}</span>
			</div>
		</div>
	);
};
