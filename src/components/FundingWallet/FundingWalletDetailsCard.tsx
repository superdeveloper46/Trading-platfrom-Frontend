import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import { useMst } from "models/Root";
import cn from "classnames";
import messages from "messages/common";
import exchangeMessages from "messages/exchange";
import financeMessages from "messages/finance";
import styles from "styles/pages/WalletDetails.module.scss";
import cache from "helpers/cache";
import { FAVORITE_WALLETS_CACHE_KEY } from "utils/cacheKeys";
import { AccountTypeEnum } from "types/account";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import InfoSnack from "components/InfoSnack";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import { getFavoriteWallets } from "helpers/wallets";
import { IBalance } from "models/Account";
import useAccountType from "hooks/useAccountType";
import { MarginModalEnum, TerminalMobileWidgetEnum } from "types/exchange";
import MarginOperationModal from "components/Terminal/modals/MarginOperationModal";
import { ACCOUNT_TYPE } from "constants/exchange";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import useMarginLevel from "hooks/useMarginLevel";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";

const FundingWalletDetailsCard: React.FC = () => {
	const {
		account: {
			balances,
			balancesCross,
			balancesIsolated,
			balancesIsolatedPaired,
			isBalanceOperationsEnabled,
			isDepositEnabled,
			isWithdrawEnabled,
			isTransferEnabled,
		},
		finance: { marginOptions },
		tickers: { list: tickers },
		terminal: { setMobileActiveWidget },
	} = useMst();
	const { code } = useParams<{ code: string }>();
	const type = useAccountType();
	const { formatMessage, formatNumber } = useIntl();
	const [isFavorite, setIsFavorite] = useState<boolean>(false);
	const [openedMarginModal, setOpenedMarginModal] = useState<MarginModalEnum | "">("");

	const currentBalances =
		type === AccountTypeEnum.ISOLATED
			? balancesIsolatedPaired
			: type === AccountTypeEnum.CROSS
			? balancesCross
			: balances;

	const balance = currentBalances.find((b) => b.code === code);
	const balanceBase = balance
		? ((balance.paired_balance?.is_quoted ? balance : balance.paired_balance) as IBalance)
		: null;
	const balanceQuote = balance
		? ((balance.paired_balance?.is_quoted ? balance.paired_balance : balance) as IBalance)
		: null;

	const debtBase = balanceBase ? balanceBase?.debt ?? 0 : 0;
	const debtQuote = balanceQuote
		? +(balanceQuote?.borrowed ?? 0) + +(balanceQuote?.interest ?? 0)
		: 0;

	const currentOption =
		type === AccountTypeEnum.CROSS
			? marginOptions.find((o) => o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.CROSS])
			: type === AccountTypeEnum.ISOLATED
			? balance
				? marginOptions.find(
						(o) =>
							o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.ISOLATED] &&
							o.pair?.symbol === balance.pair?.replace("/", "_"),
				  )
				: null
			: null;

	const equityCurrency = currentOption?.equity_currency;

	const marginLevel = balance?.pair
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

	useEffect(() => {
		if (balance) {
			setIsFavorite(getFavoriteWallets().includes(balance.code));
		}
	}, [balance?.code]);

	const availableTickers =
		tickers.length && balance
			? tickers
					.filter(
						(t) =>
							t.symbol.split("_")?.includes(balance.code) &&
							(type === AccountTypeEnum.CROSS ? t.cross_margin_leverage > 0 : true) &&
							(type === AccountTypeEnum.ISOLATED ? t.isolated_margin_leverage > 0 : true),
					)
					.sort((t1, t2) => t2.quote_volume - t1.quote_volume)
			: [];

	const formatNum = (value: number, precision?: number | null) =>
		value > 0
			? formatNumber(value, {
					useGrouping: false,
					minimumFractionDigits: precision ?? 0,
					maximumFractionDigits: precision ?? 8,
			  })
			: "0.00";

	const handleFavoriteClick = () => {
		const favorites: string[] = getFavoriteWallets();
		const idx = favorites.findIndex((id: string) => id === balance?.code);
		if (idx !== -1) {
			favorites.splice(idx, 1);
			setIsFavorite(false);
		} else if (balance?.code) {
			favorites.push(balance?.code);
			setIsFavorite(true);
		}
		cache.setItem(FAVORITE_WALLETS_CACHE_KEY, favorites);
	};

	const handleMarginTransfer = (): void => {
		setOpenedMarginModal(MarginModalEnum.TRANSFER);
	};

	const handleMarginBorrow = (): void => {
		setOpenedMarginModal(MarginModalEnum.BORROW);
	};

	const handleMarginRepay = (): void => {
		setOpenedMarginModal(MarginModalEnum.REPAY);
	};

	const handleCloseMarginModal = () => {
		setOpenedMarginModal("");
	};

	const getBalanceValuationBTC = (b: IBalance) =>
		b?.valuation
			? formatNumber((b.valuation.BTC ?? 0) * +b.balance, FORMAT_NUMBER_OPTIONS_BTC)
			: "--";

	const getBalanceValuationUSDT = (b: IBalance) =>
		b?.valuation
			? formatNumber((b.valuation.USDT ?? 0) * +b.balance, FORMAT_NUMBER_OPTIONS_USDT)
			: "--";

	const renderBalanceInfo = (b: IBalance) => (
		<div className={styles.currency_balance_info}>
			<div>
				{b.image_svg || b.image_png ? (
					<img
						src={b.image_svg || b.image_png || ""}
						alt={b.code}
						width="60"
						height="60"
						loading="lazy"
					/>
				) : (
					<i className={`ai ai-${b.code?.toLowerCase()}`} />
				)}
			</div>
			<div>
				<span>{formatNum(+b.balance, b.precision)}</span>
				&nbsp;
				<span>{b.code}</span>
			</div>
			<span>≈&nbsp;$&nbsp;{getBalanceValuationUSDT(b)}</span>
		</div>
	);

	const renderBalanceInfoIsolated = (b: IBalance) => (
		<div className={cn(styles.currency_balance_info, styles.isolated)}>
			<div>
				{b.image_svg || b.image_png ? (
					<img
						src={b.image_svg || b.image_png || ""}
						alt={b.code}
						width="60"
						height="60"
						loading="lazy"
					/>
				) : (
					<i className={`ai ai-${b.code?.toLowerCase()}`} />
				)}
			</div>
			<div>
				<span>{formatNum(+b.balance, b.precision)}</span>
				&nbsp;
				<span>{b.code}</span>
			</div>
			<span>≈&nbsp;$&nbsp;{getBalanceValuationUSDT(b)}</span>
		</div>
	);

	const renderLiquidationPrice = () => {
		if (currentOption) {
			const { liquidationPrice, hasLiquidationPrice } =
				type === AccountTypeEnum.CROSS
					? useMarginLiquidationPrice(
							currentOption,
							AccountTypeEnum.CROSS,
							balance,
							null,
							balancesCross,
							balancesIsolated,
					  )
					: useMarginLiquidationPrice(
							currentOption,
							AccountTypeEnum.ISOLATED,
							balanceBase as IBalance,
							balanceQuote as IBalance,
							balancesCross,
							balancesIsolated,
					  );

			return balance ? (
				<div className={styles.regular_info_group}>
					<span>{formatMessage(financeMessages.liquidation_price)}</span>
					<span>
						{hasLiquidationPrice &&
						!Number.isNaN(liquidationPrice) &&
						liquidationPrice > 0 &&
						equityCurrency?.code !== balance.code
							? formatNumber(liquidationPrice, {
									useGrouping: false,
									maximumFractionDigits: equityCurrency?.precision ?? 8,
									minimumFractionDigits: equityCurrency?.precision ?? 0,
							  })
							: "--"}
					</span>
				</div>
			) : null;
		}

		return null;
	};

	const renderBalanceDetails = (b: IBalance) => (
		<div className={styles.info_container}>
			<div className={styles.regular_info_group}>
				<span>{formatMessage(financeMessages.available)}</span>
				<span>{formatNum(+b.balance - +b.reserve, b.precision)}</span>
			</div>
			<div className={styles.regular_info_group}>
				<span>{formatMessage(financeMessages.reserve)}</span>
				<span>{formatNum(+b.reserve, b.precision)}</span>
			</div>
			<div className={styles.regular_info_group}>
				<span>{formatMessage(financeMessages.btc_valuation)}</span>
				<span>{getBalanceValuationBTC(b)}&nbsp;BTC</span>
			</div>
			{[AccountTypeEnum.ISOLATED, AccountTypeEnum.CROSS].includes(type) && (
				<>
					<div className={styles.regular_info_group}>
						<span>{formatMessage(exchangeMessages.borrowed)}</span>
						<span>{formatNum(+(b.borrowed ?? 0), b.precision)}</span>
					</div>
					<div className={styles.regular_info_group}>
						<span>{formatMessage(exchangeMessages.interest)}</span>
						<span>{formatNum(+(b.interest ?? 0), b.precision)}</span>
					</div>
					{renderLiquidationPrice()}
					{type === AccountTypeEnum.ISOLATED && (
						<div className={styles.regular_info_group}>
							<span>{formatMessage(exchangeMessages.margin_level)}</span>
							<span>
								{marginLevel > 0
									? formatNumber(marginLevel, {
											useGrouping: false,
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: "--"}
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);

	const SpotBalanceOprations = (
		<>
			{isTransferEnabled && (
				<InternalLink to={routes.transfers.getCreateTransfer(balance?.code ?? "")}>
					<Button
						iconCode="mini_arrow_double"
						iconAlign="left"
						fullWidth
						variant="filled"
						mini
						color="primary"
						label={formatMessage(financeMessages.transfer)}
					/>
				</InternalLink>
			)}
			{isDepositEnabled && (
				<InternalLink to={routes.profile.getDepositCurrency(balance?.code ?? "")}>
					<Button
						fullWidth
						iconCode="mini_down_right"
						iconAlign="left"
						variant="filled"
						mini
						color="primary"
						disabled={!balance?.is_deposit_enabled}
						label={formatMessage(financeMessages.deposit)}
					/>
				</InternalLink>
			)}
			{isWithdrawEnabled && (
				<InternalLink to={routes.profile.getWithdrawCurrency(balance?.code ?? "")}>
					<Button
						iconCode="mini_up_right"
						iconAlign="left"
						variant="filled"
						fullWidth
						mini
						color="primary"
						disabled={!balance?.is_withdraw_enabled}
						label={formatMessage(financeMessages.withdraw)}
					/>
				</InternalLink>
			)}
		</>
	);

	const MarginBalanceOprations = (
		<>
			<Button
				fullWidth
				iconCode="mini_down_right"
				iconAlign="left"
				variant="filled"
				mini
				color="primary"
				label={formatMessage(financeMessages.borrow)}
				onClick={handleMarginBorrow}
			/>
			<Button
				iconCode="mini_up_right"
				iconAlign="left"
				variant="filled"
				fullWidth
				mini
				color="primary"
				disabled={
					!(type === AccountTypeEnum.ISOLATED
						? debtQuote > 0 || debtBase > 0
						: (balance?.debt ?? 0) > 0)
				}
				label={formatMessage(financeMessages.repay)}
				onClick={handleMarginRepay}
			/>
			<Button
				iconCode="mini_arrow_double"
				iconAlign="left"
				fullWidth
				variant="filled"
				mini
				color="primary"
				label={formatMessage(financeMessages.margin_transfer)}
				onClick={handleMarginTransfer}
			/>
		</>
	);

	return balance ? (
		<>
			<div className={styles.header}>
				<InternalLink to={routes.profile.wallets}>
					<i className="ai ai-chevron_left" />
				</InternalLink>
				<span>
					{type === AccountTypeEnum.ISOLATED
						? `${balanceBase?.name ?? "--"} / ${balanceQuote?.name ?? "--"}`
						: balance.name}
				</span>
				<InternalLink to={routes.financeHistory.deposits}>
					<i className="ai ai-history" />
				</InternalLink>
			</div>
			{type !== AccountTypeEnum.ISOLATED && renderBalanceInfo(balance)}
			<div
				className={cn(styles.favorites, isFavorite && styles.active)}
				onClick={handleFavoriteClick}
			>
				<i className={`ai ai-star_${isFavorite ? "filled" : "outlined"}`} />
			</div>
			{type === AccountTypeEnum.ISOLATED ? (
				<div className={styles.info_group}>
					{balanceBase ? (
						<>
							{renderBalanceInfoIsolated(balanceBase)}
							{renderBalanceDetails(balanceBase)}
						</>
					) : null}
					{balanceQuote ? (
						<>
							{renderBalanceInfoIsolated(balanceQuote)}
							{renderBalanceDetails(balanceQuote)}
						</>
					) : null}
				</div>
			) : (
				renderBalanceDetails(balance)
			)}
			{isBalanceOperationsEnabled && (
				<>
					<div className={styles.buttons_section_title}>
						{formatMessage(financeMessages.choose_operation)}
					</div>
					<div className={styles.buttons_section}>
						{type === AccountTypeEnum.SPOT ? SpotBalanceOprations : MarginBalanceOprations}
					</div>
				</>
			)}
			<div className={styles.pairs_list_title}>{formatMessage(financeMessages.trade)}</div>
			<div className={styles.pairs_list}>
				{availableTickers.map((t) => (
					<InternalLink
						to={`/${URL_VARS.TRADE}/${t.symbol}?${queryVars.type}=spot&${queryVars.layout}=standard`}
						key={t.symbol}
						onClick={() => {
							setMobileActiveWidget(TerminalMobileWidgetEnum.TRADE);
						}}
					>
						<div className={styles.pairs_list_item}>{t.symbol.replace("_", "/")}</div>
					</InternalLink>
				))}
			</div>
			<MarginOperationModal
				modal={openedMarginModal}
				pair={balance.pair}
				code={balance.code}
				onClose={handleCloseMarginModal}
				onBorrowModalOpen={handleMarginBorrow}
			/>
		</>
	) : currentBalances.length ? (
		<InfoSnack color="yellow">{formatMessage(messages.currency_is_not_available)}</InfoSnack>
	) : (
		<LoadingSpinner />
	);
};

export default observer(FundingWalletDetailsCard);
