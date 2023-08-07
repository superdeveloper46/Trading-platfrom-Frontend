import React, { useState } from "react";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import messages from "messages/history";
import exchangeMessages from "messages/exchange";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { transformDate } from "utils/dayjs";
import { IHistoryOrder } from "models/History";
import { TableData, TableRow } from "components/UI/Table";
import Spinner from "components/UI/Spinner";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import Badge from "components/UI/Badge";
import ExchangeService from "services/ExchangeService";
import errorHandler from "utils/errorHandler";
import { toast } from "react-toastify";
import { formatNumberNoRounding } from "utils/format";
import { ICreateOrderBody } from "types/exchange";
import { ORDER_SIDE, ORDER_TYPE } from "constants/orders";
import IconButton from "components/UI/IconButton";

interface Props {
	order: IHistoryOrder;
	onMarginCurrencyLoad?: () => void;
	showAllOpenedOrders?: boolean;
	pairPricePrecision?: number;
	pairAmountPrecision?: number;
}

const TriggerOrdersRow: React.FC<Props> = ({
	order,
	onMarginCurrencyLoad,
	showAllOpenedOrders,
	pairPricePrecision = 8,
	pairAmountPrecision = 8,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const pricePrecision = order.pair?.price_precision ?? pairPricePrecision;
	const amountPrecision = order.pair?.amount_precision ?? pairAmountPrecision;
	const [baseCurrencyCode, quoteCurrencyCode] = order.symbol.split("_");
	const date = transformDate(order.date);
	const [isEdited, setIsEdited] = useState<boolean>(false);
	const [editableAmount, setEditableAmount] = useState<number>(
		+formatNumberNoRounding(order.amount_original ?? 0, amountPrecision),
	);
	const [editablePrice, setEditablePrice] = useState<number>(
		+formatNumberNoRounding(order.price ?? 0, pricePrecision),
	);

	const handeEditableAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditableAmount(+e.target.value);
	};

	const handeEditablePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditablePrice(+e.target.value);
	};

	const toggleIsEdited = () => {
		setIsEdited((prevState) => !prevState);
	};

	const editOrder = async () => {
		const nextOrder: ICreateOrderBody = {
			type: ORDER_TYPE[order.type].toString(),
			side: ORDER_SIDE[order.side].toString(),
			symbol: order.symbol,
			amount: editableAmount.toString(),
			price: editablePrice.toString(),
			pair: order.symbol,
		};

		if (order.stop_operator) {
			nextOrder.stop_operator = order.stop_operator.toString();
			nextOrder.stop_price = order.stop_price?.toString();
		}

		if (order.side_effect) {
			nextOrder.side_effect = order.side_effect.toString();
		}

		if (order.wallet_type) {
			nextOrder.wallet_type = order.wallet_type.toString();
		}

		await cancelOrder();

		try {
			await ExchangeService.createOrder(nextOrder);
			if (onMarginCurrencyLoad) {
				onMarginCurrencyLoad();
			}
		} catch (err) {
			errorHandler(err);
		}
	};

	const cancelOrder = async () => {
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
						{formatMessage(messages.order_was_cancelled)}
					</>,
				);
			} catch (err) {
				errorHandler(err);
				order.setIsCancelLoading(false);
			}
		}
	};

	return (
		<TableRow common className={styles.orders_history_row}>
			<TableData
				width="85px"
				maxWidth="120px"
				className={styles.orders_history_opened_orders_row_date}
				data-tip={date.format("MM/DD/YYYY HH:mm:ss")}
				data-for="order-date"
			>
				<span>{date.format("MM/DD/YYYY")}</span>
			</TableData>
			<TableData width="75px">
				{baseCurrencyCode}/<span>{quoteCurrencyCode}</span>
			</TableData>
			<TableData align="center" width="70px">
				<Badge alpha color={order.side === OrderSideEnum.SELL ? "red" : "green"}>
					{formatMessage(
						order.side === OrderSideEnum.SELL
							? messages.orders_table_type_1
							: messages.orders_table_type_2,
					)}
				</Badge>
			</TableData>
			<TableData align="center" width="70px">
				{order.type === OrderTypeEnum.STOP_LIMIT
					? formatMessage(exchangeMessages.order_type_stop_limit)
					: "--"}
			</TableData>
			<TableData align="right" width="180px" minWidth="180px">
				{isEdited ? (
					<input
						className={cn(styles.order_history_edit_input, styles.price)}
						value={editablePrice}
						type="number"
						onChange={handeEditablePriceChange}
					/>
				) : order.price ? (
					formatNumber(order.price, {
						useGrouping: false,
						minimumFractionDigits: pricePrecision,
						maximumFractionDigits: pricePrecision,
					})
				) : (
					"--"
				)}
				{showAllOpenedOrders && <>&nbsp;{quoteCurrencyCode}</>}
			</TableData>
			<TableData align="right" width="160px" minWidth="160px">
				{isEdited ? (
					<input
						className={cn(styles.order_history_edit_input, styles.amount)}
						value={editableAmount}
						type="number"
						onChange={handeEditableAmountChange}
					/>
				) : order.amount_original ? (
					formatNumber(order.amount_original, {
						useGrouping: false,
						minimumFractionDigits: amountPrecision,
						maximumFractionDigits: amountPrecision,
					})
				) : (
					"--"
				)}
				{showAllOpenedOrders && <>&nbsp;{baseCurrencyCode}</>}
				{isEdited ? (
					<div className={styles.order_history_edit_actions}>
						<IconButton
							variant="text"
							color="primary"
							size="large"
							icon={<i className="ai ai-check_filled" />}
							onClick={editOrder}
						/>
						<IconButton
							variant="text"
							color="primary"
							size="large"
							onClick={toggleIsEdited}
							icon={<i className="ai ai-cancel_filled" />}
						/>
					</div>
				) : (
					<button
						className={styles.orders_history_edit_order_button}
						type="button"
						onClick={toggleIsEdited}
					>
						<i className="ai ai-highlight" />
					</button>
				)}
			</TableData>
			<TableData align="center" width="70px">
				{formatNumber(order.amount_filled ?? 0, {
					useGrouping: false,
					maximumFractionDigits: amountPrecision,
				})}
				/
				{formatNumber(order.amount_original ?? 0, {
					useGrouping: false,
					maximumFractionDigits: amountPrecision,
				})}
			</TableData>
			<TableData align="right" width="100px">
				{order.type === OrderTypeEnum.STOP_LIMIT &&
				[OrderStatusEnum.OPEN, OrderStatusEnum.PARTIAL_FILLED].includes(
					order.status as OrderStatusEnum,
				) ? (
					"triggered"
				) : order.stop_price ? (
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
			</TableData>
			<TableData align="right" width="120px" minWidth="120px">
				{formatNumber(order.totalValue, {
					useGrouping: false,
					maximumFractionDigits:
						order.type === OrderTypeEnum.MARKET ? amountPrecision : pricePrecision,
				})}
				&nbsp;
				{order.side === OrderSideEnum.SELL ? baseCurrencyCode : quoteCurrencyCode}
			</TableData>
			<TableData align="right" width="80px" maxWidth="80px">
				<button
					type="button"
					onClick={cancelOrder}
					className={styles.orders_history_open_orders_row_cancel_button}
				>
					{order.isCancelLoading ? (
						<Spinner />
					) : (
						<i
							className="ai ai-cancel_mini"
							style={{ fontSize: "14px" }}
							data-tip={formatMessage(messages.active_orders_action_cancel_tooltip)}
							data-for="cancel-order"
						/>
					)}
				</button>
			</TableData>
		</TableRow>
	);
};

export default observer(TriggerOrdersRow);
