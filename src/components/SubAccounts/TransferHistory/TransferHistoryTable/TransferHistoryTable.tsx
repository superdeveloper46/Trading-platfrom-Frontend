import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import historyMessages from "messages/history";
import transferMessages from "messages/transfers";
import subAccountMessages from "messages/sub_accounts";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Select from "components/UI/Select";
import Button from "components/UI/Button";
import Pagination from "components/UI/Pagination";
import { PAGE_SIZE } from "constants/subAccounts";
import { Table } from "components/UI/Table";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import { useMst } from "models/Root";
import { getLoadParams, getUrlParams } from "utils/filter";
import { useTransfers } from "services/SubAccountsService";
import { ILoadTransfersParams } from "types/subAccounts";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import TransferHistoryTableRow from "./TransferHistoryTableRow";

interface ISelectOption {
	label: string;
	value: string;
}

interface IFilter {
	[queryVars.account]: string;
	[queryVars.is_outgoing]?: "true" | "false" | string | null;
	[queryVars.date]: IDateRange;
}

interface IProps {
	withTitle?: boolean;
}

const TransferHistoryTable: React.FC<IProps> = ({ withTitle }) => {
	const {
		account: { profileStatus, isProfileStatusLoaded },
		subAccounts: { accounts },
	} = useMst();

	const navigate = useNavigate();

	const query = useParamQuery();
	const querySubAccount = query.get(queryVars.account) || "";
	const queryPage = +(query.get(queryVars.page) || 1);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const queryTransferDirection: "true" | "false" | "" = query.get(queryVars.is_outgoing) || "";

	const [page, setPage] = useState<number>(queryPage);
	const [filter, setFilter] = useState<IFilter>({
		account: querySubAccount,
		is_outgoing: queryTransferDirection || null,
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

	const [loadParams, setLoadParams] = useState<ILoadTransfersParams>(getLoadParams(filter));
	const { isFetching, data: transfers } = useTransfers(loadParams);

	const { formatMessage } = useIntl();

	const filterSubAccountOptions: ISelectOption[] = useMemo(() => {
		if (isProfileStatusLoaded) {
			return [
				{
					label: "Master Account",
					value: profileStatus?.uid || "",
				},
				...accounts.map((acc) => ({
					label: acc.login,
					value: acc.uid,
				})),
			];
		}

		return [];
	}, [accounts, profileStatus]);

	const filterSubAccountOptionValue =
		filterSubAccountOptions.find((o) => o.value === filter.account) ?? null;

	const filterDirectionOptions: ISelectOption[] = [
		{ label: formatMessage(transferMessages.transfer_from), value: "true" },
		{ label: formatMessage(transferMessages.transfer_to), value: "false" },
	];
	const filterDirectionOptionValue =
		filterDirectionOptions.find((o) => o.value === filter.is_outgoing) ?? 0;

	const handleSubAccountSelectChange = (e: ISelectOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			account: value,
		}));
	};

	const handleDirectionSelectChange = (e: ISelectOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			is_outgoing: value,
		}));
	};

	const handleDateRangeChange = (nextDate: IChangeDateRange): void => {
		setFilter((prevState) => ({
			...prevState,
			date: nextDate.selection,
		}));
	};

	const handleSearch = (): void => {
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }) });
		setLoadParams(
			getLoadParams({ ...filter, [queryVars.page]: 1, [queryVars.page_size]: PAGE_SIZE }),
		);
	};

	const handlePageChange = (page: number): void => {
		setPage(page);
		navigate({ [queryVars.search]: getUrlParams({ ...filter, page }) });
		setLoadParams(getLoadParams({ ...filter, page, [queryVars.page_size]: PAGE_SIZE }));
	};

	const handleReset = (): void => {
		setFilter({
			account: "",
			is_outgoing: null,
			date: {
				startDate: null,
				endDate: null,
				key: "selection",
			},
		});
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
				name: "transfer-out",
				label: formatMessage(commonMessages.sender),
				width: "300px",
				maxWidth: "300px",
			},
			{
				name: "div1",
				width: "50px",
				maxWidth: "50px",
			},
			{
				name: "transfer-to",
				label: formatMessage(commonMessages.recipient),
				width: "300px",
				maxWidth: "300px",
			},
			{
				name: "amount",
				label: formatMessage(commonMessages.amount),
				align: AlignEnum.Right,
				width: "110px",
			},
			{
				name: "div1",
				width: "20px",
				maxWidth: "20px",
			},
			{
				name: "date",
				label: formatMessage(commonMessages.date),
				align: AlignEnum.Right,
				width: "150px",
				maxWidth: "150px",
			},
		],
	};

	return (
		<div className={subAccountsStyles.table_container}>
			{withTitle ? (
				<div className={cn(subAccountsStyles.table_title, subAccountsStyles.margin)}>
					{formatMessage(accountMessages.subaccount_transfer_history)}
				</div>
			) : null}
			<div className={subAccountsStyles.filters}>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterSubAccountOptions}
						onChange={handleSubAccountSelectChange}
						isSearchable={false}
						isLoading={!isProfileStatusLoaded}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(subAccountMessages.sub_account)}
						getOptionLabel={(option: ISelectOption) => option.label}
						getOptionValue={(option: ISelectOption) => option.value}
						value={filterSubAccountOptionValue}
					/>
				</div>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterDirectionOptions}
						onChange={handleDirectionSelectChange}
						isSearchable={false}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(historyMessages.trades_table_side)}
						getOptionLabel={(option: ISelectOption) => option.label}
						getOptionValue={(option: ISelectOption) => option.value}
						noOptionsMessage={() => formatMessage(commonMessages.no_options)}
						value={filterDirectionOptionValue}
					/>
				</div>
				<DateRangePicker
					ranges={[filter.date]}
					onChange={handleDateRangeChange}
					containerClassName={subAccountsStyles.date_picker}
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
				) : transfers && transfers.results.length > 0 ? (
					transfers.results.map((t, i: number) => {
						const sender = accounts.find(({ uid }) => t.sender === uid) || {
							login: "Master account",
							email: profileStatus?.email || "master acc email",
						};
						const receiver = accounts.find(({ uid }) => t.receiver.uid === uid) || {
							login: "Master account",
							email: profileStatus?.email || "master acc email",
						};
						return (
							<TransferHistoryTableRow
								sender={{ login: sender.login, email: sender.email }}
								receiver={{ login: receiver.login, email: receiver.email }}
								transfer={t}
								key={i}
							/>
						);
					})
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{transfers && transfers.results.length ? (
				<div className={subAccountsStyles.pagination_container}>
					<Pagination
						count={Math.ceil(transfers.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(TransferHistoryTable);
