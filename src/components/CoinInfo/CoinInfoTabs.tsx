import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import cn from "classnames";

import messages from "messages/coin_info";
import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import styles from "styles/components/CoinInfo.module.scss";
import { routes } from "constants/routing";
import Tabs from "components/UI/Tabs";

const tabs = [
	{
		link: routes.coin.root,
		message: messages.coin_info_all_coins,
	},
	{
		link: routes.coin.popular,
		message: messages.coin_info_trending_coins,
		disabled: true,
	},
	{
		link: routes.coin.recent,
		message: messages.coin_info_recently_added,
		disabled: true,
	},
	{
		link: routes.coin.leaders,
		message: messages.coin_info_leaders_losers,
	},
	{
		link: routes.coin.worldTrades,
		message: messages.coin_info_traded,
		disabled: true,
	},
];

const CoinInfoTabs: React.FC = () => {
	const {
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();
	return (
		<div className={styles.container}>
			<div className={styles.tabs_content}>
				<Tabs chip className={cn(styles.tabs, styles.overflowAuto)}>
					{tabs.map(({ message, link, disabled }) => (
						<Tab
							key={link}
							chip
							label={formatMessage(message)}
							link={link}
							isActive={pathname === `/${locale}${link}`}
							disabled={disabled}
						/>
					))}
				</Tabs>
			</div>
		</div>
	);
};

export default CoinInfoTabs;
