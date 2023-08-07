import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import Table, { IHeaderColumn } from "components/UI/Table/Table";
import { formatWallets, generateCharArray, generateNumArray } from "helpers/wallets";
import financeMessages from "messages/finance";
import { useMst } from "models/Root";
import Tooltip from "components/UI/Tooltip";
import styles from "styles/pages/Wallets.module.scss";
import { AccountTypeEnum } from "types/account";
import NoRowsMessage from "components/Table/NoRowsMessage";
import MarginRiskModal from "components/Terminal/modals/MarginRiskModal";
import { MarginModalEnum } from "types/exchange";
import MarginOperationModal from "components/Terminal/modals/MarginOperationModal";
import { queryVars } from "constants/query";
import WalletsTableRowSkeleton from "./WalletsTableRowSkeleton";
import WalletsTableRow from "./WalletsTableRow";
import Tabs from "../Tabs";
import Filters from "../Filters";

const WalletsTable: React.FC = () => {
	const {
		finance: {
			walletsFilter,
			setWalletsFilter,
			isBalancesVisible,
			marginOptions,
			crossMarginOption,
			marginRequiredVerificationLevel,
		},
		account: {
			balancesCross,
			balancesIsolated,
			isBalancesLoaded,
			profileStatus,
			getWalletBalancesByType,
			loadProfileStatus,
			isDepositEnabled,
			isWithdrawEnabled,
			isTransferEnabled,
		},
		tickers: { list: tickers },
		render,
	} = useMst();
	const [openedMarginModal, setOpenedMarginModal] = useState<{
		type: MarginModalEnum | "";
		pair: string;
		code: string;
	}>({ type: "", pair: "", code: "" });
	const [isMarginRiskModalOpened, setIsMarginRiskModalOpened] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const navigate = useNavigate();
	const tooltipRef = useRef<ReactTooltip>(null);
	const [sortName, sortValue] = walletsFilter.sort.split(".");

	const currentBalances = getWalletBalancesByType(walletsFilter.accountType as AccountTypeEnum);
	const filteredBalances = formatWallets(
		currentBalances,
		walletsFilter,
		crossMarginOption ?? null,
		balancesCross,
		balancesIsolated,
	);

	const handleChangeFilterSort = (name: string) => {
		const nextFilter = {
			...walletsFilter,
			sort: `${name}.${sortValue === queryVars.asc ? queryVars.desc : queryVars.asc}`,
		};
		setWalletsFilter(nextFilter);
	};

	const handleCloseMarginRiskModal = () => {
		setIsMarginRiskModalOpened(false);
		setWalletsFilter({
			...walletsFilter,
			accountType: AccountTypeEnum.SPOT,
			sort: "code.asc",
		});
		navigate({ [queryVars.search]: `?${queryVars.type}=spot` });
	};

	const handleCloseAcceptedMarginRiskModal = () => {
		setIsMarginRiskModalOpened(false);
		loadProfileStatus();
	};

	const handleCloseModal = () => {
		setOpenedMarginModal({ type: "", code: "", pair: "" });
	};

	useEffect(() => {
		if (walletsFilter.isMargin && profileStatus?.isMarginRulesAcceptRequired) {
			setIsMarginRiskModalOpened(true);
		}
	}, [walletsFilter.isMargin, profileStatus?.isMarginRulesAcceptRequired]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [
		walletsFilter.accountType,
		openedMarginModal.type,
		isTransferEnabled,
		isDepositEnabled,
		isWithdrawEnabled,
	]);

	const handleOpenBorrowModal = () => {
		setOpenedMarginModal((prevState) => ({ ...prevState, type: MarginModalEnum.BORROW }));
	};

	const handleMarginTransfer = (code: string, pair = ""): void => {
		setOpenedMarginModal({ type: MarginModalEnum.TRANSFER, pair: pair, code: code });
	};

	const handleMarginBorrow = (code: string, pair = ""): void => {
		setOpenedMarginModal({ type: MarginModalEnum.BORROW, pair: pair, code: code });
	};

	const handleMarginRepay = (code: string, pair = ""): void => {
		setOpenedMarginModal({ type: MarginModalEnum.REPAY, pair: pair, code: code });
	};

	const columnsSpot: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.currency),
			width: "100px",
			name: "code",
		},
		{
			label: formatMessage(financeMessages.available),
			width: "120px",
			name: "available",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.reserve),
			width: "120px",
			name: "reserve",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.total),
			width: "120px",
			name: "balance",
			align: "right",
		},
		{
			label: `${formatMessage(financeMessages.approx_total)} BTC (USDT)`,
			width: "120px",
			name: "approx-btc",
			align: "right",
		},
	];

	const columnsCross: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.currency),
			width: "100px",
			name: "code",
		},
		{
			label: formatMessage(financeMessages.available),
			width: "120px",
			name: "available",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.reserve),
			width: "120px",
			name: "reserve",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.debt),
			width: "120px",
			name: "debt",
			align: "right",
		},
		{
			label: (
				<>
					{formatMessage(financeMessages.position)}
					<Tooltip id="position" hint text="Position = “Total Amount - Debt”" />
				</>
			),
			width: "120px",
			name: "position",
			align: "right",
		},
		{
			label: `${formatMessage(financeMessages.position)} ${
				crossMarginOption?.equity_currency?.code ?? "--"
			}`,
			width: "120px",
			name: "position-equity",
			align: "right",
		},
		{
			label: `${formatMessage(financeMessages.liquidation_price)} ${
				crossMarginOption?.equity_currency?.code ?? "--"
			}`,
			width: "120px",
			name: "liquidation-price",
			align: "right",
		},
	];

	const columnsIsolated: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.pair),
			width: "100px",
			name: "pair",
		},
		{
			label: formatMessage(financeMessages.currency),
			width: "100px",
			name: "code",
		},
		{
			label: formatMessage(financeMessages.available),
			width: "120px",
			name: "available",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.reserve),
			width: "120px",
			name: "reserve",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.debt),
			width: "120px",
			name: "debt",
			align: "right",
		},
		{
			label: (
				<>
					{formatMessage(financeMessages.position)}
					<Tooltip id="position" hint text="Position = “Total Amount - Debt”" />
				</>
			),
			width: "120px",
			name: "position",
			align: "right",
		},
		{
			label: (
				<>
					{formatMessage(financeMessages.position_quote)}
					<Tooltip
						id="position_quote"
						hint
						text="Position Quote = “(Total Amount - Debt) * Rate”"
					/>
				</>
			),
			minWidth: "135px",
			width: "135px",
			name: "position-quote",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.liquidation_price),
			width: "120px",
			name: "liquidation-price",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.margin_level),
			width: "120px",
			name: "margin-level",
			align: "right",
		},
	];

	const columns = walletsFilter.isMarginIsolated
		? columnsIsolated
		: walletsFilter.isMarginCross
		? columnsCross
		: columnsSpot;

	const emptyColumns: IHeaderColumn[] = [
		{
			align: "center",
		},
		{
			align: "center",
			width: "100px",
		},
		{
			align: "center",
			width: "100px",
		},
		{
			align: "center",
			width: "100px",
		},
		{
			align: "center",
			width: "100px",
		},
	];

	return (
		<div className={styles.table_container}>
			<Tabs />
			<Filters />
			<Table
				stripped
				header={{
					primary: true,
					className: styles.table_header,
					columns: columns
						.map((col) => ({
							label: col.label,
							align: col.align,
							name: col.name,
							width: col.width,
							minWidth: col.minWidth,
							sort: sortName === col.name ? sortValue : "none",
							onSortChange: handleChangeFilterSort,
						}))
						.concat(emptyColumns as any),
				}}
			>
				{!isBalancesLoaded ? (
					[...new Array(15)].map((_, i: number) => (
						<WalletsTableRowSkeleton key={i} type={walletsFilter.accountType as AccountTypeEnum} />
					))
				) : currentBalances.length > 0 ? (
					walletsFilter.showFiltered ? (
						filteredBalances.length ? (
							filteredBalances.map((b, idx: number) => (
								<WalletsTableRow
									key={idx}
									type={walletsFilter.accountType as AccountTypeEnum}
									isBalancesVisible={isBalancesVisible}
									isTransferEnabled={render.transfers && isTransferEnabled}
									isDepositEnabled={isDepositEnabled}
									isWithdrawEnabled={isWithdrawEnabled}
									filterFavorite={walletsFilter.favorites}
									balance={b}
									onMarginTransfer={handleMarginTransfer}
									onMarginBorrow={handleMarginBorrow}
									onMarginRepay={handleMarginRepay}
									tickers={tickers}
									balancesCross={balancesCross}
									balancesIsolated={balancesIsolated}
									marginOptions={marginOptions}
								/>
							))
						) : (
							<NoRowsMessage />
						)
					) : (
						<>
							{currentBalances
								.filter((b) => +b.balance > 0)
								.map((b, idx: number) => (
									<WalletsTableRow
										key={idx}
										type={walletsFilter.accountType as AccountTypeEnum}
										isBalancesVisible={isBalancesVisible}
										filterFavorite={walletsFilter.favorites}
										balance={b}
										isTransferEnabled={render.transfers && isTransferEnabled}
										isDepositEnabled={profileStatus?.is_deposit_enabled}
										isWithdrawEnabled={profileStatus?.is_withdraw_enabled}
										onMarginTransfer={handleMarginTransfer}
										onMarginBorrow={handleMarginBorrow}
										onMarginRepay={handleMarginRepay}
										tickers={tickers}
										balancesCross={balancesCross}
										balancesIsolated={balancesIsolated}
									/>
								))}
							<div className={styles.table_divider} />
							{generateCharArray("a", "z").map((ch: string) =>
								currentBalances.filter(
									(b) => b.code.startsWith(ch.toUpperCase()) && +b.balance === 0,
								).length > 0 ? (
									<React.Fragment key={ch}>
										<span className={styles.table_letter}>{ch}</span>
										{currentBalances
											.filter((b) => b.code.startsWith(ch.toUpperCase()) && +b.balance === 0)
											.map((b, idx: number) => (
												<WalletsTableRow
													key={idx}
													type={walletsFilter.accountType as AccountTypeEnum}
													isBalancesVisible={isBalancesVisible}
													isDepositEnabled={isDepositEnabled}
													isWithdrawEnabled={isWithdrawEnabled}
													isTransferEnabled={render.transfers && isTransferEnabled}
													filterFavorite={walletsFilter.favorites}
													balance={b}
													onMarginTransfer={handleMarginTransfer}
													onMarginBorrow={handleMarginBorrow}
													onMarginRepay={handleMarginRepay}
													tickers={tickers}
													balancesCross={balancesCross}
													balancesIsolated={balancesIsolated}
												/>
											))}
									</React.Fragment>
								) : null,
							)}
							{generateNumArray().map((n: number) =>
								currentBalances.filter((b) => b.code.startsWith(n.toString()) && +b.balance === 0)
									.length > 0 ? (
									<React.Fragment key={n}>
										<span className={styles.table_letter}>{n}</span>
										{currentBalances
											.filter((b) => b.code.startsWith(n.toString()) && +b.balance === 0)
											.map((b, idx: number) => (
												<WalletsTableRow
													key={idx}
													type={walletsFilter.accountType as AccountTypeEnum}
													isBalancesVisible={isBalancesVisible}
													isTransferEnabled={render.transfers && isTransferEnabled}
													isDepositEnabled={isDepositEnabled}
													isWithdrawEnabled={isWithdrawEnabled}
													filterFavorite={walletsFilter.favorites}
													balance={b}
													onMarginTransfer={handleMarginTransfer}
													onMarginBorrow={handleMarginBorrow}
													onMarginRepay={handleMarginRepay}
													tickers={tickers}
													balancesCross={balancesCross}
													balancesIsolated={balancesIsolated}
												/>
											))}
									</React.Fragment>
								) : null,
							)}
						</>
					)
				) : (
					<NoRowsMessage />
				)}
			</Table>
			<MarginOperationModal
				modal={openedMarginModal.type}
				onClose={handleCloseModal}
				onBorrowModalOpen={handleOpenBorrowModal}
				pair={openedMarginModal.pair}
				code={openedMarginModal.code}
			/>
			{!openedMarginModal.type && (
				<>
					<Tooltip
						id="margin-transfer"
						place="bottom"
						text={formatMessage(financeMessages.margin_transfer_tooltip)}
					/>
					<Tooltip
						id="margin-borrow"
						place="bottom"
						text={formatMessage(financeMessages.borrow_tooltip)}
					/>
					<Tooltip
						id="margin-repay"
						place="bottom"
						text={formatMessage(financeMessages.repay_tooltip)}
					/>
				</>
			)}
			{isMarginRiskModalOpened && (
				<MarginRiskModal
					onClose={handleCloseMarginRiskModal}
					onCloseAccepted={handleCloseAcceptedMarginRiskModal}
					requiredVerificationLevel={marginRequiredVerificationLevel}
				/>
			)}
		</div>
	);
};

export default observer(WalletsTable);
