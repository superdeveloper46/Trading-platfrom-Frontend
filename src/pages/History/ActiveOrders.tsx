import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import historyMessages from "messages/history";
import { Header } from "components/History";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import ActiveOrdersTable from "components/History/ActiveOrders/ActiveOrdersTable";
import historyStyles from "styles/pages/History/History.module.scss";
import { getPageTitle } from "helpers/global";

const ActiveOrders: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(historyMessages.active_orders))} />
			<WebSocket events={[WSListenEventEnum.ORDERS]} />
			<div className={historyStyles.container}>
				<Header label={formatMessage(historyMessages.active_orders)} />
				<ActiveOrdersTable />
			</div>
		</>
	);
};

export default ActiveOrders;
