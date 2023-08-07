import React, { useState } from "react";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import { useIntl } from "react-intl";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import messages from "messages/exchange";
import Tab from "components/UI/Tab";
import Tooltip from "components/UI/Tooltip";
import TradeForm from "../TradeForm";

interface Props {
	isDemo?: boolean;
}

const OrderFormWidget: React.FC<Props> = ({ isDemo }) => {
	const { formatMessage } = useIntl();
	const [tradeType, setTradeType] = useState<OrderTypeEnum>(OrderTypeEnum.LIMIT);

	const handleOrderTypeChange = (name: string) => {
		setTradeType(name as OrderTypeEnum);
	};

	return (
		<div className={cn(styles.widget, styles.order_form)}>
			<div className={styles.tabs}>
				<Tab
					name={OrderTypeEnum.LIMIT}
					onClick={handleOrderTypeChange}
					isActive={tradeType === OrderTypeEnum.LIMIT}
					label={formatMessage(messages.order_type_limit)}
				/>
				<Tab
					name={OrderTypeEnum.MARKET}
					onClick={handleOrderTypeChange}
					isActive={tradeType === OrderTypeEnum.MARKET}
					label="Market"
				/>
				<Tab
					name={OrderTypeEnum.STOP_LIMIT}
					onClick={handleOrderTypeChange}
					isActive={tradeType === OrderTypeEnum.STOP_LIMIT}
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
				<TradeForm isDemo={isDemo} side={OrderSideEnum.BUY} type={tradeType} />
				<div className={styles.order_form_divider} />
				<TradeForm isDemo={isDemo} side={OrderSideEnum.SELL} type={tradeType} />
			</div>
			{/* <TradeBonus /> */}
			{/* <BirthdayBonus /> */}
		</div>
	);
};

export default OrderFormWidget;
