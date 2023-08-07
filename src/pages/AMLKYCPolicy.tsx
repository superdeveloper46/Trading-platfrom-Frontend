import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Content.module.scss";
import { useQuery } from "react-query";
import ContentService from "services/ContentService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { getPageTitle } from "helpers/global";

const useContent = () =>
	useQuery(
		["aml-kyc-policy", null],
		async () => {
			const data = await ContentService.getAMLKYCPolicy();
			return data ?? [];
		},
		{ refetchOnWindowFocus: false },
	);

const AMLKYCPolicy: React.FC = () => {
	const { data: content, isLoading } = useContent();

	return (
		<MainLayout>
			<Helmet>
				<title>{getPageTitle("AML/KYC Policy")}</title>
				<meta name="description" content={getPageTitle("AML/KYC Policy")} />
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

export default AMLKYCPolicy;
