import React from "react";
import { Helmet } from "react-helmet";

import MainLayout from "layouts/MainLayout";
import { Header, WhyWe, Footer, HowItWorks } from "components/Listing";
import styles from "styles/pages/Listing.module.scss";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const Listing: React.FC = () => {
	const localeNavigate = useLocaleNavigate();

	const openListingForm = () => {
		localeNavigate(routes.listing.request);
	};

	return (
		<MainLayout>
			<Helmet>
				<title>Listing</title>
				<meta name="description" content="Listing" />
			</Helmet>
			<div className={styles.container}>
				<Header onFillFormClick={openListingForm} />
				<WhyWe />
				<HowItWorks />
				<Footer onFillFormClick={openListingForm} />
			</div>
		</MainLayout>
	);
};

export default Listing;
