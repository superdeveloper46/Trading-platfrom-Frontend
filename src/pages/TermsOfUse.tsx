import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Content.module.scss";
import { useTermsOfUse } from "services/ContentService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { getPageTitle } from "helpers/global";

const TermsOfUse: React.FC = () => {
	const { data: content, isLoading } = useTermsOfUse();
	const title = getPageTitle("Terms of use");

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

export default TermsOfUse;
