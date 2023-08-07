import React, { useState, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import { List as VirtualizedList } from "react-virtualized/dist/commonjs/List";
import exchangeMessages from "messages/exchange";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import stylesTable from "styles/components/UI/Table.module.scss";
import useMouseLeave from "hooks/useMouseLeave";
import useAccountType from "hooks/useAccountType";
import useTerminalLayout from "hooks/useTerminalLayout";
import { useResizeDetector } from "react-resize-detector";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { IOrderBookOrder, orderBook } from "models/Terminal";
import EmptyTableData from "components/EmptyTableData";
import { IHeaderColumn } from "components/UI/Table/Table";
import { getPrecision } from "utils/format";
import { formatOrdersToPrecision } from "helpers/exchange";
import { Table } from "components/UI/Table";
import { OrderSideEnum } from "types/orders";
import OrderRowPlain from "./OrderRowPlain";
import OrderRow, { IOrderRow } from "./OrderRow";
import Tooltip from "./Tooltip";
import LoadingOverlay from "../LoadingOverlay";

const VirtualizeFunctionRowWrapper = (props: IOrderRow) => <OrderRow {...props} />;

interface Props {
	side: OrderSideEnum;
	mobile?: boolean;
	grouped?: boolean;
	headless?: boolean;
	full?: boolean;
}

const ROW_HEIGHT = 22;

const getOrdersCountByHeight = (height: number): number =>
	height === 0 ? 0 : Math.floor(height / ROW_HEIGHT);

const List: React.FC<Props> = ({
	side,
	mobile = false,
	grouped = false,
	headless = false,
	full = false,
}) => {
	const {
		terminal: { pair, tradeForm, orderBookPrecision },
		history: { openedOrdersBuyKeys, openedOrdersSellKeys },
	} = useMst();
	const { formatMessage } = useIntl();
	const [offset, setOffset] = useState<number>(0);
	const [scrollTop, setScrollTop] = useState<number>(0);
	const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
	const [containerHeight, setContainerHeight] = useState<number>(0);
	const [mouseLeft, setMouseLeaveRef] = useMouseLeave();
	const { height: refHeight, ref: containerRef } = useResizeDetector();
	const terminalLayout = useTerminalLayout();
	const terminalType = useAccountType();

	const ordersViewCount = getOrdersCountByHeight(containerHeight);

	const orders = formatOrdersToPrecision(
		side === OrderSideEnum.BUY ? orderBook.buy ?? [] : orderBook.sell ?? [],
		orderBookPrecision,
		getPrecision(pair?.price_precision),
	);

	const groupedOrders =
		side === OrderSideEnum.BUY
			? orders.slice(0, ordersViewCount)
			: orders.slice(0, ordersViewCount).reverse();

	const total = side === OrderSideEnum.BUY ? orderBook.totalBuy : orderBook.totalSell;
	const openedOrdersKeys = side === OrderSideEnum.SELL ? openedOrdersSellKeys : openedOrdersBuyKeys;
	const orderbookKey =
		total + (hoveredRowIndex ?? 1) + containerHeight + openedOrdersKeys.length + orderBookPrecision;

	let avgPrice = 0;
	let avgAmount1 = 0;
	let avgAmount2 = 0;

	if (orders.length && hoveredRowIndex !== null) {
		if (grouped && side === OrderSideEnum.SELL && !full) {
			const orderList = [...orders].slice(0, ordersViewCount).reverse();
			for (let i = orderList.length - 1; i >= hoveredRowIndex; i--) {
				avgAmount1 += orderList[i].amount;
				avgAmount2 += orderList[i].amount2;
			}
			avgPrice = avgAmount2 / avgAmount1;
		} else if (hoveredRowIndex < orders.length) {
			for (let i = 0; i <= hoveredRowIndex; i++) {
				avgAmount1 += orders[i].amount;
				avgAmount2 += orders[i].amount2;
			}
			avgPrice = avgAmount2 / avgAmount1;
		}
	}

	const handleOrderClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const { id } = e.currentTarget.dataset;
		const order = id ? orders.find((item) => item.key === id) : null;
		if (order) {
			tradeForm.setClickedOrder(order, side);
		}
	};

	const handleChangeIndex = useCallback(
		(index: number | null, top: number | null) => {
			setHoveredRowIndex(index);
			setOffset(
				grouped
					? side === OrderSideEnum.SELL && !full
						? ((index ?? 0) - 1) * ROW_HEIGHT
						: (index ?? 0) * ROW_HEIGHT
					: top ?? 0,
			);
		},
		[grouped, side, full],
	);

	const handleWrapperMouseOut = () => {
		setHoveredRowIndex(null);
	};

	const handleScroll = (e: { scrollTop: number }) => {
		setScrollTop(e.scrollTop);
	};

	useEffect(() => {
		if (refHeight) {
			const d = !headless || full ? 30 : 0;
			setContainerHeight(refHeight - d);
		}
	}, [refHeight, terminalLayout, terminalType, headless, full, side]);

	useEffect(() => {
		if (mouseLeft) {
			setHoveredRowIndex(null);
			setOffset(0);
		}
	}, [mouseLeft]);

	const columns: IHeaderColumn[] = [
		{
			label: (
				<>
					{formatMessage(exchangeMessages.price)}
					{mobile && <>&nbsp;{pair?.quote_currency_code}</>}
				</>
			),
		},
		{
			align: "right",
			label: (
				<>
					{formatMessage(exchangeMessages.amount)}
					&nbsp;{pair?.base_currency_code}
				</>
			),
		},
	];

	if (!mobile) {
		columns.push({
			align: "right",
			label: (
				<>
					{formatMessage(exchangeMessages.amount)}
					&nbsp;{pair?.quote_currency_code}
				</>
			),
		});
	}

	return (
		<div className={cn(styles.orderbook_list_container, { [styles.grouped]: grouped })}>
			{((!mobile && !grouped) || full) && (
				<>
					<div className={styles.widget_header}>
						<div className={styles.widget_title}>
							{formatMessage(
								exchangeMessages[side === OrderSideEnum.SELL ? "sell_orders" : "buy_orders"],
							)}
						</div>
						{/* <div className={styles.order_book_total_value}>
							<span>
								{side === OrderSideEnum.BUY ? pair?.quote_currency_code : pair?.base_currency_code}
							</span>
						</div> */}
					</div>
					<div className={styles.widget_divider} />
				</>
			)}
			<div className={cn(styles.orderbook_content, grouped && styles.hidden)} ref={containerRef}>
				<LoadingOverlay />
				{pair && orders.length ? (
					<>
						{(!headless || full) && (
							<Table
								className={styles.orderbook_table}
								header={{
									className: styles.orderbook_table_header,
									columns,
								}}
							/>
						)}
						{/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
						<div
							className={styles.orderbook_list_wrapper}
							onMouseOut={handleWrapperMouseOut}
							key={grouped && !full ? "grouped" : orderbookKey}
							ref={setMouseLeaveRef}
						>
							{grouped && !full ? (
								<div
									className={cn(
										styles.orderbook_group_list,
										stylesTable.rows,
										stylesTable.stripped,
									)}
								>
									{groupedOrders.map((order: IOrderBookOrder, idx: number) => (
										<OrderRowPlain
											key={order.key}
											index={idx}
											order={order}
											handleClick={handleOrderClick}
											mobile={mobile}
											pair={pair}
											side={side}
											pricePrecision={orderBookPrecision}
											hoveredRowIndex={hoveredRowIndex}
											setHoveredRowIndex={handleChangeIndex}
											openedOrdersKeys={openedOrdersKeys}
										/>
									))}
								</div>
							) : (
								<AutoSizer>
									{({ height, width }) => (
										<VirtualizedList
											height={height}
											width={width}
											rowCount={orders.length}
											data={orders}
											pair={pair}
											group={grouped}
											rowHeight={ROW_HEIGHT}
											overscanRowCount={5}
											mobile={mobile}
											onRowClick={handleOrderClick}
											onScroll={handleScroll}
											pricePrecision={orderBookPrecision}
											isScrolling
											className={cn(styles.orderbook_list, stylesTable.rows, stylesTable.stripped)}
											hoveredRowIndex={hoveredRowIndex}
											scrollTop={scrollTop}
											setHoveredRowIndex={handleChangeIndex}
											openedOrdersKeys={openedOrdersKeys}
											// @ts-ignore
											rowRenderer={VirtualizeFunctionRowWrapper}
											side={side}
										/>
									)}
								</AutoSizer>
							)}
							{!grouped && hoveredRowIndex !== null && (
								<Tooltip
									top={offset - scrollTop}
									avgPrice={avgPrice}
									avgAmount1={avgAmount1}
									avgAmount2={avgAmount2}
									pair={pair}
									alignTo={grouped ? "right" : side === OrderSideEnum.SELL ? "right" : "left"}
								/>
							)}
						</div>
					</>
				) : (
					<EmptyTableData />
				)}
			</div>
			{grouped && pair && hoveredRowIndex !== null && (
				<Tooltip
					top={offset - scrollTop + (side === OrderSideEnum.SELL && !full ? 30 : full ? 60 : 0)}
					avgPrice={avgPrice}
					avgAmount1={avgAmount1}
					avgAmount2={avgAmount2}
					pair={pair}
					alignTo={grouped ? "right" : side === OrderSideEnum.SELL ? "right" : "left"}
				/>
			)}
		</div>
	);
};

export default observer(List);
