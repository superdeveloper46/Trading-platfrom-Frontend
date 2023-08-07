import React from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Navigate, Route, Routes } from "react-router";

import messages from "messages/common";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import SettingsGeneral from "components/Profile/Settings/SettingsGeneral";
import LanguageInterface from "components/Profile/Settings/LanguageInterface";
import LanguageContent from "components/Profile/Settings/LanguageContent";
import InterfaceTheme from "components/Profile/Settings/InterfaceTheme";
import TerminalLayoutSetting from "components/Profile/Settings/TerminalLayoutSetting";
import NotificationSettings from "components/Profile/Settings/NotificationSettings";
import LanguageNotification from "components/Profile/Settings/LanguageNotification";
import { getPageTitle } from "helpers/global";
import { URL_VARS, routes } from "constants/routing";
import { useMst } from "models/Root";

const Router = () => {
	const { render } = useMst();

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: <SettingsGeneral />,
		},
		{
			path: URL_VARS.LANGUAGE_INTERFACE,
			element: <LanguageInterface />,
		},
		{
			path: URL_VARS.INTERFACE_THEME,
			element: <InterfaceTheme />,
		},
		{
			path: URL_VARS.TERMINAL_LAYOUT,
			element: <TerminalLayoutSetting />,
		},
		{
			path: URL_VARS.NOTIFICATIONS,
			element: <NotificationSettings />,
		},
		{
			path: `${URL_VARS.NOTIFICATIONS}/${URL_VARS.LANGUAGE}`,
			element: <LanguageNotification />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.settings.root} />,
		},
	];

	if (render.stories) {
		routesProps.push({
			path: URL_VARS.LANGUAGE_CONTENT,
			element: <LanguageContent />,
		});
	}

	return (
		<Routes>
			{routesProps.map((props, i) => (
				<Route key={i} {...props} />
			))}
		</Routes>
	);
};

const ProfileSettings: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.settings));

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
			<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Verification}>
				<Router />
			</ProfileLayout>
		</>
	);
};

export default ProfileSettings;
