import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import stakingMessages from "messages/staking";
import styles from "styles/pages/Staking.module.scss";
import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import { routes } from "constants/routing";

const tabs = [
	{
		link: routes.staking.plans,
		message: stakingMessages.available,
	},
	{
		link: routes.staking.positionsActive,
		message: stakingMessages.active,
	},
	{
		link: routes.staking.positionsHistory,
		message: commonMessages.history,
	},
	{
		link: routes.staking.paymentHistory,
		message: stakingMessages.payment_history,
	},
];

const Tabs: React.FC = () => {
	const {
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();

	return (
		<div className={styles.container}>
			<div className={styles.tabs_content}>
				<div className={cn(styles.tabs, styles.overflowAuto)}>
					{tabs.map(({ message, link }) => (
						<Tab
							key={link}
							className={styles.tab}
							label={formatMessage(message)}
							link={link}
							isActive={pathname === `/${locale}${link}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default observer(Tabs);
