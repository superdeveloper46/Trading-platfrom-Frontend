import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import messages from "messages/support";
import { getPageTitle } from "helpers/global";
import Routes from "components/SupportCenter/Routes";

const SupportCenter: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.support_center));

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
			<Routes />
		</MainLayout>
	);
};

export default SupportCenter;
