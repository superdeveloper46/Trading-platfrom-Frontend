import React from "react";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "layouts/MainLayout";
import styles from "styles/pages/Page.module.scss";
import { getPageTitle } from "helpers/global";
import { Tabs, PageHeader, Plans, Positions, Interests } from "components/Staking";
import { URL_VARS } from "constants/routing";

const Staking: React.FC = () => {
	const headerTitle = getPageTitle("Alpha Staking");

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.PLANS,
			element: <Plans />,
		},
		{
			path: URL_VARS.POSITIONS_ACTIVE,
			element: <Positions type="active" />,
		},
		{
			path: URL_VARS.POSITIONS_HISTORY,
			element: <Positions type="history" />,
		},
		{
			path: URL_VARS.PAYMENT_HISTORY,
			element: <Interests />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={URL_VARS.PLANS} />,
		},
	];

	return (
		<MainLayout>
			<Helmet
				title={headerTitle}
				meta={[
					{ name: "description", content: headerTitle },
					{ property: "og:title", content: headerTitle },
					{ property: "twitter:title", content: headerTitle },
					{ property: "og:description", content: headerTitle },
					{ name: "twitter:description", content: headerTitle },
				]}
			/>
			<PageHeader />
			<div className={styles.content}>
				<Tabs />
				<Routes>
					{routesProps.map((props, i) => (
						<Route key={i} {...props} />
					))}
				</Routes>
			</div>
		</MainLayout>
	);
};
export default Staking;
