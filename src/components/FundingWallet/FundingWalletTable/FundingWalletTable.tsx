import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import Table, { IHeaderColumn } from "components/UI/Table/Table";
import financeMessages from "messages/finance";
import { useMst } from "models/Root";
import styles from "styles/pages/Wallets.module.scss";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { queryVars } from "constants/query";
import { RowSkeleton } from "components/UI/Table";
import { IP2PBalance } from "types/p2p";
import FundingWalletTableRow from "./FundingWalletTableRow";

interface IProps {
	balances?: IP2PBalance[];
	isBalancesLoading: boolean;
	openTransferModal: (asset: string) => void;
}

const FundingWalletTable: React.FC<IProps> = ({
	isBalancesLoading,
	balances,
	openTransferModal,
}) => {
	const { formatMessage } = useIntl();

	const {
		finance: { walletsFilter, setWalletsFilter, isBalancesVisible },
		account: { isDepositEnabled, isWithdrawEnabled, isTransferEnabled },
		render,
	} = useMst();

	const [sortName, sortValue] = walletsFilter.sort.split(".");

	const handleChangeFilterSort = (name: string) => {
		const nextFilter = {
			...walletsFilter,
			sort: `${name}.${sortValue === queryVars.asc ? queryVars.desc : queryVars.asc}`,
		};
		setWalletsFilter(nextFilter);
	};

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [walletsFilter.accountType, isTransferEnabled, isDepositEnabled, isWithdrawEnabled]);

	const columns: IHeaderColumn[] = [
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
		// {
		// 	label: `${formatMessage(financeMessages.approx_total)} BTC (USDT)`,
		// 	width: "120px",
		// 	name: "approx-btc",
		// 	align: "right",
		// },
	];

	const emptyColumns: IHeaderColumn[] = [
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
		{
			align: "center",
			width: "100px",
		},
	];

	return (
		<div className={styles.table_container}>
			{/* <Filters /> */}
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
				{isBalancesLoading ? (
					[...new Array(15)].map((_, i: number) => <RowSkeleton key={i} cells={columns} />)
				) : balances && balances.length ? (
					balances.map((b, idx: number) => (
						<FundingWalletTableRow
							key={idx}
							isBalancesVisible={isBalancesVisible}
							isTransferEnabled={render.transfers && isTransferEnabled}
							isDepositEnabled={isDepositEnabled}
							isWithdrawEnabled={isWithdrawEnabled}
							filterFavorite={walletsFilter.favorites}
							openTransferModal={openTransferModal}
							balance={b}
						/>
					))
				) : (
					<NoRowsMessage />
				)}
			</Table>
		</div>
	);
};

export default observer(FundingWalletTable);
