import React from "react";
import { Navigate, Routes } from "react-router-dom";
import { Route } from "react-router";
import { PathRouteProps } from "react-router/dist/lib/components";

import ProfileLayout from "layouts/ProfileLayout";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";
import { URL_VARS } from "constants/routing";
import ActiveOrders from "./ActiveOrders";
import ClosedOrders from "./ClosedOrders";
import TradesHistory from "./TradesHistory";
import Borrows from "./Borrows";
import Repayments from "./Repayments";
import HistoryInterests from "./Interests";
import MarginTransfers from "./MarginTransfers";
import MarginCalls from "./MarginCalls";
import Liquidations from "./Liquidations";

const History: React.FC = () => {
	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ACTIVE_ORDERS,
			element: <ActiveOrders />,
		},
		{
			path: URL_VARS.CLOSED_ORDERS,
			element: <ClosedOrders />,
		},
		{
			path: URL_VARS.TRADES_HISTORY,
			element: <TradesHistory />,
		},
		...(config.isModuleOn(RenderModuleEnum.MARGIN)
			? [
					{
						path: URL_VARS.BORROWS,
						element: <Borrows />,
					},
					{
						path: URL_VARS.REPAYMENTS,
						element: <Repayments />,
					},
					{
						path: URL_VARS.INTERESTS,
						element: <HistoryInterests />,
					},
					{
						path: URL_VARS.TRANSFERS,
						element: <MarginTransfers />,
					},
					{
						path: URL_VARS.MARGIN_CALLS,
						element: <MarginCalls />,
					},
					{
						path: URL_VARS.LIQUIDATIONS,
						element: <Liquidations />,
					},
			  ]
			: []),
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={URL_VARS.ACTIVE_ORDERS} />,
		},
	];

	return (
		<ProfileLayout>
			<Routes>
				{routesProps.map((props, i) => (
					<Route key={i} {...props} />
				))}
			</Routes>
		</ProfileLayout>
	);
};

export default History;
