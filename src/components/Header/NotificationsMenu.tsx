import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import notificationsMessages from "messages/notifications";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { INotification } from "models/Notifications";
import { NOTIFICATION_CATEGORY } from "constants/notifications";
import { ReactComponent as SettingsIcon } from "assets/icons/settings-02.svg";
import styles from "styles/components/Header.module.scss";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import { routes } from "constants/routing";

interface INotificationsItemProps {
	notification: INotification;
}

const NotificationsItem: React.FC<INotificationsItemProps> = ({ notification }) => {
	const icon = NOTIFICATION_CATEGORY[notification.category];

	return (
		<div
			className={cn(styles.notifications_menu_list_item, {
				[styles.disabled]: !!notification.read_at,
			})}
		>
			<InternalLink to={routes.profile.getNotificationDetails(notification.uuid, false)} />
			{/* ?fromNotificationsPage=false */}
			<i
				className={`ai ai-${icon?.icon}`}
				style={{ color: icon?.icon === "info_filled" && icon?.color ? icon?.color : undefined }}
			/>
			<span>{notification.title}</span>
			<time>{dayjs(notification.created_at).fromNow()}</time>
		</div>
	);
};

const NotificationsMenu: React.FC = () => {
	const {
		notifications: { latest },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={styles.notification_menu_container}>
			<div className={styles.notifications_menu_header}>
				<span>{formatMessage(notificationsMessages.latest_notifications)}</span>
				<InternalLink to={routes.settings.notifications}>
					<SettingsIcon />
				</InternalLink>
			</div>
			<div className={styles.notifications_menu_list}>
				{latest.length > 0 ? (
					latest
						.slice(0, 4)
						.map((n: INotification) => <NotificationsItem key={n.uuid} notification={n} />)
				) : (
					<NoRowsMessage />
				)}
			</div>
			<InternalLink className={styles.notifications_menu_footer} to={routes.profile.notification}>
				<span>{formatMessage(notificationsMessages.all_notifications)}</span>
				<i className="ai ai-doc_outlined" />
			</InternalLink>
		</div>
	);
};

export default observer(NotificationsMenu);
