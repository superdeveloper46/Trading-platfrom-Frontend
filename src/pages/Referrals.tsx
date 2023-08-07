import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { PathRouteProps } from "react-router/dist/lib/components";
import { Navigate, Route, Routes } from "react-router-dom";
import cn from "classnames";

import styles from "styles/pages/Page.module.scss";
import messages from "messages/referrals";
import {
	PageHeader,
	Refback,
	ReferralAccruals,
	ReferralInvites,
	ReferralsList,
	Stats,
	Tabs,
} from "components/Referrals";
import MainLayout from "layouts/MainLayout";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";

const Router = () => {
	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.ROOT,
			element: (
				<>
					<ReferralInvites />
					<ReferralsList />
				</>
			),
		},
		{
			path: URL_VARS.REFERRAL_ACCRUALS,
			element: <ReferralAccruals />,
		},
		{
			path: URL_VARS.REFBACK,
			element: <Refback />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.referrals.root} />,
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

const ReferralsContainer = () => {
	const { formatMessage } = useIntl();
	const { referrals } = useMst();

	useEffect(() => {
		referrals.loadReferralsInfo();
		referrals.loadReferralInvites();
		referrals.loadReferralsList({ [queryVars.page_size]: 15 });
	}, []);

	return (
		<MainLayout>
			<Helmet title={getPageTitle(formatMessage(messages.referrals))} />
			<PageHeader />
			<div className={cn(styles.content, styles.transparent, styles.low_padding)}>
				<Stats />
				<Tabs />
				<Router />
			</div>
		</MainLayout>
	);
};

export default observer(ReferralsContainer);
