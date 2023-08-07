import React from "react";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import { OrderSideEnum } from "types/orders";

interface IProps {
	align: "left" | "right";
	side: OrderSideEnum;
	progress: string;
}

const DepthProgress: React.FC<IProps> = ({ align, side, progress }) => (
	<div
		className={cn(
			styles.orderbook_list_item_depth_progress,
			styles[align],
			styles[side.toLowerCase()],
		)}
		style={{ width: progress }}
	/>
);

export default DepthProgress;
