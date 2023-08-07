import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

import { ITransfer } from "types/history";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import Badge from "components/UI/Badge";
import historyStyles from "styles/pages/History/History.module.scss";

interface Props {
	transfer: ITransfer;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const MarginTransfersTableRow: React.FC<Props> = ({ transfer, type }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow common className={historyStyles.table_row}>
			<TableData width="150px">
				{transfer.date ? dayjs.utc(dayjs(transfer.date)).format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span>{transfer.date ? dayjs.utc(dayjs(transfer.date)).format("HH:mm:ss") : "--"}</span>
			</TableData>
			{type === AccountTypeEnum.ISOLATED ? (
				<TableData width="100px">{transfer.pair?.symbol}</TableData>
			) : null}
			<TableData width="100px">{transfer.currency?.code}</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+transfer.amount, {
					useGrouping: false,
					maximumFractionDigits: transfer.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="100px">
				{transfer.direction === 1 ? (
					<Badge alpha color="blue">
						OUT {transfer.wallet_type === 2 ? "CROSS" : "ISOLATED"}
					</Badge>
				) : (
					<Badge alpha color="violet">
						IN {transfer.wallet_type === 2 ? "CROSS" : "ISOLATED"}
					</Badge>
				)}
			</TableData>
		</TableRow>
	);
};

export default MarginTransfersTableRow;
