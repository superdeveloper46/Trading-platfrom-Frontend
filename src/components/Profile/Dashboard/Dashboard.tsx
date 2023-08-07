import useAutoFetch from "hooks/useAutoFetch";
import { observer } from "mobx-react-lite";
import { IProfileStatus } from "models/Account";
import { useMst } from "models/Root";
import React, { useEffect } from "react";
import styles from "styles/pages/ProfileDashboard.module.scss";
import DashboardActiveSession from "./DashboardActiveSessions";
import DashboardApi from "./DashboardApi";
import DashboardBalance from "./DashboardBalance";
import DashboardFeeLevel from "./DashboardFeeLevel";
import ActiveOrders from "./DashboardFriends/ActiveOrders";
import FriendsActivity from "./DashboardFriends/FriendsActivity";
import DashboardProfile from "./DashboardProfile";
import DashboardSecurity from "./DashboardSecurity";
import DashboardSupport from "./DashboardSupport";
import DashboardVerification from "./DashboardVerification";

const Dashboard: React.FC = () => {
	const {
		global: { isAuthenticated },
		account: {
			profileStatus,
			avatarColor,
			balances,
			balancesCross,
			balancesIsolated,
			rates,
			loadRates,
			isBalancesLoaded,
			isProfileStatusLoaded,
			loadProfileStatus,
		},
		tickers: { list: tickers, loadTickers },
		global: { isWSDown },
		render,
	} = useMst();

	useEffect(() => {
		loadRates();
		loadTickers();
	}, []);

	useAutoFetch(loadTickers, isWSDown);

	return (
		<div className={styles.container}>
			<DashboardProfile profileStatus={profileStatus as IProfileStatus} avatarColor={avatarColor} />
			<DashboardBalance
				tickers={tickers}
				rates={rates}
				balances={balances}
				balancesCross={balancesCross}
				balancesIsolated={balancesIsolated}
				isLoading={!isBalancesLoaded}
				isMarginActive={render.margin}
			/>
			<div className={styles.fee_level_container}>
				<DashboardFeeLevel
					balances={balances}
					balancesIsolated={balancesCross}
					balancesCross={balancesIsolated}
				/>
			</div>
			<DashboardSecurity
				profileStatus={profileStatus as IProfileStatus}
				isProfileLoading={!isProfileStatusLoaded}
				loadProfile={loadProfileStatus}
			/>
			<DashboardActiveSession />
			<div className={styles.friends_container}>
				<FriendsActivity />
				<ActiveOrders />
			</div>
			<DashboardApi />
			{!(isAuthenticated && profileStatus?.is_sub_account) && (
				<DashboardVerification profileStatus={profileStatus as IProfileStatus} />
			)}
			{render.supportCenter && <DashboardSupport />}
		</div>
	);
};

export default observer(Dashboard);
