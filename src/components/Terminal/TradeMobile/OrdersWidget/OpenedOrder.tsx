import React from "react";
import { IHistoryOrder } from "models/History";
import historyMessages from "messages/history";
import { useIntl } from "react-intl";
import { transformDate } from "utils/dayjs";
import styles from "styles/pages/TerminalMobile.module.scss";
import cn from "classnames";
import CircleProgress from "components/UI/CircleProgress";
import ExchangeService from "services/ExchangeService";
import { toast } from "react-toastify";
import errorHandler from "utils/errorHandler";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { formatNumberNoRounding } from "utils/format";
import { observer } from "mobx-react-lite";
import Spinner from "components/UI/Spinner";

interface Props {
	order: IHistoryOrder;
	onMarginCurrencyLoad?: () => void;
}

const OpenedOrder: React.FC<Props> = ({ order, onMarginCurrencyLoad }) => {
	const { formatMessage, formatNumber } = useIntl();

	const prepareSymbol = (symbol: string): string => {
		const symbolArray = symbol.split("_");
		return symbolArray[0];
	};

	const handleCancelClick = async () => {
		if (!order.isCancelLoading) {
			try {
				order.setIsCancelLoading(true);
				await ExchangeService.cancelOrder(order.id);
				if (onMarginCurrencyLoad) {
					onMarginCurrencyLoad();
				}
				toast(
					<>
						<i className="ai ai-check_outline" />
						{formatMessage(historyMessages.order_was_cancelled)}
					</>,
				);
			} catch (err) {
				errorHandler(err);
				order.setIsCancelLoading(false);
			}
		}
	};

	return (
		<div className={styles.orders_item} key={order.id}>
			<div className={styles.orders_grid}>
				<div className={styles.orders_pair_details}>{order.pair?.label}</div>
				<div className={styles.orders_date_text}>
					{transformDate(order.date, "DD/MM/YYYY HH:mm:ss")}
				</div>
				<button className={styles.delete_order_row} onClick={handleCancelClick} type="button">
					<div className={styles.remove_order_text}>
						{formatMessage(historyMessages.active_orders_action_cancel_tooltip)}
					</div>
					{order.isCancelLoading ? (
						<Spinner size={14} />
					) : (
						<i className={cn("ai ai-cancel_mini", styles.cancel_order_icon)} />
					)}
				</button>
				<span className={styles.orders_prop_text}>
					{formatMessage(historyMessages.orders_table_price)}
				</span>
				<span className={styles.orders_prop_text}>
					{formatMessage(historyMessages.active_orders_amount)}
				</span>
				<span className={cn(styles.orders_prop_text, styles.right)}>{`${formatMessage(
					historyMessages.active_orders_filled,
				)} (${prepareSymbol(order.symbol)})`}</span>
				<span
					className={
						order.side === OrderSideEnum.SELL
							? styles.orders_amount_red
							: styles.orders_amount_green
					}
				>
					{order.price != null
						? formatNumberNoRounding(order.price, order.pair?.price_precision ?? 8)
						: "--"}
				</span>
				<div className={styles.orders_digits_text}>
					{order.amount !== null
						? formatNumber(order.amount, {
								useGrouping: false,
								maximumFractionDigits: order.pair?.amount_precision ?? 8,
						  })
						: "--"}
				</div>
				<div className={styles.orders_filled_row}>
					<CircleProgress
						sqSize={16}
						percentage={order.amount_filled ?? 0}
						strokeWidth={2}
						color="blue"
						fontStyle={{
							fontSize: "0px",
						}}
					/>
					<div className={styles.order_text_filled}>
						{formatNumber(order.amount_filled ?? 0, {
							useGrouping: false,
							maximumFractionDigits: order.pair?.amount_precision ?? 8,
						})}
					</div>
				</div>
			</div>
			{order.type === OrderTypeEnum.STOP_LIMIT && (
				<div className={styles.order_row}>
					<div className={styles.orders_inner_row_trigger}>
						<div className={styles.orders_trigger_data_row}>
							<span className={styles.orders_trigger_text}>
								{formatMessage(historyMessages.trigger_condition)}
							</span>
							<span className={styles.orders_trigger_value}>
								{order.stop_operator === 1 ? ">=" : "<="}
								{order.stop_price != null
									? formatNumberNoRounding(order.stop_price, order.pair?.price_precision ?? 8)
									: "--"}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default observer(OpenedOrder);
