import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import { flip } from "utils/format";

export const ORDER_TYPE: Record<string, number> = {
	[OrderTypeEnum.MARKET]: 1,
	[OrderTypeEnum.LIMIT]: 2,
	[OrderTypeEnum.STOP_LIMIT]: 3,
};

export const ORDER_SIDE: Record<string, number> = {
	[OrderSideEnum.SELL]: 1,
	[OrderSideEnum.BUY]: 2,
};

export const ORDER_STATUS: Record<string, number> = {
	[OrderStatusEnum.PENDING]: 1,
	[OrderStatusEnum.OPEN]: 2,
	[OrderStatusEnum.CANCELLED]: 3,
	[OrderStatusEnum.PARTIAL_CANCELED]: 4,
	[OrderStatusEnum.PARTIAL_CANCELLED]: 4,
	[OrderStatusEnum.PARTIAL_FILLED]: 5,
	[OrderStatusEnum.FILLED]: 6,
	[OrderStatusEnum.EXPIRED]: 7,
	[OrderStatusEnum.FAILED]: 8,
};

export const ORDER_STATUS_TEXT: Record<string, string> = {
	[OrderStatusEnum.PENDING]: "pending",
	[OrderStatusEnum.OPEN]: "open",
	[OrderStatusEnum.CANCELLED]: "cancelled",
	[OrderStatusEnum.PARTIAL_CANCELED]: "partial cancelled",
	[OrderStatusEnum.PARTIAL_CANCELLED]: "partial cancelled",
	[OrderStatusEnum.PARTIAL_FILLED]: "partial filled",
	[OrderStatusEnum.FILLED]: "filled",
	[OrderStatusEnum.EXPIRED]: "expired",
	[OrderStatusEnum.FAILED]: "failed",
};

export const ORDER_TYPE_FLIPPED: Record<number, string> = flip(ORDER_TYPE);
export const ORDER_SIDE_FLIPPED: Record<number, string> = flip(ORDER_SIDE);
export const ORDER_STATUS_FLIPPED: Record<number, string> = flip(ORDER_STATUS);
