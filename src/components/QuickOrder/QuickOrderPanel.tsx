import React from "react";
import styles from "styles/components/QuickOrderPanel.module.scss";
import Button from "components/UI/Button";
import cn from "classnames";
import Input, { Appender } from "components/UI/Input";
import { orderBook } from "models/Terminal";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import messages from "messages/exchange";
import { useMst } from "models/Root";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { OrderSideEnum } from "types/orders";
import { useLocation, useNavigate } from "react-router-dom";
import useTradeFormQuickOrder from "./useTradeFormQuickOrder";

interface IProps {
	onStartDrag?: DraggableEventHandler;
	onStopDrag?: DraggableEventHandler;
}

const QuickOrderPanel: React.FC<IProps> = ({ onStartDrag, onStopDrag }) => {
	const {
		terminal: { pair, setIsQuickOrderPlacementOpen },
		account: { balances },
		global: { isAuthenticated, locale },
	} = useMst();
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { formatMessage } = useIntl();
	const buyOrders = orderBook.buy.length ? orderBook.buy : [{ price: "--" }];
	const sellOrders = orderBook.sell.length ? orderBook.sell : [{ price: "--" }];

	const topBuyOrder = [...buyOrders].slice(0, 1)[0];
	const topSellOrder = [...sellOrders].slice(0, 1)[0];

	const tradeFormBuy = useTradeFormQuickOrder(
		pair ?? {},
		OrderSideEnum.BUY,
		balances,
		isAuthenticated,
	);

	const tradeFormSell = useTradeFormQuickOrder(
		pair ?? {},
		OrderSideEnum.SELL,
		balances,
		isAuthenticated,
	);

	const amount = tradeFormBuy.body.amount || tradeFormSell.body.amount;
	const error =
		tradeFormBuy.formErrors.amount ||
		tradeFormBuy.formErrors.non_field_errors ||
		tradeFormSell.formErrors.amount ||
		tradeFormSell.formErrors.non_field_errors;

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const buyEventTarget = { ...e.target, name: "BUY-amount" };
		const sellEventTarget = { ...e.target, name: "SELL-amount" };
		tradeFormBuy.onInputChange({ ...e, target: buyEventTarget });
		tradeFormSell.onInputChange({ ...e, target: sellEventTarget });
	};

	const handleClose = () => {
		setIsQuickOrderPlacementOpen(false);
	};

	const handleAuth = () => {
		if (isAuthenticated) {
			return true;
		}

		navigate(`/${locale}/login?redirect=${pathname}${search}`);
		return false;
	};

	const handleSubmitBuy = () => {
		if (handleAuth()) {
			tradeFormBuy.onSubmit();
		}
	};

	const handleSubmitSell = () => {
		if (handleAuth()) {
			tradeFormSell.onSubmit();
		}
	};

	return (
		<Draggable bounds="parent" handle="strong" onStart={onStartDrag} onStop={onStopDrag}>
			<div className={styles.graggable_popup}>
				<strong className={cn(styles.zone, styles.pick)}>
					<i className="ai ai-dots_grid" />
				</strong>
				<Button
					mini
					label={
						<div className={styles.custom_button_content}>
							<span>Market {formatMessage(messages.buy)}</span>
							<span>{topBuyOrder.price}</span>
						</div>
					}
					color="tertiary"
					className={styles.button}
					onClick={handleSubmitBuy}
					isLoading={tradeFormBuy.isOnSubmitLoading}
				/>
				<div className={styles.input_container}>
					<Input
						labelValue={formatMessage(messages.amount)}
						value={amount}
						error={error}
						onChange={onInputChange}
						small
						appender={<Appender>{pair?.base_currency_code ?? ""}</Appender>}
					/>
				</div>
				<Button
					mini
					label={
						<div className={styles.custom_button_content}>
							<span>Market {formatMessage(messages.sell)}</span>
							<span>{topSellOrder.price}</span>
						</div>
					}
					color="quinary"
					className={styles.button}
					onClick={handleSubmitSell}
					isLoading={tradeFormSell.isOnSubmitLoading}
				/>
				<div className={cn(styles.zone, styles.close)} onClick={handleClose}>
					<i className="ai ai-x_close" />
				</div>
			</div>
		</Draggable>
	);
};

export default observer(QuickOrderPanel);
