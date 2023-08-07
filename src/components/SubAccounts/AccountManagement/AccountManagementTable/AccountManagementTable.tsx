import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import subAccountsMessages from "messages/sub_accounts";
import { IHeader } from "components/UI/Table/Table";
import useParamQuery from "hooks/useSearchQuery";
import { ILoadSubAccountParams } from "types/subAccounts";
import { getLoadParams, getUrlParams } from "utils/filter";
import Tooltip from "components/UI/Tooltip";
import Select from "components/UI/Select";
import CheckBox from "components/UI/CheckBox";
import Button from "components/UI/Button";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import { useSubAccounts } from "services/SubAccountsService";
import { useMst } from "models/Root";
import { queryVars } from "constants/query";
import AccountManagementTableRow from "./AccountManagementTableRow";

interface ISubAccountOption {
	label: string;
	value: string;
}

interface IFilter {
	[queryVars.account]: string;
	[queryVars.is_active]: boolean;
}

const AccountManagementTable: React.FC = () => {
	const {
		subAccounts: { accounts, isAccountsLoading },
	} = useMst();

	const query = useParamQuery();
	const queryAccount = query.get(queryVars.account) || "";
	const queryIsActive = query.get(queryVars.is_active) || false;
	const navigate = useNavigate();

	const [filter, setFilter] = useState<IFilter>({
		account: queryAccount,
		is_active: Boolean(queryIsActive),
	});
	const [loadParams, setLoadParams] = useState<ILoadSubAccountParams>(getLoadParams(filter));

	const { formatMessage } = useIntl();
	const { isFetching, data: subAccounts, refetch } = useSubAccounts(loadParams);

	const filterSubAccountOptions: ISubAccountOption[] = accounts.map((s) => ({
		label: s.login,
		value: s.uid,
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

	const handleSearch = () => {
		navigate({ [queryVars.search]: getUrlParams(filter) });
		setLoadParams(getLoadParams(filter));
	};

	const toggleActiveOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		const nextFilter = { ...filter, [queryVars.is_active]: checked };
		setFilter(nextFilter);
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.is_active]: checked }) });
		setLoadParams(getLoadParams(nextFilter));
	};

	const handleReset = (): void => {
		setFilter({
			account: "",
			is_active: false,
		});
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
				name: "user_id",
				label: formatMessage(accountMessages.subaccount_table_user_id),
				width: "100px",
			},
			{
				name: "email",
				label: formatMessage(accountMessages.subaccount_table_email),
				width: "150px",
			},
			{
				name: "created_at",
				label: formatMessage(accountMessages.subaccount_table_created_at),
				width: "120px",
			},
			{
				name: "trading_permission",
				label: formatMessage(accountMessages.subaccount_table_trading_permission),
				align: "center",
				width: "200px",
			},
			{
				name: "asset_management",
				label: formatMessage(accountMessages.subaccount_asset_management),
				align: "center",
				width: "150px",
			},
			{
				name: "api",
				label: formatMessage(accountMessages.subaccount_table_api),
				align: "center",
				width: "80px",
			},
			{
				name: "login",
				label: (
					<>
						{formatMessage(subAccountsMessages.login)}
						<Tooltip
							id="login"
							hint
							text={formatMessage(subAccountsMessages.sub_acc_allow_to_sign_in)}
						/>
					</>
				),
				align: "center",
				width: "80px",
			},
			{
				name: "acc_state",
				label: formatMessage(accountMessages.subaccount_table_acc_state),
				align: "center",
				width: "90px",
			},
			{
				name: "div1",
				width: "140px",
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
						isLoading={isAccountsLoading}
						labeled
						placeholder={formatMessage(commonMessages.all)}
						label={formatMessage(subAccountsMessages.sub_account)}
						getOptionLabel={(option: ISubAccountOption) => option.label}
						getOptionValue={(option: ISubAccountOption) => option.value}
						value={filterSubAccountOptionValue}
					/>
				</div>
				<div className={subAccountsStyles.filter_checkbox}>
					<CheckBox name="show_active_only" checked={filter.is_active} onChange={toggleActiveOnly}>
						{formatMessage(subAccountsMessages.show_active_only)}
					</CheckBox>
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
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
					))
				) : subAccounts && subAccounts.length ? (
					subAccounts.map((item) => (
						<AccountManagementTableRow reFetchList={refetch} key={item.uid} subAccount={item} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
		</div>
	);
};

export default observer(AccountManagementTable);
