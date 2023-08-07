import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/TradingFees.module.scss";
import feesMessages from "messages/fees_trading";
import accountMessages from "messages/account";
import Switch from "components/UI/Switch";
import classnames from "classnames";
import styleProps from "utils/styleProps";
import { ITradingFeesTier } from "types/tradingFees";

interface IMakerTakerItem {
	taker?: boolean;
	rate1: string;
	rate2?: string;
	centered?: boolean;
}

export const MakerTakerItem: React.FC<IMakerTakerItem> = ({ taker, rate1, rate2, centered }) => (
	<div
		className={classnames(styles.fee_maker_taker_item, {
			[styles.centered]: centered,
		})}
	>
		<span>{taker ? "Taker" : "Maker"}</span>
		<span>{rate1}%</span>
		{rate2 && <span>{rate2}%</span>}
	</div>
);

interface IFeeRate {
	checked: boolean;
	onCheck(e: any): void;
	noTitle?: boolean;
}

export const FeeRate: React.FC<IFeeRate> = ({ checked, onCheck, noTitle }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.fee_rate}>
			{!noTitle && <span>{formatMessage(feesMessages.spot_market_fee_rate)}</span>}
			<div className={styles.fee_rate_switch}>
				<span>
					{formatMessage(accountMessages.use_commission_in_alp, {
						discount: "20%",
					})}
				</span>
				<Switch id="alp-fee-switch" checked={checked} onChange={onCheck} />
			</div>
		</div>
	);
};

interface IBalanceProps {
	text: string;
	amount: string;
	ccy: string;
	progress: number;
	primary?: boolean;
}

export const Balance: React.FC<IBalanceProps> = ({ text, amount, ccy, progress, primary }) => (
	<div className={styles.fee_balance}>
		<span className={styles.fee_balance_title}>{text}</span>
		<div className={styles.fee_balance_value}>
			{amount}
			&nbsp;{ccy}
		</div>
		<BalanceProgress progress={progress} primary={primary} />
	</div>
);

export const BalanceProgress: React.FC<Pick<IBalanceProps, "progress" | "primary">> = ({
	progress,
	primary,
}) => (
	<div
		className={classnames(styles.fee_balance_range, {
			[styles.primary]: primary,
			[styles.secondary]: !primary,
		})}
		style={styleProps({ "--fee-balance-range-percentage": `${progress}%` })}
	/>
);

export const sortTiers = (a: ITradingFeesTier, b: ITradingFeesTier): number => {
	const getTierLevel = (tier: string) => +(tier.split(" ")?.[1] ?? 0);
	const lvlA = getTierLevel(a.name);
	const lvlB = getTierLevel(b.name);
	return lvlA - lvlB;
};
