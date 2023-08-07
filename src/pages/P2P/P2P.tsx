import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PathRouteProps } from "react-router/dist/lib/components";
import cookies from "js-cookie";

import { URL_VARS } from "constants/routing";
import { useMst } from "models/Root";
import MainLayout from "layouts/MainLayout";
import Header from "components/P2P/Header";
import TradingRequirementsModal from "components/P2P/modals/TradingRequirementsModal";
import styles from "styles/pages/P2P/P2P.module.scss";
import AuthenticatedRoute from "components/AuthenticatedRoute/AuthenticatedRoute";
import NotificationModal from "components/P2P/modals/NotificationModal";
import { COOKIE_ACCEPTED, COOKIE_P2P_SCAMMER_ATTENTION } from "constants/p2p";
import AdsPage from "./AdsPage";
import UserCenter from "./UserCenter";
import UserDetails from "./UserDetails";
import Orders from "./Orders";
import Ads from "./Ads";
import OrderDetails from "./OrderDetails";
import Merchant from "./Merchant";
import BecomeMerchant from "./BecomeMerchant";
import OrderCreate from "./OrderCreate";

const P2P: React.FC = () => {
	const {
		account: { profileStatus },
	} = useMst();

	const { pathname } = useLocation();

	const [isRequirementsModalOpened, toggleRequirementsModal] = useState(false);
	const [isNotificationModalOpened, toggleNotificationModal] = useState(false);

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.MAIN,
			element: <AdsPage />,
		},
		{
			path: URL_VARS.USER_CENTER,
			element: <UserCenter />,
		},
		{
			path: `${URL_VARS.USER_CENTER}/:${URL_VARS.ID}`,
			element: <UserDetails />,
		},
		{
			path: URL_VARS.ORDERS,
			element: <Orders />,
		},
		{
			path: URL_VARS.ADS,
			element: <Ads />,
		},
		{
			path: `${URL_VARS.ORDERS}/:${URL_VARS.ID}`,
			element: <OrderDetails />,
		},
		{
			path: URL_VARS.MERCHANT,
			element: <Merchant />,
		},
		{
			path: URL_VARS.BECOME_MERCHANT,
			element: <BecomeMerchant />,
		},
		// {
		// 	path: URL_VARS.EXPRESS,
		// 	element: <Express />,
		// },
		{
			path: URL_VARS.CREATE_ORDER,
			element: <OrderCreate />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={URL_VARS.MAIN} />,
		},
	];

	useEffect(() => {
		if (pathname.includes(URL_VARS.CREATE_ORDER)) {
			return;
		}
		toggleRequirementsModal(Boolean(profileStatus && !profileStatus.p2p_terms_accepted));
	}, [profileStatus?.p2p_terms_accepted]);

	useEffect(() => {
		if (!(cookies.get(COOKIE_P2P_SCAMMER_ATTENTION) === COOKIE_ACCEPTED)) {
			toggleNotificationModal(true);
		}
	}, []);

	return (
		<MainLayout>
			<div className={styles.container}>
				<Header />
				<Routes>
					{routesProps.map((props, i) => (
						<Route
							key={i}
							{...props}
							element={
								// @ts-ignore
								[URL_VARS.MAIN, URL_VARS.DEAD_END_ROUTE].includes(props.path) ? (
									props.element
								) : (
									<AuthenticatedRoute>{props.element}</AuthenticatedRoute>
								)
							}
						/>
					))}
				</Routes>
			</div>
			<TradingRequirementsModal
				isOpen={isRequirementsModalOpened}
				onClose={() => toggleRequirementsModal(false)}
			/>
			<NotificationModal
				isOpen={isNotificationModalOpened}
				onClose={() => toggleNotificationModal(false)}
			/>
		</MainLayout>
	);
};

export default observer(P2P);
