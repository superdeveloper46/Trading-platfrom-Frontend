import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import messages from "messages/exchange";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import styles from "styles/pages/Terminal.module.scss";
import Tab from "components/UI/Tab";
import TradeForm from "../TradeForm";
import Tooltip from "../../UI/Tooltip";
// import TradeBonus from "./TradeBonus";
// import BirthdayBonus from "./BirthdayBonus";

interface Props {
	isDemo?: boolean;
}

const OrderFormTablet: React.FC<Props> = React.memo(({ isDemo = false }) => {
	const [sideType, setSideType] = useState<OrderSideEnum>(OrderSideEnum.BUY);
	const [orderType, setOrderType] = useState<OrderTypeEnum>(OrderTypeEnum.LIMIT);
	const { formatMessage } = useIntl();

	const handleOperationType = (name: string) => {
		setSideType(name as OrderSideEnum);
	};

	const handleOrderType = (name: string): void => {
		setOrderType(name as OrderTypeEnum);
	};

	return (
		<div className={cn(styles.widget, styles.order_form)}>
			<div className={cn(styles.order_form_tablet_side_tabs, styles.tabs)}>
				<Tab
					className={cn(
						styles.order_form_tablet_side_tab,
						sideType === OrderSideEnum.BUY && styles.active,
					)}
					onClick={handleOperationType}
					name={OrderSideEnum.BUY}
					isActive={sideType === OrderSideEnum.BUY}
					label={formatMessage(messages.buy)}
				/>
				<Tab
					className={cn(
						styles.order_form_tablet_side_tab,
						sideType === OrderSideEnum.SELL && styles.active,
					)}
					onClick={handleOperationType}
					name={OrderSideEnum.SELL}
					isActive={sideType === OrderSideEnum.SELL}
					label={formatMessage(messages.sell)}
				/>
			</div>
			<div className={styles.tabs}>
				<Tab
					name={OrderTypeEnum.LIMIT}
					onClick={handleOrderType}
					isActive={orderType === OrderTypeEnum.LIMIT}
					label={formatMessage(messages.order_type_limit)}
				/>
				<Tab
					name={OrderTypeEnum.MARKET}
					onClick={handleOrderType}
					isActive={orderType === OrderTypeEnum.MARKET}
					label={formatMessage(messages.order_type_market)}
				/>
				<Tab
					name={OrderTypeEnum.STOP_LIMIT}
					onClick={handleOrderType}
					isActive={orderType === OrderTypeEnum.STOP_LIMIT}
					label={
						<>
							{formatMessage(messages.order_type_stop_limit)}
							<Tooltip
								id="stop-limit-order"
								hint
								text={formatMessage(messages.stop_limit_order_desc)}
								className={styles.order_form_stop_limit_tooltip}
							/>
						</>
					}
				/>
			</div>
			<div className={styles.order_form_body}>
				<TradeForm type={orderType} side={sideType} isDemo={isDemo} />
			</div>
			{/* <TradeBonus /> */}
			{/* <BirthdayBonus /> */}
		</div>
	);
});

export default OrderFormTablet;
