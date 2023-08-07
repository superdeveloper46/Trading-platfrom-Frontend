import React, { useState, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import historyMessages from "messages/history";
import { IHeader } from "components/UI/Table/Table";
import historyStyles from "styles/pages/History/History.module.scss";
import { AccountTypeEnum } from "types/account";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { useMst } from "models/Root";
import useParamQuery from "hooks/useSearchQuery";
import { getLoadParams, getUrlParams } from "utils/filter";
import { useTrades } from "services/HistoryService";
import CurrencySelect, { IOption as ICurrencyOption } from "components/UI/CurrencySelect";
import { ACCOUNT_TYPE } from "constants/exchange";
import Tab from "components/UI/Tab";
import Button from "components/UI/Button";
import { RowSkeleton, Table } from "components/UI/Table";
import Pagination from "components/UI/Pagination";
import pageStyles from "styles/pages/Page.module.scss";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";
import { IHistoryParams } from "types/history";
import { queryVars } from "constants/query";
import TradesHistoryTableRow from "./TradesHistoryTableRow";

const PAGE_SIZE = 15;

interface IFilter {
	[queryVars.pair]: string;
	[queryVars.sort]: {
		name: string;
		value: "asc" | "desc";
	} | null;
	[queryVars.date]: IDateRange;
}

const TradesHistoryTable: React.FC = () => {
	const query = useParamQuery();
	const navigate = useNavigate();
	const { formatMessage } = useIntl();

	const {
		tickers: { loadTickers, list: tickerList },
	} = useMst();

	const queryPage = +(query.get(queryVars.page) || 1);
	const queryType = query.get(queryVars.type) || AccountTypeEnum.SPOT;
	const queryOrdering = query.get(queryVars.ordering) || "";
	const [activeTab, setActiveTab] = useState<AccountTypeEnum>(
		queryType === AccountTypeEnum.ISOLATED
			? AccountTypeEnum.ISOLATED
			: queryType === AccountTypeEnum.CROSS
			? AccountTypeEnum.CROSS
			: AccountTypeEnum.SPOT,
	);
	const [page, setPage] = useState<number>(queryPage);
	const [filter, setFilter] = useState<IFilter>({
		pair: query.get(queryVars.pair)?.replace("_", "/") ?? "",
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

	const { isFetching: isTradesLoading, data: trades } = useTrades(loadParams);

	const filterCurrenciesOptions: ICurrencyOption[] = tickerList.map(
		(ticker): ICurrencyOption => ({
			label: {
				code: `${ticker.base_currency?.code}/${ticker.quote_currency?.code}`,
			},
			value: `${ticker.base_currency?.code}_${ticker.quote_currency?.code}`,
		}),
	);

	const filterPairOption: ICurrencyOption | undefined =
		filterCurrenciesOptions.find((o) => o.value === filter.pair) ?? undefined;

	const handlePairSelectChange = useCallback((e: ICurrencyOption): void => {
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

	const handleDateRangeChange = (nextDate: IChangeDateRange) => {
		setFilter((prevState) => ({
			...prevState,
			date: nextDate.selection,
		}));
	};

	const handleRangeClear = () => {
		setFilter((prevState) => ({
			...prevState,
			date: {
				...prevState.date,
				startDate: "",
				endDate: "",
			},
		}));
	};

	const handleTabChange = (tab: string): void => {
		setActiveTab(tab as AccountTypeEnum);
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

	const handleReset = () => {
		setFilter({
			pair: "",
			sort: {
				name: "",
				value: queryVars.desc,
			},
			date: {
				startDate: null,
				endDate: null,
				key: "selection",
			},
		});
	};

	const headerOptions: IHeader = {
		primary: true,
		className: historyStyles.table_row,
		columns: [
			{
				name: "date",
				label: formatMessage(historyMessages.active_orders_date),
				width: "150px",
				sort: filter.sort?.name === queryVars.date ? filter.sort?.value : "default",
				onSortChange: handleChangeOrdering,
			},
			{
				name: "pair_id",
				label: formatMessage(historyMessages.active_orders_pair),
				width: "100px",
			},
			{
				name: "price",
				label: formatMessage(historyMessages.active_orders_trading_price),
				align: "right",
				width: "120px",
				sort: filter.sort?.name === "price" ? filter.sort?.value : "default",
				onSortChange: handleChangeOrdering,
			},
			{
				name: "amount",
				label: formatMessage(historyMessages.active_orders_amount),
				width: "120px",
				align: "right",
			},
			{
				name: "total",
				label: formatMessage(historyMessages.active_orders_total),
				width: "120px",
				align: "right",
			},
			{
				name: "transaction_fee",
				label: formatMessage(historyMessages.active_orders_transaction_fee),
				width: "120px",
				align: "right",
			},
		],
	};

	const tabs = [
		{
			name: AccountTypeEnum.SPOT,
			label: "Spot",
		},
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
		loadTickers();
	}, []);

	return (
		<div className={pageStyles.table_container}>
			{config.isModuleOn(RenderModuleEnum.MARGIN) ? (
				<div className={cn(historyStyles.tabs, pageStyles.tabs, pageStyles.table_head)}>
					{tabs.map(({ label, name }) => (
						<Tab key={name} name={name} isActive={name === activeTab} onClick={handleTabChange}>
							{label}
						</Tab>
					))}
				</div>
			) : null}
			<div className={pageStyles.filters}>
				<DateRangePicker
					ranges={[filter.date]}
					containerClassName={pageStyles.date_picker}
					onChange={handleDateRangeChange}
					staticRanges={[]}
					inputRanges={[]}
					onRangeClear={handleRangeClear}
				/>
				<div className={pageStyles.filter_select}>
					<CurrencySelect
						mini
						onSelectChange={handlePairSelectChange}
						options={filterCurrenciesOptions}
						value={filterPairOption}
						autoFocus
						label={formatMessage(historyMessages.active_orders_pair)}
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
						isLoading={isTradesLoading}
					/>
				</div>
			</div>
			<Table header={headerOptions}>
				{isTradesLoading ? (
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : trades && trades.results.length > 0 ? (
					trades.results.map((trade, idx) => (
						<TradesHistoryTableRow key={trade.id + idx} trade={trade} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{trades && trades.results.length ? (
				<div className={pageStyles.pagination_container}>
					<Pagination
						count={Math.ceil(trades.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(TradesHistoryTable);
