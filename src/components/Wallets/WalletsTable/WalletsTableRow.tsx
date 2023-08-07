import React, { useEffect, useRef, useState } from "react";
import { FormatNumberOptions, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { ACCOUNT_TYPE } from "constants/exchange";
import financeMessages from "messages/finance";
import styles from "styles/pages/Wallets.module.scss";
import { AccountTypeEnum } from "types/account";
import { TableData, TableRow } from "components/UI/Table";
import { IBalance } from "models/Account";
import { ITicker } from "models/Ticker";
import { IMarginOption } from "models/Finance";
import useMarginLevel from "hooks/useMarginLevel";
import cache from "helpers/cache";
import { FAVORITE_WALLETS_CACHE_KEY } from "utils/cacheKeys";
import { getColorVariant } from "helpers/global";
import styleProps from "utils/styleProps";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import InternalLink from "components/InternalLink";
import { STARS_STR } from "constants/wallet";
import { TerminalLayoutEnum } from "types/exchange";
import { getFavoriteWallets } from "helpers/wallets";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";

interface IProps {
	balance: IBalance;
	tickers: ITicker[];
	isBalancesVisible: boolean;
	isDepositEnabled?: boolean;
	isWithdrawEnabled?: boolean;
	isTransferEnabled?: boolean;
	filterFavorite: boolean;
	type: AccountTypeEnum;
	onMarginTransfer: (code: string, pair: string) => void;
	onMarginBorrow: (code: string, pair: string) => void;
	onMarginRepay: (code: string, pair: string) => void;
	balancesCross: IBalance[];
	balancesIsolated: IBalance[];
	marginOptions?: IMarginOption[];
}

const WalletsTableRow: React.FC<IProps> = ({
	filterFavorite,
	tickers,
	balance,
	isBalancesVisible,
	isDepositEnabled,
	isWithdrawEnabled,
	isTransferEnabled,
	type,
	onMarginTransfer,
	onMarginBorrow,
	onMarginRepay,
	balancesCross,
	balancesIsolated,
	marginOptions = [],
}) => {
	const [isTradeMenuOpen, setIsTradeMenuOpen] = useState<boolean>(false);
	const tradeMenuRef = useRef<HTMLButtonElement | null>(null);
	const { formatMessage, formatNumber } = useIntl();
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	const balanceBase = balance.paired_balance?.is_quoted ? balance : balance.paired_balance;
	const balanceQuote = balance.paired_balance?.is_quoted ? balance.paired_balance : balance;
	const availableBase = balanceBase ? +balanceBase.balance - +balanceBase.reserve : 0;
	const availableQuote = balanceQuote ? +balanceQuote.balance - +balanceQuote.reserve : 0;

	const debtBase = balanceBase ? balanceBase?.debt ?? 0 : 0;
	const debtQuote = balanceQuote
		? +(balanceQuote?.borrowed ?? 0) + +(balanceQuote?.interest ?? 0)
		: 0;

	const equityBase = +balance.balance - balance.debt;
	const equityQuote = balanceQuote ? +balanceQuote.balance - debtQuote : 0;

	const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
		useGrouping: false,
		minimumFractionDigits: balance.precision ?? 0,
		maximumFractionDigits: balance.precision ?? 8,
	};

	const currentOption =
		type === AccountTypeEnum.CROSS
			? marginOptions.find(
					(o: IMarginOption) => o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.CROSS],
			  )
			: type === AccountTypeEnum.ISOLATED
			? marginOptions.find(
					(o: IMarginOption) =>
						o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.ISOLATED] &&
						o.pair?.symbol === balance.pair?.replace("/", "_"),
			  )
			: null;

	const equityCurrency = currentOption?.equity_currency;

	const valuationEquityBase = equityCurrency?.code ? balance.valuation?.[equityCurrency.code] : 0;
	const valuationEquityQuote = equityCurrency?.code
		? balanceQuote.valuation?.[equityCurrency.code]
		: 0;

	const marginLevel = balance.pair
		? useMarginLevel(
				equityCurrency?.code ?? "",
				balancesCross,
				balancesIsolated,
				[AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(type)
					? type
					: AccountTypeEnum.ISOLATED,
				balance.pair.replace("/", "_"),
		  ).marginLevel
		: 999;

	const availableTickers = tickers
		? tickers
				.filter(
					(t: ITicker) =>
						t.symbol.split("_")?.includes(balance.code) &&
						(type === AccountTypeEnum.CROSS ? t.cross_margin_leverage > 0 : true) &&
						(type === AccountTypeEnum.ISOLATED ? t.isolated_margin_leverage > 0 : true),
				)
				.sort((t1: ITicker, t2: ITicker) => t2.quote_volume - t1.quote_volume)
		: [];

	useEffect(() => {
		setIsFavorite(getFavoriteWallets().includes(balance.code));
	}, [balance.code]);

	const toggleIsTradeMenuOpen = () => {
		setIsTradeMenuOpen((prevState) => !prevState);
	};

	const handleMarginTransfer = (): void => {
		onMarginTransfer(
			type === AccountTypeEnum.ISOLATED ? balanceBase.code : balance.code,
			balance.pair ?? "",
		);
	};

	const handleMarginBorrow = (): void => {
		onMarginBorrow(
			type === AccountTypeEnum.ISOLATED ? balanceBase.code : balance.code,
			balance.pair ?? "",
		);
	};

	const handleMarginRepay = (): void => {
		onMarginRepay(
			type === AccountTypeEnum.ISOLATED ? balanceBase.code : balance.code,
			balance.pair ?? "",
		);
	};

	const handleFavoriteClick = () => {
		const favorites = getFavoriteWallets();
		const idx = favorites.findIndex((id: string) => id === balance.code);
		if (idx !== -1) {
			favorites.splice(idx, 1);
			setIsFavorite(false);
		} else {
			favorites.push(balance.code);
			setIsFavorite(true);
		}
		cache.setItem(FAVORITE_WALLETS_CACHE_KEY, favorites);
	};

	const handleCloseTradeMenu = (e: any): void => {
		if (tradeMenuRef.current && !tradeMenuRef?.current?.contains(e.target)) {
			setIsTradeMenuOpen(false);
		}
	};

	const handleScroll = () => {
		setIsTradeMenuOpen(false);
	};

	useEffect(() => {
		if (isTradeMenuOpen) {
			document.addEventListener("click", handleCloseTradeMenu);
			document.addEventListener("scroll", handleScroll);
		}
		return () => {
			document.removeEventListener("click", handleCloseTradeMenu);
			document.removeEventListener("scroll", handleScroll);
		};
	}, [isTradeMenuOpen]);

	const formatColumnNumber = (value: number) =>
		isBalancesVisible
			? value > 0
				? formatNumber(value, FORMAT_NUMBER_OPTIONS)
				: "0.00"
			: STARS_STR;

	const Available = () => (
		<TableData align="right" disabled={balance.available === 0} width="120px">
			{formatColumnNumber(balance.available)}
		</TableData>
	);

	const Total = () => (
		<TableData align="right" disabled={+balance.balance === 0} width="120px">
			{formatColumnNumber(+balance.balance)}
		</TableData>
	);

	const Debt = () => (
		<TableData
			className={styles.table_data_reserve}
			align="right"
			disabled={balance.debt <= 0}
			width="120px"
		>
			{formatColumnNumber(balance.debt)}
		</TableData>
	);

	const Position = () => (
		<TableData
			align="right"
			width="120px"
			styleInline={styleProps({ color: getColorVariant(equityBase) })}
		>
			{isBalancesVisible
				? formatNumber(equityBase, {
						useGrouping: false,
						minimumFractionDigits: balance.precision ?? 0,
						maximumFractionDigits: balance.precision ?? 8,
				  })
				: STARS_STR}
		</TableData>
	);

	const PositionValuated = () => (
		<TableData
			align="right"
			width="120px"
			styleInline={styleProps({ color: getColorVariant(equityBase) })}
		>
			{isBalancesVisible
				? valuationEquityBase
					? formatNumber(equityBase * valuationEquityBase, {
							useGrouping: false,
							minimumFractionDigits: equityCurrency?.precision ?? 0,
							maximumFractionDigits: equityCurrency?.precision ?? 8,
					  })
					: "--"
				: STARS_STR}
		</TableData>
	);

	const MarginLevel = () => (
		<TableData width="120px" align="right">
			{isBalancesVisible
				? marginLevel > 0
					? formatNumber(marginLevel, {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  })
					: "--"
				: STARS_STR}
		</TableData>
	);

	const Reserve = () => (
		<TableData
			className={styles.table_data_reserve}
			align="right"
			disabled={+balance.reserve === 0}
			width="120px"
		>
			{formatColumnNumber(+balance.reserve)}
		</TableData>
	);

	const Currency = () => (
		<TableData className={styles.table_data_currency} width="100px">
			<div
				className={cn(styles.favorite_icon, {
					[styles.active]: isFavorite && filterFavorite,
					[styles.favorite]: isFavorite,
				})}
				onClick={handleFavoriteClick}
			>
				<i className={`ai ai-star_${filterFavorite || isFavorite ? "filled" : "outlined"}`} />
			</div>
			<div className={styles.currency_value}>
				{balance.image_svg || balance.image_png ? (
					<img
						src={balance.image_svg || balance.image_png || ""}
						alt={balance.code}
						width="24"
						height="24"
						loading="lazy"
					/>
				) : (
					<i className={`ai ai-${balance.code?.toLowerCase()}`} />
				)}
				<span>
					<b>{balance.code ?? "-"}</b>
					{balance.name}
				</span>
			</div>
		</TableData>
	);

	const Pair = () => (
		<TableData className={styles.table_data_currency} width="100px">
			<div
				className={cn(styles.favorite_icon, {
					[styles.active]: isFavorite && filterFavorite,
					[styles.favorite]: isFavorite,
				})}
				onClick={handleFavoriteClick}
			>
				<i className={`ai ai-star_${filterFavorite || isFavorite ? "filled" : "outlined"}`} />
			</div>
			<div className={styles.currency_value}>
				<b>{balance.pair ?? "-"}</b>
			</div>
		</TableData>
	);

	const ApproxBalanceBTC = () => (
		<TableData column align="right" disabled={+balance.balance === 0} width="140px">
			{isBalancesVisible
				? balance.valuation
					? formatNumber((balance.valuation.BTC ?? 0) * +balance.balance, FORMAT_NUMBER_OPTIONS_BTC)
					: "--"
				: STARS_STR}
			&nbsp;BTC
			<span>
				{isBalancesVisible ? (
					balance.valuation ? (
						<>
							≈
							{formatNumber(
								(balance.valuation.USDT ?? 0) * +balance.balance,
								FORMAT_NUMBER_OPTIONS_USDT,
							)}
						</>
					) : (
						"--"
					)
				) : (
					STARS_STR
				)}
				&nbsp;USDT
			</span>
		</TableData>
	);

	const CurrencyIsolated = () => (
		<TableData className={styles.table_data_currency} width="100px" column>
			<div className={styles.currency_value}>
				{balanceBase.image_svg || balanceBase.image_png ? (
					<img
						src={balanceBase.image_svg || balanceBase.image_png}
						alt={balanceBase.code}
						width="24"
						height="24"
					/>
				) : (
					<i className={`ai ai-${balanceBase.code?.toLowerCase()}`} />
				)}
				<b>{balanceBase.code ?? "-"}</b>
			</div>
			<div className={styles.currency_value}>
				{balanceQuote ? (
					balanceQuote.image_svg || balanceQuote.image_png ? (
						<img
							src={balanceQuote.image_svg || balanceQuote.image_png}
							alt={balanceQuote.code}
							width="24"
							height="24"
						/>
					) : (
						<i className={`ai ai-${balanceQuote.code?.toLowerCase()}`} />
					)
				) : null}
				<b>{balanceQuote?.code ?? "-"}</b>
			</div>
		</TableData>
	);

	const AvailableIsolated = () => (
		<TableData align="right" width="120px" column>
			<span className="primary">
				{isBalancesVisible
					? availableBase > 0
						? formatNumber(availableBase, {
								useGrouping: false,
								minimumFractionDigits: balanceBase.precision,
								maximumFractionDigits: balanceBase.precision,
						  })
						: "0.00"
					: STARS_STR}
			</span>
			<span className="primary">
				{isBalancesVisible
					? availableQuote > 0
						? formatNumber(availableQuote, {
								useGrouping: false,
								minimumFractionDigits: balanceQuote.precision,
								maximumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"
					: STARS_STR}
			</span>
		</TableData>
	);

	// const TotalIsolated = () => (
	// 	<TableData align="right" width="120px" $multi $gap="8px">
	// 		<span className="primary">{formatColumnNumber(+balanceBase.balance)}</span>
	// 		<span className="primary">
	// 			{isBalancesVisible
	// 				? +balanceQuote?.balance > 0
	// 					? formatNumber(+balanceQuote.balance, {
	// 							useGrouping: false,
	// 							maximumFractionDigits: balanceQuote.precision,
	// 							minimumFractionDigits: balanceQuote.precision,
	// 					  })
	// 					: "0.00"
	// 				: STARS_STR}
	// 		</span>
	// 	</TableData>
	// );

	const ReserveIsolated = () => (
		<TableData className={styles.table_data_reserve} column align="right" width="120px">
			<span className="primary">{formatColumnNumber(+balanceBase.reserve)}</span>
			<span className="primary">
				{isBalancesVisible
					? +(balanceQuote?.reserve ?? 0) > 0
						? formatNumber(+balanceQuote.reserve, {
								useGrouping: false,
								maximumFractionDigits: balanceQuote.precision,
								minimumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"
					: STARS_STR}
			</span>
		</TableData>
	);

	const DebtIsolated = () => (
		<TableData className={styles.table_data_reserve} column align="right" width="120px">
			<span className="primary">{formatColumnNumber(debtBase)}</span>
			<span className="primary">
				{isBalancesVisible
					? debtQuote > 0
						? formatNumber(debtQuote, {
								useGrouping: false,
								maximumFractionDigits: balanceQuote.precision,
								minimumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"
					: STARS_STR}
			</span>
		</TableData>
	);

	const PositionIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary" style={styleProps({ color: getColorVariant(equityBase) })}>
				{isBalancesVisible
					? formatNumber(equityBase, {
							useGrouping: false,
							minimumFractionDigits: balance.precision ?? 0,
							maximumFractionDigits: balance.precision ?? 8,
					  })
					: STARS_STR}
			</span>
			<span className="primary" style={styleProps({ color: getColorVariant(equityQuote) })}>
				{isBalancesVisible
					? formatNumber(equityQuote, {
							useGrouping: false,
							minimumFractionDigits: balanceQuote.precision ?? 0,
							maximumFractionDigits: balanceQuote.precision ?? 8,
					  })
					: STARS_STR}
			</span>
		</TableData>
	);

	const PositionIsolatedValuated = () => (
		<TableData column align="right" minWidth="135px" width="135px">
			<span className="primary" style={styleProps({ color: getColorVariant(equityBase) })}>
				{isBalancesVisible
					? valuationEquityBase
						? formatNumber(equityBase * valuationEquityBase, {
								useGrouping: false,
								minimumFractionDigits: equityCurrency?.precision ?? 0,
								maximumFractionDigits: equityCurrency?.precision ?? 8,
						  })
						: "--"
					: STARS_STR}
			</span>
			<span className="primary" style={styleProps({ color: getColorVariant(equityQuote) })}>
				{isBalancesVisible
					? valuationEquityQuote
						? formatNumber(equityQuote * valuationEquityQuote, {
								useGrouping: false,
								minimumFractionDigits: equityCurrency?.precision ?? 0,
								maximumFractionDigits: equityCurrency?.precision ?? 8,
						  })
						: "--"
					: STARS_STR}
			</span>
		</TableData>
	);

	const LiquidationPriceEquity = () => {
		if (currentOption) {
			const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
				currentOption,
				AccountTypeEnum.CROSS,
				balance,
				null,
				balancesCross,
				balancesIsolated,
			);

			return (
				<TableData align="right" width="120px">
					<span>
						{isBalancesVisible
							? hasLiquidationPrice && equityCurrency?.code !== balance.code
								? formatNumber(liquidationPrice, {
										useGrouping: false,
										maximumFractionDigits: equityCurrency?.precision ?? 8,
										minimumFractionDigits: equityCurrency?.precision ?? 0,
								  })
								: "--"
							: STARS_STR}
					</span>
				</TableData>
			);
		}

		return (
			<TableData align="right" width="120px">
				<span>--</span>
			</TableData>
		);
	};

	const LiquidationPriceEquityIsolated = () => {
		if (currentOption) {
			const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
				currentOption,
				AccountTypeEnum.ISOLATED,
				balanceBase as IBalance,
				balanceQuote as IBalance,
				balancesCross,
				balancesIsolated,
			);

			return (
				<TableData align="right" width="120px">
					<span className="primary">
						{isBalancesVisible ? (
							!Number.isNaN(liquidationPrice) && hasLiquidationPrice && liquidationPrice > 0 ? (
								<>
									{formatNumber(liquidationPrice, {
										useGrouping: false,
										maximumFractionDigits: equityCurrency?.precision ?? 8,
										minimumFractionDigits: equityCurrency?.precision ?? 0,
									})}
									&nbsp;{equityCurrency?.code ?? "--"}
								</>
							) : (
								"--"
							)
						) : (
							STARS_STR
						)}
					</span>
				</TableData>
			);
		}

		return (
			<TableData align="right" width="120px">
				<span>--</span>
			</TableData>
		);
	};

	// const ApproxBalanceBTCIsolated = () => (
	// 	<TableData $multi $gap="8px" align="right" width="140px">
	// 		<span className="primary">
	// 			{isBalancesVisible
	// 				? balanceBase.valuation
	// 					? formatNumber(
	// 							(balanceBase.valuation.BTC ?? 0) * +balanceBase.balance,
	// 							FORMAT_NUMBER_OPTIONS_BTC,
	// 					  )
	// 					: "--"
	// 				: STARS_STR}
	// 			&nbsp;BTC
	// 		</span>
	// 		<span className="primary">
	// 			{isBalancesVisible
	// 				? balanceQuote?.valuation
	// 					? formatNumber(
	// 							(balanceQuote.valuation.BTC ?? 0) * +balanceQuote.balance,
	// 							FORMAT_NUMBER_OPTIONS_BTC,
	// 					  )
	// 					: "--"
	// 				: STARS_STR}
	// 			&nbsp;BTC
	// 		</span>
	// 	</TableData>
	// );

	const ColumnsSpot = () => (
		<>
			<Currency />
			<Available />
			<Reserve />
			<Total />
			<ApproxBalanceBTC />
		</>
	);

	const ColumnsCross = () => (
		<>
			<Currency />
			<Available />
			<Reserve />
			<Debt />
			<Position />
			<PositionValuated />
			<LiquidationPriceEquity />
			{/* <ApproxBalanceBTC /> */}
		</>
	);

	const ColumnsIsolated = () => (
		<>
			<Pair />
			<CurrencyIsolated />
			<AvailableIsolated />
			<ReserveIsolated />
			<DebtIsolated />
			<PositionIsolated />
			<PositionIsolatedValuated />
			<LiquidationPriceEquityIsolated />
			<MarginLevel />
			{/* <BalanceIsolated /> */}
			{/* <ApproxBalanceBTCIsolated /> */}
		</>
	);

	const TradeMenu = () => (
		<div
			className={styles.trade_menu}
			style={styleProps({
				top: `${(tradeMenuRef.current?.getBoundingClientRect().top ?? 0) + 25}px`,
				left: `${(tradeMenuRef.current?.getBoundingClientRect().left ?? 0) - 105}px`,
			})}
		>
			{availableTickers.map((t: ITicker) => (
				<InternalLink
					key={t.symbol}
					blank
					to={`/${URL_VARS.TRADE}/${t.symbol}?${queryVars.type}=${type}&${queryVars.layout}=${
						type === AccountTypeEnum.SPOT
							? TerminalLayoutEnum.STANDARD
							: TerminalLayoutEnum.ADVANCED
					}`}
				>
					<div className={styles.trade_menu_item}>{t.symbol.replace("_", "/")}</div>
				</InternalLink>
			))}
		</div>
	);

	return (
		<TableRow className={styles.table_row} common>
			{type === AccountTypeEnum.ISOLATED ? (
				<ColumnsIsolated />
			) : type === AccountTypeEnum.CROSS ? (
				<ColumnsCross />
			) : (
				<ColumnsSpot />
			)}
			<TableData align="center" />
			<TableData align="center" width="100px">
				{availableTickers.length > 0 && (
					<div className={styles.trade_action_container}>
						{type === AccountTypeEnum.ISOLATED || availableTickers.length === 1 ? (
							<InternalLink
								to={`/${URL_VARS.TRADE}/${
									type === AccountTypeEnum.ISOLATED
										? balance.pair?.replace("/", "_")
										: availableTickers[0].symbol.replace("/", "_")
								}?${queryVars.layout}=${
									type === AccountTypeEnum.SPOT
										? TerminalLayoutEnum.STANDARD
										: TerminalLayoutEnum.ADVANCED
								}&${queryVars.type}=${type}`}
							>
								<button className={cn(styles.trade_action, styles.active)} type="button">
									<i className="ai ai-bar_chart_mini" />
									<span>{formatMessage(financeMessages.trade)}</span>
								</button>
							</InternalLink>
						) : (
							<button
								className={cn(styles.trade_action, isTradeMenuOpen && styles.active)}
								type="button"
								onClick={toggleIsTradeMenuOpen}
								ref={tradeMenuRef}
							>
								<i className="ai ai-bar_chart_mini" />
								{formatMessage(financeMessages.trade)}
								{isTradeMenuOpen && <TradeMenu />}
								<i className="ai ai-arrow_down" />
							</button>
						)}
					</div>
				)}
			</TableData>
			<TableData align="center" width="120px">
				{type === AccountTypeEnum.SPOT ? (
					isTransferEnabled && (
						<InternalLink
							className={styles.action_button}
							to={routes.transfers.getCreateTransfer(balance.code)}
						>
							<i className="ai ai-mini_arrow_double" />
							{formatMessage(financeMessages.transfer)}
						</InternalLink>
					)
				) : (
					<button
						className={styles.action_button}
						type="button"
						onClick={handleMarginTransfer}
						data-tip
						data-for="margin-transfer"
					>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(financeMessages.margin_transfer)}
					</button>
				)}
			</TableData>
			<TableData align="center" width="100px">
				{type === AccountTypeEnum.SPOT ? (
					isDepositEnabled && (
						<InternalLink
							className={cn(styles.action_button, !balance.is_deposit_enabled && styles.disabled)}
							to={routes.profile.getDepositCurrency(balance.code)}
						>
							<i className="ai ai-mini_down_right" />
							{formatMessage(financeMessages.deposit)}
						</InternalLink>
					)
				) : (
					<button
						className={styles.action_button}
						type="button"
						onClick={handleMarginBorrow}
						data-tip
						data-for="margin-borrow"
					>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(financeMessages.borrow)}
					</button>
				)}
			</TableData>
			<TableData align="center" width="100px">
				{type === AccountTypeEnum.SPOT ? (
					isWithdrawEnabled && (
						<InternalLink
							className={cn(styles.action_button, !balance.is_withdraw_enabled && styles.disabled)}
							to={routes.profile.getWithdrawCurrency(balance.code)}
						>
							<i className="ai ai-mini_up_right" />
							{formatMessage(financeMessages.withdraw)}
						</InternalLink>
					)
				) : (
					<button
						className={cn(
							styles.action_button,
							!(type === AccountTypeEnum.ISOLATED
								? debtQuote > 0 || debtBase > 0
								: balance.debt > 0) && styles.disabled,
						)}
						type="button"
						onClick={handleMarginRepay}
						data-tip
						data-for="margin-repay"
					>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(financeMessages.repay)}
					</button>
				)}
			</TableData>
		</TableRow>
	);
};

export default observer(WalletsTableRow);
