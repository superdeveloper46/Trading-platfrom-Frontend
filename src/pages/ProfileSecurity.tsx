import React from "react";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Navigate, Route, Routes } from "react-router";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";

import messages from "messages/common";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import SecurityGeneral from "components/Profile/Security/SecurityGeneral";
import SecuritySessionList from "components/Profile/Security/SecuritySessionList";
import SecurityAuthenticator from "components/Profile/Security/SecurityAuthenticator";
import { getPageTitle } from "helpers/global";
import { routes, URL_VARS } from "constants/routing";

const Router = () => {
	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: <SecurityGeneral />,
		},
		{
			path: URL_VARS.SESSIONS,
			element: <SecuritySessionList />,
		},
		{
			path: URL_VARS.AUTHENTICATOR,
			element: <SecurityAuthenticator />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.security.root} />,
		},
	];

	return (
		<Routes>
			{routesProps.map((props, i) => (
				<Route key={i} {...props} />
			))}
		</Routes>
	);
};

const ProfileSecurity: React.FC = () => {
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
			<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Security}>
				<Router />
			</ProfileLayout>
		</>
	);
};

export default ProfileSecurity;
