import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import messages from "messages/exchange";
import commonMessages from "messages/common";
import styles from "styles/pages/Terminal.module.scss";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import useTradeForm from "hooks/useTradeForm";
import { useMst } from "models/Root";
import { formatNumberNoRounding } from "utils/format";
import useWindowSize from "hooks/useWindowSize";
import Button from "components/UI/Button";
import InputExchange from "components/UI/InputExchange";
import { Appender, AppenderDivider } from "components/UI/Input";
import InternalLink from "components/InternalLink";
import useAccountType from "hooks/useAccountType";
import { AccountTypeEnum } from "types/account";
import useTerminalLayout from "hooks/useTerminalLayout";
import { ICreateOrderBody, MarginActionTypeEnum, TerminalLayoutEnum } from "types/exchange";
import { ACCOUNT_TYPE } from "constants/exchange";
import RadioChoice from "components/UI/Radio";
import { IBalance } from "models/Account";
import { getBalance } from "helpers/account";
import { routes } from "constants/routing";
import { InputNameEnum } from "types/terminal";
import { useTradingFees } from "services/TradingFeesService";
import AutoFillRange from "./AutoFillRange";
import MarginStats from "./MarginStats";
import StopLimitConfirmModal from "../modals/StopLimitConfirmModal";
import Loans from "./Loans";

interface IProps {
	isDemo?: boolean;
	side: OrderSideEnum;
	type: OrderTypeEnum;
}

const TradeForm: React.FC<IProps> = ({ isDemo, side, type }) => {
	const {
		terminal: { pair, tradeForm, marginCurrency, loadMarginCurrency },
		account: { balances, balancesCross, balancesIsolated, loadBalances },
		global: { isAuthenticated },
		render,
	} = useMst();
	const accountType = useAccountType();
	const layout = useTerminalLayout();
	const { formatNumber, formatMessage } = useIntl();
	const { mobile, desktop } = useWindowSize();
	const [activeMarketInputGroup, setActiveMarketInputGroup] = useState<string>(
		InputNameEnum.AMOUNT,
	);
	const [actionType, setActionType] = useState<MarginActionTypeEnum>(MarginActionTypeEnum.NORMAL);
	const [stopLimitOrder, setStopLimitOrder] = useState<ICreateOrderBody | null>(null);
	const { data: tradingFees } = useTradingFees();

	const isMargin =
		render.margin &&
		layout === TerminalLayoutEnum.ADVANCED &&
		(accountType === AccountTypeEnum.ISOLATED || accountType === AccountTypeEnum.CROSS);

	const handleChangeActionType = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setActionType(e.target.value as MarginActionTypeEnum);
	};

	const currentBalance = pair
		? getBalance(
				side === OrderSideEnum.BUY ? pair.quote_currency_code : pair.base_currency_code,
				pair.symbol,
				accountType,
				balances,
				balancesCross,
				balancesIsolated,
		  )
		: null;

	const isAutoFillDisabled =
		!isAuthenticated ||
		(!(+(currentBalance?.available ?? 0) > 0) && actionType !== MarginActionTypeEnum.BORROW);

	const clickedOrderBySide =
		side === OrderSideEnum.SELL ? tradeForm.clickedSellOrder : tradeForm.clickedBuyOrder;
	const amountPrecision = pair?.amount_precision || 8;
	const pricePrecision = pair?.price_precision || 8;

	const fee = tradingFees?.personal?.fee_tier?.taker_fee_rate ?? pair?.taker_fee_rate ?? 0.002;

	const baseCurrencyCode = pair?.base_currency_code || "";
	const quoteCurrencyCode = pair?.quote_currency_code || "";

	const quoteCurrencyPrecision = marginCurrency.quote?.currency?.precision ?? 8;
	const baseCurrencyPrecision = marginCurrency.base?.currency?.precision ?? 8;

	const currencyCodeBySide = side === OrderSideEnum.BUY ? quoteCurrencyCode : baseCurrencyCode;
	const debtCurrencyCodeBySide = side === OrderSideEnum.BUY ? baseCurrencyCode : quoteCurrencyCode;

	const marginCurrencyCodeBySide =
		side === OrderSideEnum.BUY ? quoteCurrencyCode : baseCurrencyCode;
	const marginCurrencyPrecisionBySide =
		side === OrderSideEnum.BUY ? quoteCurrencyPrecision : baseCurrencyPrecision;

	const marginAvailable = marginCurrency.getAvailable(side);
	const marginAvailablePlusBorrowable = marginCurrency.getAvailablePlusBorrowable(side);
	const marginDebt = marginCurrency.getDebt(side);

	const marginBalances: { [key: string]: IBalance[] } = {
		cross: balancesCross,
		isolated: balancesIsolated,
	};
	const currentMarginBalances = marginBalances[accountType] ?? [];
	const filterEmptyNPair = (b: IBalance) =>
		b.debt > 0 && (b.pair ? b.pair.replace("/", "_") === pair?.symbol : true);

	const loans: IBalance[] = currentMarginBalances.filter(filterEmptyNPair);

	const onOpenStopLimitModal = (order: ICreateOrderBody) => {
		setStopLimitOrder(order);
	};

	const handleCloseStopLimitModal = () => {
		setStopLimitOrder(null);
	};

	const {
		body,
		formErrors,
		onUpdateFormBody,
		onUpdateFormErrors,
		onSetFillPercentage,
		realBody,
		onInputChange,
		onAutoFill,
		onAutoFillMarginDebt,
		onSubmit,
		isOnSubmitLoading,
		fillPercentage,
	} = useTradeForm(
		pair ?? {},
		side,
		type,
		activeMarketInputGroup,
		isMargin
			? {
					actionType: actionType,
					availablePlusBorrowable: marginAvailablePlusBorrowable,
					available: marginAvailable,
					debt: marginDebt,
			  }
			: null,
		{ currentBalance: currentBalance as any },
		isAuthenticated,
		loadMarginCurrency,
		onOpenStopLimitModal,
	);

	const handleSubmit = async () => {
		await onSubmit();
		if (isMargin) {
			loadBalances();
		}
	};

	useEffect(() => {
		if (clickedOrderBySide) {
			const price = formatNumberNoRounding(clickedOrderBySide.price, pricePrecision);
			const amount = formatNumberNoRounding(clickedOrderBySide.orderDepth, amountPrecision);
			const total = formatNumberNoRounding(+price * +amount, pricePrecision);
			onUpdateFormBody({
				price,
				amount,
				total,
				stop_price: body.stop_price,
			});
			onUpdateFormErrors({});
			tradeForm.resetState();

			if (currentBalance) {
				switch (side) {
					case OrderSideEnum.SELL:
						onSetFillPercentage((+amount / currentBalance.available) * 100);
						break;
					case OrderSideEnum.BUY:
						onSetFillPercentage((+total / currentBalance.available) * 100);
						break;
					default:
						break;
				}
			}
		}
	}, [clickedOrderBySide, side, amountPrecision, currentBalance]);

	useEffect(() => {
		if (
			isAuthenticated &&
			isMargin &&
			pair &&
			pair.symbol &&
			(pair.cross_margin_leverage || pair.isolated_margin_leverage)
		) {
			updateMarginCurrency();
		}
	}, [
		pair?.id,
		pair?.symbol,
		pair?.cross_margin_leverage,
		pair?.isolated_margin_leverage,
		accountType,
		quoteCurrencyCode,
		baseCurrencyCode,
		isAuthenticated,
	]);

	const updateMarginCurrency = () => {
		loadMarginCurrency(
			ACCOUNT_TYPE[accountType],
			baseCurrencyCode,
			quoteCurrencyCode,
			accountType === AccountTypeEnum.ISOLATED ? pair?.symbol : undefined,
		);
	};

	const handleMarketInputGroupChange = (group: string): void => {
		setActiveMarketInputGroup(group);
	};

	const handleWalletBalanceFillRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value = "0" } = e.target;
		onAutoFill(+value / 100);
	};

	const handleWalletBalancePartChange = (e: React.MouseEvent<HTMLDivElement>) => {
		const { part = "0" } = e.currentTarget.dataset;
		onAutoFill(+part / 100);
	};

	const handleAutoFillFull = () => {
		onAutoFill();
	};

	const WalletBalance = (
		<div
			className={cn(styles.trade_form_wallet_balance, isDemo && styles.demo)}
			onClick={handleAutoFillFull}
		>
			<i className="ai ai-balance_outline" />
			<span>
				{currentBalance
					? formatNumberNoRounding(currentBalance.available, currentBalance.precision ?? 8)
					: "--"}
			</span>
			&nbsp;
			{currencyCodeBySide}
		</div>
	);

	const WalletBalanceMargin = (
		<div className={styles.trade_form_margin_wallet_balance}>
			<div
				className={cn(styles.trade_form_wallet_balance, isDemo && styles.demo)}
				onClick={handleAutoFillFull}
			>
				<i className="ai ai-balance_outline" />
				&nbsp;
				<b>
					{formatNumber(
						actionType === MarginActionTypeEnum.BORROW
							? marginAvailablePlusBorrowable
							: marginAvailable,
						{
							useGrouping: false,
							maximumFractionDigits: marginCurrencyPrecisionBySide,
							minimumFractionDigits: marginCurrencyPrecisionBySide,
						},
					)}
				</b>
				&nbsp;
				{marginCurrencyCodeBySide}
			</div>
			{actionType === MarginActionTypeEnum.BORROW && (
				<div className={styles.trade_form_margin_wallet_action}>
					Max. borrow:
					<span>
						{marginCurrency.quote || marginCurrency.base
							? formatNumber(
									side === OrderSideEnum.BUY
										? +(marginCurrency.quote?.borrowable ?? 0)
										: +(marginCurrency.base?.borrowable ?? 0),
									{
										useGrouping: false,
										maximumFractionDigits: marginCurrencyPrecisionBySide,
										minimumFractionDigits: marginCurrencyPrecisionBySide,
									},
							  )
							: "--"}
						&nbsp;{currencyCodeBySide}
					</span>
				</div>
			)}
			{actionType === MarginActionTypeEnum.REPAY && (
				<div className={styles.trade_form_margin_wallet_action} onClick={onAutoFillMarginDebt}>
					Debt:
					<span>
						{formatNumberNoRounding(marginDebt, 8)}
						&nbsp;
						{debtCurrencyCodeBySide}
					</span>
				</div>
			)}
		</div>
	);

	return (
		<>
			<div className={styles.trade_form}>
				{!mobile && (
					<div className={styles.trade_form_header}>
						<div className={styles.trade_form_title}>
							{formatMessage(side === OrderSideEnum.BUY ? messages.buy : messages.sell)}
							&nbsp;
							{side === OrderSideEnum.BUY ? (
								<span className={styles.trade_form_header_green_bold}>{baseCurrencyCode}</span>
							) : (
								<span className={styles.trade_form_header_red_bold}>{baseCurrencyCode}</span>
							)}
						</div>
						{isAuthenticated && (isMargin ? WalletBalanceMargin : WalletBalance)}
					</div>
				)}
				{isMargin && (
					<div className={styles.trade_form_action_types}>
						<RadioChoice
							name="action-type"
							choice="normal"
							label={formatMessage(messages.order_action_type_normal)}
							onChange={handleChangeActionType}
							value={actionType}
						/>
						<RadioChoice
							name="action-type"
							choice="borrow"
							label={formatMessage(messages.order_action_type_borrow)}
							onChange={handleChangeActionType}
							value={actionType}
						/>
						<RadioChoice
							name="action-type"
							choice="repay"
							label={formatMessage(messages.order_action_type_repay)}
							onChange={handleChangeActionType}
							value={actionType}
						/>
					</div>
				)}
				{type === OrderTypeEnum.STOP_LIMIT && (
					<InputExchange
						name={`${side}-stop_price`}
						value={body.stop_price}
						onChange={onInputChange}
						onEnter={handleSubmit}
						labelValue={formatMessage(messages.stop_price)}
						error={formErrors.stop_price}
						appender={
							<Appender>
								{quoteCurrencyCode}/{baseCurrencyCode}
							</Appender>
						}
					/>
				)}
				<InputExchange
					name={`${side}-price`}
					value={
						type === OrderTypeEnum.MARKET
							? pair
								? `≈${formatNumberNoRounding(pair.close, pair.price_precision)}`
								: ""
							: body.price
					}
					onChange={onInputChange}
					onEnter={handleSubmit}
					labelValue={formatMessage(
						type === OrderTypeEnum.STOP_LIMIT ? messages.limit_price : messages.price,
					)}
					error={formErrors.price}
					disabled={type === OrderTypeEnum.MARKET}
					appender={
						<Appender>
							{type === OrderTypeEnum.MARKET && (
								<>
									Market
									<AppenderDivider />
								</>
							)}
							{quoteCurrencyCode}
						</Appender>
					}
				/>
				{type === OrderTypeEnum.MARKET ? (
					<>
						<InputExchange
							name={`${side}-${activeMarketInputGroup}`}
							value={body[activeMarketInputGroup]}
							onChange={onInputChange}
							onEnter={handleSubmit}
							error={formErrors[activeMarketInputGroup] || formErrors.non_field_errors}
							appender={
								<Appender>
									{activeMarketInputGroup === InputNameEnum.AMOUNT
										? baseCurrencyCode
										: quoteCurrencyCode}
								</Appender>
							}
							groups={[
								{
									name: InputNameEnum.AMOUNT,
									label: formatMessage(commonMessages.amount),
								},
								{ name: InputNameEnum.QUOTE_AMOUNT, label: formatMessage(commonMessages.total) },
							]}
							activeGroup={activeMarketInputGroup}
							onGroupChange={handleMarketInputGroupChange}
						/>
						<AutoFillRange
							value={fillPercentage}
							disabled={isAutoFillDisabled}
							onPartChange={handleWalletBalancePartChange}
							onRangeChange={handleWalletBalanceFillRangeChange}
						/>
					</>
				) : (
					<>
						<InputExchange
							name={`${side}-amount`}
							value={body.amount}
							onChange={onInputChange}
							onEnter={handleSubmit}
							labelValue={formatMessage(commonMessages.amount)}
							error={formErrors.amount}
							appender={<Appender>{baseCurrencyCode}</Appender>}
						/>
						<AutoFillRange
							value={fillPercentage}
							disabled={isAutoFillDisabled}
							onPartChange={handleWalletBalancePartChange}
							onRangeChange={handleWalletBalanceFillRangeChange}
						/>
						<InputExchange
							name={`${side}-total`}
							value={body.total}
							error={formErrors.total || formErrors.non_field_errors}
							onChange={onInputChange}
							onEnter={handleSubmit}
							labelValue={formatMessage(commonMessages.total)}
							appender={<Appender>{quoteCurrencyCode}</Appender>}
						/>
					</>
				)}
				{isAuthenticated ? (
					<>
						<Button
							variant="filled"
							color={side === OrderSideEnum.BUY ? "tertiary" : "quinary"}
							mini
							onClick={handleSubmit}
							isLoading={isOnSubmitLoading}
							fullWidth
							label={
								<>
									{type === OrderTypeEnum.STOP_LIMIT
										? "Stop Limit"
										: type === OrderTypeEnum.MARKET
										? "Market"
										: "Limit"}
									&nbsp;
									{formatMessage(side === OrderSideEnum.BUY ? messages.buy : messages.sell)}
									&nbsp;
									{baseCurrencyCode}
								</>
							}
						/>
						{type !== OrderTypeEnum.MARKET && (
							<div className={styles.trade_form_fee_container}>
								<span>{formatMessage(messages.fee)}</span>
								<div>
									<div className={styles.amount}>
										≈
										{formatNumber(
											(side === OrderSideEnum.BUY ? realBody.amount * fee : realBody.total * fee) ||
												0,
											{
												useGrouping: false,
												maximumFractionDigits: amountPrecision,
											},
										)}
									</div>
									&nbsp;
									{side === OrderSideEnum.BUY ? baseCurrencyCode : quoteCurrencyCode}
								</div>
							</div>
						)}
					</>
				) : !mobile ? (
					<div className={styles.trade_form_login_container}>
						{formatMessage(messages.exchange_form_login_msg, {
							link1: (
								<InternalLink to={routes.login.root}>
									{formatMessage(commonMessages.login_noun)}
								</InternalLink>
							),
							link2: (
								<InternalLink to={routes.register.root} className="text-center text-underline">
									{formatMessage(commonMessages.registerAction)}
								</InternalLink>
							),
						})}
					</div>
				) : null}
				{isAuthenticated && isMargin && (
					<MarginStats
						currencyCode={marginCurrencyCodeBySide}
						updateMarginCurrency={updateMarginCurrency}
					/>
				)}
				{stopLimitOrder ? (
					<StopLimitConfirmModal
						isOpen
						onClose={handleCloseStopLimitModal}
						pair={pair}
						order={stopLimitOrder}
					/>
				) : null}
			</div>
			{isAuthenticated && isMargin && desktop && <Loans loans={loans} />}
		</>
	);
};

export default observer(TradeForm);
