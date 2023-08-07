import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import messages from "messages/common";
import { PageHeader, List } from "components/Profile/Notifications";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { useMst } from "models/Root";
import styles from "styles/pages/Notifications.module.scss";
import { getPageTitle } from "helpers/global";
import { queryVars } from "constants/query";

const Notifications: React.FC = () => {
	const { notifications } = useMst();
	const { formatMessage } = useIntl();
	const { page = "1" } = useParams<{ [queryVars.page]: string }>();
	const { category } = useParams<{ [queryVars.category]: string }>();
	// const page = +query.get(queryVars.page) || 1;
	// const category = query.get("category");

	useEffect(() => {
		notifications.loadNotifications({
			[queryVars.page_size]: 10,
			[queryVars.page]: Number(page),
			category: category || undefined,
		});
	}, []);

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(messages.notifications))} />
			<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Notifications}>
				<div className={styles.page_content_container}>
					<PageHeader />
					<List />
				</div>
			</ProfileLayout>
		</>
	);
};

export default observer(Notifications);
