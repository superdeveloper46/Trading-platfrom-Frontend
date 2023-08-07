import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "layouts/AuthLayout";
import { LayoutRouteProps, PathRouteProps } from "react-router/dist/lib/components";

import { DepositFailed, DepositSuccess } from "components/DepositResult";
import { URL_VARS } from "constants/routing";
import NotFound from "./NotFound";
import ConfirmWithdrawal from "./ConfirmWithdrawal";

const ConfirmPages = () => {
	const routesProps: (PathRouteProps | LayoutRouteProps)[] = [
		{
			path: URL_VARS.DEPOSIT_SUCCESS,
			element: <DepositSuccess />,
		},
		{
			path: URL_VARS.DEPOSIT_FAILED,
			element: <DepositFailed />,
		},
		{
			path: `${URL_VARS.WITHDRAW}/:${URL_VARS.SLUG}`,
			element: <ConfirmWithdrawal />,
		},
		{
			element: <NotFound />,
		},
	];

	return (
		<AuthLayout>
			<Routes>
				{routesProps.map((props, i) => (
					<Route key={i} {...props} />
				))}
			</Routes>
		</AuthLayout>
	);
};

export default ConfirmPages;
