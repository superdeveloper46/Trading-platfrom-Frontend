import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import messages from "messages/listing";
import { useIntl } from "react-intl";

import { ListingRequestForm } from "components/ListingRequest";
import { getPageTitle } from "helpers/global";
import styles from "styles/pages/ListingRequest.module.scss";
import commonMessages from "messages/common";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";

const ListingRequest: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.social_listing_header));
	const desc = formatMessage(messages.social_listing_desc, { ref: "" });

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: desc },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: desc },
					{ name: "twitter:description", content: desc },
				]}
			/>
			<div className={styles.container}>
				<Breadcrumbs
					links={[
						{
							link: routes.listing.root,
							label: formatMessage(commonMessages.listing),
						},
					]}
					current={formatMessage(messages.add_your_coin)}
				/>
				<ListingRequestForm />
			</div>
		</MainLayout>
	);
};

export default ListingRequest;
