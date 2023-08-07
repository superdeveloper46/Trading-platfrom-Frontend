import React, { useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import Pagination from "components/UI/Pagination";
import messages from "messages/report";
import commonMessages from "messages/common";
import styles from "styles/components/TransactionsMonitoring/Report.module.scss";
import tablesStyles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import { useReports } from "services/ReportService";
import { RowSkeleton, Table, TableData, TableRow } from "components/UI/Table";
import { IHeader } from "components/UI/Table/Table";
import { IReportDescriptor, RequestTypeEnum, ResourceTypeEnum } from "types/amlReport";
import dayjs from "utils/dayjs";
import Button from "components/UI/Button";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import useCopyClick from "hooks/useCopyClick";
import CompletedReport from "./CompletedReport";

const PAGE_SIZE = 20;

interface IReportsTableRowProps {
	report: IReportDescriptor;
	onViewReport: (report: IReportDescriptor) => void;
}

const ReportsTableRow: React.FC<IReportsTableRowProps> = ({ report, onViewReport }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	const handleCopyAddress = () => {
		copyClick(report.address);
	};

	const handleViewReport = () => {
		onViewReport(report);
	};

	const getReportType = (type: RequestTypeEnum) => {
		switch (type) {
			case RequestTypeEnum.REPORT_TYPE_ADDRESS:
				return formatMessage(messages.reports_table_type_address);
			case RequestTypeEnum.REPORT_TYPE_TRANSACTION:
				return formatMessage(messages.reports_table_transaction);

			default:
				return "Unknown";
		}
	};

	const getReportColor = (type: RequestTypeEnum): BadgeColorEnum => {
		switch (type) {
			case RequestTypeEnum.REPORT_TYPE_ADDRESS:
				return BadgeColorEnum.GREEN;
			case RequestTypeEnum.REPORT_TYPE_TRANSACTION:
				return BadgeColorEnum.VIOLET;
			default:
				return BadgeColorEnum.GREY;
		}
	};

	return (
		<TableRow>
			<TableData dateMode>
				{dayjs(report.created_at).format("DD.MM.YYYY")}&nbsp;
				<span>{dayjs(report.created_at).format("HH:mm")}</span>
			</TableData>
			<TableData maxWidth="550px" minWidth="550px">
				<div className={tablesStyles.link}>
					{report.address}
					<i
						className={cn("ai ai-copy_new", tablesStyles.copy_button)}
						onClick={handleCopyAddress}
					/>
				</div>
			</TableData>
			<TableData align="right">
				<Badge alpha color={getReportColor(report.report_type)}>
					{getReportType(report.report_type)}
				</Badge>
			</TableData>
			<TableData maxWidth="200px" minWidth="200px" align="right">
				<Button
					label={formatMessage(messages.view_report)}
					variant="text"
					mini
					color="primary"
					onClick={handleViewReport}
				/>
			</TableData>
		</TableRow>
	);
};

const Reports: React.FC = () => {
	const [, setSearchParams] = useSearchParams();
	const { formatMessage } = useIntl();
	const [page, setPage] = useState<number>(1);
	const { data, isLoading } = useReports(page);
	const pageCount = Math.ceil((data?.count ?? 0) / PAGE_SIZE);

	const [detailedReport, setDetailedReport] = useState<IReportDescriptor | null>(null);

	const handlePageChange = (page: number): void => {
		setPage(page);
	};

	const handleDetailedReport = (report: IReportDescriptor) => {
		setSearchParams({
			value: report.address,
			type:
				report.report_type === RequestTypeEnum.REPORT_TYPE_ADDRESS
					? ResourceTypeEnum.ADDRESS
					: ResourceTypeEnum.HASH,
		});
		setDetailedReport(report);
		window.scrollTo(0, 0);
	};

	const headerOptions: IHeader = {
		primary: true,
		className: tablesStyles.table_row,
		columns: [
			{
				name: "created_at",
				label: formatMessage(messages.reports_table_created_at),
			},
			{
				name: "address",
				label: formatMessage(messages.reports_table_address),
				maxWidth: "550px",
				minWidth: "550px",
			},
			{
				name: "type",
				align: "right",
				label: formatMessage(messages.reports_table_type),
			},
			{
				maxWidth: "200px",
				minWidth: "200px",
			},
		],
	};

	return (
		<div className={styles.container}>
			{detailedReport ? <CompletedReport report={detailedReport} /> : null}
			<Table header={headerOptions}>
				{isLoading ? (
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton key={i} cells={headerOptions.columns} />
					))
				) : data && data.results.length > 0 ? (
					data?.results.map((report, idx) => (
						<ReportsTableRow onViewReport={handleDetailedReport} key={idx} report={report} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{pageCount > 1 && <Pagination count={pageCount} page={page} onChange={handlePageChange} />}
		</div>
	);
};

export default Reports;
