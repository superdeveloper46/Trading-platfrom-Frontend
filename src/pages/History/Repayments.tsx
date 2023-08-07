import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import RepaymentsTable from "components/History/Repayments/RepaymentsTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const Repayments: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Repayments")} />
		<div className={historyStyles.container}>
			<Header label="Repayments" />
			<RepaymentsTable />
		</div>
	</>
);

export default Repayments;
