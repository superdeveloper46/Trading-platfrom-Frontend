import React from "react";
import { useIntl } from "react-intl";

import { ITrade } from "types/history";
import { transformDate } from "utils/dayjs";
import { TableData, TableRow } from "components/UI/Table";
import historyStyles from "styles/pages/History/History.module.scss";

interface Props {
	trade: ITrade;
}

const TradesHistoryTableRow: React.FC<Props> = ({ trade }) => {
	const { formatNumber } = useIntl();
	const currency = trade.pair_id?.split("_") ?? "";
	const date = transformDate(trade.date || 0);

	return (
		<TableRow common className={historyStyles.table_row}>
			<TableData width="150px">
				{date.format("DD/MM/YYYY")}&nbsp;
				<span>{date.format("HH:mm:ss")}</span>
			</TableData>
			<TableData width="100px">
				{currency[0]}/<span>{currency[1]}</span>
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(trade.price || 0, {
					useGrouping: false,
					maximumFractionDigits: 8,
				})}
				&nbsp;{currency[1]}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(trade.amount1 || 0, {
					useGrouping: false,
					maximumFractionDigits: 8,
				})}
				&nbsp;{currency[0]}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(trade.amount2 || 0, {
					useGrouping: false,
					maximumFractionDigits: 3,
				})}
				&nbsp;{currency[1]}
			</TableData>
			<TableData align="right" width="120px">
				<span>
					{formatNumber(trade.fee_amount || 0, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					&nbsp;{trade.fee_currency_id}
				</span>
			</TableData>
		</TableRow>
	);
};

export default TradesHistoryTableRow;
