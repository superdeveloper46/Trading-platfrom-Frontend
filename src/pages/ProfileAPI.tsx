import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";

import ProfileLayout from "layouts/ProfileLayout";
import Api, { EditApiKey } from "components/Profile/API";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { getPageTitle } from "helpers/global";
import { URL_VARS } from "constants/routing";

const Router = () => (
	<Routes>
		<Route path={URL_VARS.ROOT} element={<Api />} />
		<Route path={`/:${URL_VARS.SLUG}`} element={<EditApiKey />} />
	</Routes>
);

const ProfileAPI: React.FC = () => {
	const title = getPageTitle("API");

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.API}>
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
			<Router />
		</ProfileLayout>
	);
};

export default ProfileAPI;
