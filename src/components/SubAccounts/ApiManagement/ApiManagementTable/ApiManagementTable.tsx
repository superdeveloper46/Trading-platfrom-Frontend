import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import subAccountMessages from "messages/sub_accounts";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Select from "components/UI/Select";
import Button from "components/UI/Button";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import Pagination from "components/UI/Pagination";
import { getLoadParams, getUrlParams } from "utils/filter";
import useParamQuery from "hooks/useSearchQuery";
import { useMst } from "models/Root";
import SubAccountsService, { useSubApis } from "services/SubAccountsService";
import { ILoadApiKeysParams } from "types/subAccounts";
import { queryVars } from "constants/query";
import AccountManagementTableRow from "./ApiManagementTableRow";
import DeleteApiModal from "../../modals/DeleteApiModal";

interface ISubAccountOption {
	label: string;
	value: string;
}

interface IFilter {
	account: string;
}

const ApiManagementTable: React.FC = () => {
	const navigate = useNavigate();
	const { formatMessage } = useIntl();

	const {
		subAccounts: { accounts },
	} = useMst();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [modalData, setModalData] = useState<{ slug: string; label: string }>({
		slug: "",
		label: "",
	});

	const query = useParamQuery();
	const querySubAccount = query.get(queryVars.account) || "";
	const queryPage = +(query.get(queryVars.page) || 1);
	const [filter, setFilter] = useState<IFilter>({
		account: querySubAccount,
	});
	const [page, setPage] = useState<number>(queryPage);

	const [loadParams, setLoadParams] = useState<ILoadApiKeysParams>(getLoadParams(filter));
	const { isFetching, data: subApis, refetch } = useSubApis(loadParams);

	const filterSubAccountOptions: ISubAccountOption[] = accounts.map((acc) => ({
		label: acc.login.length > 12 ? `${acc.login.slice(0, 12)}...` : acc.login,
		value: acc.uid,
	}));
	const filterSubAccountOptionValue =
		filterSubAccountOptions.find((o: ISubAccountOption) => o.value === filter.account) ?? null;

	const handleSubAccountSelectChange = (e: ISubAccountOption | null): void => {
		const value = e?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			account: value,
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

	const resetFilter = (): void => {
		setFilter({
			account: "",
		});
	};

	const openModal = (slug: string, label: string) => {
		setModalData({ slug, label });
		setIsDeleteModalOpen(true);
	};

	const headerOptions: IHeader = {
		primary: true,
		className: subAccountsStyles.table_row,
		columns: [
			{
				name: "account",
				label: formatMessage(accountMessages.subaccount_table_account),
				width: "200px",
				maxWidth: "200px",
			},
			{
				name: "email",
				label: formatMessage(accountMessages.subaccount_table_email),
				width: "150px",
				maxWidth: "150px",
			},
			{
				name: "label",
				label: formatMessage(accountMessages.subaccount_table_label),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "public-key",
				label: formatMessage(accountMessages.subaccount_api_public_key_label),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "spot",
				label: formatMessage(accountMessages.spot),
				align: AlignEnum.Center,
				width: "95px",
			},
			{
				name: "margin",
				label: formatMessage(accountMessages.margin),
				align: AlignEnum.Center,
				width: "95px",
			},
			{
				name: "ip_restriction",
				label: formatMessage(accountMessages.subaccount_table_ip_restriction),
				width: "140px",
				maxWidth: "140px",
			},
			{
				name: "div1",
				width: "140px",
				maxWidth: "140px",
			},
			{
				name: "div2",
				width: "140px",
				maxWidth: "140px",
			},
		],
	};

	return (
		<div className={subAccountsStyles.table_container}>
			<DeleteApiModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				label={modalData.label}
				successCallback={() => refetch()}
				onConfirmCallback={() => SubAccountsService.deleteSubApi(modalData.slug)}
			/>
			<div className={subAccountsStyles.filters}>
				<div className={subAccountsStyles.filter_select}>
					<Select
						mini
						options={filterSubAccountOptions}
						onChange={handleSubAccountSelectChange}
						isSearchable={false}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(subAccountMessages.sub_account)}
						getOptionLabel={(option: ISubAccountOption) => option.label}
						getOptionValue={(option: ISubAccountOption) => option.value}
						value={filterSubAccountOptionValue}
					/>
				</div>
				<div className={subAccountsStyles.filters_buttons}>
					<Button
						variant="text"
						color="primary"
						label={formatMessage(commonMessages.reset)}
						mini
						onClick={resetFilter}
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
				) : subApis && subApis.results.length > 0 ? (
					subApis.results.map((subApi, i: number) => (
						<AccountManagementTableRow
							onDelete={() => openModal(subApi.slug, `${subApi.label} api`)}
							subApi={subApi}
							key={i}
						/>
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{subApis && subApis.results.length ? (
				<div className={subAccountsStyles.pagination_container}>
					<Pagination
						count={Math.ceil(subApis.count / PAGE_SIZE)}
						page={page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default observer(ApiManagementTable);
