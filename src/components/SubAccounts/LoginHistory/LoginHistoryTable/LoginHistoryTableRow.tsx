import React from "react";
import dayjs from "dayjs";

import { TableData, TableRow } from "components/UI/Table";
import { ISubAccountSession } from "types/subAccounts";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";

interface Props {
	session: ISubAccountSession;
}

const LoginHistoryTableRow: React.FC<Props> = ({ session }) => (
	<TableRow className={subAccountsStyles.table_row}>
		<TableData crop width="150px">
			{session.account.login}
		</TableData>
		<TableData crop width="170px">
			{session.account.email}
		</TableData>
		<TableData dateMode width="120px">
			{dayjs(session.date).utc().format("DD/MM/YYYY")}{" "}
			<span>{dayjs(session.date).utc().format("HH:mm:ss")}</span>
		</TableData>
		<TableData width="110px">{session.ip_address}</TableData>
	</TableRow>
);

export default LoginHistoryTableRow;
