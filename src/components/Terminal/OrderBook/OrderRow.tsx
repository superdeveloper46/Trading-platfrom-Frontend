import React from "react";
import cn from "classnames";
import stylesTable from "styles/components/UI/Table.module.scss";
import styles from "styles/pages/Terminal.module.scss";
import FormattedPrice from "components/Terminal/FormattedPrice";
import { IPair } from "models/Terminal";
import { OrderSideEnum } from "types/orders";
import { formatNumberNoRounding } from "utils/format";
import DepthProgress from "./DepthProgress";

export interface IOrderRow {
	key: string | number;
	index: number;
	style: React.CSSProperties;
	parent: {
		props: {
			side: OrderSideEnum;
			onRowClick: (e: React.MouseEvent) => void;
			data: any[];
			mobile: boolean;
			pair: IPair;
			pricePrecision: number;
			hoveredRowIndex: number | null;
			setHoveredRowIndex: (index: number | null, styleProp: string | number | null) => void;
			group: boolean;
			openedOrdersKeys: number[];
		};
	};
}

const OrderRow: React.FC<IOrderRow> = React.memo(
	({
		index,
		style,
		parent: {
			props: {
				side,
				data,
				group,
				pair,
				hoveredRowIndex,
				pricePrecision,
				mobile,
				setHoveredRowIndex,
				openedOrdersKeys,
				onRowClick,
			},
		},
	}) => {
		const order = data[index];
		const amount_precision = pair.amount_precision ?? 6;
		const price_precision = pricePrecision ?? pair.price_precision ?? 3;
		const showBackground = hoveredRowIndex ? hoveredRowIndex - index >= 0 : false;
		const isUserActiveOrder = openedOrdersKeys?.indexOf(order.key) !== -1 ?? false;

		const handleMouseEnter = () => {
			if (!mobile) {
				setHoveredRowIndex(index, style.top ?? 0);
			}
		};

		const handleMouseLeave = () => {
			if (!mobile) {
				setHoveredRowIndex(null, null);
			}
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
				style={style}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={onRowClick}
			>
				<DepthProgress
					progress={order.progress}
					side={side}
					align={group ? "left" : side === OrderSideEnum.BUY ? "left" : "right"}
				/>
				{hoveredRowIndex === index && <div className={styles.orderbook_dashed_bottom_line} />}
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

export default OrderRow;
