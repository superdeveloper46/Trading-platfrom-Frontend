import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router";

import messages from "messages/common";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import VerificationLevels from "components/Profile/Verification/VerificationLevels";
import Identity from "components/Profile/Verification/Identity";
import Address from "components/Profile/Verification/Address";
import Finance from "components/Profile/Verification/Finance";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import { routes, URL_VARS } from "constants/routing";

const VerificationRouter = () => {
	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: <VerificationLevels />,
		},
		{
			path: URL_VARS.IDENTITY,
			element: <Identity />,
		},
		{
			path: URL_VARS.ADDRESS,
			element: <Address />,
		},
		{
			path: URL_VARS.FINANCE,
			element: <Finance />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.verification.root} />,
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

const ProfileVerification: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.verification));
	const {
		verification: { loadStates },
	} = useMst();

	useEffect(() => {
		loadStates();
	}, []);

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
				<VerificationRouter />
			</ProfileLayout>
		</>
	);
};

export default observer(ProfileVerification);
