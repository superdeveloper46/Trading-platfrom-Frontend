import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Competitions.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import competitionsMessages from "messages/competitions";
import { useIntl } from "react-intl";
import Header from "components/Competitions/Header";
import cn from "classnames";
import { getPageTitle } from "helpers/global";
import FAQ from "../components/Competitions/FAQ";
import Description from "../components/Competitions/Description";
import CompetitionsList from "../components/Competitions/CompetitionsList";

const Competitions: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(competitionsMessages.trading_competition));
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
			<Header />
			<div className={styles.content_wrapper}>
				<div className={pageStyles.page_container_outer}>
					<div className={cn(pageStyles.content, pageStyles.transparent, pageStyles.noPadding)}>
						<CompetitionsList />
						<Description />
						<FAQ />
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Competitions;
