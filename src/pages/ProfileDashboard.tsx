import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";

import messages from "messages/common";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import Dashboard from "components/Profile/Dashboard/Dashboard";
import { getPageTitle } from "helpers/global";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { routes, URL_VARS } from "constants/routing";

const Router = () => (
	<Routes>
		<Route path={URL_VARS.ROOT} element={<Dashboard />} />
		<Route path={URL_VARS.DEAD_END_ROUTE} element={<Navigate to={routes.dashboard.root} />} />
	</Routes>
);

const ProfileDashboard: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.dashboard));

	return (
		<>
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
			<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Dashboard}>
				<Router />
				<WebSocket events={[WSListenEventEnum.WALLETS]} />
			</ProfileLayout>
		</>
	);
};

export default ProfileDashboard;
