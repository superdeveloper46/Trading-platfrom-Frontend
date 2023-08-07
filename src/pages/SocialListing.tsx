import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import messages from "messages/listing";
import styles from "styles/pages/SocialListing.module.scss";
import { useIntl } from "react-intl";
import {
	PageHeader,
	LatestDonations,
	TopDonates,
	ListingProjects,
	AlcCoin,
	HowItWorks,
} from "components/SocialListing";
import { getPageTitle } from "helpers/global";

const SocialListing: React.FC = () => {
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
			<PageHeader />
			<div className={styles.content}>
				<div className={styles.donations}>
					<LatestDonations />
					<TopDonates />
				</div>
				<ListingProjects />
				<AlcCoin />
				<HowItWorks />
			</div>
		</MainLayout>
	);
};

export default SocialListing;
