import React, { useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/pages/Terminal.module.scss";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import messages from "messages/exchange";
import Tab from "components/UI/Tab";
import useAccountType from "hooks/useAccountType";
import InternalLink from "components/InternalLink";
import { AccountTypeEnum } from "types/account";
import { useMst } from "models/Root";
import Tooltip from "components/UI/Tooltip";
import { routes } from "constants/routing";
import TradeForm from "../TradeForm";

interface IProps {
	isDemo?: boolean;
}

const OrderFormWidgetAdvanced: React.FC<IProps> = ({ isDemo = false }) => {
	const { render } = useMst();
	const [sideType, setSideType] = useState<OrderSideEnum>(OrderSideEnum.BUY);
	const [tradeType, setTradeType] = useState<OrderTypeEnum>(OrderTypeEnum.LIMIT);
	const { formatMessage } = useIntl();
	const terminalType = useAccountType();

	const handleSideType = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
		setSideType(e.currentTarget.dataset.name as OrderSideEnum);
	};

	const handleOrderTypeChange = (name: string): void => {
		setTradeType(name as OrderTypeEnum);
	};

	return (
		<div className={cn(styles.widget, styles.order_form_advanced)}>
			<div
				className={cn(
					styles.order_form_buy_sell_options,
					sideType === OrderSideEnum.BUY && styles.buy,
				)}
			>
				<div
					data-name={OrderSideEnum.BUY}
					className={cn(
						styles.order_form_buy_sell_option,
						styles.buy,
						sideType === OrderSideEnum.BUY && styles.active,
					)}
					onClick={handleSideType}
				>
					<span>{formatMessage(messages.buy)}</span>
				</div>
				<div
					data-name={OrderSideEnum.SELL}
					className={cn(
						styles.order_form_buy_sell_option,
						sideType === OrderSideEnum.SELL && styles.active,
					)}
					onClick={handleSideType}
				>
					<span>{formatMessage(messages.sell)}</span>
				</div>
			</div>
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
				{render.margin && terminalType !== AccountTypeEnum.SPOT && (
					<InternalLink className={styles.order_form_advanced_faq} to={routes.marginTradingFaq}>
						FAQ
						<i className="ai ai-web_link" />
					</InternalLink>
				)}
			</div>
			<TradeForm type={tradeType} side={sideType} isDemo={isDemo} />
			{/* <TradeBonus /> */}
		</div>
	);
};

export default OrderFormWidgetAdvanced;
