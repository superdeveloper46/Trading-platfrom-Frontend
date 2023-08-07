import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/TerminalMobile.module.scss";
import historyMessages from "messages/history";
import commonMessages from "messages/common";
import { MobileFilterOrderSideEnum } from "types/exchange";
import { OrderSideEnum } from "types/orders";
import LoadingSpinner from "components/UI/LoadingSpinner";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import ActiveOrder from "./OpenedOrder";
import OpenedOrdersFilterOverlay from "./OpenedOrdersFilterOverlay";
import ShowAllOrdersButton from "./ShowAllOrdersButton";
import CancelAllOrdersModal from "../../modals/CancelAllOrdersModal";

interface Props {
	modal?: boolean;
}

const ActiveOrdersMobile: React.FC<Props> = ({ modal }) => {
	const {
		history: { openedOrders, isOpenedOrdersLoading, openedOrdersPairLabels, loadOpenedOrders },
		terminal: { pair, showAllOpenedOrders },
	} = useMst();
	const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(false);
	const [filterValue, setFilterValue] = useState<MobileFilterOrderSideEnum>(
		MobileFilterOrderSideEnum.ALL,
	);
	const [isCancelAllModalOpen, setIsCancelAllModalOpen] = useState<boolean>(false);
	const [pairSymbolState, setPairSymbolState] = useState<string>("");
	const { formatMessage } = useIntl();

	useEffect(() => {
		loadOpenedOrders({ [queryVars.pair]: pairSymbolState, [queryVars.page_size]: 100 });
	}, [pairSymbolState]);

	useEffect(() => {
		setPairSymbolState(pair?.symbol ?? "");
	}, [pair?.symbol]);

	const handleCloseCancelAllModal = (): void => {
		setIsCancelAllModalOpen(false);
	};

	const handleOpenCancelAllModal = (): void => {
		setIsCancelAllModalOpen(true);
	};

	const showFilter = (): void => {
		setShowFilterOverlay(true);
	};

	const changeFilterState = (nextState = MobileFilterOrderSideEnum.ALL): void => {
		setFilterValue(nextState as MobileFilterOrderSideEnum);
	};

	const hideFilter = (): void => {
		setShowFilterOverlay(false);
	};

	const orders = modal
		? openedOrders
				.filter((order) => {
					switch (filterValue) {
						case MobileFilterOrderSideEnum.SELL:
							return order.side === OrderSideEnum.SELL;
						case MobileFilterOrderSideEnum.BUY:
							return order.side === OrderSideEnum.BUY;
						default:
							return true;
					}
				})
				.map((order) => <ActiveOrder key={order.id} order={order} />)
		: openedOrders.slice(0, 2).map((order) => <ActiveOrder key={order.id} order={order} />);

	const filterTitle = () => (
		<span className={styles.active_orders_filter_text}>
			{formatMessage(
				filterValue === MobileFilterOrderSideEnum.SELL
					? commonMessages.active_orders_sell
					: filterValue === MobileFilterOrderSideEnum.BUY
					? commonMessages.active_orders_buy
					: historyMessages.all_orders_window_title,
			)}
		</span>
	);

	return (
		<>
			{modal && openedOrders.length ? (
				<div className={styles.all_modal_filter_row}>
					<div className={styles.active_orders_filter_wrapper} onClick={showFilter}>
						<i className={cn(styles.active_orders_filter_icon, "ai ai-filter")} />
						{filterTitle()}
						<div className={styles.active_orders_arrow_icon} />
					</div>
					<button
						className={styles.all_modal_cancel_all_button}
						type="button"
						onClick={handleOpenCancelAllModal}
					>
						<span className={styles.all_modal_cancel_all_text}>
							{formatMessage(historyMessages.cancel_all)}
						</span>
						<i className={cn(styles.cancel_all_icon, "ai ai-error_outlined")} />
					</button>
				</div>
			) : null}

			{isOpenedOrdersLoading ? <LoadingSpinner verticalMargin="30px" /> : orders}

			{!openedOrders.length ? (
				<NoRowsMessage small>
					<i className="ai ai-dok_empty" />
					<span>{formatMessage(commonMessages.active_orders_no_data)}</span>
				</NoRowsMessage>
			) : null}

			{!modal && openedOrders.length ? <ShowAllOrdersButton /> : null}

			{showFilterOverlay ? (
				<OpenedOrdersFilterOverlay
					show={showFilterOverlay}
					changeFilterState={(nextFilterState) => changeFilterState(nextFilterState)}
					back={hideFilter}
					currentState={filterValue}
				/>
			) : null}
			{isCancelAllModalOpen && (
				<CancelAllOrdersModal
					isOpen
					onClose={handleCloseCancelAllModal}
					symbol={showAllOpenedOrders ? "" : pair?.symbol}
					pairs={openedOrdersPairLabels}
				/>
			)}
		</>
	);
};

export default observer(ActiveOrdersMobile);
