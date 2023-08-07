import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";

import coinMessages from "messages/exchange";
import messages from "messages/history";
import { transformDate } from "utils/dayjs";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import ButtonMicro from "components/UI/ButtonMicro";
import Tooltip from "components/UI/Tooltip";
import Badge from "components/UI/Badge";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import historyStyles from "styles/pages/History/History.module.scss";
import { IHistoryOrder } from "models/History";
import ExchangeService from "services/ExchangeService";
import errorHandler from "utils/errorHandler";
import Spinner from "components/UI/Spinner";

interface Props {
	order: IHistoryOrder;
	type: AccountTypeEnum;
}

const ActiveOrdersRow: React.FC<Props> = ({ order, type }) => {
	const { formatMessage, formatNumber } = useIntl();
	const currency = order.symbol.split("_");
	const date = transformDate(type === AccountTypeEnum.SPOT ? order.date || 0 : order.open_at || 0);
	const amountPrecision = order.pair?.amount_precision ?? 8;
	const pricePrecision = order.pair?.price_precision ?? 8;

	const handleCancelClick = async () => {
		if (!order.isCancelLoading) {
			order.setIsCancelLoading(true);
			ExchangeService.cancelOrder(order.id)
				.then(() => {
					toast(
						<>
							<i className="ai ai-check_outline" />
							{formatMessage(messages.order_was_cancelled)}
						</>,
					);
				})
				.catch((err) => {
					errorHandler(err, false);
					order.setIsCancelLoading(false);
				});
		}
	};

	return (
		<TableRow common className={historyStyles.table_row}>
			<TableData width="150px" minWidth="150px">
				{date.format("DD/MM/YYYY")}&nbsp;
				<span>{date.format("HH:mm:ss")}</span>
			</TableData>
			<TableData width="75px">
				{currency[0]}/<span>{currency[1]}</span>
			</TableData>
			<TableData align="center" width="65px">
				{order.type === OrderTypeEnum.MARKET
					? formatMessage(coinMessages.order_type_market)
					: order.type === OrderTypeEnum.LIMIT
					? formatMessage(coinMessages.order_type_limit)
					: order.type === OrderTypeEnum.STOP_LIMIT
					? formatMessage(coinMessages.order_type_stop_limit)
					: "--"}
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
			<TableData align="right" width="120px">
				{formatNumber(order.price || 0, {
					useGrouping: false,
					minimumFractionDigits: pricePrecision,
					maximumFractionDigits: pricePrecision,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(order.amount_original || 0, {
					useGrouping: false,
					minimumFractionDigits: amountPrecision,
					maximumFractionDigits: amountPrecision,
				})}
			</TableData>
			<TableData align="center" width="70px">
				{formatNumber(order.filled_percent || 0, {
					useGrouping: false,
					minimumFractionDigits: 1,
					maximumFractionDigits: 1,
				})}
				%
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber((order.price || 0) * (order.amount_original || 0), {
					useGrouping: false,
					maximumFractionDigits: 3,
				})}
				&nbsp;{currency[1]}
			</TableData>
			<TableData align="right" width="120px">
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
			<TableData align="right" width="130px">
				{formatNumber(
					order.side === OrderSideEnum.SELL ? order.value_filled || 0 : order.amount_filled || 0,
					{
						useGrouping: false,
						minimumFractionDigits: amountPrecision,
						maximumFractionDigits: amountPrecision,
					},
				)}
				&nbsp;
				{currency[order.side === OrderSideEnum.SELL ? 1 : 0]}
			</TableData>
			<TableData align="right" width="80px">
				<Tooltip
					id={`tooltip_${order.id}`}
					opener={
						order.isCancelLoading ? (
							<Spinner />
						) : (
							<ButtonMicro onClick={handleCancelClick}>
								<i className="ai ai-cancel_mini" style={{ fontSize: "14px" }} />
							</ButtonMicro>
						)
					}
					text={formatMessage(messages.active_orders_action_cancel_tooltip)}
				/>
			</TableData>
		</TableRow>
	);
};

export default observer(ActiveOrdersRow);
