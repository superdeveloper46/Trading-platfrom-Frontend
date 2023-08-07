import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import securityMessages from "messages/security";
import subAccountsMessages from "messages/sub_accounts";
import { getLoadParams, getUrlParams } from "utils/filter";
import { IHeader } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Select from "components/UI/Select";
import Button from "components/UI/Button";
import Pagination from "components/UI/Pagination";
import { PAGE_SIZE } from "constants/subAccounts";
import { Table } from "components/UI/Table";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import { useMst } from "models/Root";
import useParamQuery from "hooks/useSearchQuery";
import { useSessions } from "services/SubAccountsService";
import { ILoadSubAccountParams } from "types/subAccounts";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { queryVars } from "constants/query";
import LoginHistoryTableRow from "./LoginHistoryTableRow";

interface ISubAccountOption {
	label: string;
	value: string;
}

interface IFilter {
	[queryVars.account]: string;
	[queryVars.date]: IDateRange;
}

const LoginHistoryTable: React.FC = () => {
	const {
		subAccounts: { accounts },
	} = useMst();

	const query = useParamQuery();
	const queryAccount = query.get(queryVars.account) || "";
	const queryPage = +(query.get(queryVars.page) || 1);
	const [filter, setFilter] = useState<IFilter>({
		account: queryAccount,
		date: {
			startDate: query.get(queryVars.date_after)
				? new Date(query.get(queryVars.date_after) || "")
				: "",
			endDate: query.get(queryVars.date_before)
				? new Date(query.get(queryVars.date_before) || "")
				: "",
			key: "selection",
		},
	});
	const [page, setPage] = useState<number>(queryPage);
	const [loadParams, setLoadParams] = useState<ILoadSubAccountParams>(getLoadParams(filter));
	const { isFetching, data: sessions } = useSessions(loadParams);

	const navigate = useNavigate();
	const { formatMessage } = useIntl();

	const filterSubAccountOptions: ISubAccountOption[] = accounts.map((acc) => ({
		label: acc.login,
		value: acc.uid,
	}));

	const filterSubAccountOptionValue =
		filterSubAccountOptions.find((o) => o.value === filter.account) ?? null;

	const handleSubAccountSelectChange = (e: ISubAccountOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			account: value,
		}));
	};

	const handleSearch = (): void => {
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }) });
		setLoadParams({
			...getLoadParams(filter),
			[queryVars.page]: 1,
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handlePageChange = (page: number): void => {
		setPage(page);
		navigate({ [queryVars.search]: getUrlParams({ ...filter, page }) });
		setLoadParams({ ...getLoadParams(filter), page, [queryVars.page_size]: PAGE_SIZE });
	};

	const handleReset = (): void => {
		setFilter({
			account: "",
			date: {
				startDate: null,
				endDate: null,
				key: "selection",
			},
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
				name: "email",
				label: formatMessage(accountMessages.subaccount_table_email),
				width: "170px",
			},
			{
				name: "date",
				label: formatMessage(commonMessages.date),
				width: "120px",
			},
			{
				name: "ip",
				label: formatMessage(securityMessages.ip_address_label),
				width: "110px",
			},
		],
	};

	return (
		<div className={subAccountsStyles.table_container}>
			<div className={subAccountsStyles.filters}>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterSubAccountOptions}
						onChange={handleSubAccountSelectChange}
						isSearchable={false}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(subAccountsMessages.sub_account)}
						getOptionLabel={(option: ISubAccountOption) => option.label}
						getOptionValue={(option: ISubAccountOption) => option.value}
						value={filterSubAccountOptionValue}
					/>
				</div>
				<DateRangePicker
					ranges={[filter.date]}
					containerClassName={subAccountsStyles.date_picker}
					onChange={handleDateRangeChange}
					staticRanges={[]}
					inputRanges={[]}
					onRangeClear={handleRangeClear}
				/>
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
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
					))
				) : sessions && sessions.results.length > 0 ? (
					sessions.results.map((s) => <LoginHistoryTableRow key={s.id} session={s} />)
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{sessions && sessions.results.length ? (
				<div className={subAccountsStyles.pagination_container}>
					<Pagination
						count={Math.ceil(sessions.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(LoginHistoryTable);
