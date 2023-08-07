import React, { useState } from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import { useBlockedUsers } from "services/P2PService";
import { queryVars } from "constants/query";
import NewPagination from "components/UI/NewPagination";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import { Table } from "components/UI/NewTable";
import BlockedUsersTableRow from "./BlockedUsersTableRow";

const PAGE_SIZE = 5;

interface IFilter {
	[queryVars.page]: number;
	[queryVars.page_size]: number;
}

const BlockedUsers = () => {
	const { formatMessage } = useIntl();

	const [filter, setFilter] = useState<IFilter>({
		[queryVars.page]: 1,
		[queryVars.page_size]: PAGE_SIZE,
	});

	const { data: blockedUsers, isFetching, refetch } = useBlockedUsers(filter);

	const handlePageChange = (page: number): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: page,
		}));
	};

	const headerOptions: IHeader = {
		columns: [
			{
				name: "username",
				label: formatMessage(p2pMessages.username),
				maxWidth: "400px",
				minWidth: "165px",
			},
			{
				name: "date",
				label: formatMessage(commonMessages.date),
				maxWidth: "450px",
				minWidth: "220px",
			},
			{
				name: "comment",
				label: formatMessage(p2pMessages.comment),
				maxWidth: "800px",
				minWidth: "200px",
			},
			{
				name: "action",
				label: formatMessage(p2pMessages.action),
				align: AlignEnum.Right,
				width: "100px",
				minWidth: "100px",
				maxWidth: "130px",
			},
		],
	};

	return (
		<div className={p2pStyles.table_container}>
			<span className={styles.section_title}>{formatMessage(p2pMessages.blocked_users)}</span>
			<span className={styles.section_desc}>
				{blockedUsers?.count || 0} {formatMessage(p2pMessages.users_are_blocked)}
			</span>
			<Table header={headerOptions}>
				{isFetching ? (
					[...new Array(PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : blockedUsers && blockedUsers.results.length ? (
					blockedUsers.results.map((user, idx) => (
						<BlockedUsersTableRow user={user} refetch={refetch} key={idx} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
				{blockedUsers && blockedUsers.results.length && blockedUsers.count > PAGE_SIZE ? (
					<div className={p2pStyles.pagination_container}>
						<NewPagination
							count={Math.ceil(blockedUsers.count / PAGE_SIZE)}
							page={filter.page}
							onChange={handlePageChange}
						/>
					</div>
				) : null}
			</Table>
		</div>
	);
};

export default BlockedUsers;
