import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/Terminal.module.scss";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import messages from "messages/exchange";
import { observer } from "mobx-react-lite";
import useAccountType from "hooks/useAccountType";
import { AccountTypeEnum } from "types/account";
import useMarginLevel from "hooks/useMarginLevel";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import MarginLeverageSign from "components/UI/MarginLeverageSign";
import MarginLevel from "components/MarginLevel";
import { MarginModalEnum } from "types/exchange";
import useRiskLevelRate from "hooks/useRiskLevelRate";
import { ACCOUNT_TYPE } from "constants/exchange";
import MarginOperationModal from "../modals/MarginOperationModal";

interface IProps {
	currencyCode?: string;
	updateMarginCurrency: () => void;
}

const MarginStats: React.FC<IProps> = ({ currencyCode, updateMarginCurrency }) => {
	const {
		terminal: { pair },
		account: { balancesCross, balancesIsolated, marginStatus },
		finance: { marginOptions },
	} = useMst();
	const accountType = useAccountType();
	const { mobile } = useWindowSize();
	const { formatNumber, formatMessage } = useIntl();
	const [openedModal, setOpenedModal] = useState<MarginModalEnum | "">("");
	const isIsolated = accountType === AccountTypeEnum.ISOLATED;

	const handleModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { name } = e.currentTarget.dataset;
		setOpenedModal(name as MarginModalEnum);
	};

	const handleCloseModal = () => {
		setOpenedModal("");
	};

	const currentOption =
		accountType === AccountTypeEnum.CROSS
			? marginOptions.find((o) => o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.CROSS])
			: accountType === AccountTypeEnum.ISOLATED
			? marginOptions.find(
					(o) =>
						o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.ISOLATED] &&
						o.pair?.symbol === pair?.symbol,
			  )
			: null;

	const { marginLevel, totalBTC, totalUSDT, totalDebtBTC, totalDebtUSDT } = useMarginLevel(
		currentOption?.equity_currency?.code ?? "",
		balancesCross,
		balancesIsolated,
		accountType,
		pair?.symbol,
	);

	const riskLevel = marginStatus
		? useRiskLevelRate(marginLevel, [
				marginStatus.transfer_level,
				marginStatus.borrow_level,
				marginStatus.call_level,
		  ])
		: 0;

	const handleBorrowModalOpen = () => {
		setOpenedModal(MarginModalEnum.BORROW);
	};

	return (
		<div className={styles.trade_form_stats}>
			{!mobile && pair ? (
				<div className={styles.trade_form_stats_pair_account}>
					<div className={styles.trade_form_stats_pair_account_pair}>
						<i className={`ai ai-${pair.base_currency_code.toLowerCase()}`} />
						<div className={styles.trade_form_stats_pair_account_pair_name}>
							{pair.base_currency_code ?? "--"}&nbsp;
							<span>\ {pair.quote_currency_code ?? "--"}</span>
							{accountType === AccountTypeEnum.CROSS && pair.cross_margin_leverage ? (
								<MarginLeverageSign leverage={pair.cross_margin_leverage} />
							) : accountType === AccountTypeEnum.ISOLATED && pair.isolated_margin_leverage ? (
								<MarginLeverageSign leverage={pair.isolated_margin_leverage} />
							) : null}
						</div>
					</div>
					<div className={styles.trade_form_stats_pair_account_account}>{accountType} MARGIN</div>
				</div>
			) : null}
			<div className={styles.trade_form_stats_actions}>
				<button type="button" data-name={MarginModalEnum.TRANSFER} onClick={handleModalOpen}>
					{formatMessage(messages.action_margin_transfer)}
				</button>
				<button type="button" data-name={MarginModalEnum.BORROW} onClick={handleModalOpen}>
					{formatMessage(messages.action_margin_borrow)}
				</button>
				<button type="button" data-name={MarginModalEnum.REPAY} onClick={handleModalOpen}>
					{formatMessage(messages.action_margin_repay)}
				</button>
			</div>
			<div className={styles.trade_form_stats_risk}>
				<div className={styles.trade_form_stats_risk_group}>
					<div className={styles.trade_form_stats_risk_balance}>
						<span>Total Balance</span>
						<b>
							{!Number.isNaN(totalBTC) ? formatNumber(totalBTC, FORMAT_NUMBER_OPTIONS_BTC) : "--"}
							&nbsp;BTC
						</b>
						<span>
							≈
							{!Number.isNaN(totalUSDT)
								? formatNumber(totalUSDT, FORMAT_NUMBER_OPTIONS_USDT)
								: "--"}
							&nbsp;USDT
						</span>
					</div>
					<div className={styles.trade_form_stats_risk_balance}>
						<span>Total Debt</span>
						<b>
							{!Number.isNaN(totalDebtBTC)
								? formatNumber(totalDebtBTC, FORMAT_NUMBER_OPTIONS_BTC)
								: "--"}
							&nbsp;BTC
						</b>
						<span>
							≈
							{!Number.isNaN(totalDebtUSDT)
								? formatNumber(totalDebtUSDT, FORMAT_NUMBER_OPTIONS_USDT)
								: "--"}
							&nbsp;USDT
						</span>
					</div>
				</div>
				{marginStatus ? (
					<div className={styles.trade_form_stats_risk_group}>
						<div className={styles.trade_form_stats_risk_rate}>
							<MarginLevel percentage={riskLevel * 100} marginLevel={marginLevel} />
						</div>
					</div>
				) : null}
			</div>
			<MarginOperationModal
				onClose={handleCloseModal}
				onSuccess={updateMarginCurrency}
				onBorrowModalOpen={handleBorrowModalOpen}
				modal={openedModal}
				pair={isIsolated ? pair?.label ?? "" : ""}
				code={currencyCode}
			/>
		</div>
	);
};

export default observer(MarginStats);
