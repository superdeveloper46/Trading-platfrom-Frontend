import { IOrder } from "models/History";
import React from "react";
import styles from "styles/components/Profile/Dashboard/ActiveOrders.module.scss";
import classnames from "classnames";
import ButtonMicro from "components/UI/ButtonMicro";
import { OrderSideEnum, OrderStatusEnum, OrderTypeEnum } from "types/orders";
import coinMessages from "messages/exchange";
import activeOrdersMessages from "messages/history";
import recentTradesMessages from "messages/recent_trades";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import Button from "components/UI/Button";
import CancelOrderModal from "./CancelOrderModal";
import { useActiveOrderRow } from "./useActiveOrderRow";

interface IProps {
	order: IOrder;
	onOrderClosed?(): void;
}

const ActiveOrderMobileRow: React.FC<IProps> = ({ order, onOrderClosed }) => {
	const {
		formatNumber,
		formatMessage,
		isExpanded,
		modalOpen,
		onCloseModal,
		onOpenModal,
		toggle,
		pairSymbols,
		date,
	} = useActiveOrderRow(order);
	return (
		<div
			className={classnames(styles.card_mobile, {
				[styles.expanded]: isExpanded,
			})}
		>
			{modalOpen && (
				<CancelOrderModal onSuccess={onOrderClosed} order={order} onClose={onCloseModal} />
			)}
			<div
				className={classnames(styles.card_mobile_header, {
					[styles.expanded]: isExpanded,
				})}
			>
				<div className={styles.card_mobile_ccy}>
					{pairSymbols?.length > 1 ? (
						<span>
							{pairSymbols[0]}/{pairSymbols[1]}
						</span>
					) : (
						<span>???/???</span>
					)}
				</div>
				<div className={styles.card_mobile_date_time}>
					<span className={styles.card_mobile_date_time_item}>{date.format("DD/MM/YYYY")}</span>
					<span className={styles.card_mobile_date_time_item}>{date.format("HH:mm")}</span>
				</div>
				<div
					className={classnames(styles.card_mobile_action, {
						[styles.expanded]: isExpanded,
					})}
				>
					<ButtonMicro onClick={toggle}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>Type / Side</span>
					<span>
						{formatMessage(
							order?.type === OrderTypeEnum.LIMIT
								? coinMessages.order_type_limit
								: coinMessages.order_type_stop_limit,
						)}
						&nbsp;/&nbsp;
						<Badge color={BadgeColorEnum.RED} directional side={order?.side as OrderSideEnum}>
							{formatMessage(
								order?.side === OrderSideEnum.BUY
									? recentTradesMessages.operation_sell
									: recentTradesMessages.operation_buy,
							)}
						</Badge>
					</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>Price / Amount</span>
					<span>
						{formatNumber(order?.price ?? 0, {
							useGrouping: false,
							minimumFractionDigits: order?.pair?.price_precision ?? 2,
							maximumFractionDigits: order?.pair?.price_precision ?? 8,
						})}
						&nbsp;/&nbsp;
						{formatNumber(order?.amount_original ?? 0, {
							useGrouping: false,
							minimumFractionDigits: order?.pair?.amount_precision ?? 2,
							maximumFractionDigits: order?.pair?.amount_precision ?? 8,
						})}
					</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>Trigger</span>
					<span>
						{order?.type === OrderTypeEnum.STOP_LIMIT && order?.status === OrderTypeEnum.LIMIT ? (
							"triggered"
						) : order?.stop_price && order.status !== OrderStatusEnum.CANCELLED ? (
							<>
								{order.stop_operator === 1 ? ">=" : "<="}
								{formatNumber(order.stop_price, {
									useGrouping: false,
									maximumFractionDigits: 3,
								})}
							</>
						) : (
							"-"
						)}
					</span>
				</div>
				{isExpanded && (
					<div className={styles.card_mobile_content_hidden}>
						<div className={styles.card_mobile_content_group}>
							<span>Total</span>
							<span>
								{/* {formatNumber(order.amount * order.price, {
								useGrouping: false,
								maximumFractionDigits: 3,
							})} */}
								{formatNumber(1, {
									useGrouping: false,
									maximumFractionDigits: 3,
								})}
							</span>
						</div>
						<div className={styles.card_mobile_content_group}>
							<span>Filled</span>
							<span>
								{formatNumber(order?.filled_percent ?? 0, {
									useGrouping: false,
									minimumFractionDigits: 1,
									maximumFractionDigits: 1,
								})}
								%
							</span>
						</div>
						<div className={styles.cancel_button_container}>
							<Button
								variant="text"
								color="primary"
								mini
								onClick={onOpenModal}
								label={formatMessage(activeOrdersMessages.active_orders_action_cancel_tooltip)}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ActiveOrderMobileRow;
