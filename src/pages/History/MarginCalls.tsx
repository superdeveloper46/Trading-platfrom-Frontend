import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import MarginCallsTable from "components/History/MarginCalls/MarginCallsTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const MarginCalls: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Margin Calls")} />
		<div className={historyStyles.container}>
			<Header label="Margin Calls" />
			<MarginCallsTable />
		</div>
	</>
);

export default MarginCalls;
