import React, { useState } from "react";
import Modal, {
	Footer,
	SuccessScreen,
	Icon,
	Description,
	InfoGroup,
	InfoGroupItem,
	InfoGroupItemValue,
	BodyContainer,
	Content,
	ActionGroup,
} from "components/UI/Modal";
import { useIntl } from "react-intl";
import historyMessages from "messages/history";
import commonMessages from "messages/common";
import recentTradesMessages from "messages/recent_trades";
import CancelOrderIcon from "assets/images/modals/cancel_order.svg";
import { IHistoryOrder } from "models/History";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import { OrderSideEnum } from "types/orders";
import Button, { ButtonsGroup } from "components/UI/Button";
import errorHandler from "utils/errorHandler";
import HistoryService from "services/HistoryService";

interface IProps {
	order: IHistoryOrder;
	onSuccess?(): void;
	onClose(): void;
}

const CancelOrderModal: React.FC<IProps> = ({ order, onSuccess, onClose }) => {
	const { formatMessage, formatNumber } = useIntl();
	const currency = order?.symbol?.split("_") || null;
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [isCancelling, setCancelling] = useState<boolean>(false);

	const onCancel = async () => {
		try {
			setCancelling(true);
			await HistoryService.cancelOrder(order.id);
			setIsSuccessful(true);
			onSuccess?.();
		} catch (err) {
			errorHandler(err);
		} finally {
			setCancelling(false);
		}
	};

	return (
		<Modal
			iconCode="warning"
			label={formatMessage(historyMessages.active_orders_modal_confirm)}
			onClose={onClose}
			isOpen
		>
			<BodyContainer>
				{isSuccessful ? (
					<SuccessScreen>
						<span>{formatMessage(historyMessages.order_was_cancelled)}</span>
					</SuccessScreen>
				) : (
					<>
						<Content centered>
							<Icon>
								<img src={CancelOrderIcon} alt="cancel order" width="65" />
							</Icon>
							<Description noMargin>
								{formatMessage(historyMessages.active_orders_modal_cancel_body)}
							</Description>
						</Content>
						<InfoGroup>
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_pair)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									{currency && (
										<span>
											{currency[0]}/<span>{currency[1]}</span>
										</span>
									)}
								</InfoGroupItemValue>
							</InfoGroupItem>
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_side)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									<Badge
										alpha
										color={
											order.side === OrderSideEnum.BUY ? BadgeColorEnum.GREEN : BadgeColorEnum.RED
										}
										directional
										side={order.side as OrderSideEnum}
									>
										{formatMessage(
											order.side === OrderSideEnum.BUY
												? recentTradesMessages.operation_sell
												: recentTradesMessages.operation_buy,
										)}
									</Badge>
								</InfoGroupItemValue>
							</InfoGroupItem>
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_price)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									<span>
										{formatNumber(order?.price ?? 0, {
											useGrouping: false,
											minimumFractionDigits: order?.pair?.price_precision || 6,
											maximumFractionDigits: 8,
										})}
										&nbsp;<span>{currency && currency[1]}</span>
									</span>
								</InfoGroupItemValue>
							</InfoGroupItem>
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_amount)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									<span>
										{formatNumber(order?.amount ?? 0, {
											useGrouping: false,
											minimumFractionDigits: order?.pair?.amount_precision || 6,
											maximumFractionDigits: 8,
										})}
										&nbsp;<span>{currency && currency[0]}</span>
									</span>
								</InfoGroupItemValue>
							</InfoGroupItem>
							<InfoGroupItem>
								<InfoGroupItemValue>Total/Filled:</InfoGroupItemValue>
								<InfoGroupItemValue>
									<span>
										{formatNumber((order.amount ?? 0) * (order.price ?? 0), {
											useGrouping: false,
											maximumFractionDigits: 3,
										})}
										&nbsp; / &nbsp;
										<span>
											{formatNumber(order.filled_percent ?? 0, {
												useGrouping: false,
												minimumFractionDigits: 1,
												maximumFractionDigits: 1,
											})}
											%
										</span>
									</span>
								</InfoGroupItemValue>
							</InfoGroupItem>
						</InfoGroup>
					</>
				)}
			</BodyContainer>
			<Footer>
				<ActionGroup>
					{!isSuccessful && (
						<Button
							fullWidth
							variant="filled"
							color="primary"
							isLoading={isCancelling}
							onClick={onCancel}
							label={formatMessage(commonMessages.confirm)}
						/>
					)}
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						onClick={onClose}
						label={
							isSuccessful
								? formatMessage(commonMessages.close)
								: formatMessage(commonMessages.back_btn)
						}
					/>
				</ActionGroup>
			</Footer>
		</Modal>
	);
};

export default CancelOrderModal;
