import * as React from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/SocialListingHistory.module.scss";
import MainLayout from "layouts/MainLayout";
import messages from "messages/listing";
import { ListingProjects } from "components/SocialListing";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";
import styleProps from "utils/styleProps";
import { getPageTitle } from "helpers/global";

const SocialListingHistory: React.FC = () => {
	const title = getPageTitle("Social Listing");
	const { formatMessage } = useIntl();

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div style={styleProps({ paddingTop: "20px" })} className={styles.container}>
				<Breadcrumbs
					links={[
						{
							link: routes.socialListing.root,
							label: formatMessage(messages.back_to_rating_btn),
						},
					]}
				/>
				<div className={styles.container}>
					<span className={styles.header_primary}>{formatMessage(messages.history_header)}</span>
					<span style={styleProps({ marginBottom: "20px" })} className={styles.header_secondary}>
						{formatMessage(messages.history_desc)}
					</span>
					<div className={styles.content}>
						<ListingProjects historyMode />
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default observer(SocialListingHistory);
