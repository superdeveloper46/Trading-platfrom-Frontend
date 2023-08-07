import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import messages from "messages/history";
import Pagination from "components/UI/Pagination";
import { useMst } from "models/Root";
import { ICurrency } from "models/Currencies";
import LoadingSpinner from "components/UI/LoadingSpinner";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import useParamQuery from "hooks/useSearchQuery";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/FinanceHistory.module.scss";
import NoRowsMessage from "components/Table/NoRowsMessage";
import queryParamsToObject from "utils/queryParamsToObject";
import { IHeaderColumn } from "components/UI/Table/Table";
import { IWithdraw } from "models/Withdrawal";
import { Table } from "components/UI/Table";
import { getPageTitle } from "helpers/global";
import { queryVars } from "constants/query";
import WithdrawMobileRow from "./WithdrawMobileRow";
import WithdrawRow from "./WithdrawRow";
import CancelWithdrawModal from "./CancelWithdrawModal";
import WithdrawRowSkeleton from "./WithdrawRowSkeleton";

const PAGE_SIZE = 15;

interface IFilter {
	[queryVars.currency]?: string;
	[queryVars.page]?: number;
}

const getUrlParams = (filter: IFilter, pageSize: number): string => {
	const urlParams = `?${filter.currency ? `${queryVars.currency}=${filter.currency}` : ""}${
		filter.page ? `&${queryVars.page}=${filter.page}` : ""
	}${pageSize ? `&${queryVars.page_size}=${pageSize}` : ""}`;

	return urlParams.replace("?&", "?");
};

const Withdraws = () => {
	const {
		history: { withdraws, withdrawsCount, isWithdrawsLoading, loadWithdraws, cancelWithdraw },
		currencies,
		terminal: { pair },
	} = useMst();

	const query = useParamQuery();
	const navigate = useNavigate();
	const { desktop } = useWindowSize();
	const { formatMessage } = useIntl();
	const [modalOpened, setModalOpened] = useState(false);

	const [withdrawToCancel, setWithdrawToCancel] = useState<IWithdraw>();
	const [filter, setFilter] = useState({
		[queryVars.page]: +(query.get(queryVars.page) ?? 1),
		[queryVars.currency]: query.get(queryVars.currency) ?? undefined,
	});

	const length = withdraws.length;

	const currenciesOptions: IOption[] =
		currencies?.data?.map(
			(currency: ICurrency): IOption => ({
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
		loadWithdraws(params);
	}, []);

	const handlePairSelect = useCallback(
		(e) => {
			const currency = e?.value || null;
			if (currency === filter.currency) return;

			const newFilter = { [queryVars.page]: 1, currency };
			setFilter(newFilter);
			navigate({ [queryVars.search]: getUrlParams(newFilter, PAGE_SIZE) });
			loadWithdraws({ ...newFilter, [queryVars.page_size]: PAGE_SIZE });
		},
		[filter],
	);

	const handlePaginationClick = useCallback(
		(page: number) => {
			if (page === filter.page) return;
			const newFilter = { ...filter, page };
			setFilter(newFilter);

			navigate({ [queryVars.search]: getUrlParams(newFilter, PAGE_SIZE) });
			loadWithdraws({ ...newFilter, [queryVars.page_size]: PAGE_SIZE });
		},
		[filter],
	);

	const handleCancelClick = useCallback(
		(e) => {
			const { id } = e.currentTarget.dataset;

			const withdrawToCancel = withdraws.find(
				(withdraw: IWithdraw) => withdraw.id === parseInt(id, 10),
			);
			setWithdrawToCancel(withdrawToCancel);
			setModalOpened(true);
		},
		[withdraws],
	);

	const handleCloseModal = useCallback(() => {
		setModalOpened(false);
	}, []);

	const handleModalConfirm = useCallback(async () => {
		if (withdrawToCancel?.id) {
			await cancelWithdraw(withdrawToCancel.id);
			handleCloseModal();
		}
	}, [withdrawToCancel]);

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
			width: "550px",
		},
		{
			name: "status",
			label: formatMessage(messages.orders_table_status),
			width: "120px",
			align: "center",
		},
		{
			width: "80px",
			maxWidth: "80px",
		},
	];

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(messages.withdraws_history))} />
			<CancelWithdrawModal
				isOpen={modalOpened}
				onClose={handleCloseModal}
				withdraw={withdrawToCancel}
				onConfirm={handleModalConfirm}
				pair={pair ?? undefined}
			/>
			<div className={styles.filters}>
				<div className={styles.filter_select}>
					<CurrencySelect
						onSelectChange={handlePairSelect}
						options={currenciesOptions}
						value={selectedCurrency}
						autoFocus
						withoutLabel
						isClearable
						mini
						placeholder={formatMessage(messages.deposits_table_currency)}
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
					{isWithdrawsLoading ? (
						[...new Array(PAGE_SIZE)].map((_, i: number) => <WithdrawRowSkeleton key={i} />)
					) : length > 0 ? (
						withdraws.map((withdraw: IWithdraw) => (
							<WithdrawRow
								withdraw={withdraw}
								key={withdraw.id}
								onCancelClick={handleCancelClick}
							/>
						))
					) : (
						<NoRowsMessage disableHover />
					)}
				</Table>
			) : (
				<div className={styles.mobile_container}>
					{isWithdrawsLoading ? (
						<LoadingSpinner />
					) : length > 0 ? (
						withdraws.map((withdraw: IWithdraw) => (
							<WithdrawMobileRow
								key={withdraw.id}
								withdraw={withdraw}
								onCancelClick={handleCancelClick}
							/>
						))
					) : (
						<NoRowsMessage disableHover />
					)}
				</div>
			)}
			<div className={styles.pagination_container}>
				<Pagination
					count={Math.ceil(withdrawsCount / PAGE_SIZE)}
					page={filter.page}
					onChange={handlePaginationClick}
				/>
			</div>
		</>
	);
};

export default observer(Withdraws);
