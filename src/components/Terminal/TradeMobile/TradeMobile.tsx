import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import { SellOrders, BuyOrders } from "components/Terminal";
import styles from "styles/pages/TerminalMobile.module.scss";
import stylesTerminal from "styles/pages/Terminal.module.scss";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import TradeForm from "components/Terminal/TradeForm";
import Chart from "components/Terminal/Chart";
import exchangeMessages from "messages/exchange";
import Tab from "components/UI/Tab";
import Button from "components/UI/Button";
import Tabs from "components/UI/Tabs";
import useAccountType from "hooks/useAccountType";
import useTerminalLayout from "hooks/useTerminalLayout";
import { useMst } from "models/Root";
import { TerminalLayoutEnum } from "types/exchange";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { AccountTypeEnum } from "types/account";
import { IBalance } from "models/Account";
import InternalLink from "components/InternalLink";
import Tooltip from "components/UI/Tooltip";
import { routes } from "constants/routing";
import OrdersWidgetMobile from "./OrdersWidget";

const TradeMobile: React.FC = () => {
	const {
		terminal: { pair },
		account: { balances, balancesCross, balancesIsolated },
		global: { isAuthenticated },
		render,
	} = useMst();
	const layout = useTerminalLayout();
	const type = useAccountType();

	const { formatMessage, formatNumber } = useIntl();
	const [tradeFormAdvancedSide, setTradeFormAdvancedSide] = useState<OrderSideEnum | "">("");
	const [isTradeFormVisible, setIsTradeFormVisible] = useState<boolean>(false);
	const [orderType, setOrderType] = useState<OrderTypeEnum>(OrderTypeEnum.LIMIT);
	const [variant, setVariant] = useState<string>("trading");
	const terminalType = useAccountType();
	const isMargin =
		render.margin &&
		layout === TerminalLayoutEnum.ADVANCED &&
		(type === AccountTypeEnum.ISOLATED || type === AccountTypeEnum.CROSS);

	const handleOrderTypeChange = (name: string): void => {
		setOrderType(name as OrderTypeEnum);
	};

	const handleVariantChange = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
		const { name } = e.currentTarget.dataset;
		if (name) {
			setVariant(name);
		}
	};

	const handleTrade = () => {
		setVariant("trading");
	};

	const handleSetTradeFormAdvancedBuy = () => {
		setTradeFormAdvancedSide(OrderSideEnum.BUY);
		setIsTradeFormVisible(true);
	};

	const handleSetTradeFormAdvancedSell = () => {
		setTradeFormAdvancedSide(OrderSideEnum.SELL);
		setIsTradeFormVisible(true);
	};

	const handleHideTradeFormAdvanced = () => {
		setIsTradeFormVisible(false);
		setTradeFormAdvancedSide("");
	};

	const currentBalance =
		type === AccountTypeEnum.CROSS
			? balancesCross
			: type === AccountTypeEnum.ISOLATED
			? balancesIsolated
			: balances;
	const balance1: IBalance | null =
		currentBalance.find((b) => b.code === pair?.quote_currency_code) ?? null;
	const balance2: IBalance | null =
		currentBalance.find((b) => b.code === pair?.base_currency_code) ?? null;

	return (
		<div className={styles.trade_form_container}>
			<div className={styles.trades_chart_buttons}>
				<button
					className={cn(styles.trades_chart_button, variant === "trading" && styles.active)}
					onClick={handleVariantChange}
					data-name="trading"
					type="button"
				>
					<i className="ai ai-orders_outline" />
				</button>
				<button
					className={cn(styles.trades_chart_button, variant === "chart" && styles.active)}
					onClick={handleVariantChange}
					data-name="chart"
					type="button"
				>
					<i className="ai ai-chart_outline" />
				</button>
			</div>
			<div className={cn(styles.chart_container, variant === "chart" && styles.active)}>
				<Chart />
			</div>
			{variant === "chart" ? (
				<>
					<div className={cn(styles.order_book_container, styles.mini)}>
						<div className={styles.order_book_group}>
							<SellOrders mobile />
						</div>
						<div className={styles.order_book_group}>
							<BuyOrders mobile />
						</div>
					</div>
					<div className={styles.trade_button_container}>
						<Button
							onClick={handleTrade}
							label={`${formatMessage(financeMessages.trade)} ${pair?.label ?? "--"}`}
							fullWidth
						/>
					</div>
				</>
			) : (
				<>
					<div className={cn(styles.order_book_container, isMargin && styles.full_height)}>
						<div className={styles.order_book_group}>
							<SellOrders mobile />
						</div>
						<div className={styles.order_book_group}>
							<BuyOrders mobile />
						</div>
					</div>
					{isMargin ? (
						<div className={styles.buy_sell_buttons}>
							<Button
								variant="filled"
								color="tertiary"
								label={
									<>
										{formatMessage(exchangeMessages.buy)}&nbsp;{pair?.base_currency_code ?? "--"}
									</>
								}
								onClick={handleSetTradeFormAdvancedBuy}
								fullWidth
								mini
							/>
							<Button
								variant="filled"
								color="quinary"
								label={
									<>
										{formatMessage(exchangeMessages.sell)}&nbsp;{pair?.base_currency_code ?? "--"}
									</>
								}
								onClick={handleSetTradeFormAdvancedSell}
								fullWidth
								mini
							/>
						</div>
					) : (
						<>
							{isAuthenticated && (
								<div className={styles.balance_container}>
									<div className={styles.balance_currency_container}>
										<i className="ai ai-balance_outline" />
										{pair?.base_currency_code ? (
											<>
												<span className={styles.balance_currency}>{pair.base_currency_code}:</span>
												{balance2 !== null
													? formatNumber(balance2.available, {
															useGrouping: false,
															minimumFractionDigits: balance2.precision ?? 4,
															maximumFractionDigits: balance2.precision ?? 4,
													  })
													: "--"}
											</>
										) : null}
									</div>
									<div className={styles.balance_currency_container}>
										<i className="ai ai-balance_outline" />
										{pair?.quote_currency_code ? (
											<>
												<span className={styles.balance_currency}>{pair.quote_currency_code}:</span>
												{balance1 !== null
													? formatNumber(balance1.available, {
															useGrouping: false,
															minimumFractionDigits: balance1.precision ?? 4,
															maximumFractionDigits: balance1.precision ?? 4,
													  })
													: "--"}
											</>
										) : null}
									</div>
								</div>
							)}
							<Tabs className={styles.widget_tabs}>
								<Tab
									name={OrderTypeEnum.LIMIT}
									onClick={handleOrderTypeChange}
									isActive={orderType === OrderTypeEnum.LIMIT}
									className={styles.widget_tab}
									label={formatMessage(exchangeMessages.order_type_limit)}
								/>
								<Tab
									name={OrderTypeEnum.MARKET}
									onClick={handleOrderTypeChange}
									isActive={orderType === OrderTypeEnum.MARKET}
									className={styles.widget_tab}
									label={formatMessage(exchangeMessages.order_type_market)}
								/>
								<Tab
									name={OrderTypeEnum.STOP_LIMIT}
									onClick={handleOrderTypeChange}
									className={styles.widget_tab}
									isActive={orderType === OrderTypeEnum.STOP_LIMIT}
									label={
										<>
											{formatMessage(exchangeMessages.order_type_stop_limit)}
											<Tooltip
												id="stop-limit-order-widget"
												hint
												place="top"
												text={formatMessage(exchangeMessages.stop_limit_order_desc)}
											/>
										</>
									}
								/>
							</Tabs>
							{orderType === OrderTypeEnum.LIMIT && (
								<div className={styles.trade_container}>
									<TradeForm side={OrderSideEnum.BUY} type={OrderTypeEnum.LIMIT} />
									<TradeForm side={OrderSideEnum.SELL} type={OrderTypeEnum.LIMIT} />
								</div>
							)}
							{orderType === OrderTypeEnum.MARKET && (
								<div className={styles.trade_container}>
									<TradeForm side={OrderSideEnum.BUY} type={OrderTypeEnum.MARKET} />
									<TradeForm side={OrderSideEnum.SELL} type={OrderTypeEnum.MARKET} />
								</div>
							)}
							{orderType === OrderTypeEnum.STOP_LIMIT && (
								<div className={styles.trade_container}>
									<TradeForm side={OrderSideEnum.BUY} type={OrderTypeEnum.STOP_LIMIT} />
									<TradeForm side={OrderSideEnum.SELL} type={OrderTypeEnum.STOP_LIMIT} />
								</div>
							)}
							{isAuthenticated ? (
								<OrdersWidgetMobile />
							) : (
								<div className={styles.unauthorized_text_block}>
									{formatMessage(exchangeMessages.exchange_form_login_msg, {
										link1: (
											<InternalLink to={routes.login.root}>
												{formatMessage(commonMessages.login_noun)}
											</InternalLink>
										),
										link2: (
											<InternalLink to={routes.register.root}>
												{formatMessage(commonMessages.registerAction)}
											</InternalLink>
										),
									})}
								</div>
							)}
						</>
					)}
				</>
			)}
			{isMargin && tradeFormAdvancedSide !== "" && (
				<div className={styles.trade_form_advanced_container}>
					<div
						className={cn(styles.trade_form_advanced_backdrop, isTradeFormVisible && styles.show)}
						onClick={handleHideTradeFormAdvanced}
					/>
					<div
						className={cn(styles.trade_form_advanced_content, isTradeFormVisible && styles.show)}
					>
						<div
							className={cn(
								stylesTerminal.order_form_buy_sell_options,
								tradeFormAdvancedSide === OrderSideEnum.BUY && stylesTerminal.buy,
							)}
						>
							<div
								data-name={OrderSideEnum.BUY}
								className={cn(
									stylesTerminal.order_form_buy_sell_option,
									stylesTerminal.buy,
									tradeFormAdvancedSide === OrderSideEnum.BUY && stylesTerminal.active,
								)}
								onClick={handleSetTradeFormAdvancedBuy}
							>
								<span>{formatMessage(exchangeMessages.buy)}</span>
							</div>
							<div
								data-name={OrderSideEnum.SELL}
								className={cn(
									stylesTerminal.order_form_buy_sell_option,
									tradeFormAdvancedSide === OrderSideEnum.SELL && stylesTerminal.active,
								)}
								onClick={handleSetTradeFormAdvancedSell}
							>
								<span>{formatMessage(exchangeMessages.sell)}</span>
							</div>
						</div>
						<div className={stylesTerminal.tabs}>
							<Tab
								name={OrderTypeEnum.LIMIT}
								onClick={handleOrderTypeChange}
								isActive={orderType === OrderTypeEnum.LIMIT}
								label={formatMessage(exchangeMessages.order_type_limit)}
							/>
							<Tab
								name={OrderTypeEnum.MARKET}
								onClick={handleOrderTypeChange}
								isActive={orderType === OrderTypeEnum.MARKET}
								label={formatMessage(exchangeMessages.order_type_market)}
							/>
							<Tab
								name={OrderTypeEnum.STOP_LIMIT}
								onClick={handleOrderTypeChange}
								isActive={orderType === OrderTypeEnum.STOP_LIMIT}
								label={
									<>
										{formatMessage(exchangeMessages.order_type_stop_limit)}
										<Tooltip
											id="stop-limit-order"
											hint
											text={formatMessage(exchangeMessages.stop_limit_order_desc)}
										/>
									</>
								}
							/>
							{render.margin && terminalType !== AccountTypeEnum.SPOT && (
								<InternalLink
									className={stylesTerminal.order_form_advanced_faq}
									to={routes.marginTradingFaq}
								>
									FAQ
									<i className="ai ai-web_link" />
								</InternalLink>
							)}
						</div>
						<div className={styles.trade_form_advanced_content_inner}>
							<TradeForm type={orderType} side={tradeFormAdvancedSide} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default observer(TradeMobile);
