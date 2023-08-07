import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import subAccountMessages from "messages/sub_accounts";
import coinInfoMessages from "messages/exchange";
import { useMst } from "models/Root";
import { ISubAccountBalance } from "types/subAccounts";
import { TableData, TableRow } from "components/UI/Table";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/SubAccounts/Balances.module.scss";
import subAccountStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import { routes, URL_VARS } from "constants/routing";
import { ChangeNoteModal } from "../../modals";

interface Props {
	balance: ISubAccountBalance;
	refetchBalances: () => void;
}

const BalanceTableRow: React.FC<Props> = ({ balance, refetchBalances }) => {
	const { formatMessage, formatNumber } = useIntl();
	const {
		account: { profileStatus },
	} = useMst();

	const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

	const onEditClick = () => {
		setIsNoteModalOpen(true);
	};

	return (
		<>
			<TableRow className={subAccountStyles.table_row} common>
				<TableData width="200px" maxWidth="200px">
					{balance.login}
				</TableData>
				<TableData crop width="200px" maxWidth="200px">
					{balance.email}
				</TableData>
				<TableData align="right" width="170px" maxWidth="170px">
					{+balance.total_balance > 0
						? formatNumber(+balance.total_balance, {
								useGrouping: false,
								maximumFractionDigits: 8,
						  })
						: "--"}
				</TableData>
				<TableData width="50px" maxWidth="50px" />
				<TableData width="300px">
					<div className={styles.table_data_note} title={balance.description} onClick={onEditClick}>
						<i className="ai ai-edit_outline" />
						<span>{balance.description}</span>
					</div>
				</TableData>
				<TableData align="center" width="50px" maxWidth="50px">
					{balance.is_active ? (
						<i className={cn(subAccountStyles.table_data_status, "ai ai-check_filled")} />
					) : (
						<i className={cn(subAccountStyles.table_data_status, "ai ai-cancel_filled")} />
					)}
				</TableData>
				<TableData width="50px" maxWidth="50px" />
				<TableData width="100px" maxWidth="100px">
					<div className={styles.table_data_transfer}>
						<InternalLink
							to={routes.subAccounts.getTransferQuery({
								[URL_VARS.IN]: balance.uid,
								[URL_VARS.OUT]: profileStatus?.uid,
							})}
						>
							<span>{formatMessage(subAccountMessages.transfer)}</span>
						</InternalLink>
					</div>
				</TableData>
				<TableData align="right" width="90px" maxWidth="90px">
					<InternalLink to={routes.subAccounts.getBalanceDetails(balance.uid)}>
						{formatMessage(coinInfoMessages.details)}
					</InternalLink>
				</TableData>
			</TableRow>
			<ChangeNoteModal
				balance={balance}
				isOpen={isNoteModalOpen}
				onClose={() => setIsNoteModalOpen(false)}
				refetchBalances={() => refetchBalances()}
			/>
		</>
	);
};

export default observer(BalanceTableRow);
