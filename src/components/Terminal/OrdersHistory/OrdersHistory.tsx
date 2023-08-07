import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import historyMessages from "messages/history";
import styles from "styles/pages/Terminal.module.scss";
import { OrdersHistoryTypeEnum } from "types/exchange";
import useAccountType from "hooks/useAccountType";
import { AccountTypeEnum } from "types/account";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";
import OpenedOrders from "./OpenedOrders";
import ClosedOrders from "./ClosedOrders";
import TriggerOrders from "./TriggerOrders";
import Options from "./Options";
import Funds from "./Funds";

const OrdersHistory: React.FC = () => {
	const {
		render,
		global: { isAuthenticated },
		history: { openedOrders, triggerOrders },
	} = useMst();
	const { formatMessage } = useIntl();
	const type = useAccountType();
	const [ordersType, setOrdersType] = useState<OrdersHistoryTypeEnum>(OrdersHistoryTypeEnum.OPENED);

	const handleTabsChange = (name: string) => {
		setOrdersType(name as OrdersHistoryTypeEnum);
	};

	useEffect(() => {
		if (type === AccountTypeEnum.SPOT) {
			setOrdersType(OrdersHistoryTypeEnum.OPENED);
		}
	}, [type]);

	const renderTable = () => {
		switch (ordersType) {
			case OrdersHistoryTypeEnum.TRIGGER:
				return <TriggerOrders />;
			case OrdersHistoryTypeEnum.CLOSED:
				return <ClosedOrders />;
			case OrdersHistoryTypeEnum.FUNDS:
				return <Funds />;
			default:
				return <OpenedOrders />;
		}
	};

	return (
		<div className={cn(styles.widget, styles.orders_history_widget)}>
			<div className={styles.orders_history_container}>
				<div className={cn(styles.tabs, styles.orders_history_widget_tabs)}>
					<Tab
						className={styles.orders_history_widget_tab}
						isActive={ordersType === OrdersHistoryTypeEnum.OPENED}
						name={OrdersHistoryTypeEnum.OPENED}
						onClick={handleTabsChange}
						label={`${formatMessage(historyMessages.active_orders)}${
							openedOrders.length > 0 ? ` (${openedOrders.length})` : ""
						}`}
					/>
					<Tab
						className={styles.orders_history_widget_tab}
						isActive={ordersType === OrdersHistoryTypeEnum.TRIGGER}
						name={OrdersHistoryTypeEnum.TRIGGER}
						onClick={handleTabsChange}
						label={`${formatMessage(historyMessages.trigger_orders)}${
							triggerOrders.length > 0 ? ` (${triggerOrders.length})` : ""
						}`}
					/>
					<Tab
						className={styles.orders_history_widget_tab}
						isActive={ordersType === OrdersHistoryTypeEnum.CLOSED}
						name={OrdersHistoryTypeEnum.CLOSED}
						onClick={handleTabsChange}
						label={formatMessage(historyMessages.order_history)}
					/>
					{render.margin && type !== AccountTypeEnum.SPOT && (
						<Tab
							className={styles.orders_history_widget_tab}
							isActive={ordersType === OrdersHistoryTypeEnum.FUNDS}
							name={OrdersHistoryTypeEnum.FUNDS}
							onClick={handleTabsChange}
							label={formatMessage(historyMessages.funds)}
						/>
					)}
				</div>
				{isAuthenticated &&
					[OrdersHistoryTypeEnum.OPENED, OrdersHistoryTypeEnum.TRIGGER].includes(ordersType) && (
						<Options />
					)}
			</div>
			{renderTable()}
			{isAuthenticated && ordersType !== OrdersHistoryTypeEnum.FUNDS && (
				<InternalLink
					className={styles.orders_history_whole_history}
					to={
						ordersType === OrdersHistoryTypeEnum.OPENED
							? routes.history.activeOrders
							: routes.history.closedOrders
					}
				>
					{formatMessage(historyMessages.whole_history)}
					<i className="ai ai-chevron_right" />
				</InternalLink>
			)}
		</div>
	);
};

export default observer(OrdersHistory);
