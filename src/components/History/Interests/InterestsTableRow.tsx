import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

import { IInterest } from "types/history";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import { formatRateToPercentage } from "utils/format";
import historyStyles from "styles/pages/History/History.module.scss";

interface Props {
	interest: IInterest;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const InterestTableRow: React.FC<Props> = ({ interest, type }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow common className={historyStyles.table_row}>
			<TableData width="150px">
				{interest.date ? dayjs.utc(dayjs(interest.date)).format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span>{interest.date ? dayjs.utc(dayjs(interest.date)).format("HH:mm:ss") : "--"}</span>
			</TableData>
			{type === AccountTypeEnum.ISOLATED && (
				<TableData width="100px">{interest.pair?.symbol ?? "--"}</TableData>
			)}
			<TableData width="100px">{interest.currency?.code ?? "--"}</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+interest.interest_accrued, {
					useGrouping: false,
					maximumFractionDigits: interest.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(+interest.borrowed, {
					useGrouping: false,
					maximumFractionDigits: interest.currency?.precision ?? 8,
					minimumFractionDigits: 2,
				})}
			</TableData>
			<TableData align="right" width="100px">
				{formatRateToPercentage(+interest.interest_rate)}
			</TableData>
		</TableRow>
	);
};

export default InterestTableRow;
