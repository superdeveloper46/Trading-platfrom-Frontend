import React from "react";
import classnames from "classnames";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { Navigate, Route, Routes } from "react-router";
import { PathRouteProps } from "react-router/dist/lib/components";

import MainLayout from "layouts/MainLayout";
import styles from "styles/pages/CoinInfo.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import messages from "messages/coin_info";
import { getPageTitle } from "helpers/global";
import Header from "components/CoinInfo/Header";
import AllCoins from "components/CoinInfo/AllCoins";
import Popular from "components/CoinInfo/Popular";
import Recent from "components/CoinInfo/Recent";
import Leaders from "components/CoinInfo/Leaders";
import WorldTrades from "components/CoinInfo/WorldTrades";
import CoinInfoTabs from "components/CoinInfo/CoinInfoTabs";
import Highlights from "components/CoinInfo/Highlights";
import { URL_VARS, routes } from "constants/routing";

const CoinInfo: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.coin_info_header));

	const routesProps: PathRouteProps[] = [
		{
			path: URL_VARS.POPULAR,
			element: <Popular />,
		},
		{
			path: URL_VARS.RECENT,
			element: <Recent />,
		},
		{
			path: URL_VARS.LEADERS,
			element: <Leaders />,
		},
		{
			path: URL_VARS.WORLD_TRADES,
			element: <WorldTrades />,
		},
		{
			path: URL_VARS.DEAD_END_ROUTE,
			element: <Navigate to={routes.coin.root} />,
		},
	];

	return (
		<MainLayout>
			<Helmet title={title} meta={[{ name: "description", content: title }]} />
			<Header />
			<Highlights />
			<CoinInfoTabs />
			<div
				className={classnames(
					pageStyles.content,
					pageStyles.transparent,
					pageStyles.from_start,
					styles.page_content,
				)}
			>
				<Routes>
					<Route path={URL_VARS.ROOT} element={<AllCoins />} />
					{routesProps.map((props, i) => (
						<Route key={i} {...props} />
					))}
				</Routes>
			</div>
		</MainLayout>
	);
};

export default CoinInfo;
