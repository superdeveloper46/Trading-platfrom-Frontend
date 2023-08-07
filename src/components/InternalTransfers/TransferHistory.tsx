import React from "react";
import styles from "styles/components/InternalTransfers/TransferHistory.module.scss";
import internalTransfersMessages from "messages/transfers";
import { useIntl } from "react-intl";
import TransferHistoryTable from "./TransferHistoryTable";

const TransferHistory: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.page_container}>
			<div className={styles.header_container}>
				<h1 className={styles.header_title}>
					{formatMessage(internalTransfersMessages.history_header)}
				</h1>
			</div>
			<TransferHistoryTable full />
		</div>
	);
};

export default TransferHistory;
