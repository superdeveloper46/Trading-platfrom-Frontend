import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import MarginTransfersTable from "components/History/MarginTransfers/MarginTransfersTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const MarginTransfers: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Transfers")} />
		<div className={historyStyles.container}>
			<Header label="Margin Transfers" />
			<MarginTransfersTable />
		</div>
	</>
);

export default MarginTransfers;
