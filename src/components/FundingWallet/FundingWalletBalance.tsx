import { observer } from "mobx-react-lite";
import React from "react";
import { useIntl } from "react-intl";

import exchangeMessages from "messages/exchange";
import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import { reduceBalance } from "hooks/useMarginLevel";
import { useMst } from "models/Root";
import styles from "styles/pages/Wallets.module.scss";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

interface IProps {
	openTransferModal: (asset: string) => void;
}

const FundingWalletBalance: React.FC<IProps> = ({ openTransferModal }) => {
	const localeNavigate = useLocaleNavigate();

	const {
		account: { balances },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();

	const totalBalanceBTC = reduceBalance(balances, "BTC");
	const totalBalanceUSDT = reduceBalance(balances, "USDT");

	const handleOpenSendModal = () => {
		localeNavigate(routes.transfers.create);
	};

	const handleOpenTransferModal = () => {
		openTransferModal("");
	};

	const TotalBalanceBTC = (
		<div className={styles.total_balance_btc}>
			<div className={styles.total_balance_btc_currency}>
				<i className="ai ai-btc" />
				{formatNumber(totalBalanceBTC ?? 0, FORMAT_NUMBER_OPTIONS_BTC)}
			</div>
			{/* <div className={styles.toggle_balance_visibility} onClick={handleBalanceVisibilityChange}> */}
			{/*	<i className={`ai ai-eye${isBalancesVisible ? "_disabled" : ""}`} /> */}
			{/*	<span> */}
			{/*		{formatMessage( */}
			{/*			isBalancesVisible ? financeMessages.hide_balance : financeMessages.show_balance, */}
			{/*		)} */}
			{/*	</span> */}
			{/* </div> */}
		</div>
	);

	const TotalBalanceUSDT = (
		<div className={styles.total_balance_usdt}>
			≈
			<i className="ai ai-usd" />
			{formatNumber(totalBalanceUSDT ?? 0, FORMAT_NUMBER_OPTIONS_USDT)}
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
				<div className={styles.action_buttons}>
					<button type="button" onClick={handleOpenTransferModal}>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(exchangeMessages.transfer)}
					</button>
					<button type="button" onClick={handleOpenSendModal}>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(commonMessages.send)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default observer(FundingWalletBalance);
