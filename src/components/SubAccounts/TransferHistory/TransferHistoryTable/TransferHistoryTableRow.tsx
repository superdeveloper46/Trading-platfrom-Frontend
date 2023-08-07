import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import accountMessages from "messages/account";
import { ISubAccountTransfer } from "types/subAccounts";
import { TableData, TableRow } from "components/UI/Table";
import Badge from "components/UI/Badge";
import styles from "styles/pages/SubAccounts/TransferHistory.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";

interface Props {
	transfer: ISubAccountTransfer;
	sender: { login: string; email: string };
	receiver: { login: string; email: string };
}

const TransferHistoryTableRow: React.FC<Props> = ({ transfer, sender, receiver }) => {
	const { formatNumber, formatMessage } = useIntl();

	return (
		<TableRow className={subAccountsStyles.table_row} common>
			<TableData className={styles.table_data_custom} width="300px" maxWidth="300px">
				<div className={styles.account_div}>
					{sender?.login} <span className={styles.secondary_text}>({sender?.email})</span>
				</div>
				<Badge alpha color="green">
					{formatMessage(accountMessages.spot)}
				</Badge>
			</TableData>
			<TableData width="50px" maxWidth="50px" />
			<TableData className={styles.table_data_custom} width="300px" maxWidth="300px">
				<div className={styles.account_div}>
					{receiver?.login} <span className={styles.secondary_text}>({receiver?.email})</span>{" "}
				</div>
				<Badge alpha color="green">
					{formatMessage(accountMessages.spot)}
				</Badge>
			</TableData>
			<TableData align="right" width="110px">
				{formatNumber(transfer.amount, {
					useGrouping: false,
					maximumFractionDigits: transfer.currency.precision,
				})}
				&nbsp;
				<span className={styles.secondary_text}>{transfer.currency.code}</span>
			</TableData>
			<TableData width="20px" maxWidth="20px" />
			<TableData dateMode align="right" width="150px" maxWidth="150px">
				{dayjs(transfer.date).utc().format("DD/MM/YYYY")}{" "}
				<span>{dayjs(transfer.date).utc().format("HH:mm:ss")}</span>
			</TableData>
		</TableRow>
	);
};

export default TransferHistoryTableRow;
