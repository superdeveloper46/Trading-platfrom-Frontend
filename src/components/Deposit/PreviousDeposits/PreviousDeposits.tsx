import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/components/DepositWithdrawal.module.scss";
import messages from "messages/finance";
import withdrawMessages from "messages/history";
import commonMessages from "messages/common";
import { IDeposit } from "models/Deposit";
import { useMst } from "models/Root";
import NoRowsMessage from "components/Table/NoRowsMessage";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useWindowSize from "hooks/useWindowSize";
import InternalLink from "components/InternalLink";
import Table, { IHeaderColumn } from "components/UI/Table/Table";
import { TableHeader } from "components/UI/Page";
import { routes } from "constants/routing";
import PreviousDepositRowMobile from "./PreviousDepositRowMobile";
import PreviousDepositRow from "./PreviousDepositRow";

const PreviousDeposits: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		deposit: { previousDeposits },
	} = useMst();

	const { results, isLoading } = previousDeposits;
	const { mobile } = useWindowSize();

	const columns: IHeaderColumn[] = [
		{ label: formatMessage(withdrawMessages.orders_table_date), name: "date" },
		{ label: formatMessage(commonMessages.coin), name: "coin" },
		{
			label: formatMessage(withdrawMessages.orders_table_amount),
			name: "amount",
		},
		{
			label: "TX",
			name: "tx",
		},
		{
			width: "100px",
		},
		{
			label: formatMessage(withdrawMessages.orders_table_status),
			name: "status",
			maxWidth: "150px",
			align: "right",
		},
	];

	return (
		<div className={styles.table_container}>
			<TableHeader style={{ margin: "10px 20px" }}>
				<span className={styles.table_title}>{formatMessage(messages.previous_deposits)}</span>
			</TableHeader>
			{isLoading ? (
				<LoadingSpinner />
			) : !results || results?.length === 0 ? (
				<NoRowsMessage />
			) : mobile ? (
				results.map((deposit: IDeposit) => <PreviousDepositRowMobile deposit={deposit} />)
			) : (
				<Table stripped header={{ columns }}>
					{results.map((deposit: IDeposit) => (
						<PreviousDepositRow key={deposit.id} deposit={deposit} />
					))}
				</Table>
			)}
			<div className={styles.table_footer}>
				<InternalLink to={routes.financeHistory.deposits}>
					{formatMessage(commonMessages.review_all)}
					<i className="ai ai-chevron_right" />
				</InternalLink>
			</div>
		</div>
	);
};

export default observer(PreviousDeposits);
