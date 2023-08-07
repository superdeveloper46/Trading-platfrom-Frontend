import React from "react";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import stylesTable from "styles/components/UI/Table.module.scss";
import FormattedPrice from "components/Terminal/FormattedPrice";
import { IOrderBookOrder, IPair } from "models/Terminal";
import { formatNumberNoRounding } from "utils/format";
import { OrderSideEnum } from "types/orders";
import DepthProgress from "./DepthProgress";

export interface IOrderRowPlain {
	index: number;
	side: OrderSideEnum;
	handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
	order: IOrderBookOrder;
	mobile: boolean;
	pair: IPair;
	pricePrecision: number;
	hoveredRowIndex: number | null;
	setHoveredRowIndex: (index: number | null, styleProp: number | null) => void;
	openedOrdersKeys: string[];
}

const OrderRowPlain: React.FC<IOrderRowPlain> = React.memo(
	({
		index,
		order,
		side,
		pair,
		hoveredRowIndex,
		mobile,
		pricePrecision,
		setHoveredRowIndex,
		openedOrdersKeys,
		handleClick,
	}) => {
		const amount_precision = pair.amount_precision ?? 6;
		const price_precision = pricePrecision ?? pair.price_precision ?? 3;
		const showBackground =
			hoveredRowIndex !== null
				? side === OrderSideEnum.BUY
					? hoveredRowIndex - index >= 0
					: hoveredRowIndex - index < 0
				: false;
		const isUserActiveOrder = openedOrdersKeys?.indexOf(order.key) !== -1 ?? false;

		const handleMouseEnter = () => {
			if (!mobile) {
				setHoveredRowIndex(index, null);
			}
		};

		const handleMouseLeave = () => {
			setHoveredRowIndex(null, null);
		};

		return (
			<div
				className={cn(
					styles.orderbook_list_item,
					showBackground && styles.sum_idx_bg,
					stylesTable.row,
				)}
				key={order.key}
				data-id={order.key}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}
			>
				<DepthProgress align="left" side={side} progress={order.progress} />
				{hoveredRowIndex === index && (
					<div
						className={cn(
							styles.orderbook_dashed_bottom_line,
							side === OrderSideEnum.SELL && styles.top,
						)}
					/>
				)}
				<div className={cn(styles.orderbook_list_item_column, styles.price)}>
					{isUserActiveOrder && <div className={styles.orderbook_list_item_active_order} />}
					<FormattedPrice
						coloredFull={order.unique}
						value={order.price}
						precision={price_precision}
						type={side === OrderSideEnum.BUY ? 2 : 1}
					/>
				</div>
				<div className={cn(styles.orderbook_list_item_column, styles.right)}>
					{formatNumberNoRounding(order.amount, amount_precision)}
				</div>
				{!mobile && (
					<div className={cn(styles.orderbook_list_item_column, styles.right)}>
						{formatNumberNoRounding(order.amount2, 4)}
					</div>
				)}
			</div>
		);
	},
);

export default OrderRowPlain;
