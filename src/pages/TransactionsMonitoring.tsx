import MainLayout from "layouts/MainLayout";
import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import messages from "messages/report";
import { getPageTitle } from "helpers/global";
import MonitoringRootComponent from "components/TransactionsMonitoring/MonitoringRootComponent";

const TransactionsMonitoring: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.page_title));

	return (
		<MainLayout>
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
			<MonitoringRootComponent />
		</MainLayout>
	);
};

export default TransactionsMonitoring;
