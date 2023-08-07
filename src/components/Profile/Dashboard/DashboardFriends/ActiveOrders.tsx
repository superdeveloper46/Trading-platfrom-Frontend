import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import styles from "styles/components/Profile/Dashboard/ActiveOrders.module.scss";
import historyMessages from "messages/history";
import useWindowSize from "hooks/useWindowSize";
import { RowSkeleton, Table } from "components/UI/Table";
import { IHeaderColumn } from "components/UI/Table/Table";
import { IOrder } from "models/History";
import commonMessages from "messages/common";
import NoRowsMessage from "components/Table/NoRowsMessage";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { useMst } from "models/Root";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";
import ActiveOrderRow from "./ActiveOrderRow";
import ActiveOrderMobileRow from "./ActiveOrderMobileRow";
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from "../DashboardCard";

const ActiveOrders: React.FC = () => {
	const { formatMessage } = useIntl();
	const { mobile, desktop } = useWindowSize();
	const [isLoading, setLoading] = useState(false);
	const [orders, setOrders] = useState<IOrder[]>([]);

	const {
		history: { openedOrders, triggerOrders, loadOpenedOrders, openedOrdersCount },
	} = useMst();

	useEffect(() => {
		loadOpenedOrders();
	}, []);

	useEffect(() => {
		setOrders([...openedOrders, ...triggerOrders]);
	}, [openedOrders.length, triggerOrders.length]);

	const reload = async () => {
		try {
			setLoading(true);
			await loadOpenedOrders();
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardCard>
			<DashboardCardHeader link={routes.history.activeOrders}>
				<DashboardCardTitle>
					{formatMessage(historyMessages.active_orders)}&nbsp;(
					{openedOrdersCount}){mobile && <i className="ai ai-chevron_right" />}
				</DashboardCardTitle>
				{!mobile && <i className="ai ai-chevron_right" />}
			</DashboardCardHeader>
			{desktop ? (
				<Table
					header={{
						columns,
						primary: true,
					}}
					className={styles.table_container}
				>
					{isLoading ? (
						<RowSkeleton cells={columns} />
					) : orders.length > 0 ? (
						orders.map((order, index) => (
							<ActiveOrderRow key={index} order={order} onOrderClosed={reload} />
						))
					) : (
						<NoRowsMessage>
							<i className="ai ai-dok_empty" />
							{formatMessage(commonMessages.active_orders_no_data)}
						</NoRowsMessage>
					)}
				</Table>
			) : (
				<div className={styles.list_mobile_container}>
					{isLoading ? (
						<LoadingSpinner />
					) : orders.length > 0 ? (
						orders.map((order, index) => (
							<ActiveOrderMobileRow key={index} order={order} onOrderClosed={reload} />
						))
					) : (
						<NoRowsMessage>
							<i className="ai ai-dok_empty" />
							{formatMessage(commonMessages.active_orders_no_data)}
						</NoRowsMessage>
					)}
				</div>
			)}
		</DashboardCard>
	);
};

export default ActiveOrders;

const columns: IHeaderColumn[] = [
	{
		label: "Pair/Date",
	},
	{
		label: "Type/Side/Trigger",
	},
	{
		label: "Price/Amount",
		align: "right",
	},
	{
		label: "Total/Filled",
		align: "right",
	},
	{
		label: "Cancel order",
		align: "right",
	},
];
