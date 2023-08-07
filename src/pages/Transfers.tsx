import React from "react";
import { useIntl } from "react-intl";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate } from "react-router";
import { observer } from "mobx-react-lite";

import financeMessages from "messages/finance";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import InternalTransfers from "components/InternalTransfers/InternalTransfers";
import CreateTransferForm from "components/InternalTransfers/CreateTransferForm";
import TransferHistory from "components/InternalTransfers/TransferHistory";
import AcceptTransferForm from "components/InternalTransfers/AcceptTransferForm";
import { getPageTitle } from "helpers/global";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { routes, URL_VARS } from "constants/routing";

const Transfers: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(financeMessages.transfer));

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: <InternalTransfers />,
		},
		{
			path: URL_VARS.CREATE,
			element: <CreateTransferForm />,
		},
		{
			path: `:${URL_VARS.TXID}/${URL_VARS.APPLY}`,
			element: <AcceptTransferForm />,
		},
		{
			path: URL_VARS.HISTORY,
			element: <TransferHistory />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.transfers.root} />,
		},
	];

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Transfer}>
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
			<Routes>
				{routesProps.map((props, i) => (
					<Route key={i} {...props} />
				))}
			</Routes>
			<WebSocket events={[WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(Transfers);
