import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import terminalStyles from "styles/pages/Terminal.module.scss";
import Tab from "components/UI/Tab";
import historyMessages from "messages/history";
import { OrdersHistoryTypeEnum } from "types/exchange";
import ActiveOrdersMobile from "./OpenedOrders";
import ClosedOrdersMobile from "./ClosedOrders";

const OrdersWidgetMobile: React.FC = () => {
	const { formatMessage } = useIntl();
	const [activeType, setActiveType] = useState<OrdersHistoryTypeEnum>(OrdersHistoryTypeEnum.OPENED);

	const handleTabsChange = (name: string) => {
		setActiveType(name as OrdersHistoryTypeEnum);
	};

	return (
		<>
			<div className={cn(terminalStyles.tabs, styles.widget_tabs)}>
				<Tab
					className={styles.orders_history_widget_tab}
					isActive={activeType === OrdersHistoryTypeEnum.OPENED}
					name={OrdersHistoryTypeEnum.OPENED}
					onClick={handleTabsChange}
					label={formatMessage(historyMessages.active_orders)}
				/>
				<Tab
					className={styles.orders_history_widget_tab}
					isActive={activeType === OrdersHistoryTypeEnum.CLOSED}
					name={OrdersHistoryTypeEnum.CLOSED}
					onClick={handleTabsChange}
					label={formatMessage(historyMessages.order_history)}
				/>
			</div>
			{activeType === OrdersHistoryTypeEnum.OPENED ? (
				<ActiveOrdersMobile />
			) : (
				<ClosedOrdersMobile />
			)}
		</>
	);
};

export default OrdersWidgetMobile;
