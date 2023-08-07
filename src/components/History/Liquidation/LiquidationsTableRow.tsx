import React, { useState } from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

import { ILiquidation } from "types/history";
import { AccountTypeEnum } from "types/account";
import { Table, TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import historyStyles from "styles/pages/History/History.module.scss";
import { formatNumberNoRounding } from "utils/format";
import { IHeaderColumn } from "components/UI/Table/Table";
import messages from "messages/history";
import { OrderSideEnum } from "types/orders";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import { ORDER_STATUS } from "constants/orders";

interface Props {
	liquidation: ILiquidation;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const LiquidationsTableRow: React.FC<Props> = ({ liquidation, type }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState(false);

	const hasTrades = liquidation.executions.length > 0;

	const toggleExpand = () => {
		setIsExpanded((prevState) => !prevState);
	};

	const executionsColumns: IHeaderColumn[] = [
		{
			name: "pair",
			label: formatMessage(messages.active_orders_pair),
			width: "85px",
		},
		{
			name: "side",
			label: formatMessage(messages.trades_table_side),
			align: "center",
			maxWidth: "100px",
		},
		{
			name: "amount",
			label: formatMessage(messages.active_orders_amount),
			align: "right",
		},
		{
			name: "price",
			label: formatMessage(messages.active_orders_trading_price),
			align: "right",
		},
	];

	return (
		<TableRowAdvancedContainer active={isExpanded}>
			<TableRow
				active={isExpanded}
				onExpand={toggleExpand}
				isExpandActive={hasTrades}
				common
				className={historyStyles.table_row}
			>
				<TableData width="150px">
					{liquidation.created_at
						? dayjs.utc(dayjs(liquidation.created_at)).format("DD/MM/YYYY")
						: "--"}
					&nbsp;
					<span>
						{liquidation.created_at
							? dayjs.utc(dayjs(liquidation.created_at)).format("HH:mm:ss")
							: "--"}
					</span>
				</TableData>
				{type === AccountTypeEnum.ISOLATED && (
					<TableData width="100px">
						{liquidation.pair.base_currency_code}
						<span>/{liquidation.pair.quote_currency_code}</span>
					</TableData>
				)}
				<TableData align="right" width="150px">
					{formatNumberNoRounding(+liquidation.amount, liquidation.currency?.precision ?? 8)}{" "}
					<span>{liquidation.currency?.code}</span>
				</TableData>
				<TableData align="right" width="150px">
					{liquidation.closed_at
						? dayjs.utc(dayjs(liquidation.closed_at)).format("DD/MM/YYYY")
						: "--"}
					&nbsp;
					<span>
						{liquidation.closed_at
							? dayjs.utc(dayjs(liquidation.closed_at)).format("HH:mm:ss")
							: "--"}
					</span>
				</TableData>
			</TableRow>
			{isExpanded && liquidation.executions ? (
				<Table header={{ columns: executionsColumns }}>
					{liquidation.executions.map((trade) => (
						<TableRow key={trade.id}>
							<TableData>
								{trade.pair?.base_currency_code}
								<span>/{trade.pair?.quote_currency_code}</span>
							</TableData>
							<TableData align="center" maxWidth="100px">
								<Badge
									alpha
									color={
										trade.side === ORDER_STATUS[OrderSideEnum.SELL]
											? BadgeColorEnum.RED
											: BadgeColorEnum.GREEN
									}
								>
									{formatMessage(
										trade.side === ORDER_STATUS[OrderSideEnum.SELL]
											? messages.orders_table_type_1
											: messages.orders_table_type_2,
									)}
								</Badge>
							</TableData>
							<TableData align="right">
								{trade.amount_filled} <span>{trade.pair?.base_currency_code}</span>
							</TableData>
							<TableData align="right">
								{formatNumber(+(trade.price_avg || 0), {
									useGrouping: false,
									maximumFractionDigits: trade.pair?.amount_precision || 8,
									minimumFractionDigits: trade.pair?.amount_precision || 8,
								})}{" "}
								<span>{trade.pair?.quote_currency_code}</span>
							</TableData>
						</TableRow>
					))}
				</Table>
			) : null}
		</TableRowAdvancedContainer>
	);
};

export default LiquidationsTableRow;
