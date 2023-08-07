import React, { useState } from "react";
import { useIntl } from "react-intl";
import recentTradesMessages from "messages/recent_trades";
import commonMessages from "messages/common";
import exchangeMessages from "messages/exchange";
import activeOrdersMessages from "messages/history";
import { ICreateOrderBody } from "types/exchange";
import { IPair } from "models/Terminal";
import marginModalStyles from "styles/components/MarginModal.module.scss";
import ExchangeService from "services/ExchangeService";
import Modal, {
	ActionGroup,
	Footer,
	InfoGroup,
	InfoGroupItem,
	InfoGroupItemAttrValue,
	InfoGroupItemValue,
} from "components/UI/Modal";
import Badge from "components/UI/Badge";
import Button from "components/UI/Button";
import errorHandler from "utils/errorHandler";
import { toast } from "react-toastify";
import { isOrderDone } from "helpers/history";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	order: ICreateOrderBody;
	pair?: IPair | null;
}

const StopLimitConfirmModal: React.FC<Props> = ({ isOpen, onClose, pair = {}, order }) => {
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
	const { formatMessage, formatNumber } = useIntl();
	const currency = order?.symbol?.split("_") || null;
	const side = +(order.side ?? 0);
	const price = +(order.price ?? 0);
	const amount = +(order.amount ?? 0);
	const stopOperator = +(order.stop_operator ?? 0);
	const stopPrice = +(order.stop_price ?? 0);

	const handleSubmit = async () => {
		try {
			setIsSubmitLoading(true);
			const res = await ExchangeService.createOrder(order);
			toast(
				<>
					<i className="ai ai-check_outline" />
					{formatMessage(
						isOrderDone(res) ? exchangeMessages.order_created_done : exchangeMessages.order_created,
					)}
				</>,
			);
			onClose();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<Modal label={formatMessage(commonMessages.confirm)} isOpen={isOpen} onClose={onClose}>
			<div className={marginModalStyles.stop_limit_confirm_subheader}>
				<InfoGroupItemValue>
					{currency ? (
						<InfoGroupItemAttrValue>
							{currency[0]}/<span>{currency[1]}</span>
						</InfoGroupItemAttrValue>
					) : null}
				</InfoGroupItemValue>
				<span>Stop-Limit</span>
				<InfoGroupItemValue>
					{order?.type ? (
						<Badge alpha color={side === 1 ? "red" : "green"}>
							{side === 1 ? "Sell" : "Buy"}
						</Badge>
					) : null}
				</InfoGroupItemValue>
			</div>
			<InfoGroup>
				<InfoGroupItem>
					<InfoGroupItemValue>{formatMessage(exchangeMessages.stop_price)}:</InfoGroupItemValue>
					<InfoGroupItemValue>
						<b>
							{formatNumber(stopPrice, {
								useGrouping: false,
								maximumFractionDigits: pair?.price_precision || 6,
							})}
							&nbsp;<span>{currency ? currency[1] : null}</span>
						</b>
					</InfoGroupItemValue>
				</InfoGroupItem>
				<InfoGroupItem>
					<InfoGroupItemValue>
						{formatMessage(activeOrdersMessages.active_orders_price)}:
					</InfoGroupItemValue>
					<InfoGroupItemValue>
						<b>
							{formatNumber(price, {
								useGrouping: false,
								maximumFractionDigits: pair?.price_precision ?? 6,
							})}
							&nbsp;<span>{currency ? currency[1] : null}</span>
						</b>
					</InfoGroupItemValue>
				</InfoGroupItem>
				<InfoGroupItem>
					<InfoGroupItemValue>
						{formatMessage(activeOrdersMessages.active_orders_amount)}:
					</InfoGroupItemValue>
					<InfoGroupItemValue>
						<b>
							{formatNumber(amount, {
								useGrouping: false,
								maximumFractionDigits: pair?.amount_precision ?? 6,
							})}
							&nbsp;<span>{currency ? currency[0] : null}</span>
						</b>
					</InfoGroupItemValue>
				</InfoGroupItem>
			</InfoGroup>
			<div className={marginModalStyles.stop_limit_stop_order_text}>
				{stopOperator === 1
					? formatMessage(activeOrdersMessages.stop_limit_order_warn_higher, {
							price: (
								<span>
									{formatNumber(price, {
										useGrouping: false,
										maximumFractionDigits: pair?.price_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[1] : null}</span>
								</span>
							),
							stop_price: (
								<span>
									{formatNumber(stopPrice, {
										useGrouping: false,
										maximumFractionDigits: pair?.price_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[1] : null}</span>
								</span>
							),
							amount: (
								<span>
									{formatNumber(amount, {
										useGrouping: false,
										maximumFractionDigits: pair?.amount_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[0] : null}</span>
								</span>
							),
							side:
								+order.side === 1
									? formatMessage(recentTradesMessages.operation_sell)
									: formatMessage(recentTradesMessages.operation_buy),
					  })
					: formatMessage(activeOrdersMessages.stop_limit_order_warn_lower, {
							price: (
								<span>
									{formatNumber(price, {
										useGrouping: false,
										maximumFractionDigits: pair?.price_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[1] : null}</span>
								</span>
							),
							stop_price: (
								<span>
									{formatNumber(stopPrice, {
										useGrouping: false,
										maximumFractionDigits: pair?.price_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[1] : null}</span>
								</span>
							),
							amount: (
								<span>
									{formatNumber(amount, {
										useGrouping: false,
										maximumFractionDigits: pair?.price_precision ?? 6,
									})}
									&nbsp;<span>{currency ? currency[0] : null}</span>
								</span>
							),
							side:
								side === 1
									? formatMessage(recentTradesMessages.operation_sell)
									: formatMessage(recentTradesMessages.operation_buy),
					  })}
			</div>
			<Footer>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={handleSubmit}
						isLoading={isSubmitLoading}
						label={formatMessage(commonMessages.confirm)}
					/>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						onClick={onClose}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</ActionGroup>
			</Footer>
		</Modal>
	);
};

export default StopLimitConfirmModal;
