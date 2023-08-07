import React, { useState } from "react";
import { useIntl } from "react-intl";
import classnames from "classnames";
import dayjs from "dayjs";

import Badge, { BadgeColorEnum } from "components/UI/Badge";
import Pagination from "components/UI/Pagination";
import SkeletonLoader from "components/UI/Skeleton";
import useAutoFetch from "hooks/useAutoFetch";
import accountMessages from "messages/account";
import messages from "messages/common";
import { useSessions } from "services/SecurityService";
import styles from "styles/components/Profile/SessionCard.module.scss";
import { ISession } from "types/profileSecurity";
import { queryVars } from "constants/query";
import EndSessionModal from "./EndSessionModal";

interface IProps {
	pageSize: number;
	icon?: string;
	isPaginated?: boolean;
	fixedHeight?: boolean;
}

const SessionCard: React.FC<IProps> = ({ pageSize, fixedHeight, icon, isPaginated, children }) => {
	const { formatMessage } = useIntl();
	const [page, setPage] = React.useState(1);
	const [modalOpen, setModalOpen] = useState(false);
	const {
		isFetching,
		data: { results: sessions, count: sessionCount } = { results: [], count: 0 },
		refetch,
	} = useSessions({
		page,
		"page-size": pageSize,
	});

	const { data: { count: activeSessionsCount } = { count: 0 }, refetch: refetchActive } =
		useSessions({
			[queryVars.is_active]: true,
		});

	const onPageChange = (nextPage: number) => {
		setPage(nextPage);
	};

	const toggleModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.preventDefault();
		setModalOpen(!modalOpen);
	};

	const reloadSessions = () => {
		refetch();
		refetchActive();
	};

	useAutoFetch(reloadSessions, true, 20000);

	return (
		<>
			{modalOpen && (
				<EndSessionModal
					isOpen={modalOpen}
					onClose={toggleModal}
					onSessionTerminated={reloadSessions}
				/>
			)}
			<div className={styles.card}>
				<div className={styles.card_header}>
					<div className={styles.card_title}>
						{icon && <i className={icon} />}
						{formatMessage(accountMessages.active_sessions)}
						&nbsp;({activeSessionsCount})
					</div>
					<span className={styles.card_link} onClick={() => toggleModal()}>
						{formatMessage(accountMessages.end_sessions)}
					</span>
				</div>
				<div
					className={classnames(styles.list, {
						[styles.fixed_height]: fixedHeight,
					})}
				>
					{isFetching
						? [...new Array(pageSize - 1)].map((_, index) => (
								<SessionSkeletonListItem key={index} />
						  ))
						: sessions.map(
								(session, index) => session && <SessionListItem key={index} {...session} />,
						  )}
					{isPaginated && sessionCount > 8 && (
						<Pagination
							onChange={onPageChange}
							count={Math.ceil(sessionCount / pageSize)}
							page={page}
						/>
					)}
				</div>
				{children}
			</div>
		</>
	);
};

export default SessionCard;

export const SessionListItem: React.FC<ISession> = ({
	ua,
	is_current,
	is_active,
	date,
	ip_address,
	country_name,
}) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.list_item}>
			<div className={styles.list_item_label}>
				{ua?.is_mobile_app ? <i className="ai ai-mobile" /> : <i className="ai ai-web_outlined" />}
				<span>
					{ua?.browser}&nbsp;
					{is_current && (
						<Badge color={BadgeColorEnum.GREEN} alpha>
							{formatMessage(accountMessages.current_session)}
						</Badge>
					)}
					&nbsp;
					{is_active && (
						<Badge color={BadgeColorEnum.GREEN} alpha>
							{formatMessage(messages.active)}
						</Badge>
					)}
				</span>
				<span>{country_name}</span>
			</div>
			<div className={styles.list_item_value}>
				<span>IP {ip_address}</span>
				<span>{dayjs(date).format("DD/MM/YYYY HH:mm")}</span>
			</div>
		</div>
	);
};

export const SessionSkeletonListItem: React.FC = () => (
	<div className={styles.list_item}>
		<div className={styles.list_item_label}>
			<i className="ai">
				<SkeletonLoader height={13} width={13} />
			</i>
			<span>
				<SkeletonLoader height={14} width={80} />
			</span>
			<span>
				<SkeletonLoader height={12} width={100} />
			</span>
		</div>
		<div className={styles.list_item_value}>
			<span>
				<SkeletonLoader height={14} width={160} />
			</span>
			<span>
				<SkeletonLoader height={12} width={120} />
			</span>
		</div>
	</div>
);
