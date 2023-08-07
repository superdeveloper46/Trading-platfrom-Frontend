import { ORDER_SIDE_FLIPPED, ORDER_STATUS_FLIPPED, ORDER_TYPE_FLIPPED } from "constants/orders";
import { IHistoryOrder } from "models/History";
import { OrderStatusEnum, OrderTypeEnum } from "types/orders";

export const formatHistoryOrder = (order: IHistoryOrder) => {
	const o = { ...order };

	if (typeof o.side === "number") {
		o.side = ORDER_SIDE_FLIPPED[o.side];
	}
	if (typeof o.type === "number") {
		o.type = ORDER_TYPE_FLIPPED[o.type];
	}
	if (typeof o.status === "number") {
		o.status = ORDER_STATUS_FLIPPED[o.status];
	}
	if (typeof o.stop_price === "string") {
		o.stop_price = +o.stop_price;
	}

	o.filled_percent = o.filled_percent ?? 0;
	o.direction = o.direction ?? null;
	o.fee_filled = o.fee_filled ?? null;
	o.pair = o.pair ?? null;
	o.stop_operator = o.stop_operator ?? null;
	o.open_at = o.open_at ?? null;
	o.updated_at = o.updated_at ?? null;
	o.side_effect = o.side_effect ?? null;
	o.order_filled_value = o.order_filled_value ?? null;
	o.order_total_value = o.order_total_value ?? null;

	return o;
};

export const formatHistoryOrders = (orders: IHistoryOrder[]) => {
	const nextOrders: IHistoryOrder[] = [];

	orders.forEach((o) => {
		nextOrders.push(formatHistoryOrder(o));
	});

	return nextOrders;
};

export const isOrderDone = (order: IHistoryOrder) =>
	[
		OrderStatusEnum.CANCELLED,
		OrderStatusEnum.PARTIAL_CANCELED,
		OrderStatusEnum.PARTIAL_CANCELLED,
		OrderStatusEnum.FILLED,
	].includes(order.status as OrderStatusEnum) ||
	(order.type === OrderTypeEnum.MARKET && order.status === OrderStatusEnum.PARTIAL_FILLED);
