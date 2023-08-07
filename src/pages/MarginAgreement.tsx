import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Content.module.scss";
import { useMarginAgreement } from "services/ContentService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { getPageTitle } from "helpers/global";

const MarginAgreement: React.FC = () => {
	// TODO: Make 1 file for all documents rendering
	const { data: content, isLoading } = useMarginAgreement();
	const title = getPageTitle("Margin Agreement");

	return (
		<MainLayout>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={title} />
			</Helmet>
			<div className={styles.container}>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					// eslint-disable-next-line react/no-danger
					<div dangerouslySetInnerHTML={{ __html: content?.text }} />
				)}
			</div>
		</MainLayout>
	);
};

export default MarginAgreement;
