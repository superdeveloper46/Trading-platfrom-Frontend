import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import historyMessages from "messages/history";
import { Header } from "components/History";
import TradesHistoryTable from "components/History/TradesHistory/TradesHistoryTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const TradesHistory: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(historyMessages.trades))} />
			<div className={historyStyles.container}>
				<Header label={formatMessage(historyMessages.trades)} />
				<TradesHistoryTable />
			</div>
		</>
	);
};

export default TradesHistory;
