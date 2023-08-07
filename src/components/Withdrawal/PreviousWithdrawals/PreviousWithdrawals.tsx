import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import messages from "messages/finance";
import withdrawMessages from "messages/history";
import commonMessages from "messages/common";
import { CancelModal } from "components/Withdrawal/modals";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import { IWithdraw } from "models/Withdrawal";
import InternalLink from "components/InternalLink";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { Table } from "components/UI/Table";
import { IHeaderColumn } from "components/UI/Table/Table";
import { routes } from "constants/routing";
import { TableHeader } from "components/UI/Page";
import LoadingSpinner from "components/UI/LoadingSpinner";
import NoRowsMessage from "components/Table/NoRowsMessage";
import PreviousWithdrawalRow from "./PreviousWithdrawalRow";
import PreviousWithdrawalRowMobile from "./PreviousWithdrawalRowMobile";

const PreviousWithdrawals: React.FC = () => {
	const {
		withdrawal: { previousWithdraws, cancelWithdraw, getPreviousWithdraws },
		global: { locale },
	} = useMst();
	const { results, isLoading } = previousWithdraws;
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();
	const [modalData, setModalData] = useState<{
		amount: string;
		currencyCode: string;
		slug: string;
	} | null>(null);

	const handleCloseCancelModal = useCallback(() => {
		setModalData(null);
	}, []);

	const handleConfirmCancelModal = useCallback((slug: string) => {
		cancelWithdraw(slug).finally(() => {
			setModalData(null);
			getPreviousWithdraws();
		});
	}, []);

	const handleOpenCancelModal = useCallback(
		(amount: string, currencyCode: string, slug: string) => {
			setModalData({ amount, currencyCode, slug });
		},
		[],
	);

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(withdrawMessages.orders_table_date),
			name: "date",
		},
		{
			label: formatMessage(commonMessages.coin),
			name: "coin",
		},
		{
			label: formatMessage(withdrawMessages.orders_table_amount),
			name: "amount",
		},
		{
			label: formatMessage(commonMessages.note),
			name: "note",
			width: "100px",
			maxWidth: "100px",
		},
		{
			label: formatMessage(withdrawMessages.orders_table_status),
			maxWidth: "150px",
			align: "right",
		},
		{
			width: "60px",
			maxWidth: "60px",
		},
	];

	return (
		<div className={styles.table_container}>
			{modalData && (
				<CancelModal
					isOpen={!!modalData}
					onClose={handleCloseCancelModal}
					onConfirm={handleConfirmCancelModal}
					data={modalData}
				/>
			)}
			<TableHeader style={{ margin: "10px 20px" }}>
				<span className={styles.table_title}>{formatMessage(messages.previous_withdraws)}</span>
			</TableHeader>
			{isLoading ? (
				<LoadingSpinner />
			) : !results || results?.length === 0 ? (
				<NoRowsMessage />
			) : mobile ? (
				results.map((withdraw: IWithdraw) => (
					<PreviousWithdrawalRowMobile
						key={withdraw.id}
						withdraw={withdraw}
						locale={locale}
						onCancel={handleOpenCancelModal}
					/>
				))
			) : (
				<Table header={{ columns }} stripped>
					{results.map((withdraw: IWithdraw) => (
						<PreviousWithdrawalRow
							withdraw={withdraw}
							locale={locale}
							key={withdraw.id}
							onCancel={handleOpenCancelModal}
						/>
					))}
				</Table>
			)}
			<div className={styles.table_footer}>
				<InternalLink to={routes.financeHistory.withdraws}>
					{formatMessage(commonMessages.review_all)}
					<i className="ai ai-chevron_right" />
				</InternalLink>
			</div>
		</div>
	);
};

export default observer(PreviousWithdrawals);
