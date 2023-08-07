import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

import { IRepay } from "types/history";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import historyStyles from "styles/pages/History/History.module.scss";
import Badge from "components/UI/Badge";

interface Props {
	repay: IRepay;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const RepaymentsTableRow: React.FC<Props> = ({ repay, type }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow common className={historyStyles.table_row}>
			<TableData width="150px">
				{repay.date ? dayjs.utc(dayjs(repay.date)).format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span>{repay.date ? dayjs.utc(dayjs(repay.date)).format("HH:mm:ss") : "--"}</span>
			</TableData>
			{type === AccountTypeEnum.ISOLATED && (
				<TableData width="100px">{repay.pair?.symbol ?? "--"}</TableData>
			)}
			<TableData width="100px">{repay.currency?.code ?? "--"}</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+repay.principal_amount, {
					useGrouping: false,
					maximumFractionDigits: repay.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+repay.interest_amount, {
					useGrouping: false,
					maximumFractionDigits: repay.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+repay.principal_amount + +repay.interest_amount, {
					useGrouping: false,
					maximumFractionDigits: repay.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="100px">
				{repay.type === 1 ? (
					<Badge alpha color="blue">
						Auto
					</Badge>
				) : (
					<Badge alpha color="violet">
						Manual
					</Badge>
				)}
			</TableData>
		</TableRow>
	);
};

export default RepaymentsTableRow;
