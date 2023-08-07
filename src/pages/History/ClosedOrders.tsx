import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import historyMessages from "messages/history";
import { Header } from "components/History";
import ClosedOrdersTable from "components/History/ClosedOrders/ClosedOrdersTable";
import historyStyles from "styles/pages/History/History.module.scss";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { getPageTitle } from "helpers/global";

const ClosedOrders: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(historyMessages.order_history))} />
			<WebSocket events={[WSListenEventEnum.ORDERS]} />
			<div className={historyStyles.container}>
				<Header label={formatMessage(historyMessages.order_history)} />
				<ClosedOrdersTable />
			</div>
		</>
	);
};

export default ClosedOrders;
