import React, { useState } from "react";
import cn from "classnames";
import commonMessages from "messages/common";
import { IHeader } from "components/UI/Table/Table";
import styles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import { RowSkeleton, Table } from "components/UI/Table";
import Pagination from "components/UI/Pagination";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import { useIntl } from "react-intl";
import useWindowSize from "hooks/useWindowSize";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IScoreDataSourceExt, NavSourcesEnum, SourcesTypeEnum } from "types/amlReport";
import messages from "messages/report";
import AddressRow from "./AddressRow";
import AddressRowMobile from "./AddressRowMobile";
import ExpandableList from "../ExpandableList";

const PAGE_SIZE = 10;

// interface ISort {
// 	name: string;
// 	value: "asc" | "desc";
// }

interface Props {
	data: IScoreDataSourceExt[];
	type: SourcesTypeEnum;
	loading: boolean;
	className?: string;
}

const AddressTable: React.FC<Props> = ({ data, loading, className, type }) => {
	const { formatMessage } = useIntl();
	const [page, setPage] = useState<number>(1);
	// const [filter, setFilter] = useState<ISort | null>(null);
	const pageCount = Math.ceil(data.length / PAGE_SIZE);
	const { mobile } = useWindowSize();
	// TODO: rewtite order logic to work with already fetched data
	// const handleChangeOrdering = (name: string): void => {
	// 	const nextSort: ISort = {
	// 		name: name,
	// 		value: filter?.value === "asc" ? "desc" : "asc",
	// 	};
	// 	setFilter(nextSort);
	// };

	const handlePageChange = (page: number): void => {
		setPage(page);
	};

	const headerOptions: IHeader = {
		primary: true,
		className: styles.table_row,
		columns: [
			{
				name: "amount",
				label: formatMessage(messages.amount),
				minWidth: "120px",
				maxWidth: "120px",
				// sort: filter?.name === "amount" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: "direct_tx",
				label: formatMessage(messages.direct_tx),
				maxWidth: "350px",
				minWidth: "350px",
				// sort: filter?.name === "direct_tx" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: type === SourcesTypeEnum.UNKNOWN ? "address" : "owner",
				label:
					type === SourcesTypeEnum.UNKNOWN
						? formatMessage(messages.address_cluster_id)
						: formatMessage(messages.owner),
				maxWidth: "250px",
				minWidth: "250px",
				// sort:
				// 	filter?.name === (type === "unknown" ? "address" : "owner") ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: "tag",
				label: formatMessage(messages.type_tag),
				maxWidth: "250px",
				minWidth: "250px",
				// sort: filter?.name === "tag" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: "depth",
				label: formatMessage(messages.depth),
				maxWidth: "100px",
				minWidth: "100px",
				// sort: filter?.name === "depth" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: "share",
				label: `${formatMessage(messages.share)}%`,
				maxWidth: "100px",
				minWidth: "100px",
				// sort: filter?.name === "share" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
			{
				name: "tx_hash",
				label: formatMessage(messages.tx_hash),
				maxWidth: "500px",
				minWidth: "350px",
				// sort: filter?.name === "tx_hash" ? filter?.value : "default",
				// onSortChange: handleChangeOrdering,
			},
		],
	};

	return (
		<div className={className}>
			{!mobile && (
				<div
					className={styles.report_block_header}
					id={
						type === SourcesTypeEnum.RISKY
							? NavSourcesEnum.RISKY_SOURCES
							: type === SourcesTypeEnum.UNKNOWN
							? NavSourcesEnum.UNKNOWN_SOURCES
							: NavSourcesEnum.KNOWN_SOURCES
					}
				>
					{type === SourcesTypeEnum.RISKY
						? formatMessage(messages.risky_sources)
						: type === SourcesTypeEnum.UNKNOWN
						? formatMessage(messages.unknown_sources)
						: formatMessage(messages.known_sources)}
				</div>
			)}
			{mobile ? (
				loading ? (
					<LoadingSpinner />
				) : (
					data.length > 0 && (
						<ExpandableList type={type}>
							{data.map((data, idx: number) => (
								<AddressRowMobile key={idx} data={data} type={type} />
							))}
						</ExpandableList>
					)
				)
			) : (
				<div
					className={cn(styles.table_container, {
						[styles.risky]: type === SourcesTypeEnum.RISKY,
						[styles.unknown]: type === SourcesTypeEnum.UNKNOWN,
						[styles.known]: type === SourcesTypeEnum.KNOWN,
					})}
				>
					<Table header={headerOptions}>
						{loading ? (
							[...new Array(PAGE_SIZE)].map((_, i: number) => (
								<RowSkeleton cells={headerOptions.columns} key={i} />
							))
						) : data.length > 0 ? (
							data
								.filter((_, idx: number) => {
									const startIdx = PAGE_SIZE * (page - 1);
									return startIdx <= idx && idx <= startIdx + PAGE_SIZE - 1;
								})
								.map((data, idx: number) => <AddressRow key={idx} data={data} type={type} />)
						) : (
							<div className={noResultsStyles.no_rows_message_container}>
								<i className="ai ai-dok_empty" />
								{formatMessage(commonMessages.table_no_data)}
							</div>
						)}
					</Table>
					{pageCount > 1 ? (
						<div className={styles.pagination_container}>
							<Pagination count={pageCount} page={page} onChange={handlePageChange} />
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};

export default AddressTable;
