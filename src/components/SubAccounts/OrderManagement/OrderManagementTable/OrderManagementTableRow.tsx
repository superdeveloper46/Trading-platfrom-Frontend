import React from "react";
import { useIntl } from "react-intl";

import coinMessages from "messages/exchange";
import messages from "messages/history";
import { SubAccountTypeEnum } from "types/subAccounts";
import { transformDate } from "utils/dayjs";
import { TableData, TableRow } from "components/UI/Table";
import ButtonMicro from "components/UI/ButtonMicro";
import Tooltip from "components/UI/Tooltip";
import Badge from "components/UI/Badge";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import { IHistoryOrder } from "models/History";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";

interface Props {
	order: IHistoryOrder;
	type: SubAccountTypeEnum;
	onCancel: (id: number) => void;
}

const OrderManagementTableRow: React.FC<Props> = ({ order, type, onCancel }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [, quoteCurrencyCode] = order.symbol.split("_");
	const currency = order.symbol.split("_");
	const date = transformDate(
		type === SubAccountTypeEnum.Spot ? order.date || 0 : order.open_at || 0,
	);
	const amountPrecision = 8;
	const pricePrecision = 8;

	return (
		<TableRow className={subAccountsStyles.table_row}>
			<TableData crop width="150px">
				{order.account?.login}
			</TableData>
			<TableData width="150px" minWidth="150px">
				{date.format("DD/MM/YYYY")}&nbsp;
				<span className={subAccountsStyles.grey_text}>{date.format("HH:mm:ss")}</span>
			</TableData>
			<TableData width="75px">
				{currency[0]}/<span className={subAccountsStyles.grey_text}>{currency[1]}</span>
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
			<TableData align="right" width="120px" minWidth="120px">
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
				{formatNumber(+(order?.price || 0) * +(order?.amount_original || 0), {
					useGrouping: false,
					maximumFractionDigits: 3,
				})}
				&nbsp;{quoteCurrencyCode}
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
			<TableData align="right" width="130px" minWidth="130px">
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
					id={`${order.id}`}
					text={formatMessage(messages.active_orders_action_cancel_tooltip)}
					opener={
						<ButtonMicro onClick={() => onCancel(order.id)}>
							<i className="ai ai-cancel_mini" style={{ fontSize: "14px" }} />
						</ButtonMicro>
					}
				/>
			</TableData>
		</TableRow>
	);
};

export default OrderManagementTableRow;
