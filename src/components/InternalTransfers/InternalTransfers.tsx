import { useMst } from "models/Root";
import React from "react";
import styles from "styles/components/InternalTransfers/TransferHistory.module.scss";
import CreateTransfer from "./CreateTransfer";
import TransferHistoryTable from "./TransferHistoryTable";

const InternalTransfers: React.FC = () => {
	const {
		global: { isAuthenticated },
	} = useMst();
	return (
		<div className={styles.page_container}>
			<CreateTransfer isAuthenticated={isAuthenticated} />
			<TransferHistoryTable />
		</div>
	);
};

export default InternalTransfers;
