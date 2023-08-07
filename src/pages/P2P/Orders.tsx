import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import OrdersTable from "components/P2P/Orders/OrdersTable";
import styles from "styles/pages/P2P/Orders.module.scss";
import historyMessages from "messages/history";

const Orders = () => {
	const { formatMessage } = useIntl();
	const title = `P2P ${formatMessage(historyMessages.orders)} | ALP.COM`;

	return (
		<div className={styles.container}>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<OrdersTable />
		</div>
	);
};

export default Orders;
