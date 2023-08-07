import exchangeMessages from "messages/exchange";
import financeMessages from "messages/finance";
import {
	FORMAT_NUMBER_OPTIONS_BTC,
	FORMAT_NUMBER_OPTIONS_USD,
	FORMAT_NUMBER_OPTIONS_USDT,
} from "constants/format";
import useMarginLevel, { reduceBalance } from "hooks/useMarginLevel";
import useRiskLevelRate from "hooks/useRiskLevelRate";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/Wallets.module.scss";
import { AccountTypeEnum } from "types/account";
import { MarginModalEnum } from "types/exchange";
import MarginLevel from "components/MarginLevel";
import { STARS_STR } from "constants/wallet";
import MarginOperationModal from "components/Terminal/modals/MarginOperationModal";

const WalletsBalance: React.FC = () => {
	const {
		account: { balances, balancesCross, balancesIsolated },
		finance: {
			isBalancesVisible,
			setIsBalancesVisible,
			crossMarginOption,
			walletsFilter: { isMargin, isMarginCross, accountType },
		},
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const [openedModal, setOpenedModal] = useState<MarginModalEnum | "">("");

	const currentOption = accountType === AccountTypeEnum.CROSS ? crossMarginOption : null;

	const { marginLevel, totalBTC, totalDebtBTC, totalUSDT, totalDebtUSDT } = useMarginLevel(
		currentOption?.equity_currency?.code ?? "",
		balancesCross,
		balancesIsolated,
		accountType as AccountTypeEnum,
	);

	const riskLevel = crossMarginOption
		? useRiskLevelRate(marginLevel, [
				crossMarginOption.transfer_level,
				crossMarginOption.borrow_level,
				crossMarginOption.call_level,
		  ])
		: 0;

	const totalSpotBalanceBTC = reduceBalance(balances, "BTC");
	const totalSpotBalanceUSDT = reduceBalance(balances, "USDT");

	const totalBalanceBTC = isMargin ? totalBTC : totalSpotBalanceBTC;
	const totalBalanceUSDT = isMargin ? totalUSDT : totalSpotBalanceUSDT;

	const handleBalanceVisibilityChange = () => {
		const nextIsVisible = !isBalancesVisible;
		setIsBalancesVisible(nextIsVisible);
	};

	const handleCloseModal = () => {
		setOpenedModal("");
	};

	const handleOpenTransferModal = () => {
		setOpenedModal(MarginModalEnum.TRANSFER);
	};

	const handleOpenBorrowModal = () => {
		setOpenedModal(MarginModalEnum.BORROW);
	};

	const handleOpenRepayModal = () => {
		setOpenedModal(MarginModalEnum.REPAY);
	};

	const TotalBalanceBTC = (
		<div className={styles.total_balance_btc}>
			<div className={styles.total_balance_btc_currency}>
				<i className="ai ai-btc" />
				{isBalancesVisible
					? formatNumber(totalBalanceBTC ?? 0, FORMAT_NUMBER_OPTIONS_BTC)
					: STARS_STR}
			</div>
			<div className={styles.toggle_balance_visibility} onClick={handleBalanceVisibilityChange}>
				<i className={`ai ai-eye${isBalancesVisible ? "_disabled" : ""}`} />
				<span>
					{formatMessage(
						isBalancesVisible ? financeMessages.hide_balance : financeMessages.show_balance,
					)}
				</span>
			</div>
		</div>
	);

	const TotalBalanceUSDT = (
		<div className={styles.total_balance_usdt}>
			≈
			<i className="ai ai-usd" />
			{isBalancesVisible
				? formatNumber(totalBalanceUSDT ?? 0, FORMAT_NUMBER_OPTIONS_USDT)
				: STARS_STR}
		</div>
	);

	const TotalDebt = (
		<div className={styles.total_debt}>
			<span>Total Debt</span>
			<span>
				{isBalancesVisible ? formatNumber(totalDebtBTC, FORMAT_NUMBER_OPTIONS_BTC) : STARS_STR}
				&nbsp;BTC
				<span>
					≈
					<i className="ai ai-usd" />
					{isBalancesVisible ? formatNumber(totalDebtUSDT, FORMAT_NUMBER_OPTIONS_USD) : STARS_STR}
				</span>
			</span>
		</div>
	);

	return (
		<div className={styles.balance_container}>
			<div className={styles.balance}>
				<div className={styles.total_balance}>
					{TotalBalanceBTC}
					{TotalBalanceUSDT}
					<div className={styles.approximate_balance}>
						{formatMessage(financeMessages.approximate_balance)}
					</div>
				</div>
				{isMargin && (
					<div className={styles.advanced_info_container}>
						{isMarginCross && (
							<MarginLevel percentage={riskLevel * 100} marginLevel={marginLevel} inline />
						)}
						{TotalDebt}
					</div>
				)}
				{isMargin && (
					<div className={styles.action_buttons}>
						<button type="button" onClick={handleOpenTransferModal}>
							<i className="ai ai-mini_arrow_double" />
							{formatMessage(exchangeMessages.transfer)}
						</button>
						<button type="button" onClick={handleOpenBorrowModal}>
							<i className="ai ai-mini_up" />
							{formatMessage(exchangeMessages.borrow)}
						</button>
						<button type="button" onClick={handleOpenRepayModal}>
							<i className="ai ai-mini_down" />
							{formatMessage(exchangeMessages.repay)}
						</button>
					</div>
				)}
			</div>
			<MarginOperationModal
				modal={openedModal}
				onClose={handleCloseModal}
				onBorrowModalOpen={handleOpenBorrowModal}
				pair={isMarginCross ? "" : "BTC/USDT"}
				code={crossMarginOption?.equity_currency?.code ?? ""}
			/>
		</div>
	);
};

export default observer(WalletsBalance);
