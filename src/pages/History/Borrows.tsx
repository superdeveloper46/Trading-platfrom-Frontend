import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import historyStyles from "styles/pages/History/History.module.scss";
import BorrowsTable from "components/History/Borrows/BorrowsTable";
import { getPageTitle } from "helpers/global";

const Borrows: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Borrows")} />
		<div className={historyStyles.container}>
			<Header label="Borrows" />
			<BorrowsTable />
		</div>
	</>
);

export default Borrows;
