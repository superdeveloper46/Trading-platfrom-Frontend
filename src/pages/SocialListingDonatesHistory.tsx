import * as React from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import styles from "styles/pages/SocialListingHistory.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import MainLayout from "layouts/MainLayout";
import messages from "messages/listing";
import common_messages from "messages/common";
import history_messages from "messages/history";
import { getPageTitle } from "helpers/global";
import { ListingHistoryDonateRow } from "components/SocialListingHistory";
import { useLatestProjectDonations } from "services/SocialListingService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useWindowSize from "hooks/useWindowSize";
import Pagination from "components/UI/Pagination";
import { Table } from "components/UI/Table";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import { queryVars } from "constants/query";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const PAGE_SIZE = 20;

const SocialListingDonatesHistory: React.FC = () => {
	const title = getPageTitle("Social project");

	const { slug = "" } = useParams<{ slug: string }>();
	const [page, setPage] = React.useState(1);
	const { data: latestDonations, isFetching } = useLatestProjectDonations(slug, {
		[queryVars.page]: page,
		[queryVars.page_size]: PAGE_SIZE,
	});

	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const { mobile } = useWindowSize();

	const headerOptions: IHeader = {
		primary: true,
		columns: [
			{
				label: formatMessage(history_messages.orders_table_date),
			},
			{
				label: formatMessage(history_messages.orders_table_amount),
				align: AlignEnum.Right,
			},
			{
				label: formatMessage(common_messages.user),
				align: AlignEnum.Right,
			},
		],
	};

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				<button
					type="button"
					className={styles.back_button}
					onClick={() => localeNavigate(routes.socialListing.root)}
				>
					<i className="ai ai-chevron_left" />
					{formatMessage(messages.back_to_rating_btn)}
				</button>
				<div className={styles.block}>
					<span className={styles.header_primary}>{formatMessage(messages.donates_history)}</span>
					<span className={styles.header_secondary}>
						{formatMessage(messages.donates_history_desc)}
					</span>
					<div className={styles.content_wrapper}>
						<Table
							stripped
							className={cn(styles.table, { [styles.mobile]: mobile })}
							header={!mobile ? headerOptions : undefined}
						>
							{isFetching ? (
								<LoadingSpinner />
							) : latestDonations && latestDonations.results.length ? (
								latestDonations.results.map((donate, i) => (
									<ListingHistoryDonateRow key={i} donate={donate} />
								))
							) : (
								<div className={pageStyles.table_row}>
									{formatMessage(common_messages.no_match_search)}
								</div>
							)}
						</Table>
						{latestDonations && latestDonations.count > 1 && (
							<Pagination
								onChange={setPage}
								count={Math.ceil(latestDonations.count / PAGE_SIZE)}
								page={page}
							/>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default observer(SocialListingDonatesHistory);
