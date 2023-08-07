import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import historyMessages from "messages/history";
import Tabs from "components/UI/Tabs";
import Tab from "components/UI/Tab";
import { OrdersHistoryTypeEnum } from "types/exchange";
import OpenedOrders from "./OpenedOrders";
import ClosedOrders from "./ClosedOrders";

interface Props {
	show: boolean;
	hide: () => void;
}

const AllOrdersWindow: React.FC<Props> = ({ show, hide }) => {
	const { formatMessage } = useIntl();
	const [activeType, setActiveType] = useState<OrdersHistoryTypeEnum>(OrdersHistoryTypeEnum.OPENED);

	const handleTabsChange = (name: string) => {
		setActiveType(name as OrdersHistoryTypeEnum);
	};

	const handleHide = (): void => {
		hide();
	};

	return (
		<div className={cn(styles.all_modal_wrapper, show && styles.show)}>
			<div className={styles.all_modal_service_row}>
				<button className={styles.all_modal_close_button} type="button" onClick={handleHide}>
					<i className={cn(styles.all_modal_back_icon, "ai ai-chevron_left")} />
				</button>
				<span className={styles.all_modal_title}>
					{formatMessage(historyMessages.all_orders_window_title)}
				</span>
				<div className={styles.all_modal_void} />
			</div>
			<Tabs className={styles.widget_tabs}>
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
			</Tabs>
			<div className={styles.all_modal_orders_wrapper}>
				{activeType === OrdersHistoryTypeEnum.CLOSED ? (
					<ClosedOrders modal />
				) : (
					<OpenedOrders modal />
				)}
			</div>
		</div>
	);
};

export default AllOrdersWindow;
