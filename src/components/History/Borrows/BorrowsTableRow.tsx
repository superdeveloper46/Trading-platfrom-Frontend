import React from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

import { IBorrow } from "types/history";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import Badge from "components/UI/Badge";
import historyStyles from "styles/pages/History/History.module.scss";

interface Props {
	borrow: IBorrow;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const BorrowingTableRow: React.FC<Props> = ({ borrow, type }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow className={historyStyles.table_row}>
			<TableData width="165px" minWidth="165px">
				{borrow.opened_at ? dayjs.utc(dayjs(borrow.opened_at)).format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span>
					{borrow.opened_at ? dayjs.utc(dayjs(borrow.opened_at)).format("HH:mm:ss") : "--"}
				</span>
			</TableData>
			{type === AccountTypeEnum.ISOLATED && (
				<TableData width="100px">{borrow.pair?.symbol ?? "--"}</TableData>
			)}
			<TableData width="100px">{borrow.currency?.code ?? "--"}</TableData>
			<TableData align="right" width="120px">
				{formatNumber(borrow.borrowed, {
					useGrouping: false,
					maximumFractionDigits: borrow.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData width="100px" />
			<TableData width="100px">
				<Badge alpha color={borrow.type === 1 ? "blue" : "violet"}>
					{borrow.type === 1 ? "Auto" : "Manual"}
				</Badge>
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(borrow.repaid, {
					useGrouping: false,
					maximumFractionDigits: borrow.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(borrow.interest_paid, {
					useGrouping: false,
					maximumFractionDigits: borrow.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="150px" minWidth="150px">
				{borrow.closed_at ? dayjs.utc(dayjs(borrow.closed_at)).format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span>
					{borrow.closed_at ? dayjs.utc(dayjs(borrow.closed_at)).format("HH:mm:ss") : "--"}
				</span>
			</TableData>
		</TableRow>
	);
};

export default BorrowingTableRow;
