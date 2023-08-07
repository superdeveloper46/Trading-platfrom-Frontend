import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import financeMessages from "messages/finance";
import { AlignEnum, IHeader, IHeaderColumn } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import Tab from "components/UI/Tab";
import {
	ICrossSubAccountBalance,
	IIsolatedSubAccountBalance,
	ISubAccountWallet,
	SubAccountTypeEnum,
} from "types/subAccounts";
import useParamQuery from "hooks/useSearchQuery";
import { getUrlParams } from "utils/filter";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import { useMst } from "models/Root";
import { AccountTypeEnum } from "types/account";
import { MarginModalEnum } from "types/exchange";
import SubMarginTransferModal from "components/SubAccounts/modals/SubMarginTransferModal";
import SubBorrowModal from "components/SubAccounts/modals/SubBorrowModal";
import SubRepayModal from "components/SubAccounts/modals/SubRepayModal";
import { queryVars } from "constants/query";
import BalanceDetailsTableRow from "./BalanceDetailsTableRow";
import IsolateBalanceDetailsTableRow from "./IsolateBalanceDetailsTableRow";
import CrossBalanceDetailsTableRow from "./CrossBalanceDetailsTableRow";

export type IWalletExtended = ISubAccountWallet & { valuation?: Record<string, number> };
export type ICrossBalanceExtended = ICrossSubAccountBalance & {
	valuation?: Record<string, number>;
};
export type IIsolatedBalanceExtended = IIsolatedSubAccountBalance & {
	valuation?: Record<string, number>;
	paired_balance: Record<string, any>;
	available: number;
};

interface IProps {
	refetchAllBalances: () => void;
	spotBalances: IWalletExtended[];
	crossBalances: ICrossBalanceExtended[];
	formattedIsolatedBalances: IIsolatedBalanceExtended[];
	isolatedBalances: IIsolatedSubAccountBalance[];
	isBalancesLoading: boolean;
	uid: string;
}

const BalanceDetailsTable: React.FC<IProps> = ({
	refetchAllBalances,
	isolatedBalances,
	formattedIsolatedBalances,
	spotBalances,
	crossBalances,
	isBalancesLoading,
	uid,
}) => {
	const navigate = useNavigate();
	const { formatMessage } = useIntl();

	const [openedMarginModal, setOpenedMarginModal] = useState<{
		type: MarginModalEnum | "";
		pair: string;
		code: string;
	}>({ type: "", pair: "", code: "" });

	const {
		account: { profileStatus },
		finance: { crossMarginOption, marginOptions },
	} = useMst();

	const query = useParamQuery();
	const queryType: SubAccountTypeEnum =
		(query.get(queryVars.type) as SubAccountTypeEnum) || SubAccountTypeEnum.Spot;

	const [filter] = useState({});

	const [activeTab, setActiveTab] = useState<SubAccountTypeEnum>(
		queryType === SubAccountTypeEnum.Isolated
			? SubAccountTypeEnum.Isolated
			: queryType === SubAccountTypeEnum.Cross
			? SubAccountTypeEnum.Cross
			: SubAccountTypeEnum.Spot,
	);

	const handleTabChange = (tab: string): void => {
		setActiveTab(tab as SubAccountTypeEnum);

		if (tab !== activeTab) {
			navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.type]: tab }) });
		}
	};

	const handleOpenBorrowModal = () => {
		setOpenedMarginModal((prevState) => ({ ...prevState, type: MarginModalEnum.BORROW }));
	};

	const handleMarginTransfer = (code: string, pair = ""): void => {
		setOpenedMarginModal({
			type: MarginModalEnum.TRANSFER,
			pair: pair,
			code: code,
		});
	};

	const handleMarginBorrow = (code: string, pair = ""): void => {
		setOpenedMarginModal({ type: MarginModalEnum.BORROW, pair: pair, code: code });
	};

	const handleMarginRepay = (code: string, pair = ""): void => {
		setOpenedMarginModal({ type: MarginModalEnum.REPAY, pair: pair, code: code });
	};

	const handleCloseModal = () => {
		setOpenedMarginModal({ type: "", code: "", pair: "" });
	};

	const emptyColumns: IHeaderColumn[] = [
		{
			align: "center",
		},
		{
			align: "center",
			width: "120px",
		},
		{
			align: "center",
			width: "120px",
		},
		{
			align: "center",
			width: "120px",
		},
	];

	const columnsSpot: IHeaderColumn[] = [
		{
			name: "coin",
			label: formatMessage(commonMessages.coin),
			width: "150px",
		},
		{
			name: "total-balance",
			label: formatMessage(accountMessages.subaccount_table_total_balance),
			align: AlignEnum.Right,
			width: "150px",
		},
		{
			name: "available-balance",
			label: formatMessage(commonMessages.available_balance),
			align: AlignEnum.Right,
			width: "150px",
		},
		{
			name: "in-order",
			label: formatMessage(accountMessages.subaccount_table_in_order),
			align: AlignEnum.Right,
			width: "150px",
		},
		{
			name: "btc-value",
			label: formatMessage(accountMessages.subaccount_table_btc_value),
			align: AlignEnum.Right,
			width: "150px",
		},
		{
			name: "div1",
			width: "60px",
			maxWidth: "60px",
		},
		{
			name: "transfer",
			label: formatMessage(financeMessages.transfer),
			width: "200px",
		},
	];

	const columnsCross: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.currency),
			width: "150px",
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
			label: formatMessage(financeMessages.position),
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
		...emptyColumns,
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
			label: formatMessage(financeMessages.position),
			width: "120px",
			name: "position",
			align: "right",
		},
		{
			label: formatMessage(financeMessages.position_quote),
			width: "120px",
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
		...emptyColumns,
	];

	const headerColumns: IHeaderColumn[] = useMemo(() => {
		switch (activeTab) {
			case SubAccountTypeEnum.Spot:
				return columnsSpot;
			case SubAccountTypeEnum.Cross:
				return columnsCross;
			case SubAccountTypeEnum.Isolated:
				return columnsIsolated;
			default:
				return columnsSpot;
		}
	}, [activeTab, columnsSpot, columnsCross, columnsIsolated]);

	const headerOptions: IHeader = {
		primary: true,
		className: subAccountsStyles.table_row,
		columns: headerColumns,
	};

	const tabs = [
		{
			name: SubAccountTypeEnum.Spot,
			label: formatMessage(financeMessages.main_spot),
		},
		{
			name: SubAccountTypeEnum.Cross,
			label: "Cross Margin",
		},
		{
			name: SubAccountTypeEnum.Isolated,
			label: "Isolated Margin",
		},
	];

	const rows = useMemo(() => {
		switch (true) {
			case Boolean(activeTab === SubAccountTypeEnum.Spot && spotBalances.length):
				return spotBalances.map((b, i) => (
					<BalanceDetailsTableRow
						uid={uid || ""}
						key={i}
						wallet={b}
						masterUid={profileStatus?.uid || ""}
					/>
				));
			case Boolean(activeTab === SubAccountTypeEnum.Cross && crossBalances?.length):
				return crossBalances?.map((b, i) => (
					<CrossBalanceDetailsTableRow
						onMarginTransfer={handleMarginTransfer}
						onMarginBorrow={handleMarginBorrow}
						onMarginRepay={handleMarginRepay}
						balancesCross={crossBalances}
						balancesIsolated={formattedIsolatedBalances}
						crossMarginOption={crossMarginOption}
						balance={b}
						key={i}
					/>
				));
			case Boolean(activeTab === SubAccountTypeEnum.Isolated && formattedIsolatedBalances?.length):
				return formattedIsolatedBalances?.map((b, i) => (
					<IsolateBalanceDetailsTableRow
						onMarginTransfer={handleMarginTransfer}
						onMarginBorrow={handleMarginBorrow}
						onMarginRepay={handleMarginRepay}
						balancesCross={crossBalances}
						balancesIsolated={isolatedBalances}
						marginOptions={marginOptions}
						balance={b}
						key={i}
					/>
				));
			default:
				return (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				);
		}
	}, [
		activeTab,
		spotBalances,
		crossBalances,
		isolatedBalances,
		formattedIsolatedBalances,
		handleMarginTransfer,
		handleMarginBorrow,
		handleMarginBorrow,
		marginOptions.length,
	]);

	return (
		<div className={subAccountsStyles.table_container}>
			<div className={cn(subAccountsStyles.tabs, pageStyles.tabs, pageStyles.table_head)}>
				{tabs.map(({ label, name }) => (
					<Tab key={name} name={name} isActive={name === activeTab} onClick={handleTabChange}>
						{label}
					</Tab>
				))}
			</div>
			{/* <Filters> */}
			{/* <CheckBox */}
			{/*	name="show_all" */}
			{/*	checked={!isEmptyBalancesVisible} */}
			{/*	onChange={handleChangeEmptyBalanceVisibility} */}
			{/* > */}
			{/*	{formatMessage(financeMessages.hide_empty_balances)} */}
			{/* </CheckBox> */}
			{/* </Filters> */}
			<Table header={headerOptions}>
				{isBalancesLoading
					? [...new Array(PAGE_SIZE)].map((_, i) => (
							<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
					  ))
					: rows}
			</Table>
			{openedMarginModal.type === MarginModalEnum.TRANSFER && (
				<SubMarginTransferModal
					uid={uid}
					refetchAllBalances={refetchAllBalances}
					spotBalances={spotBalances}
					crossBalances={crossBalances}
					isolatedBalances={formattedIsolatedBalances}
					isOpen
					onClose={handleCloseModal}
					onBorrowModalOpen={handleOpenBorrowModal}
					type={openedMarginModal.pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
					pair={openedMarginModal.pair}
					currency={openedMarginModal.pair ? openedMarginModal.code : ""}
					asset={openedMarginModal.pair ? "" : openedMarginModal.code}
				/>
			)}
			{openedMarginModal.type === MarginModalEnum.BORROW && (
				<SubBorrowModal
					uid={uid}
					refetchAllBalances={refetchAllBalances}
					spotBalances={spotBalances}
					crossBalances={crossBalances}
					isolatedBalances={formattedIsolatedBalances}
					isOpen
					onClose={handleCloseModal}
					type={openedMarginModal.pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
					pair={openedMarginModal.pair}
					currency={openedMarginModal.pair ? openedMarginModal.code : ""}
					asset={openedMarginModal.pair ? "" : openedMarginModal.code}
				/>
			)}
			{openedMarginModal.type === MarginModalEnum.REPAY && (
				<SubRepayModal
					uid={uid}
					refetchAllBalances={refetchAllBalances}
					spotBalances={spotBalances}
					crossBalances={crossBalances}
					isolatedBalances={formattedIsolatedBalances}
					isOpen
					onClose={handleCloseModal}
					type={openedMarginModal.pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
					pair={openedMarginModal.pair}
					currency={openedMarginModal.pair ? openedMarginModal.code : ""}
					asset={openedMarginModal.pair ? "" : openedMarginModal.code}
				/>
			)}
		</div>
	);
};

export default observer(BalanceDetailsTable);
