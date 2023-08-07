import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";

import Table, { IHeaderColumn } from "components/UI/Table/Table";
import useWindowSize from "hooks/useWindowSize";
import commonMessages from "messages/common";
import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import couponsMessages from "messages/alpha_codes";
import styles from "styles/components/InternalTransfers/TransferHistoryTable.module.scss";
import errorHandler from "utils/errorHandler";
import { IInternalTransferTableHistory, ITransfersHistoryFilter } from "types/internal_transfers";
import { IPaginationParams, MessageFormatter } from "types/general";
import InternalTransferService from "services/InternalTransferService";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { RowSkeleton } from "components/UI/Table";
import NoRowsMessage from "components/Table/NoRowsMessage";
import LoadingSpinner from "components/UI/LoadingSpinner";
import SearchInput from "components/UI/SearchInput";
import Button from "components/UI/Button";
import Pagination from "components/UI/Pagination";
import InternalLink from "components/InternalLink";
import { IBalance } from "models/Account";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import TableHistoryTableRow from "./TransferHistoryTableRow";
import TransferHistoryTableRowMobile from "./TransferHistoryTableRowMobile";
import { processBalances } from "./InternalTransfersUtil";

const PAGE_SIZE = 15;

interface IProps {
	full?: boolean;
}

const getColumns = (formatMessage: MessageFormatter): IHeaderColumn[] => [
	{
		name: "date",
		label: formatMessage(historyMessages.orders_table_date),
		width: "150px",
	},
	{
		name: "status",
		label: formatMessage(historyMessages.orders_table_status),
		align: "center",
		width: "100px",
	},
	{
		name: "amount",
		label: formatMessage(historyMessages.orders_table_amount),
		align: "right",
		width: "120px",
	},
	{
		name: "currency",
		label: formatMessage(historyMessages.deposits_table_currency),
		width: "100px",
	},
	{
		name: "receiver",
		label: formatMessage(commonMessages.user_uid),
		align: "right",
		width: "100px",
	},
	{
		name: "description",
		label: formatMessage(commonMessages.description),
		align: "center",
		width: "100px",
	},
	{
		name: "txid",
		label: formatMessage(historyMessages.deposits_table_transaction),
		width: "130px",
		align: "right",
	},
];

const TransferHistoryTable: React.FC<IProps> = ({ full }) => {
	const { formatMessage } = useIntl();

	const {
		account: { loadBalances, balances, isBalancesLoaded },
	} = useMst();

	const { desktop } = useWindowSize();
	const [transfersData, setTransfersData] = useState<{
		transfers: IInternalTransferTableHistory[];
		count: number;
	}>({ transfers: [], count: 0 });
	const [isLoading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [currencies, setProcessedCurrencies] = useState<IOption[]>([]);

	useEffect(() => {
		if (full) {
			loadBalances();
		}
	}, []);

	useEffect(() => {
		setProcessedCurrencies(processBalances(balances as IBalance[]));
	}, [balances.length]);

	const [historyFilter, setHistoryFilter] = useState<ITransfersHistoryFilter>({
		search: "",
		currency: "",
	});

	useEffect(() => {
		loadTransfers();
	}, [page]);

	useEffect(() => {
		transfersData.transfers.map((t) => {
			t.option = currencies.find((c) => c.label.code === t.currency.code);
			return t;
		});
	}, [transfersData.transfers.length, currencies.length]);

	const columns: IHeaderColumn[] = getColumns(formatMessage);

	const loadTransfers = async (search?: boolean): Promise<void> => {
		try {
			setLoading(true);
			const params: IPaginationParams = { page, [queryVars.page_size]: PAGE_SIZE };
			const data = await InternalTransferService.loadTransfersHistory(
				search ? { ...params, ...historyFilter } : params,
			);
			if (!data) return;
			const { results, count } = data;
			setTransfersData({ transfers: results, count });
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setHistoryFilter((h) => ({ ...h, search: value }));
	};

	const onSelect = (e: { value: string }) => {
		const { value } = e;
		setHistoryFilter((h) => ({
			...h,
			currency: value,
		}));
	};

	const onPageChange = (nextPage: number) => {
		setPage(nextPage);
	};

	const onSearch = () => loadTransfers(true);

	const onResetSearch = () => {
		setHistoryFilter({ currency: "", search: "" });
		loadTransfers();
	};

	const onCancel = async (txid: string) => {
		try {
			await InternalTransferService.cancelTransferRequest(txid);
			loadTransfers();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<div className={styles.table_container}>
			{full && (
				<div className={styles.filters}>
					<div className={styles.filters_search}>
						<SearchInput
							name="search"
							onEnter={onSearch}
							onChange={onInput}
							value={historyFilter.search}
							placeholder={formatMessage(commonMessages.search)}
						/>
					</div>
					<div className={styles.filter_select}>
						<CurrencySelect
							onSelectChange={onSelect}
							isLoading={!isBalancesLoaded}
							options={currencies}
							value={currencies.find((o) => o.value === historyFilter.currency)}
							disabled={currencies.length === 0}
							autoFocus
							placeholder={formatMessage(financeMessages.select_currency)}
							withoutLabel
						/>
					</div>
					<div className={styles.filter_buttons}>
						<Button
							variant="text"
							color="primary"
							label={formatMessage(commonMessages.reset)}
							mini
							onClick={onResetSearch}
						/>
						<Button
							variant="filled"
							color="primary"
							label={formatMessage(commonMessages.search)}
							mini
							onClick={onSearch}
						/>
					</div>
				</div>
			)}
			{desktop ? (
				<Table
					header={{
						columns,
						advanced: true,
						primary: true,
					}}
				>
					{isLoading ? (
						<RowSkeleton cells={columns} />
					) : transfersData.transfers.length ? (
						transfersData.transfers.map((transfer) => (
							<TableHistoryTableRow key={transfer.txid} transfer={transfer} onCancel={onCancel} />
						))
					) : (
						<NoRowsMessage />
					)}
				</Table>
			) : (
				<div className={styles.mobile_history_container}>
					{isLoading ? (
						<LoadingSpinner />
					) : transfersData.transfers.length ? (
						transfersData.transfers.map((transfer) => (
							<TransferHistoryTableRowMobile
								key={transfer.txid}
								transfer={transfer}
								onCancel={onCancel}
							/>
						))
					) : (
						<NoRowsMessage />
					)}
				</div>
			)}
			{full ? (
				<div className={styles.pagination_container}>
					<Pagination
						onChange={onPageChange}
						count={Math.ceil(transfersData.count / PAGE_SIZE)}
						page={page}
					/>
				</div>
			) : (
				<div className={styles.all_history_message_block}>
					<InternalLink to={routes.transfers.history}>
						{formatMessage(couponsMessages.check_history)}
						<i className="ai ai-chevron_right" />
					</InternalLink>
				</div>
			)}
		</div>
	);
};

export default observer(TransferHistoryTable);
