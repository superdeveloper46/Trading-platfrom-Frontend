import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PathRouteProps } from "react-router/dist/lib/components";

import ProfileLayout from "layouts/ProfileLayout";
import { useMst } from "models/Root";
import { URL_VARS } from "constants/routing";
import Balance from "./Balance";
import BalanceDetails from "./BalanceDetails";
import OrderManagement from "./OrderManagement";
import AccountManagement from "./AccountManagement";
import SubAuthenticator from "./SubAuthenticator";
import ApiManagement from "./ApiManagement";
import SubAccountApiManagement from "./SubAccountApiManagement";
import EditSubApi from "./EditSubApi";
import CreateSubApi from "./CreateSubApi";
import CreateSubTransfer from "./CreateSubTransfer";
import TransferHistory from "./TransferHistory";
import LoginHistory from "./LoginHistory";
import CreateSubAccount from "./CreateSubAccount";

const SubAccounts: React.FC = () => {
	const {
		subAccounts: { getSubAccounts },
	} = useMst();

	useEffect(() => {
		getSubAccounts();
	}, []);

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.BALANCE,
			element: <Balance />,
		},
		{
			path: `${URL_VARS.BALANCE}/:${URL_VARS.UID}`,
			element: <BalanceDetails />,
		},
		{
			path: URL_VARS.ORDER_MANAGEMENT,
			element: <OrderManagement />,
		},
		{
			path: URL_VARS.ACCOUNT_MANAGEMENT,
			element: <AccountManagement />,
		},
		{
			path: `${URL_VARS.ACCOUNT_MANAGEMENT}/${URL_VARS.AUTHENTICATOR}`,
			element: <SubAuthenticator />,
		},
		{
			path: URL_VARS.API_MANAGEMENT,
			element: <ApiManagement />,
		},
		{
			path: `${URL_VARS.API_MANAGEMENT}/:${URL_VARS.UID}`,
			element: <SubAccountApiManagement />,
		},
		{
			path: `${URL_VARS.API_MANAGEMENT}/:${URL_VARS.UID}/${URL_VARS.EDIT}`,
			element: <EditSubApi />,
		},
		{
			path: `${URL_VARS.API_MANAGEMENT}/${URL_VARS.CREATE}`,
			element: <CreateSubApi />,
		},
		{
			path: URL_VARS.TRANSFER,
			element: <CreateSubTransfer />,
		},
		{
			path: URL_VARS.TRANSFER_HISTORY,
			element: <TransferHistory />,
		},
		{
			path: URL_VARS.LOGIN_HISTORY,
			element: <LoginHistory />,
		},
		{
			path: URL_VARS.CREATE,
			element: <CreateSubAccount />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={URL_VARS.BALANCE} />,
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

export default observer(SubAccounts);
