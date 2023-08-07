import React, { useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { PathRouteProps } from "react-router/dist/lib/components";
import { observer } from "mobx-react-lite";
import { Navigate, Route } from "react-router";

import historyMessages from "messages/history";
import { useMst } from "models/Root";
import styles from "styles/pages/FinanceHistory.module.scss";
import Tab from "components/UI/Tab";
import Tabs from "components/UI/Tabs";
import Withdraws from "components/Withdraws";
import Deposits from "components/Deposits";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { routes, URL_VARS } from "constants/routing";
import ProfileLayout from "layouts/ProfileLayout";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { TFinanceHistoryType } from "types/routing";

const Router = () => {
	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: <Deposits />,
		},
		{
			path: URL_VARS.DEPOSITS,
			element: <Deposits />,
		},
		{
			path: URL_VARS.WITHDRAWS,
			element: <Withdraws />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.financeHistory.root} />,
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

const FinanceHistory: React.FC = () => {
	const {
		global: { locale },
	} = useMst();
	const localeNavigate = useLocaleNavigate();
	const { pathname } = useLocation();
	const initialTab: TFinanceHistoryType = (pathname.split(
		`/${locale}${routes.financeHistory.root}/`,
	)[1] || URL_VARS.DEPOSITS) as TFinanceHistoryType;
	const [activeTab, setActiveTab] = useState<TFinanceHistoryType>(initialTab);
	const { formatMessage } = useIntl();

	const handleTabChange = (name: TFinanceHistoryType) => {
		setActiveTab(name);
		localeNavigate(routes.financeHistory.getType(name));
	};

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Wallets}>
			<div className={styles.profile_card}>
				<h1 className={styles.history_page_header}>{formatMessage(historyMessages.history)}</h1>
				<Tabs>
					<Tab
						className={styles.history_tab}
						isActive={activeTab === URL_VARS.DEPOSITS}
						onClick={() => handleTabChange(URL_VARS.DEPOSITS)}
					>
						{formatMessage(historyMessages.deposits)}
					</Tab>
					<Tab
						className={styles.history_tab}
						isActive={activeTab === URL_VARS.WITHDRAWS}
						onClick={() => handleTabChange(URL_VARS.WITHDRAWS)}
					>
						{formatMessage(historyMessages.withdraws)}
					</Tab>
				</Tabs>
				<Router />
			</div>
		</ProfileLayout>
	);
};

export default observer(FinanceHistory);
