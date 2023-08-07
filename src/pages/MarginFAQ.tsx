import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import { PageHeader, FAQ } from "components/MarginFAQ";
import styles from "styles/pages/Page.module.scss";
import { getPageTitle } from "helpers/global";

const MarginFAQ: React.FC = () => (
	<MainLayout>
		<Helmet>
			<title>{getPageTitle("Margin Trading FAQ")}</title>
			<meta name="description" content={getPageTitle("Margin Trading FAQ")} />
		</Helmet>
		<PageHeader />
		<div className={styles.content}>
			<FAQ />
		</div>
	</MainLayout>
);

export default MarginFAQ;
