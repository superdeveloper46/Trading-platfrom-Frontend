import React, { useState, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import commonMessages from "messages/common";
import historyMessages from "messages/history";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import useParamQuery from "hooks/useSearchQuery";
import { AccountTypeEnum } from "types/account";
import { ACCOUNT_TYPE } from "constants/exchange";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { ISelectOption } from "components/UI/Select";
import Button from "components/UI/Button";
import { IHeader } from "components/UI/Table/Table";
import historyStyles from "styles/pages/History/History.module.scss";
import { useMst } from "models/Root";
import { getLoadParams, getUrlParams } from "utils/filter";
import { useInterests } from "services/HistoryService";
import pageStyles from "styles/pages/Page.module.scss";
import Tab from "components/UI/Tab";
import Pagination from "components/UI/Pagination";
import { RowSkeleton, Table } from "components/UI/Table";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import { IHistoryParams } from "types/history";
import { queryVars } from "constants/query";
import InterestsTableRow from "./InterestsTableRow";

const PAGE_SIZE = 15;

interface IFilter {
	[queryVars.pair]: string;
	[queryVars.currency]: string;
	[queryVars.side]: string;
	[queryVars.sort]: {
		name: string;
		value: "asc" | "desc";
	} | null;
	[queryVars.date]: IDateRange;
}

const InterestsTable: React.FC = () => {
	const query = useParamQuery();
	const navigate = useNavigate();
	const { formatMessage } = useIntl();

	const {
		account: { loadBalances, balancesCross, balancesIsolated },
	} = useMst();

	const queryPage = +(query.get(queryVars.page) || 1);
	const queryType = query.get(queryVars.type) || AccountTypeEnum.SPOT;
	const queryOrdering = query.get(queryVars.ordering) || "";
	const [activeTab, setActiveTab] = useState<Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>>(
		queryType === AccountTypeEnum.ISOLATED ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS,
	);
	const [page, setPage] = useState<number>(queryPage);
	const [filter, setFilter] = useState<IFilter>({
		pair: query.get(queryVars.pair)?.replace("_", "/") ?? "",
		currency: query.get(queryVars.currency) ?? "",
		side: query.get(queryVars.side) || "",
		sort: queryOrdering
			? {
					name: queryOrdering?.[0] === "-" ? queryOrdering.slice(1) : queryOrdering,
					value: query.get(queryVars.ordering)?.[0] === "-" ? queryVars.desc : queryVars.asc,
			  }
			: null,
		date: {
			startDate: query.get(queryVars.date_after)
				? new Date(query.get(queryVars.date_after) || 0)
				: "",
			endDate: query.get(queryVars.date_before)
				? new Date(query.get(queryVars.date_before) || 0)
				: "",
			key: "selection",
		},
	});

	const [loadParams, setLoadParams] = useState<IHistoryParams>({
		...getLoadParams(filter),
		[queryVars.page]: queryPage,
		[queryVars.wallet_type]: ACCOUNT_TYPE[activeTab],
		[queryVars.page_size]: PAGE_SIZE,
	});

	const { isFetching: isInterestsLoading, data: interests } = useInterests(loadParams);

	const filterCurrenciesOptions: IOption[] =
		activeTab === "cross"
			? balancesCross.map(
					(b): IOption => ({
						label: {
							code: b.code,
						},
						value: b.code,
					}),
			  )
			: balancesIsolated
					.filter((b) => (filter.pair ? b.pair === filter.pair : true))
					.map(
						(b): IOption => ({
							label: {
								code: b.code,
							},
							value: b.code,
						}),
					);

	const filterPairsOptions: IOption[] = balancesIsolated.map(
		(b): IOption => ({
			label: {
				code: b.pair || "",
			},
			value: b.pair || "",
		}),
	);

	const filterCurrencyOption: IOption | undefined =
		filterCurrenciesOptions.find((o: IOption) => o.value === filter.currency) ?? undefined;

	const filterPairOption: IOption | undefined =
		filterPairsOptions.find((o: IOption) => o.value === filter.pair) ?? undefined;

	const handleCurrencySelectChange = useCallback((e: IOption | ISelectOption): void => {
		const { value } = e;
		setFilter((prevState) => ({
			...prevState,
			currency: value,
		}));
	}, []);

	const handlePairSelectChange = useCallback((e: IOption | ISelectOption): void => {
		const { value } = e;
		setFilter((prevState) => ({
			...prevState,
			pair: value,
		}));
	}, []);

	const handleChangeOrdering = (name: string): void => {
		const nextSort: IFilter["sort"] = {
			name: name,
			value: filter.sort?.value === queryVars.asc ? queryVars.desc : queryVars.asc,
		};
		const nextFilter = {
			...filter,
			sort: nextSort,
		};
		setFilter(nextFilter);
		navigate({
			[queryVars.search]: getUrlParams({ ...nextFilter, [queryVars.type]: activeTab, page }),
		});
		setLoadParams({
			...getLoadParams(nextFilter),
			page,
			[queryVars.wallet_type]: ACCOUNT_TYPE[activeTab],
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handleSearch = (): void => {
		setPage(1);
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
			page,
			[queryVars.wallet_type]: ACCOUNT_TYPE[activeTab],
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handleDateRangeChange = (nextDate: IChangeDateRange): void => {
		setFilter((prevState) => ({
			...prevState,
			date: nextDate.selection,
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

	const handleReset = (): void => {
		setFilter({
			pair: "",
			side: "",
			currency: "",
			sort: null,
			date: {
				startDate: null,
				endDate: null,
				key: "selection",
			},
		});
	};

	const handleTabChange = (tab: string): void => {
		setActiveTab(tab as Exclude<AccountTypeEnum, AccountTypeEnum.SPOT>);
		setPage(1);
		setLoadParams({
			...getLoadParams({
				[queryVars.page]: 1,
				[queryVars.page_size]: PAGE_SIZE,
				[queryVars.wallet_type]: ACCOUNT_TYPE[tab] ?? 2,
			}),
		});
		handleReset();
		navigate({ [queryVars.search]: `?${queryVars.type}=${tab}` });
	};

	const headerOptions: IHeader = {
		primary: true,
		className: historyStyles.table_row,
		columns: [
			{
				name: "date",
				label: formatMessage(historyMessages.active_orders_date),
				width: "150px",
				sort: filter.sort?.value || "default",
				onSortChange: handleChangeOrdering,
			},
			...(activeTab === AccountTypeEnum.ISOLATED
				? [
						{
							name: "pair",
							label: formatMessage(historyMessages.active_orders_pair),
							width: "100px",
						},
				  ]
				: []),
			{
				name: "coin",
				label: formatMessage(commonMessages.coin),
				width: "100px",
			},
			{
				name: "amount-of-interest",
				label: formatMessage(historyMessages.interests_amount),
				align: "right",
				width: "120px",
			},
			{
				name: "borrowed",
				label: formatMessage(historyMessages.interests_borrowed),
				align: "right",
				width: "120px",
			},
			{
				name: "interest-rate",
				label: formatMessage(historyMessages.interests_daily_rate),
				align: "right",
				width: "100px",
			},
		],
	};

	const tabs = [
		{
			name: AccountTypeEnum.CROSS,
			label: "Cross",
		},
		{
			name: AccountTypeEnum.ISOLATED,
			label: "Isolated",
		},
	];

	useEffect(() => {
		loadBalances();
	}, []);

	return (
		<div className={pageStyles.table_container}>
			<div className={cn(historyStyles.tabs, pageStyles.tabs, pageStyles.table_head)}>
				{tabs.map(({ label, name }) => (
					<Tab key={name} name={name} isActive={name === activeTab} onClick={handleTabChange}>
						{label}
					</Tab>
				))}
			</div>
			<div className={pageStyles.filters}>
				<DateRangePicker
					ranges={[filter.date]}
					containerClassName={pageStyles.date_picker}
					onChange={handleDateRangeChange}
					staticRanges={[]}
					inputRanges={[]}
					onRangeClear={handleRangeClear}
				/>
				{activeTab === AccountTypeEnum.ISOLATED && (
					<div className={pageStyles.filter_select}>
						<CurrencySelect
							mini
							onSelectChange={handlePairSelectChange}
							options={filterPairsOptions}
							value={filterPairOption}
							autoFocus
							label="Pair"
							placeholder={formatMessage(commonMessages.all)}
						/>
					</div>
				)}
				<div className={pageStyles.filter_select}>
					<CurrencySelect
						mini
						onSelectChange={handleCurrencySelectChange}
						options={filterCurrenciesOptions}
						value={filterCurrencyOption}
						autoFocus
						label="Coin"
						placeholder={formatMessage(commonMessages.all)}
					/>
				</div>
				<div className={pageStyles.filters_buttons}>
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
						isLoading={isInterestsLoading}
					/>
				</div>
			</div>

			<Table header={headerOptions}>
				{isInterestsLoading ? (
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : interests && interests.results.length > 0 ? (
					interests.results.map((interest) => (
						<InterestsTableRow interest={interest} key={interest.id} type={activeTab} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{interests && interests.results.length ? (
				<div className={pageStyles.pagination_container}>
					<Pagination
						count={Math.ceil(interests.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(InterestsTable);
