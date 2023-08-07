import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import messages from "messages/history";
import { transformDate } from "utils/dayjs";
import { Table, TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import { IHeaderColumn } from "components/UI/Table/Table";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import styles from "styles/pages/History/History.module.scss";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IHistoryOrder, IHistoryOrderTrade } from "models/History";
import { ORDER_STATUS_TEXT } from "constants/orders";
import exchangeMessages from "messages/exchange";

const getColorFromStatus = (status: OrderStatusEnum): BadgeColorEnum => {
	switch (status) {
		case OrderStatusEnum.PARTIAL_CANCELED:
			return BadgeColorEnum.GREY_DARK;
		case OrderStatusEnum.PARTIAL_CANCELLED:
			return BadgeColorEnum.GREY_DARK;
		case OrderStatusEnum.CANCELLED:
			return BadgeColorEnum.GREY;
		default:
			return BadgeColorEnum.GREEN;
	}
};

interface ITradeProps {
	trade: IHistoryOrderTrade;
	showTransactionFee: boolean;
	pricePrecision: number;
	amountPrecision: number;
}

const TradeRow: React.FC<ITradeProps> = observer(
	({ trade, showTransactionFee, pricePrecision, amountPrecision }) => {
		const [baseCurrencyCode, quoteCurrencyCode] = trade.pair_id.split("_");
		const tradeDate = transformDate(trade.date);
		const { formatNumber } = useIntl();

		return (
			<TableRow>
				<TableData
					width="85px"
					maxWidth="120px"
					className={styles.orders_history_opened_orders_row_date}
				>
					{tradeDate.format("DD/MM/YYYY")}&nbsp;
					<span>{tradeDate.format("HH:mm:ss")}</span>
				</TableData>
				<TableData align="right">
					<span>
						{formatNumber(trade.price, {
							useGrouping: false,
							maximumFractionDigits: pricePrecision,
							minimumFractionDigits: pricePrecision,
						})}
						&nbsp;{quoteCurrencyCode}
					</span>
				</TableData>
				<TableData align="right">
					{formatNumber(trade.amount1 ?? 0, {
						useGrouping: false,
						maximumFractionDigits: amountPrecision,
						minimumFractionDigits: amountPrecision,
					})}
					&nbsp;{baseCurrencyCode}
				</TableData>
				<TableData align="right">
					{formatNumber(trade.amount2 ?? 0, {
						useGrouping: false,
						maximumFractionDigits: 3,
					})}
					&nbsp;{quoteCurrencyCode}
				</TableData>
				<TableData align="right">
					<span>
						{showTransactionFee ? (
							<>
								{formatNumber(trade.fee_amount ?? 0, {
									useGrouping: false,
									maximumFractionDigits: amountPrecision,
									minimumFractionDigits: amountPrecision,
								})}
								&nbsp;{trade.fee_currency_id}
							</>
						) : (
							"--"
						)}
					</span>
				</TableData>
			</TableRow>
		);
	},
);

interface Props {
	order: IHistoryOrder;
}

const OrdersHistoryRow: React.FC<Props> = ({ order }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState(false);
	const pricePrecision = order.pair?.price_precision ?? 8;
	const amountPrecision = order.pair?.amount_precision ?? 8;
	const [baseCurrencyCode, quoteCurrencyCode] = order.symbol.split("_");
	const date = transformDate(order.date);
	const hasTrades = [
		OrderStatusEnum.FILLED,
		OrderStatusEnum.PARTIAL_FILLED,
		OrderStatusEnum.PARTIAL_CANCELED,
		OrderStatusEnum.PARTIAL_CANCELLED,
	].includes(order.status as OrderStatusEnum);

	const disabled = [OrderStatusEnum.CANCELLED, OrderStatusEnum.EXPIRED].includes(
		order.status as OrderStatusEnum,
	);

	const toggleExpand = () => {
		if (hasTrades) {
			if (!order.trades.length && !isExpanded) {
				order.loadTrades();
			}
			setIsExpanded((prevState) => !prevState);
		}
	};

	const tradesColumns: IHeaderColumn[] = [
		{
			name: "date",
			label: formatMessage(messages.active_orders_date),
			width: "85px",
			maxWidth: "120px",
		},
		{
			name: "price",
			label: formatMessage(messages.active_orders_trading_price),
			align: "right",
		},
		{
			name: "amount",
			label: formatMessage(messages.active_orders_amount),
			align: "right",
		},
		{
			name: "total",
			label: formatMessage(messages.active_orders_total),
			align: "right",
		},
		{
			name: "fee",
			label: formatMessage(messages.active_orders_transaction_fee),
			align: "right",
		},
	];

	return (
		<TableRowAdvancedContainer active={isExpanded} disabled={disabled}>
			<TableRow
				active={isExpanded}
				onExpand={toggleExpand}
				isExpandActive={hasTrades}
				className={styles.closed_orders_row}
			>
				<TableData width="150px" minWidth="150px">
					{date.format("DD/MM/YYYY")}&nbsp;
					<span>{date.format("HH:mm:ss")}</span>
				</TableData>
				<TableData width="100px" minWidth="100px">
					{baseCurrencyCode}/<span>{quoteCurrencyCode}</span>
				</TableData>
				<TableData align="center" width="65px" minWidth="65px">
					{formatMessage(
						order.type === OrderTypeEnum.LIMIT
							? exchangeMessages.order_type_limit
							: order.type === OrderTypeEnum.STOP_LIMIT
							? exchangeMessages.order_type_stop_limit
							: exchangeMessages.order_type_market,
					)}
				</TableData>
				<TableData align="center" width="70px" minWidth="70px">
					<Badge
						alpha
						disabled={disabled}
						color={order.side === OrderSideEnum.SELL ? BadgeColorEnum.RED : BadgeColorEnum.GREEN}
					>
						{formatMessage(
							order.side === OrderSideEnum.SELL
								? messages.orders_table_type_1
								: messages.orders_table_type_2,
						)}
					</Badge>
				</TableData>
				<TableData align="right" width="120px" minWidth="120px">
					{order.type !== OrderTypeEnum.MARKET && order.price
						? formatNumber(order.price, {
								useGrouping: false,
								minimumFractionDigits: pricePrecision,
								maximumFractionDigits: pricePrecision,
						  })
						: "--"}
				</TableData>
				<TableData align="right" width="120px" minWidth="120px">
					{order.price_avg
						? formatNumber(order.price_avg, {
								useGrouping: false,
								minimumFractionDigits: pricePrecision,
								maximumFractionDigits: pricePrecision,
						  })
						: "--"}
				</TableData>
				<TableData align="center" width="90px" minWidth="90px">
					{formatNumber(order.filled_percent, {
						useGrouping: false,
						minimumFractionDigits: 1,
						maximumFractionDigits: 1,
					})}
					%
				</TableData>
				<TableData align="right" width="120px" minWidth="120px">
					{formatNumber(order.amount ?? 0, {
						useGrouping: false,
						maximumFractionDigits: amountPrecision,
						minimumFractionDigits: amountPrecision,
					})}
				</TableData>
				<TableData align="right" width="140px" minWidth="140px">
					{formatNumber(order.totalValue ?? 0, {
						useGrouping: false,
						minimumFractionDigits: pricePrecision,
						maximumFractionDigits: pricePrecision,
					})}
					&nbsp;{quoteCurrencyCode}
				</TableData>
				<TableData align="right" width="120px" minWidth="120px">
					<Badge
						alpha
						disabled={disabled}
						color={getColorFromStatus(order.status as OrderStatusEnum)}
					>
						{ORDER_STATUS_TEXT[order.status]}
					</Badge>
				</TableData>
			</TableRow>
			{isExpanded && (
				<Table header={{ columns: tradesColumns }}>
					{order.isTradesLoading ? (
						<LoadingSpinner verticalMargin="20px" />
					) : (
						order.trades.map((trade) => (
							<TradeRow
								key={trade.id}
								trade={trade}
								pricePrecision={pricePrecision}
								amountPrecision={amountPrecision}
								showTransactionFee={order.type !== OrderTypeEnum.MARKET}
							/>
						))
					)}
				</Table>
			)}
		</TableRowAdvancedContainer>
	);
};

export default observer(OrdersHistoryRow);
