import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import subAccountsMessages from "messages/sub_accounts";
import coinMessages from "messages/exchange";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import useParamQuery from "hooks/useSearchQuery";
import { ILoadOrdersParams, SubAccountTypeEnum } from "types/subAccounts";
import { getLoadParams, getUrlParams } from "utils/filter";
import Select from "components/UI/Select";
import Button from "components/UI/Button";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import SubAccountsService, { useOrders } from "services/SubAccountsService";
import { useMst } from "models/Root";
import Pagination from "components/UI/Pagination";
import Tab from "components/UI/Tab";
import { formatHistoryOrders } from "helpers/history";
import { ACCOUNT_TYPE } from "constants/exchange";
import { queryVars } from "constants/query";
import OrderManagementTableRow from "./OrderManagementTableRow";

interface ISubAccountOption {
	label: string;
	value: string;
}

interface IFilter {
	[queryVars.account]: string;
	[queryVars.side]: string;
}

const OrderManagementTable: React.FC = () => {
	const {
		subAccounts: { accounts, isAccountsLoading },
	} = useMst();

	const navigate = useNavigate();

	const query = useParamQuery();
	const queryPage = +(query.get(queryVars.page) || 1);
	const queryType = query.get(queryVars.type) || SubAccountTypeEnum.Spot;
	const queryAccount = query.get(queryVars.account) || "";
	const querySide = query.get(queryVars.side) || "";

	const [page, setPage] = useState<number>(queryPage);
	const [activeTab, setActiveTab] = useState<SubAccountTypeEnum>(
		queryType === SubAccountTypeEnum.Isolated
			? SubAccountTypeEnum.Isolated
			: queryType === SubAccountTypeEnum.Cross
			? SubAccountTypeEnum.Cross
			: SubAccountTypeEnum.Spot,
	);

	const [filter, setFilter] = useState<IFilter>({
		account: queryAccount,
		side: querySide,
	});

	const [loadParams, setLoadParams] = useState<ILoadOrdersParams>({
		...getLoadParams(filter),
		[queryVars.page]: queryPage,
		[queryVars.page_size]: PAGE_SIZE,
	});

	const { isFetching, data: orders, refetch: refetchOrders } = useOrders(loadParams);

	const { formatMessage } = useIntl();

	const filterSubAccountOptions: ISubAccountOption[] = accounts.map((acc) => ({
		label: acc.login,
		value: acc.uid,
	}));

	const filterSubAccountOptionValue =
		filterSubAccountOptions.find((o: ISubAccountOption) => o.value === filter.account) ?? null;

	const filterSideOptions: ISubAccountOption[] = [
		{ label: formatMessage(coinMessages.buy), value: "2" },
		{ label: formatMessage(coinMessages.sell), value: "1" },
	];

	const filterSideOptionValue = filterSideOptions.find((o) => o.value === filter.side) ?? null;

	const handleTabChange = (tab: string): void => {
		setActiveTab(tab as SubAccountTypeEnum);

		if (tab !== activeTab) {
			setPage(1);
			setLoadParams({
				...getLoadParams({
					[queryVars.page]: 1,
					[queryVars.page_size]: PAGE_SIZE,
					[queryVars.wallet_type]: ACCOUNT_TYPE[tab as SubAccountTypeEnum] ?? 1,
				}),
			});
			navigate({ [queryVars.search]: `?${queryVars.type}=${tab}` });
			handleReset();
		}
	};

	const handleSubAccountSelectChange = (e: ISubAccountOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			account: value,
		}));
	};

	const handleSideSelectChange = (e: ISubAccountOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			side: value,
		}));
	};

	const handleCancelClick = (id: number): void => {
		SubAccountsService.cancelSubAccountOrder(id).then(() => {
			toast.success(
				<>
					<i className="ai ai-check_outline" />
					{formatMessage(historyMessages.order_was_cancelled)}
				</>,
			);
			refetchOrders();
		});
	};

	const handleSearch = (): void => {
		navigate({
			[queryVars.search]: getUrlParams({
				...filter,
				[queryVars.type]: activeTab,
				[queryVars.page]: 1,
			}),
		});
		setLoadParams({
			...getLoadParams(filter),
			[queryVars.page]: 1,
			[queryVars.wallet_type]: ACCOUNT_TYPE[activeTab],
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handlePageChange = (page: number): void => {
		setPage(page);
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.type]: activeTab, page }),
		});
		setLoadParams({
			...getLoadParams(filter),
			[queryVars.wallet_type]: ACCOUNT_TYPE[activeTab],
			[queryVars.page]: page,
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handleReset = (): void => {
		setFilter({
			account: "",
			side: "",
		});
	};

	const headerOptions: IHeader = {
		primary: true,
		className: subAccountsStyles.table_row,
		columns: [
			{
				name: "account",
				label: formatMessage(accountMessages.subaccount_table_account),
				width: "150px",
			},
			{
				name: "date",
				label: formatMessage(historyMessages.active_orders_date),
				width: "150px",
				minWidth: "150px",
			},
			{
				name: "pair_id",
				label: formatMessage(historyMessages.active_orders_pair),
				width: "75px",
			},
			{
				name: "type",
				label: formatMessage(historyMessages.active_orders_type),
				align: AlignEnum.Center,
				width: "65px",
			},
			{
				name: "side",
				label: formatMessage(historyMessages.active_orders_side),
				align: AlignEnum.Center,
				width: "70px",
			},
			{
				name: "price",
				label: formatMessage(historyMessages.active_orders_price),
				align: AlignEnum.Right,
				width: "120px",
				minWidth: "120px",
			},
			{
				name: "amount_original",
				label: formatMessage(historyMessages.active_orders_amount),
				align: AlignEnum.Right,
				width: "120px",
			},
			{
				name: "filled_percent",
				label: formatMessage(historyMessages.active_orders_filled),
				align: AlignEnum.Center,
				width: "70px",
			},
			{
				name: "total_value",
				label: formatMessage(historyMessages.active_orders_total),
				align: AlignEnum.Right,
				width: "120px",
			},
			{
				name: "trigger_condition",
				label: formatMessage(historyMessages.trigger_condition),
				align: AlignEnum.Right,
				width: "120px",
			},
			{
				name: "received",
				label: formatMessage(historyMessages.active_orders_received),
				align: AlignEnum.Right,
				width: "130px",
				minWidth: "130px",
			},
			{
				name: "cancel",
				label: formatMessage(historyMessages.active_orders_action_cancel),
				align: AlignEnum.Right,
				width: "80px",
			},
		],
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

	return (
		<div className={subAccountsStyles.table_container}>
			<div className={cn(subAccountsStyles.tabs, pageStyles.tabs, pageStyles.table_head)}>
				{tabs.map(({ label, name }) => (
					<Tab key={name} name={name} isActive={name === activeTab} onClick={handleTabChange}>
						{label}
					</Tab>
				))}
			</div>
			<div className={subAccountsStyles.filters}>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterSubAccountOptions}
						onChange={handleSubAccountSelectChange}
						isSearchable={false}
						isLoading={isAccountsLoading}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(subAccountsMessages.sub_account)}
						getOptionLabel={(option: ISubAccountOption) => option.label}
						getOptionValue={(option: ISubAccountOption) => option.value}
						value={filterSubAccountOptionValue}
					/>
				</div>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterSideOptions}
						onChange={handleSideSelectChange}
						isSearchable={false}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(historyMessages.trades_table_side)}
						getOptionLabel={(option: ISubAccountOption) => option.label}
						getOptionValue={(option: ISubAccountOption) => option.value}
						value={filterSideOptionValue}
					/>
				</div>
				<div className={subAccountsStyles.filters_buttons}>
					<Button
						variant="text"
						color="primary"
						label={formatMessage(commonMessages.reset)}
						mini
						onClick={handleReset}
					/>
					<Button
						variant="filled"
						color="primary"
						label={formatMessage(commonMessages.search)}
						mini
						onClick={handleSearch}
					/>
				</div>
			</div>
			<Table header={headerOptions}>
				{isFetching ? (
					[...new Array(PAGE_SIZE)].map((_, i) => (
						<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
					))
				) : orders && orders.results.length ? (
					formatHistoryOrders(orders.results as any[]).map((item) => (
						<OrderManagementTableRow
							type={activeTab}
							key={item.id}
							order={item}
							onCancel={handleCancelClick}
						/>
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{orders && orders.results.length ? (
				<div className={subAccountsStyles.pagination_container}>
					<Pagination
						count={Math.ceil(orders.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(OrderManagementTable);
