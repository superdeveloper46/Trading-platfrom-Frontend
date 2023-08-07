import React, { useState } from "react";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import { useIntl } from "react-intl";
import Tab from "components/UI/Tab";
import messages from "messages/common";
import { OrderbookTradesVariantEnum } from "types/exchange";
import exchangeMessages from "messages/exchange";
import RecentTrades from "./RecentTrades";
import { OrdersGroup } from "./OrderBook";

const OrderBookTrades: React.FC = () => {
	const [variant, setVariant] = useState<OrderbookTradesVariantEnum>(
		OrderbookTradesVariantEnum.ORDEBOOK,
	);
	const { formatMessage } = useIntl();

	const handleChangeVariant = (name: string): void => {
		setVariant(name as OrderbookTradesVariantEnum);
	};

	return (
		<div className={styles.orderbook_trades_advanced}>
			<div className={styles.tabs}>
				<Tab
					name={OrderbookTradesVariantEnum.ORDEBOOK}
					onClick={handleChangeVariant}
					isActive={variant === OrderbookTradesVariantEnum.ORDEBOOK}
					label={formatMessage(messages.orderbook)}
				/>
				<Tab
					name={OrderbookTradesVariantEnum.TRADES}
					onClick={handleChangeVariant}
					isActive={variant === OrderbookTradesVariantEnum.TRADES}
					label={formatMessage(exchangeMessages.recent_trades)}
				/>
				<Tab
					name={OrderbookTradesVariantEnum.ORDERBOOK_TRADES}
					onClick={handleChangeVariant}
					responsive
					isActive={variant === OrderbookTradesVariantEnum.ORDERBOOK_TRADES}
					label={`${formatMessage(messages.orderbook)} + ${formatMessage(
						exchangeMessages.recent_trades,
					)}`}
				/>
			</div>
			<div
				className={cn(
					styles.orderbook_trades_advanced_content,
					variant === OrderbookTradesVariantEnum.ORDERBOOK_TRADES && styles.grouped,
				)}
			>
				{variant === OrderbookTradesVariantEnum.ORDERBOOK_TRADES && (
					<>
						<OrdersGroup />
						<RecentTrades />
					</>
				)}
				{variant === OrderbookTradesVariantEnum.TRADES && <RecentTrades />}
				{variant === OrderbookTradesVariantEnum.ORDEBOOK && <OrdersGroup />}
			</div>
		</div>
	);
};

export default OrderBookTrades;
