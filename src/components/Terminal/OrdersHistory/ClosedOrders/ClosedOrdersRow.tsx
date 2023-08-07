import React, { useState } from "react";
import styles from "styles/pages/Terminal.module.scss";
import messages from "messages/history";
import exchangeMessages from "messages/exchange";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { transformDate } from "utils/dayjs";
import { IHistoryOrder, IHistoryOrderTrade } from "models/History";
import { Table, TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import { OrderSideEnum, OrderTypeEnum, OrderStatusEnum } from "types/orders";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import { IHeaderColumn } from "components/UI/Table/Table";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { ORDER_STATUS_TEXT } from "constants/orders";

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
	showTransactionFee: boolean;
	trade: IHistoryOrderTrade;
	pricePrecision: number;
	amountPrecision: number;
}

const TradeRow: React.FC<ITradeProps> = observer(
	({ trade, pricePrecision, amountPrecision, showTransactionFee }) => {
		const [baseCurrencyCode, quoteCurrencyCode] = trade.pair_id.split("_");
		const tradeDate = transformDate(trade.date);
		const { formatNumber } = useIntl();

		return (
			<TableRow className={styles.orders_history_row_trades_row}>
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

interface IProps {
	order: IHistoryOrder;
}

const ClosedOrdersRow: React.FC<IProps> = ({ order }) => {
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

	const toggleExpand = () => {
		if (hasTrades) {
			if (!order.trades.length && !isExpanded) {
				order.loadTrades();
			}
			setIsExpanded((prevState) => !prevState);
		}
	};

	return (
		<TableRowAdvancedContainer active={isExpanded} disabled={disabled}>
			<TableRow
				active={isExpanded}
				onExpand={toggleExpand}
				isExpandActive={hasTrades}
				className={styles.orders_history_row}
			>
				<TableData
					width="85px"
					maxWidth="120px"
					className={styles.orders_history_opened_orders_row_date}
				>
					{date.format("DD/MM/YYYY")}
					<span>{date.format("HH:mm:ss")}</span>
				</TableData>
				<TableData width="85px">
					{baseCurrencyCode}/<span>{quoteCurrencyCode}</span>
				</TableData>
				<TableData align="center" width="85px">
					{formatMessage(
						order.type === OrderTypeEnum.LIMIT
							? exchangeMessages.order_type_limit
							: order.type === OrderTypeEnum.STOP_LIMIT
							? exchangeMessages.order_type_stop_limit
							: exchangeMessages.order_type_market,
					)}
				</TableData>
				<TableData align="center" width="85px">
					<Badge
						alpha
						color={order.side === OrderSideEnum.SELL ? BadgeColorEnum.RED : BadgeColorEnum.GREEN}
					>
						{formatMessage(
							order.side === OrderSideEnum.SELL
								? messages.orders_table_type_1
								: messages.orders_table_type_2,
						)}
					</Badge>
				</TableData>
				<TableData align="right" width="85px">
					{order.type !== OrderTypeEnum.MARKET && order.price
						? formatNumber(order.price, {
								useGrouping: false,
								minimumFractionDigits: pricePrecision,
								maximumFractionDigits: pricePrecision,
						  })
						: "--"}
				</TableData>
				<TableData align="right" width="85px">
					{order.price_avg
						? formatNumber(order.price_avg, {
								useGrouping: false,
								minimumFractionDigits: pricePrecision,
								maximumFractionDigits: pricePrecision,
						  })
						: "--"}
				</TableData>
				<TableData align="center" width="85px">
					{formatNumber(order.filled_percent, {
						useGrouping: false,
						minimumFractionDigits: 1,
						maximumFractionDigits: 1,
					})}
					%
				</TableData>
				<TableData align="right" width="85px">
					{formatNumber(order.amount ?? 0, {
						useGrouping: false,
						maximumFractionDigits: amountPrecision,
						minimumFractionDigits: amountPrecision,
					})}
				</TableData>
				<TableData align="right" width="100px">
					{formatNumber(order.totalValue ?? 0, {
						useGrouping: false,
						minimumFractionDigits: pricePrecision,
						maximumFractionDigits: pricePrecision,
					})}
					&nbsp;{quoteCurrencyCode}
				</TableData>
				<TableData align="right" width="120px">
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
								showTransactionFee={order.type !== OrderTypeEnum.MARKET}
								pricePrecision={pricePrecision}
								amountPrecision={amountPrecision}
							/>
						))
					)}
				</Table>
			)}
		</TableRowAdvancedContainer>
	);
};

export default observer(ClosedOrdersRow);
