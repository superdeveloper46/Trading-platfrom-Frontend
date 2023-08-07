import { formatHistoryOrder, formatHistoryOrders, isOrderDone } from "helpers/history";
import { getParent, Instance, flow, destroy, types as t, cast, detach } from "mobx-state-tree";
import HistoryService from "services/HistoryService";
import { IGetOrdersParams, IGetPositionsParams } from "types/history";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import { HistoryModelNamesEnum } from "types/models";
import errorHandler from "utils/errorHandler";
import { ISubAccount } from "types/subAccounts";
import { Withdraw } from "./Withdrawal";
import { Deposit } from "./Deposit";

const HistoryOrderTrade = t.model({
	amount1: t.maybeNull(t.number),
	amount2: t.maybeNull(t.number),
	date: t.number,
	fee_amount: t.maybeNull(t.number),
	fee_currency_id: t.maybeNull(t.string),
	fee_rate: t.maybeNull(t.number),
	id: t.number,
	pair_id: t.string,
	price: t.number,
	type: t.maybeNull(t.number),
});
export type IHistoryOrderTrade = Instance<typeof HistoryOrderTrade>;

const HistoryOrderPair = t.model({
	amount_precision: t.number,
	id: t.string,
	is_enabled: t.boolean,
	label: t.string,
	maximum_order_size: t.number,
	minimum_order_size: t.number,
	minimum_order_value: t.number,
	price_precision: t.number,
	symbol: t.string,
});
export type IHistoryOrderPair = Instance<typeof HistoryOrderPair>;

const PositionPair = t.model({
	base_currency_code: t.string,
	quote_currency_code: t.string,
	symbol: t.string,
	price_precision: t.number,
	amount_precision: t.number,
});
export type IPositionPair = Instance<typeof PositionPair>;

const Position = t.model(HistoryModelNamesEnum.POSITION, {
	base_amount: t.number,
	base_price: t.number,
	closed_at: t.maybeNull(t.string),
	direction: t.number,
	wallet_type: t.number,
	opened_at: t.string,
	pair: PositionPair,
	quote_amount: t.number,
});
export type IPosition = Instance<typeof Position>;

const HistoryOrder = t
	.model(HistoryModelNamesEnum.HISTORY_ORDER, {
		amount: t.maybeNull(t.number),
		amount_cancelled: t.maybeNull(t.number),
		amount_filled: t.maybeNull(t.number),
		amount_unfilled: t.maybeNull(t.number),
		amount_original: t.maybeNull(t.number),
		filled_percent: t.number,
		date: t.number,
		direction: t.maybeNull(t.string),
		fee_filled: t.maybeNull(t.number),
		id: t.number,
		key: t.string,
		symbol: t.string,
		price: t.maybeNull(t.number),
		pair: t.maybeNull(HistoryOrderPair),
		price_avg: t.maybeNull(t.number),
		status: t.string, // OrderStatusEnum
		type: t.string, // OrderTypeEnum
		side: t.string, // OrderSideEnum
		value_filled: t.maybeNull(t.number),
		stop_price: t.maybeNull(t.number),
		stop_operator: t.maybeNull(t.number),
		open_at: t.maybeNull(t.number),
		done_at: t.maybeNull(t.number),
		updated_at: t.maybeNull(t.number),
		wallet_type: t.maybeNull(t.number),
		side_effect: t.maybeNull(t.number),
		quote_amount: t.maybeNull(t.number),
		order_filled_value: t.maybeNull(t.number),
		order_total_value: t.maybeNull(t.number),
		trades: t.optional(t.array(HistoryOrderTrade), []),
	})
	.views((self) => ({
		get totalValue() {
			return (self.amount ?? 0) * (self.price ?? 0) || self.value_filled || 0;
		},
	}))
	.volatile(() => ({
		isCancelLoading: false,
		isTradesLoading: false,
	}))
	.actions((self) => ({
		setIsCancelLoading(nextIsLoading: boolean) {
			self.isCancelLoading = nextIsLoading;
		},
		destroy() {
			if (self) {
				(getParent(self, 2) as IHistory)?.removeOpenOrder(self as IOrder);
			}
		},
		loadTrades: flow(function* () {
			try {
				self.isTradesLoading = true;
				const data = yield HistoryService.getOrder(self.id);
				if (data && Array.isArray(data.trades)) {
					self.trades = cast(data.trades);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isTradesLoading = false;
			}
		}),
	}));

// ts bullshit
export type IOrder = Instance<typeof HistoryOrder>;
export interface IHistoryOrder extends IOrder {
	[key: string]: any;
	account?: ISubAccount;
}

export const History = t
	.model({
		openedOrders: t.optional(t.array(HistoryOrder), []),
		triggerOrders: t.optional(t.array(HistoryOrder), []),
		isOpenedOrdersLoading: t.optional(t.boolean, false),
		openedOrdersCount: t.optional(t.number, 0),
		closedOrders: t.optional(t.array(HistoryOrder), []),
		isClosedOrdersLoading: t.optional(t.boolean, false),
		closedOrdersCount: t.optional(t.number, 0),
		filteringSymbol: t.optional(t.string, ""),
		positions: t.optional(t.array(Position), []),
		isPositionsLoading: t.optional(t.boolean, false),
		deposits: t.optional(t.array(Deposit), []),
		depositsCount: t.optional(t.number, 0),
		isDepositsLoading: t.optional(t.boolean, false),
		withdraws: t.optional(t.array(Withdraw), []),
		withdrawsCount: t.optional(t.number, 0),
		isWithdrawsLoading: t.optional(t.boolean, false),
	})
	.actions(() => ({
		removeOpenOrder(item: IOrder) {
			destroy(item);
		},
	}))
	.views((self) => ({
		get openedOrdersSellKeys() {
			return self.openedOrders
				.filter((o) => o.side === OrderSideEnum.SELL)
				.map((order) => order.key);
		},
		get openedOrdersBuyKeys() {
			return self.openedOrders
				.filter((o) => o.side === OrderSideEnum.BUY)
				.map((order) => order.key);
		},
		get openedOrdersPairLabels() {
			return Array.from(
				new Set([...self.openedOrders.map((order) => order.symbol.replace("_", "/"))]),
			);
		},
	}))
	.actions((self) => ({
		setFilteringSymbol(nextSymbol: string) {
			self.filteringSymbol = nextSymbol;
		},
	}))
	.actions((self) => ({
		updateOrders(o: IOrder, onOrderOpen?: () => void, onOrderClose?: (o: IHistoryOrder) => void) {
			// TODO REFACTOR
			const order = formatHistoryOrder(o);
			if (self.filteringSymbol && o.symbol !== self.filteringSymbol) {
				return;
			}

			if (isOrderDone(order)) {
				const idx = self.closedOrders.findIndex((o) => o.id === order.id);
				if (idx !== -1) {
					self.closedOrders[idx] = cast({
						...self.closedOrders[idx],
						...order,
						trades: [...self.closedOrders[idx].trades],
					});
				} else {
					self.closedOrders.unshift(cast(order));
					const openedOrder = self.openedOrders
						.concat(self.triggerOrders)
						.find((o) => o.id === order.id);
					if (openedOrder) {
						openedOrder.destroy();
					}
					if (onOrderClose && order.status === OrderStatusEnum.FILLED) {
						onOrderClose(order);
					}
				}
			} else if (order.type === OrderTypeEnum.STOP_LIMIT) {
				if (
					[OrderStatusEnum.OPEN, OrderStatusEnum.PARTIAL_FILLED].includes(
						order.status as OrderStatusEnum,
					)
				) {
					const triggerOrder = self.triggerOrders.find((o) => o.id === order.id);
					if (triggerOrder) {
						triggerOrder.destroy();
					}
					self.openedOrders.unshift(cast(order));
				} else {
					const idx = self.triggerOrders.findIndex((o) => o.id === order.id);
					if (idx !== -1) {
						self.triggerOrders[idx] = cast({
							...self.triggerOrders[idx],
							...order,
						});
					} else {
						self.triggerOrders.unshift(cast(order));
					}
				}
			} else {
				const idx = self.openedOrders.findIndex((o) => o.id === order.id);
				if (idx !== -1) {
					self.openedOrders[idx] = cast({
						...self.openedOrders[idx],
						...order,
						trades: [...self.openedOrders[idx].trades],
					});
				} else {
					if (onOrderOpen) {
						onOrderOpen();
					}
					self.openedOrders.unshift(cast(order));
				}
			}
		},
	}))
	.actions((self) => ({
		loadOpenedOrders: flow(function* (params?: IGetOrdersParams) {
			try {
				self.isOpenedOrdersLoading = true;
				const data = yield HistoryService.getOrders({ ...params, open_only: true });
				if (data) {
					if (Array.isArray(data.results)) {
						const orders = formatHistoryOrders(data.results);
						detach(self.openedOrders);
						self.openedOrders = cast(
							orders.filter((o) =>
								[OrderStatusEnum.OPEN, OrderStatusEnum.PARTIAL_FILLED].includes(
									o.status as OrderStatusEnum,
								),
							),
						);
						self.triggerOrders = cast(
							orders.filter(
								(o) => o.type === OrderTypeEnum.STOP_LIMIT && o.status === OrderStatusEnum.PENDING,
							),
						);
					}
					self.openedOrdersCount = data.count ?? 0;
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isOpenedOrdersLoading = false;
			}
		}),
		loadClosedOrders: flow(function* (params: IGetOrdersParams) {
			try {
				self.isClosedOrdersLoading = true;
				const data = yield HistoryService.getOrders({ ...params, closed_only: true });
				if (data) {
					if (Array.isArray(data.results)) {
						const orders = formatHistoryOrders(data.results);
						self.closedOrders = cast(orders);
					}
					self.closedOrdersCount = data.count ?? 0;
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isClosedOrdersLoading = false;
			}
		}),
		loadPositions: flow(function* (params: IGetPositionsParams) {
			try {
				self.isPositionsLoading = true;
				const data = yield HistoryService.getPositions(params);
				if (Array.isArray(data)) {
					self.positions = cast(data);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isPositionsLoading = false;
			}
		}),
	}))
	.actions((self) => ({
		loadDeposits: flow(function* (params: any) {
			try {
				self.isDepositsLoading = true;
				const data = yield HistoryService.getDeposits(params);
				self.depositsCount = data.count;

				if (Array.isArray(data.results)) {
					self.deposits = cast(data.results);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isDepositsLoading = false;
			}
		}),
	}))
	.actions((self) => ({
		loadWithdraws: flow(function* (params: any) {
			try {
				self.isWithdrawsLoading = true;
				const data = yield HistoryService.getWithdraws(params);
				self.withdrawsCount = data.count;

				if (Array.isArray(data.results)) {
					self.withdraws = cast(data.results);
				}
			} catch (err) {
				errorHandler(err);
			} finally {
				self.isWithdrawsLoading = false;
			}
		}),
		cancelWithdraw: flow(function* (id: number) {
			try {
				const item = yield HistoryService.cancelWithdraw(id);

				if (item.id) {
					self.withdraws = cast(
						self.withdraws.map((withdraw) =>
							withdraw.id === item.id ? { ...withdraw, ...item } : withdraw,
						),
					);
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export type IHistory = Instance<typeof History>;
