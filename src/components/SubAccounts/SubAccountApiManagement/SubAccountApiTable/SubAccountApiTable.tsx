import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import { IHeader } from "components/UI/Table/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Button from "components/UI/Button";
import { Table } from "components/UI/Table";
import { PAGE_SIZE } from "constants/subAccounts";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import useParamQuery from "hooks/useSearchQuery";
import { ILoadSubAccountParams, ISubApi } from "types/subAccounts";
import { getLoadParams, getUrlParams } from "utils/filter";
import SubAccountsService, { useSubApis } from "services/SubAccountsService";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { queryVars } from "constants/query";
import SubAccountApiTableRow from "./SubAccountApiTableRow";
import DeleteApiModal from "../../modals/DeleteApiModal";

interface IFilter {
	[queryVars.date]: IDateRange;
}

interface IProps {
	uid: string;
}

const ApiManagementTable: React.FC<IProps> = ({ uid }) => {
	const { formatMessage } = useIntl();
	const query = useParamQuery();
	const navigate = useNavigate();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [modalData, setModalData] = useState<{ slug: string; label: string }>({
		slug: "",
		label: "",
	});

	const [subApiList, setSubApiList] = useState<ISubApi[]>([]);

	const [filter, setFilter] = useState<IFilter>({
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

	const [loadParams, setLoadParams] = useState<ILoadSubAccountParams>(getLoadParams(filter));

	const { isFetching, data: subApis, refetch } = useSubApis(loadParams);

	useEffect(() => {
		if (uid && subApis) {
			setSubApiList(subApis.results.filter((a) => a.sub_account.uid === uid));
		}
	}, [subApis, uid]);

	const handleSearch = () => {
		navigate({ [queryVars.search]: getUrlParams(filter) });
		setLoadParams(getLoadParams(filter));
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

	const openModal = (slug: string, label: string) => {
		setModalData({ slug, label });
		setIsDeleteModalOpen(true);
	};

	const headerOptions: IHeader = {
		primary: true,
		className: subAccountsStyles.table_row,
		columns: [
			{
				name: "label",
				label: formatMessage(accountMessages.subaccount_table_label),
				width: "140px",
			},
			{
				name: "create-date",
				label: formatMessage(accountMessages.subaccount_table_created_at),
				align: "center",
				width: "120px",
			},
			{
				name: "public-key",
				label: formatMessage(accountMessages.subaccount_api_public_key_label),
				width: "140px",
				maxWidth: "140px",
			},
			{
				name: "ip_restriction",
				label: formatMessage(accountMessages.subaccount_table_ip_restriction),
				width: "140px",
			},
			{
				name: "spot",
				label: formatMessage(accountMessages.spot),
				align: "center",
				width: "100px",
			},
			{
				name: "margin",
				label: formatMessage(accountMessages.margin),
				align: "center",
				width: "100px",
			},
			{
				width: "140px",
			},
			{
				width: "140px",
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
				<DateRangePicker
					containerClassName={subAccountsStyles.date_picker}
					ranges={[filter.date]}
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
						onClick={handleRangeClear}
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
				) : subApiList.length > 0 ? (
					subApiList.map((subApi, i: number) => (
						<SubAccountApiTableRow
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
		</div>
	);
};

export default ApiManagementTable;
