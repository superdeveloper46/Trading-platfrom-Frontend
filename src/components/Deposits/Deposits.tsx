import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import messages from "messages/history";
import useParamQuery from "hooks/useSearchQuery";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Pagination from "components/UI/Pagination";
import queryParamsToObject from "utils/queryParamsToObject";
import { useMst } from "models/Root";
import NoRowsMessage from "components/Table/NoRowsMessage";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/FinanceHistory.module.scss";
import { Table } from "components/UI/Table";
import config from "helpers/config";
import { IDeposit } from "models/Deposit";
import { IHeaderColumn } from "components/UI/Table/Table";
import { queryVars } from "constants/query";
import DepositRow from "./DepositRow";
import MobileDepositRow from "./DepositMobileRow";
import DepositRowSkeleton from "./DepositRowSkeleton";

const PAGE_SIZE = 15;

interface IFilter {
	[queryVars.currency]?: string;
	[queryVars.page]?: number;
}

const getUrlParams = (filter: IFilter, pageSize: number): string => {
	const urlParams = `?${filter.currency ? `currency=${filter.currency}` : ""}${
		filter.page ? `&page=${filter.page}` : ""
	}${pageSize ? `&page-size=${pageSize}` : ""}`;

	return urlParams.replace("?&", "?");
};

const Deposits: React.FC = () => {
	const {
		history: { isDepositsLoading, deposits, depositsCount, loadDeposits },
		currencies,
	} = useMst();

	const query = useParamQuery();
	const navigate = useNavigate();
	const { desktop } = useWindowSize();
	const { formatMessage } = useIntl();

	const length = deposits?.length;
	const [filter, setFilter] = useState({
		[queryVars.page]: +(query.get(queryVars.page) ?? 1),
		[queryVars.currency]: query.get(queryVars.currency) ?? undefined,
	});

	const currenciesOptions: IOption[] =
		currencies?.data?.map(
			(currency): IOption => ({
				label: {
					code: currency.code,
					name: currency.name,
					image_png: currency.image_png ?? "",
					image_svg: currency.image_svg ?? "",
				},
				value: currency.code ?? currency.id,
			}),
		) || [];

	const selectedCurrency = currenciesOptions?.find(
		(currencyOption) => currencyOption.value === query.get(queryVars.currency),
	);

	useEffect(() => {
		const params = queryParamsToObject(query);

		currencies.loadCurrencies();
		loadDeposits({ ...params, [queryVars.page_size]: PAGE_SIZE });
	}, []);

	const handlePaginationClick = useCallback(
		(page: number) => {
			if (page === filter.page) return;

			const newFilter = { ...filter, page };
			setFilter(newFilter);

			navigate({ [queryVars.search]: getUrlParams(newFilter, PAGE_SIZE) });
			loadDeposits({ ...newFilter, [queryVars.page_size]: PAGE_SIZE });
		},
		[filter],
	);

	const handleCurrencySelect = useCallback(
		(e) => {
			const currency = e?.value || null;
			if (currency === filter.currency) return;

			const newFilter = { [queryVars.page]: 1, currency };
			setFilter(newFilter);

			navigate({ [queryVars.search]: getUrlParams(newFilter, PAGE_SIZE) });
			loadDeposits({ ...newFilter, [queryVars.page_size]: PAGE_SIZE });
		},
		[filter],
	);

	const columns: IHeaderColumn[] = [
		{
			name: "date",
			label: formatMessage(messages.orders_table_date),
			width: "85px",
		},
		{
			name: "channel",
			label: formatMessage(messages.deposits_table_channel),
			width: "80px",
		},
		{
			name: "amount",
			label: formatMessage(messages.orders_table_amount),
			align: "right",
			width: "100px",
		},
		{
			name: "fee",
			label: formatMessage(messages.trades_table_fee),
			width: "100px",
		},
		{
			name: "transaction-id",
			label: formatMessage(messages.deposits_table_transaction),
			width: "300px",
			minWidth: "300px",
		},
		{
			width: "100px",
		},
		{
			name: "status",
			label: formatMessage(messages.orders_table_status),
			align: "center",
			width: "200px",
			minWidth: "200px",
		},
	];

	return (
		<>
			<Helmet title={`${formatMessage(messages.deposits_history)} | ${config.department}`} />
			<div className={styles.filters}>
				<div className={styles.filter_select}>
					<CurrencySelect
						onSelectChange={handleCurrencySelect}
						options={currenciesOptions}
						value={selectedCurrency}
						placeholder={formatMessage(messages.deposits_table_currency)}
						autoFocus
						withoutLabel
						mini
						isClearable
					/>
				</div>
			</div>
			{desktop ? (
				<Table
					stripped
					header={{
						columns,
					}}
				>
					{isDepositsLoading ? (
						[...new Array(PAGE_SIZE)].map((_, i: number) => <DepositRowSkeleton key={i} />)
					) : length > 0 ? (
						deposits.map((deposit: IDeposit) => <DepositRow deposit={deposit} key={deposit.id} />)
					) : (
						<NoRowsMessage disableHover />
					)}
				</Table>
			) : (
				<div className={styles.mobile_container}>
					{isDepositsLoading ? (
						<LoadingSpinner />
					) : length > 0 ? (
						deposits.map((deposit: IDeposit) => (
							<MobileDepositRow deposit={deposit} key={deposit.id} />
						))
					) : (
						<NoRowsMessage disableHover />
					)}
				</div>
			)}
			<div className={styles.pagination_container}>
				<Pagination
					count={Math.ceil(depositsCount / PAGE_SIZE)}
					page={filter.page}
					onChange={handlePaginationClick}
				/>
			</div>
		</>
	);
};

export default observer(Deposits);
