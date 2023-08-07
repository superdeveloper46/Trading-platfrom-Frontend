import React from "react";
import dayjs from "utils/dayjs";
import { INotification } from "models/Notifications";
import { NOTIFICATION_CATEGORY } from "constants/notifications";
import styles from "styles/components/Profile/Notifications/NotificationDetails.module.scss";
import Markdown from "components/UI/Markdown";

interface Props {
	notification: INotification;
}

const NotificationDetails: React.FC<Props> = ({ notification }) => (
	<div className={styles.container}>
		<div className={styles.meta}>
			<i
				className={`ai ai-${NOTIFICATION_CATEGORY[notification.category]?.icon}`}
				style={{ color: NOTIFICATION_CATEGORY[notification.category]?.color }}
			/>
			<span>{dayjs(notification.created_at).fromNow()}</span>
		</div>
		<h2 className={styles.title}>{notification.title}</h2>
		<span className={styles.body}>
			<Markdown content={notification.text_md || notification.text} />
		</span>
	</div>
);

export default NotificationDetails;
