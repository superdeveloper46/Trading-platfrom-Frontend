import React from "react";
import Helmet from "react-helmet";
import { Header } from "components/History";
import InterestsTable from "components/History/Interests/InterestsTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const Interests: React.FC = () => (
	<>
		<Helmet title={getPageTitle("Interests")} />
		<div className={historyStyles.container}>
			<Header label="Interests" />
			<InterestsTable />
		</div>
	</>
);

export default Interests;
