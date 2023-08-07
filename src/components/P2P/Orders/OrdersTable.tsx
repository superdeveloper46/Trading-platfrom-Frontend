import React, { useMemo, useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { RowSkeleton, Table } from "components/UI/NewTable";
import { AlignEnum, IHeader } from "components/UI/NewTable/Table";
import Select, { ISelectOption } from "components/UI/Select";
import Button from "components/UI/Button";
import commonMessages from "messages/common";
import { useMyUserDetails, useOrders, usePairs } from "services/P2PService";
import { queryVars } from "constants/query";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import NewPagination from "components/UI/NewPagination";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { IOrderListRequestParams, P2POrderStatusEnum, P2PSideEnum } from "types/p2p";
import useParamQuery from "hooks/useSearchQuery";
import { getLoadParams, getUrlParams } from "utils/filter";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import DropdownWithContent from "components/DropdownWithContent";
import { ReactComponent as FilterIcon } from "assets/icons/filter-funnel-icon.svg";
import useWindowSize from "hooks/useWindowSize";
import p2pMessages from "messages/p2p";
import paradiseMessages from "messages/paradise";
import historyMessages from "messages/history";
import buyCryptoMessages from "messages/buy_crypto";
import OrderTableRow from "./OrderTableRow";

const PAGE_SIZE = 10;

enum TabOptionsEnum {
	Processing,
	All,
}

interface IFilter {
	[queryVars.status]: P2POrderStatusEnum | string | null;
	[queryVars.side]?: string | null;
	[queryVars.currency]?: string | null;
	[queryVars.date]: IDateRange;
	[queryVars.page]: number;
	[queryVars.page_size]: number;
}

const OrdersTable = () => {
	const { formatMessage } = useIntl();
	const { mobile, smallTablet } = useWindowSize();

	const { data: userInfo } = useMyUserDetails();

	const navigate = useNavigate();
	const query = useParamQuery();
	const queryStatus = query.get(queryVars.status) || P2POrderStatusEnum.OPEN;
	const queryCurrency = query.get(queryVars.currency);
	const querySide = query.get(queryVars.side);
	const queryPage = +(query.get(queryVars.page) || 1);

	const [filter, setFilter] = useState<IFilter>({
		[queryVars.page]: queryPage,
		[queryVars.page_size]: PAGE_SIZE,
		[queryVars.status]: queryStatus,
		[queryVars.date]: {
			startDate: query.get(queryVars.date_after)
				? new Date(query.get(queryVars.date_after) || "")
				: "",
			endDate: query.get(queryVars.date_before)
				? new Date(query.get(queryVars.date_before) || "")
				: "",
			key: "selection",
		},
		[queryVars.currency]: queryCurrency,
		[queryVars.side]: querySide,
	});

	const [loadParams, setLoadParams] = useState<IOrderListRequestParams>(getLoadParams(filter));
	const { data: orders, isFetching: isOrdersFetching } = useOrders(loadParams);
	const { data: pairs, isFetching: isPairsFetching } = usePairs();

	const baseCurrencies = useMemo(() => {
		const uniqueCurrencies: string[] = [];
		return pairs?.results
			.filter(({ base_currency }) => {
				if (uniqueCurrencies.includes(base_currency.code)) {
					return false;
				}
				return uniqueCurrencies.push(base_currency.code);
			})
			.map(({ base_currency }) => base_currency);
	}, [pairs?.results]);

	const quoteCurrencies = useMemo(() => {
		const uniqueCurrencies: string[] = [];
		return pairs?.results
			.filter(({ quote_currency }) => {
				if (uniqueCurrencies.includes(quote_currency.code)) {
					return false;
				}
				return uniqueCurrencies.push(quote_currency.code);
			})
			.map(({ quote_currency }) => quote_currency);
	}, [pairs?.results]);

	const handleSelectChange = (name: keyof IFilter, v: ISelectOption | null): void => {
		const value = v?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSearch = (): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: 1,
		}));
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: 1 }));
	};

	const handlePageChange = (page: number): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: page,
		}));
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: page }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: page }));
	};

	const handleTabChange = (tab: TabOptionsEnum) => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: 1,
			[queryVars.status]:
				tab === TabOptionsEnum.Processing ? P2POrderStatusEnum.OPEN : queryVars.all,
		}));
		setLoadParams(
			getLoadParams({
				...filter,
				[queryVars.status]:
					tab === TabOptionsEnum.Processing ? P2POrderStatusEnum.OPEN : queryVars.all,
				[queryVars.page]: 1,
			}),
		);
		navigate({
			[queryVars.search]: getUrlParams({
				...filter,
				[queryVars.status]:
					tab === TabOptionsEnum.Processing ? P2POrderStatusEnum.OPEN : queryVars.all,
			}),
		});
	};

	const handleDateRangeChange = (nextDate: IChangeDateRange): void => {
		setFilter((prevState) => ({
			...prevState,
			date: nextDate.selection,
		}));
	};

	const handleReset = (): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.side]: null,
			[queryVars.page]: 1,
			[queryVars.page_size]: PAGE_SIZE,
			[queryVars.currency]: null,
			date: {
				startDate: null,
				endDate: null,
				key: "selection",
			},
		}));
	};

	const handleRangeClear = (): void => {
		setFilter((prevState) => ({
			...prevState,
			date: {
				...prevState.date,
				startDate: "",
				endDate: "",
			},
		}));
	};

	const flowNavItems = [
		{
			id: TabOptionsEnum.Processing,
			label: formatMessage(paradiseMessages.processing),
		},
		{
			id: TabOptionsEnum.All,
			label: formatMessage(historyMessages.all_orders_window_title),
		},
	];

	const headerOptions: IHeader = {
		columns: [
			{
				name: "type",
				label: formatMessage(commonMessages.type),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "coin",
				label: formatMessage(commonMessages.coin),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "date",
				label: formatMessage(commonMessages.date),
				width: "220px",
				maxWidth: "220px",
			},
			{
				name: "fiat-amount",
				label: formatMessage(p2pMessages.fiat_amount),
				width: "190px",
				maxWidth: "190px",
			},
			{
				name: "price",
				label: formatMessage(commonMessages.price),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "crypto-amount",
				label: formatMessage(p2pMessages.crypto_amount),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "counterparty",
				label: formatMessage(p2pMessages.counterparty),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "status",
				label: formatMessage(commonMessages.status),
				width: "250px",
				maxWidth: "250px",
			},
			{
				name: "operation",
				label: formatMessage(p2pMessages.operation),
				width: "150px",
				maxWidth: "150px",
				align: AlignEnum.Right,
			},
		],
	};

	const sideOptions: ISelectOption[] = [
		{
			value: P2PSideEnum.Buy.toString(),
			label: formatMessage(buyCryptoMessages.buy),
		},
		{
			value: P2PSideEnum.Sell.toString(),
			label: formatMessage(buyCryptoMessages.sell),
		},
	];

	const cryptoOptions: IOption[] = useMemo(() => {
		const uniqueCoins: string[] = [];
		if (pairs?.results) {
			return pairs.results
				.filter((v) => {
					if (!uniqueCoins.includes(v.base_currency.code)) {
						uniqueCoins.push(v.base_currency.code);
						return true;
					}
					return false;
				})
				.map(({ base_currency }) => ({
					value: base_currency.code,
					label: {
						code: base_currency.code,
						name: base_currency.name,
						image_png: base_currency.image_png,
						image_svg: base_currency.image_svg,
					},
				}));
		}
		return [];
	}, [pairs?.results]);

	const filterSideValue = sideOptions.find((o) => o.value === filter.side) ?? null;
	const filterCurrencyValue =
		cryptoOptions.find((o) => o.label.code === filter.currency) ?? undefined;

	const isLoading = isOrdersFetching || isPairsFetching;

	const currencySelect = (
		<CurrencySelect
			isClearable
			value={filterCurrencyValue}
			onSelectChange={(o) => handleSelectChange(queryVars.currency, o)}
			options={cryptoOptions}
			isLoading={isPairsFetching}
			autoFocus
		/>
	);

	const sideSelect = (
		<Select
			value={filterSideValue}
			options={sideOptions}
			onChange={(o: ISelectOption) => handleSelectChange(queryVars.side, o)}
			isSearchable={false}
			labeled
			label={formatMessage(historyMessages.trades_table_side)}
			placeholder={formatMessage(historyMessages.trades_table_side)}
		/>
	);

	const dateRangeSelect = (
		<DateRangePicker
			ranges={[filter.date]}
			onChange={handleDateRangeChange}
			containerClassName={subAccountsStyles.date_picker}
			contentClassname={p2pStyles.range_picker_container}
			staticRanges={[]}
			inputRanges={[]}
			onRangeClear={handleRangeClear}
		/>
	);

	const actionGroup = (
		<div className={p2pStyles.table_action_group}>
			<Button
				variant="text"
				color="primary"
				label={formatMessage(commonMessages.reset)}
				onClick={handleReset}
			/>
			<Button
				variant="filled"
				color="primary"
				label={formatMessage(commonMessages.search)}
				onClick={handleSearch}
			/>
		</div>
	);

	return (
		<div className={p2pStyles.table_container}>
			<div
				className={cn(p2pStyles.tabs_container, p2pStyles.table_tabs_container, p2pStyles.header)}
			>
				<div className={p2pStyles.nav_bar}>
					{flowNavItems.map(({ id, label }) => (
						<div
							key={id}
							onClick={() => handleTabChange(id)}
							className={cn(p2pStyles.nav_item, p2pStyles.table_nav_item, {
								[p2pStyles.active]:
									filter.status === P2POrderStatusEnum.OPEN
										? id === TabOptionsEnum.Processing
										: id === TabOptionsEnum.All,
							})}
						>
							<span>{label}</span>
						</div>
					))}
					<div />
				</div>
				{smallTablet && (
					<DropdownWithContent
						className={p2pStyles.dropdown_container}
						label={() => (
							<div className={p2pStyles.filter}>
								<FilterIcon />
								{!mobile && <span>{formatMessage(p2pMessages.filter)}</span>}
							</div>
						)}
					>
						{() => (
							<div className={cn(p2pStyles.filter_content, p2pStyles.table_filter)}>
								{currencySelect}
								{sideSelect}
								{dateRangeSelect}
								{actionGroup}
							</div>
						)}
					</DropdownWithContent>
				)}
			</div>
			{!smallTablet && (
				<>
					<div className={p2pStyles.table_filter_container}>
						<div className={p2pStyles.table_filter_select}>{currencySelect}</div>
						<div className={p2pStyles.table_filter_select}>{sideSelect}</div>
						<div className={p2pStyles.table_filter_select}>{dateRangeSelect}</div>
						{actionGroup}
					</div>
					<div className={p2pStyles.table_separator} />
				</>
			)}
			<Table spaceBetween header={headerOptions}>
				{isLoading ? (
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : orders && orders.results.length > 0 ? (
					orders?.results.map((o, idx) => (
						<OrderTableRow
							baseCurrencies={baseCurrencies || []}
							quoteCurrencies={quoteCurrencies || []}
							id={userInfo?.id || -1}
							orderDetails={o}
							key={idx}
						/>
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{orders && orders.results.length && orders.count > PAGE_SIZE ? (
				<div className={p2pStyles.pagination_container}>
					<NewPagination
						count={Math.ceil(orders.count / PAGE_SIZE)}
						page={filter.page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default OrdersTable;
