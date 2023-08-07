import React from "react";
import { IHistoryOrder } from "models/History";
import historyMessages from "messages/history";
import { useIntl } from "react-intl";
import { transformDate } from "utils/dayjs";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { formatNumberNoRounding } from "utils/format";
import { observer } from "mobx-react-lite";

interface Props {
	order: IHistoryOrder;
}

const ClosedOrder: React.FC<Props> = ({ order }) => {
	const { formatMessage, formatNumber } = useIntl();
	const pricePrecision = order.pair?.price_precision ?? 4;
	const amountPrecision = order.pair?.amount_precision ?? 4;

	const prepareSymbol = (symbol: string) => {
		const symbolArray = symbol.split("_");
		return symbolArray[0];
	};

	return (
		<div className={styles.orders_item} key={order.id}>
			<div className={styles.orders_grid}>
				<span className={styles.orders_pair_details}>{order.pair?.label}</span>
				<span className={styles.orders_date_text}>
					{transformDate(order.date, "DD/MM/YYYY HH:mm:ss")}
				</span>
				<div />
				<span className={styles.orders_prop_text}>
					{formatMessage(historyMessages.orders_table_price)}
				</span>
				<span className={styles.orders_prop_text}>
					{formatMessage(historyMessages.active_orders_amount)}
				</span>
				<span className={cn(styles.orders_prop_text, styles.right)}>{`${formatMessage(
					historyMessages.active_orders_filled,
				)} (${prepareSymbol(order.symbol)})`}</span>
				{order.type === OrderTypeEnum.MARKET ? (
					<span className={styles.orders_prop_text}>--</span>
				) : order.side === OrderSideEnum.SELL ? (
					<span className={styles.orders_amount_red}>
						{order.price !== null
							? formatNumber(order.price, {
									useGrouping: false,
									maximumFractionDigits: pricePrecision,
									minimumFractionDigits: pricePrecision,
							  })
							: "--"}
					</span>
				) : (
					<span className={styles.orders_amount_green}>
						{order.price !== null
							? formatNumber(order.price, {
									useGrouping: false,
									maximumFractionDigits: pricePrecision,
									minimumFractionDigits: pricePrecision,
							  })
							: "--"}
					</span>
				)}
				<span className={styles.orders_digits_text}>
					{order.amount !== null
						? formatNumber(order.amount, {
								useGrouping: false,
								maximumFractionDigits: amountPrecision,
								minimumFractionDigits: amountPrecision,
						  })
						: "--"}
				</span>
				<div className={styles.orders_filled_row}>
					<i className={cn(styles.closed_order_done_icon, "ai ai-check_outline")} />
					<span className={styles.order_text_filled}>
						{order.amount_filled !== null
							? formatNumber(order.amount_filled, {
									useGrouping: false,
									maximumFractionDigits: amountPrecision,
									minimumFractionDigits: amountPrecision,
							  })
							: "--"}
					</span>
				</div>
			</div>
			{order.type === OrderTypeEnum.STOP_LIMIT && (
				<div className={styles.order_row}>
					<div className={styles.orders_inner_row_trigger}>
						<div className={styles.orders_trigger_data_row}>
							<span className={styles.orders_trigger_text}>
								{formatMessage(historyMessages.trigger_condition)}
							</span>
							<span className={styles.orders_trigger_value}>{`<= ${
								order.stop_price !== null
									? formatNumberNoRounding(order.stop_price, order.pair?.price_precision ?? 8)
									: "--"
							}`}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default observer(ClosedOrder);
