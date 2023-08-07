import { TableData, TableRow } from "components/UI/Table";
import { IOrder } from "models/History";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { transformDate } from "utils/dayjs";
import styles from "styles/components/Profile/Dashboard/ActiveOrders.module.scss";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import coinMessages from "messages/exchange";
import recentTradesMessages from "messages/recent_trades";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import ButtonMicro from "components/UI/ButtonMicro";
import classnames from "classnames";
import CancelOrderModal from "./CancelOrderModal";
import { useActiveOrderRow } from "./useActiveOrderRow";

interface IProps {
	order: IOrder;
	onOrderClosed?(): void;
}

const ActiveOrderRow: React.FC<IProps> = ({ order, onOrderClosed }) => {
	const { formatNumber, formatMessage, modalOpen, onCloseModal, onOpenModal, pairSymbols, date } =
		useActiveOrderRow(order);
	return (
		<TableRow>
			{modalOpen && (
				<CancelOrderModal onSuccess={onOrderClosed} order={order} onClose={onCloseModal} />
			)}
			<TableData className={styles.table_data}>
				<span className={styles.primary}>
					{pairSymbols.length > 1 ? (
						<>
							{pairSymbols[0]}/<span className={styles.secondary}>{pairSymbols[1]}</span>
						</>
					) : (
						<>
							???/<span className={styles.secondary}>???</span>
						</>
					)}
				</span>
				<span className={styles.secondary}>{date.format("DD/MM/YYYY HH:mm:ss")}</span>
			</TableData>
			<TableData className={styles.table_data}>
				<span className={styles.primary}>
					{formatMessage(
						order.type === OrderTypeEnum.LIMIT
							? coinMessages.order_type_limit
							: coinMessages.order_type_stop_limit,
					)}
					<Badge
						className={styles.filled_direction_badge}
						color={BadgeColorEnum.RED}
						directional
						side={order.side as OrderSideEnum}
					>
						{formatMessage(
							order.side === OrderSideEnum.BUY
								? recentTradesMessages.operation_sell
								: recentTradesMessages.operation_buy,
						)}
					</Badge>
				</span>
				<span className={styles.primary_small}>
					{order?.type === OrderTypeEnum.STOP_LIMIT && order?.status === OrderTypeEnum.LIMIT ? (
						"triggered"
					) : order?.stop_price && order.status !== OrderStatusEnum.CANCELLED ? (
						<>
							{order.stop_operator === 1 ? ">=" : "<="}
							{formatNumber(order.stop_price, {
								useGrouping: false,
								maximumFractionDigits: 3,
							})}
						</>
					) : (
						"-"
					)}
				</span>
			</TableData>
			<TableData className={classnames(styles.table_data, styles.right)} align="right">
				<span className={styles.primary}>
					{formatNumber(order?.price ?? 0, {
						useGrouping: false,
						minimumFractionDigits: order?.pair?.price_precision ?? 2,
						maximumFractionDigits: order?.pair?.price_precision ?? 8,
					})}
				</span>
			</TableData>
			<TableData className={classnames(styles.table_data, styles.right)} align="right">
				<span className={styles.primary}>
					{formatNumber((order.amount ?? 0) * (order.price ?? 0), {
						useGrouping: false,
						maximumFractionDigits: 3,
					})}
				</span>
				<span className={styles.primary_small}>
					{formatNumber(order.filled_percent ?? 0, {
						useGrouping: false,
						minimumFractionDigits: 1,
						maximumFractionDigits: 1,
					})}
					%
				</span>
			</TableData>
			<TableData className={classnames(styles.table_data, styles.right)} align="right">
				<ButtonMicro small onClick={onOpenModal}>
					<i className="ai ai-cancel_mini" />
				</ButtonMicro>
			</TableData>
		</TableRow>
	);
};

export default ActiveOrderRow;
