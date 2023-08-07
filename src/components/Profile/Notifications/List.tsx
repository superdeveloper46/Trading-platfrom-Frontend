import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import dayjs from "utils/dayjs";

import InternalLink from "components/InternalLink";
import { NOTIFICATION_CATEGORY } from "constants/notifications";
import { INotification } from "models/Notifications";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { useMst } from "models/Root";
import SkeletonLoader from "components/UI/Skeleton";
import Pagination from "components/UI/Pagination";
import commonMessages from "messages/common";
import styles from "styles/components/Profile/Notifications/Notifications.module.scss";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";

const ListItemSkeleton = () => (
	<div className={styles.list_item}>
		<i className={styles.list_item_icon}>
			<SkeletonLoader />
		</i>
		<span className={styles.list_item_title}>
			<SkeletonLoader />
		</span>
		<span className={styles.list_item_body}>
			<SkeletonLoader count={2} />
		</span>
		<span className={styles.list_item_date}>
			<SkeletonLoader />
		</span>
	</div>
);

const List: React.FC = () => {
	const { notifications } = useMst();
	const navigate = useNavigate();
	const { formatMessage } = useIntl();
	const { page: pageParam = "1" } = useParams<{ [queryVars.page]: string }>();
	const { category } = useParams<{ category: string }>();
	const [page, setPage] = useState<number>(Number(pageParam));

	const handlePageChange = (page: number) => {
		setPage(page);
		navigate({
			[queryVars.search]: `${queryVars.page}=${page}${
				category ? `&${queryVars.category}=${category}` : ""
			}`,
		});
		notifications.loadNotifications({
			page,
			[queryVars.page_size]: 10,
			[queryVars.category]: category || undefined,
		});
	};

	return (
		<>
			<div className={styles.list_container}>
				{notifications.isLoading ? (
					[...new Array(5)].map((_, i: number) => <ListItemSkeleton key={i} />)
				) : notifications.results.length > 0 ? (
					notifications.results.map((n: INotification) => (
						<div
							className={cn(styles.list_item, {
								[styles.read]: !!n.read_at,
							})}
							key={n.uuid}
						>
							<InternalLink to={routes.profile.getNotificationDetails(n.uuid, true)} />
							{/* ?fromNotificationsPage=true */}
							<i
								className={cn(
									`ai ai-${NOTIFICATION_CATEGORY[n.category]?.icon}`,
									styles.list_item_icon,
								)}
								style={{ color: NOTIFICATION_CATEGORY[n.category]?.color }}
							/>
							<span className={styles.list_item_title}>{n.title}</span>
							<span className={styles.list_item_body}>
								{n.text?.length > 200 ? `${n.text.slice(0, 200)}...` : n.text}
							</span>
							<span className={styles.list_item_date}>{dayjs(n.created_at).fromNow()}</span>
						</div>
					))
				) : (
					<NoRowsMessage />
				)}
			</div>
			<Pagination
				count={Math.ceil(notifications.count / 10)}
				page={page}
				onChange={handlePageChange}
			/>
		</>
	);
};
export default observer(List);
