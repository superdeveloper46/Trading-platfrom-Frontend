import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import styles from "styles/pages/Wallets.module.scss";
import { TableData, TableRow } from "components/UI/Table";
import cache from "helpers/cache";
import { FAVORITE_WALLETS_CACHE_KEY } from "utils/cacheKeys";
import InternalLink from "components/InternalLink";
import { STARS_STR } from "constants/wallet";
import { getFavoriteWallets } from "helpers/wallets";
import { routes } from "constants/routing";
import { IP2PBalance } from "types/p2p";
import exchangeMessages from "messages/exchange";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	minimumFractionDigits: 2,
	maximumFractionDigits: 8,
};

interface IProps {
	balance: IP2PBalance;
	isBalancesVisible: boolean;
	isDepositEnabled?: boolean;
	isWithdrawEnabled?: boolean;
	isTransferEnabled?: boolean;
	filterFavorite: boolean;
	openTransferModal: (asset: string) => void;
}

const FundingWalletTableRow: React.FC<IProps> = ({
	filterFavorite,
	balance,
	isBalancesVisible,
	isDepositEnabled,
	isWithdrawEnabled,
	isTransferEnabled,
	openTransferModal,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	const handleFavoriteClick = () => {
		const favorites = getFavoriteWallets();
		console.log({ favorites });
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

	const formatColumnNumber = (value: number) =>
		isBalancesVisible
			? value > 0
				? formatNumber(value, FORMAT_NUMBER_OPTIONS)
				: "0.00"
			: STARS_STR;

	const Available = () => (
		<TableData align="right" disabled={+balance.balance === 0} width="120px">
			{formatColumnNumber(+balance.balance)}
		</TableData>
	);

	const Total = () => (
		<TableData align="right" disabled={+balance.total === 0} width="120px">
			{formatColumnNumber(+balance.total)}
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

	// const ApproxBalanceBTC = () => (
	// 	<TableData column align="right" disabled={+balance.balance === 0} width="140px">
	// 		{isBalancesVisible
	// 			? balance.valuation
	// 				? formatNumber((balance.valuation.BTC ?? 0) * +balance.balance, FORMAT_NUMBER_OPTIONS_BTC)
	// 				: "--"
	// 			: STARS_STR}
	// 		&nbsp;BTC
	// 		<span>
	// 			{isBalancesVisible ? (
	// 				balance.valuation ? (
	// 					<>
	// 						≈
	// 						{formatNumber(
	// 							(balance.valuation.USDT ?? 0) * +balance.balance,
	// 							FORMAT_NUMBER_OPTIONS_USDT,
	// 						)}
	// 					</>
	// 				) : (
	// 					"--"
	// 				)
	// 			) : (
	// 				STARS_STR
	// 			)}
	// 			&nbsp;USDT
	// 		</span>
	// 	</TableData>
	// );

	const handleTransferClick = () => {
		openTransferModal(balance.code);
	};

	useEffect(() => {
		setIsFavorite(getFavoriteWallets().includes(balance.code));
	}, [balance.code]);

	const Columns = () => (
		<>
			<Currency />
			<Available />
			<Reserve />
			<Total />
			{/* <ApproxBalanceBTC /> */}
		</>
	);

	return (
		<TableRow className={styles.table_row} common>
			<Columns />
			<TableData align="center" />
			<TableData align="center" width="120px">
				{/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
				<div onClick={handleTransferClick} role="button" className={styles.action_button}>
					<i className="ai ai-mini_arrow_double" />
					{formatMessage(exchangeMessages.transfer)}
				</div>
			</TableData>
			<TableData align="center" width="120px">
				{isTransferEnabled && (
					<InternalLink
						className={styles.action_button}
						to={routes.transfers.getCreateTransfer(balance.code)}
					>
						<i className="ai ai-mini_arrow_double" />
						{formatMessage(commonMessages.send)}
					</InternalLink>
				)}
			</TableData>
			<TableData align="center" width="100px">
				{/* {isDepositEnabled && ( */}
				{/*	<InternalLink */}
				{/*		className={cn(styles.action_button)} */}
				{/*		// className={cn(styles.action_button, !balance.is_deposit_enabled && styles.disabled)} */}
				{/*		to={routes.profile.getDepositCurrency(balance.code)} */}
				{/*	> */}
				{/*		<i className="ai ai-mini_down_right" /> */}
				{/*		{formatMessage(financeMessages.deposit)} */}
				{/*	</InternalLink> */}
				{/* )} */}
			</TableData>
			<TableData align="center" width="100px">
				{/* {isWithdrawEnabled && ( */}
				{/*	<InternalLink */}
				{/*		className={cn(styles.action_button)} */}
				{/*		// className={cn(styles.action_button, !balance.is_withdraw_enabled && styles.disabled)} */}
				{/*		to={routes.profile.getWithdrawCurrency(balance.code)} */}
				{/*	> */}
				{/*		<i className="ai ai-mini_up_right" /> */}
				{/*		{formatMessage(financeMessages.withdraw)} */}
				{/*	</InternalLink> */}
				{/* )} */}
			</TableData>
		</TableRow>
	);
};

export default observer(FundingWalletTableRow);
