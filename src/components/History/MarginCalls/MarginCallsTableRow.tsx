import React from "react";
import dayjs from "dayjs";

import { IMarginCall } from "types/history";
import { AccountTypeEnum } from "types/account";
import historyStyles from "styles/pages/History/History.module.scss";
import { TableData, TableRow } from "components/UI/Table";

interface Props {
	marginCall: IMarginCall;
	type: Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>;
}

const MarginCallsTableRow: React.FC<Props> = ({ marginCall, type }) => (
	<TableRow common className={historyStyles.table_row}>
		<TableData width="150px">
			{marginCall.created_at ? dayjs.utc(dayjs(marginCall.created_at)).format("DD/MM/YYYY") : "--"}
			&nbsp;
			<span>
				{marginCall.created_at ? dayjs.utc(dayjs(marginCall.created_at)).format("HH:mm:ss") : "--"}
			</span>
		</TableData>
		{type === AccountTypeEnum.ISOLATED && (
			<TableData width="100px">{marginCall.pair?.symbol ?? "--"}</TableData>
		)}
		<TableData width="100px">{marginCall.margin_level ?? "--"}</TableData>
		<TableData align="right" width="100px">
			{marginCall.content}
		</TableData>
	</TableRow>
);

export default MarginCallsTableRow;
