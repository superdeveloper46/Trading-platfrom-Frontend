import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import financeMessages from "messages/finance";
import stakingMessages from "messages/staking";
import referralsMessages from "messages/referrals";
import { IHeader } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import styles from "styles/pages/SubAccounts/Balances.module.scss";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import { useMst } from "models/Root";
import { ISubAccountBalance } from "types/subAccounts";
import BalanceTableRow from "./BalanceTableRow";

const BalanceTable: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		subAccounts: { balances, getBalances, isBalancesLoading },
	} = useMst();

	const headerOptions: IHeader = {
		primary: true,
		className: subAccountsStyles.table_row,
		columns: [
			{
				name: "account",
				label: formatMessage(accountMessages.subaccount_table_account),
				width: "200px",
				maxWidth: "200px",
			},
			{
				name: "email",
				label: formatMessage(accountMessages.subaccount_table_email),
				width: "200px",
				maxWidth: "200px",
			},
			{
				name: "total-balance",
				label: formatMessage(accountMessages.subaccount_table_total_balance_btc),
				align: "right",
				width: "170px",
				maxWidth: "170px",
			},
			{
				name: "div1",
				width: "50px",
				maxWidth: "50px",
			},
			{
				name: "note",
				label: formatMessage(referralsMessages.note),
				width: "300px",
			},
			{
				name: "status",
				label: formatMessage(stakingMessages.positions_table_status),
				align: "center",
				width: "50px",
				maxWidth: "50px",
			},
			{
				name: "div1",
				width: "50px",
				maxWidth: "50px",
			},
			{
				name: "transfer",
				label: formatMessage(financeMessages.operations),
				width: "100px",
				maxWidth: "100px",
			},
			{
				name: "div1",
				width: "90px",
				maxWidth: "90px",
			},
		],
	};

	return (
		<div className={subAccountsStyles.table_container}>
			<Table className={styles.table} header={headerOptions}>
				{isBalancesLoading ? (
					[...new Array(PAGE_SIZE)].map((_, i) => (
						<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
					))
				) : balances.length > 0 ? (
					balances.map((b, i) => (
						<BalanceTableRow
							refetchBalances={() => getBalances()}
							balance={b as ISubAccountBalance}
							key={i}
						/>
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
		</div>
	);
};

export default observer(BalanceTable);
