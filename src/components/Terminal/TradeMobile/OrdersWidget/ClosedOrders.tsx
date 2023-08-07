import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/TerminalMobile.module.scss";
import commonMessages from "messages/common";
import dayjs, { transformDate } from "utils/dayjs";
import { MobileFilterOrderSideEnum } from "types/exchange";
import { OrderSideEnum, OrderStatusEnum } from "types/orders";
import LoadingSpinner from "components/UI/LoadingSpinner";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { IHistoryOrder } from "models/History";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import HistoryOrdersFilterOverlay from "./HistoryOrdersFilterOverlay";
import ClosedOrder from "./ClosedOrder";
import ShowAllOrdersButton from "./ShowAllOrdersButton";

interface Props {
	modal?: boolean;
}

const ClosedOrders: React.FC<Props> = ({ modal }) => {
	const {
		history: { closedOrders, isClosedOrdersLoading, loadClosedOrders },
		terminal: { pair },
	} = useMst();
	const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(false);
	const [typeFilterState, setTypeFilterState] = useState<string>("all");
	const [timeFilterState, setTimeFilterState] = useState<string>("months");
	const [canceledFilterState, setCanceledFilterState] = useState<boolean>(false);
	const [pairSymbolState, setPairSymbolState] = useState<string>("");
	const [pairLabelState, setPairLabelState] = useState<string>("");
	const { formatMessage } = useIntl();

	useEffect(() => {
		setPairSymbolState(pair?.symbol ?? "");
		setPairLabelState(pair?.label ?? "");
	}, [pair?.symbol]);

	useEffect(() => {
		loadClosedOrders({ [queryVars.pair]: pairSymbolState, [queryVars.page_size]: 100 });
	}, [pairSymbolState]);

	const showFilter = (): void => {
		setShowFilterOverlay(true);
	};

	const hideFilter = (): void => {
		setShowFilterOverlay(false);
	};

	const typeFilterFunction = (order: IHistoryOrder): boolean => {
		switch (typeFilterState) {
			case MobileFilterOrderSideEnum.SELL:
				return order.side === OrderSideEnum.SELL;
			case MobileFilterOrderSideEnum.BUY:
				return order.side === OrderSideEnum.BUY;
			default:
				return true;
		}
	};

	const cancelledFilterFunction = (order: IHistoryOrder): boolean => {
		switch (canceledFilterState) {
			case true:
				return order.status !== OrderStatusEnum.CANCELLED;
			default:
				return (
					order.status === OrderStatusEnum.FILLED ||
					order.status === OrderStatusEnum.CANCELLED ||
					order.status === OrderStatusEnum.PARTIAL_CANCELED ||
					order.status === OrderStatusEnum.PARTIAL_CANCELLED
				);
		}
	};

	const timeFilterFunction = (order: IHistoryOrder): boolean => {
		const day = 1;
		const sevenDays = 7;
		const month = 30;
		const sevenMonths = 210;

		let startDate = dayjs();
		const orderDate = dayjs(transformDate(order.date));

		switch (timeFilterState) {
			case "day":
				startDate = startDate.subtract(day, "days");
				return orderDate >= startDate;
			case "days":
				startDate = startDate.subtract(sevenDays, "days");
				return orderDate >= startDate;
			case "month":
				startDate = startDate.subtract(month, "days");
				return orderDate >= startDate;
			case "months":
				startDate = startDate.subtract(sevenMonths, "days");
				return orderDate >= startDate;
			default:
				return false;
		}
	};

	const changeFilterState = (
		timeFilterState: string,
		typeFilterState: string,
		hideCanceled: boolean,
		pairSymbolState: string,
		pairLabelState: string,
	): void => {
		setTypeFilterState(typeFilterState);
		setTimeFilterState(timeFilterState);
		setCanceledFilterState(hideCanceled);
		setPairSymbolState(pairSymbolState);
		setPairLabelState(pairLabelState);
	};

	return (
		<>
			{modal ? (
				<div className={styles.history_tab_filter_row}>
					<div className={styles.history_filter_button} onClick={showFilter}>
						<div className={styles.history_tab_filter_title}>
							{formatMessage(commonMessages.active_orders_apply_filter)}
						</div>
						<i className={cn(styles.active_orders_filter_icon, "ai ai-filter")} />
					</div>
				</div>
			) : null}

			{isClosedOrdersLoading ? (
				<LoadingSpinner verticalMargin="30px" />
			) : closedOrders.length ? (
				modal ? (
					closedOrders
						.filter(typeFilterFunction)
						.filter(cancelledFilterFunction)
						.filter(timeFilterFunction)
						.map((order: IHistoryOrder) => <ClosedOrder key={order.id} order={order} />)
				) : (
					closedOrders
						.slice(0, 2)
						.map((order: IHistoryOrder) => <ClosedOrder key={order.id} order={order} />)
				)
			) : (
				<NoRowsMessage small>
					<i className="ai ai-dok_empty" />
					<span>{formatMessage(commonMessages.orders_history_no_data)}</span>
				</NoRowsMessage>
			)}

			{!modal && closedOrders.length ? <ShowAllOrdersButton /> : null}

			{showFilterOverlay ? (
				<HistoryOrdersFilterOverlay
					show={showFilterOverlay}
					changeFilterState={(
						timeFilterState: string,
						typeFilterState: string,
						hideCanceled: boolean,
						pairSymbolState: string,
						pairLabelState: string,
					) =>
						changeFilterState(
							timeFilterState,
							typeFilterState,
							hideCanceled,
							pairSymbolState,
							pairLabelState,
						)
					}
					back={hideFilter}
					typeState={typeFilterState}
					cancelledState={canceledFilterState}
					timeState={timeFilterState}
					pairSymbol={pairSymbolState}
					pairLabel={pairLabelState}
				/>
			) : null}
		</>
	);
};

export default observer(ClosedOrders);
