import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import LiquidationsTable from "components/History/Liquidation/LiquidationsTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const Liquidations: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Liquidations")} />
		<div className={historyStyles.container}>
			<Header label="Liquidations" />
			<LiquidationsTable />
		</div>
	</>
);

export default Liquidations;
