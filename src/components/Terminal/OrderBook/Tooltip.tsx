import React from "react";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import { IPair } from "models/Terminal";
import messages from "messages/exchange";
import historyMessages from "messages/history";
import { useIntl } from "react-intl";

interface ITooltip {
	top: number;
	pair: IPair;
	avgPrice: number;
	avgAmount1: number;
	avgAmount2: number;
	alignTo: "left" | "right";
}

const Tooltip: React.FC<ITooltip> = React.memo(
	({ top, pair, avgPrice, avgAmount1, avgAmount2, alignTo }) => {
		const { formatMessage, formatNumber } = useIntl();
		return (
			<div
				className={cn(styles.orderbook_tooltip_container, {
					[styles.left]: alignTo === "left",
				})}
				style={{
					top: `${top - 18}px`,
				}}
			>
				<i className={`ai ai-hint_${alignTo === "left" ? "right" : "left"}`} />
				<div className={styles.orderbook_tooltip_param_row}>
					<div className={styles.orderbook_tooltip_param_name}>
						{formatMessage(historyMessages.avg_price)}
					</div>
					<div className={styles.orderbook_tooltip_param_value}>
						≈&nbsp;
						{formatNumber(avgPrice, {
							useGrouping: false,
							minimumFractionDigits: pair.price_precision,
							maximumFractionDigits: pair.price_precision,
						})}
					</div>
				</div>
				<div className={styles.orderbook_tooltip_param_row}>
					<div className={styles.orderbook_tooltip_param_name}>
						{formatMessage(messages.amount)}
						&nbsp;
						{pair.base_currency_code}
					</div>
					<div className={styles.orderbook_tooltip_param_value}>
						{formatNumber(avgAmount1, {
							useGrouping: false,
							minimumFractionDigits: pair.amount_precision,
							maximumFractionDigits: pair.amount_precision,
						})}
					</div>
				</div>
				<div className={styles.orderbook_tooltip_param_row}>
					<div className={styles.orderbook_tooltip_param_name}>
						{formatMessage(messages.amount)}
						&nbsp;
						{pair.quote_currency_code}
					</div>
					<div className={styles.orderbook_tooltip_param_value}>
						{formatNumber(avgAmount2, {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 8,
						})}
					</div>
				</div>
			</div>
		);
	},
);

export default Tooltip;
