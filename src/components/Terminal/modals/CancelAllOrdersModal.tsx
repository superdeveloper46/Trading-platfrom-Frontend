import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import CancelAllCurrentOrdersIcon from "assets/images/modals/cancel_current_orders.svg";
import CancelAllOrdersIcon from "assets/images/modals/cancel_all_orders.svg";
import historyMessages from "messages/history";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import Modal, {
	ActionGroup,
	Content,
	Description,
	Footer,
	Image,
	InfoGroup,
	InfoGroupItem,
	InfoGroupItemAttrValue,
	InfoGroupItemValue,
	SuccessScreen,
} from "components/UI/Modal";
import Badge from "components/UI/Badge";
import errorHandler from "utils/errorHandler";
import ExchangeService from "services/ExchangeService";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	symbol?: string;
	pairs: string[];
}

const CancelAllOrdersModal: React.FC<Props> = ({ isOpen, onClose, symbol, pairs }) => {
	const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const [baseCurrencyCode, quoteCurrencyCode] = symbol?.split("_") ?? ["", ""];

	useEffect(() => {
		setIsSuccessful(false);
		setIsCancelLoading(false);
	}, [isOpen]);

	const handleConfirm = async () => {
		try {
			setIsCancelLoading(true);
			await ExchangeService.cancelAllOrders(symbol ? { pair: symbol } : {});
			setIsSuccessful(true);
		} catch (err) {
			errorHandler(err);
		} finally {
			setIsCancelLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			iconCode="warning"
			label={formatMessage(
				symbol
					? historyMessages.active_orders_modal_cancel_all_current
					: historyMessages.active_orders_modal_cancel_all,
			)}
			onClose={onClose}
		>
			{isSuccessful ? (
				<SuccessScreen>
					<span>
						{formatMessage(
							symbol
								? historyMessages.orders_are_cancelled
								: historyMessages.all_orders_are_cancelled,
						)}
					</span>
				</SuccessScreen>
			) : (
				<>
					<Content centered>
						<Image>
							<img
								width="160"
								height="68"
								src={symbol ? CancelAllCurrentOrdersIcon : CancelAllOrdersIcon}
								alt="Cancel all orders"
							/>
						</Image>
						<Description noMargin>
							{formatMessage(
								symbol
									? historyMessages.active_orders_modal_cancel_all_current_body
									: historyMessages.active_orders_modal_cancel_all_body,
							)}
						</Description>
					</Content>
					<InfoGroup>
						{symbol ? (
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_pair)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									<InfoGroupItemAttrValue>
										{baseCurrencyCode}/{quoteCurrencyCode}
									</InfoGroupItemAttrValue>
								</InfoGroupItemValue>
							</InfoGroupItem>
						) : (
							<InfoGroupItem>
								<InfoGroupItemValue>
									{formatMessage(historyMessages.active_orders_pair)}:
								</InfoGroupItemValue>
								<InfoGroupItemValue>
									{pairs.map((pair: string, idx: number) => {
										const currency = pair.split("/");
										const sign = idx !== pairs.length - 1 ? "," : "";
										return currency ? (
											<InfoGroupItemAttrValue key={pair}>
												{currency[0]}/{currency[1]}
												{sign}
											</InfoGroupItemAttrValue>
										) : (
											""
										);
									})}
								</InfoGroupItemValue>
							</InfoGroupItem>
						)}
						<InfoGroupItem>
							<InfoGroupItemValue>
								{formatMessage(historyMessages.active_orders_side)}:
							</InfoGroupItemValue>
							<InfoGroupItemValue>
								<Badge alpha color="red">
									Sell
								</Badge>
								<Badge alpha color="green">
									Buy
								</Badge>
							</InfoGroupItemValue>
						</InfoGroupItem>
					</InfoGroup>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								fullWidth
								color="primary"
								onClick={handleConfirm}
								isLoading={isCancelLoading}
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
				</>
			)}
		</Modal>
	);
};

export default CancelAllOrdersModal;
