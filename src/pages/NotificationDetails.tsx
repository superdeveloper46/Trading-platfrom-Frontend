import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import commonMessages from "messages/common";
import commonStyles from "styles/pages/ProfileAPI.module.scss";
import {
	NotificationDetails as NotificationDetailsComponent,
	NotificationDetailsSkeleton,
} from "components/Profile/NotificationDetails";
import { useMst } from "models/Root";
import styles from "styles/pages/NotificationDetails.module.scss";
import { INotification } from "models/Notifications";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import NotificationsService from "services/NotificationsService";
import { getPageTitle } from "helpers/global";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import Breadcrumbs from "components/Breadcrumbs";

const NotificationDetails: React.FC = () => {
	const { notifications } = useMst();

	const { formatMessage } = useIntl();
	const [searchParams] = useSearchParams();
	const { fromNotificationsPage } = Object.fromEntries(searchParams);
	const { slug } = useParams<{ slug: string }>();
	const [notification, setNotification] = useState<INotification | null>(null);
	const navigate = useNavigate();
	const localeNavigate = useLocaleNavigate();

	useEffect(() => {
		if (slug) {
			NotificationsService.readNotification(slug).then((n: INotification | null) => {
				setNotification(n);
				notifications.loadLatestNotifications();
			});
		}
	}, [slug]);

	const backToNotification = () => {
		if (fromNotificationsPage && fromNotificationsPage === "true") {
			localeNavigate(routes.profile.notification);
		} else {
			navigate(-1);
		}
	};

	return (
		<>
			<Helmet
				title={getPageTitle(
					`${formatMessage(commonMessages.notifications)} |${
						notification ? ` ${notification.title} |` : ""
					}}`,
				)}
			/>
			<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Notifications}>
				<div className={styles.page_content_container}>
					<Breadcrumbs
						links={[
							{ link: "/profile/wallets", label: formatMessage(commonMessages.notifications) },
						]}
						current={notification?.title ?? "--"}
					/>
					{notification ? (
						<NotificationDetailsComponent notification={notification} />
					) : (
						<NotificationDetailsSkeleton />
					)}
				</div>
			</ProfileLayout>
		</>
	);
};

export default observer(NotificationDetails);
