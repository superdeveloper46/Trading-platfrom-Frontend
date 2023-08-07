import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import notificationsMessages from "messages/notifications";
import IconButton from "components/UI/IconButton";
import Select, { ISelectOption } from "components/UI/Select";
import styles from "styles/components/Profile/Notifications/Notifications.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { MessageFormatter } from "types/general";
import { useMst } from "models/Root";
import NotificationsService from "services/NotificationsService";
import Tooltip from "components/UI/Tooltip";
import { queryVars } from "constants/query";

function getCategoriesOptions(formatMessage: MessageFormatter): ISelectOption[] {
	return [
		{
			label: formatMessage(commonMessages.all),
			value: "all",
		},
		{
			label: formatMessage(notificationsMessages.system_notifications),
			value: "system",
		},
		{
			label: formatMessage(notificationsMessages.trading_notifications),
			value: "finance",
		},
		{
			label: formatMessage(notificationsMessages.news_digest),
			value: "digest",
		},
		{
			label: formatMessage(notificationsMessages.activities),
			value: "contests",
		},
		{
			label: formatMessage(notificationsMessages.promotions),
			value: "promotions",
		},
	];
}

const PageHeader: React.FC = () => {
	const { notifications } = useMst();
	const [filter, setFilter] = useState<ISelectOption | undefined>();
	const { formatMessage } = useIntl();
	const { page = "1" } = useParams<{ [queryVars.page]: string }>();
	const { category } = useParams<{ [queryVars.category]: string }>();
	const navigate = useNavigate();
	// const query = useParamQuery();
	// const page = +query.get(queryVars.page) || 1;

	const CATEGORIES_OPTIONS: ISelectOption[] = useMemo(
		() => getCategoriesOptions(formatMessage),
		[],
	);

	useEffect(() => {
		// const category = query.get("category");
		if (category) {
			setFilter(CATEGORIES_OPTIONS.find((o: ISelectOption) => o.value === category));
		}
	}, []);

	const handleMarkAllRead = useCallback(async () => {
		try {
			await NotificationsService.markAllRead();
			await notifications.loadNotifications({
				[queryVars.page]: Number(page),
				[queryVars.page_size]: 10,
				category,
			});
		} catch (e) {
			console.log(e);
		}
	}, [page, category]);

	const handleChangeFilterCategory = useCallback((o: ISelectOption): void => {
		setFilter(o);
		if (o.value !== "all") {
			navigate({ [queryVars.search]: `${queryVars.page_size}=1&${queryVars.category}=${o.value}` });
			notifications.loadNotifications({
				[queryVars.page]: 1,
				[queryVars.page_size]: 10,
				[queryVars.category]: o.value,
			});
		} else {
			navigate({ [queryVars.search]: `${queryVars.page}=1` });
			notifications.loadNotifications({
				[queryVars.page]: 1,
				[queryVars.page_size]: 10,
			});
		}
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.card_title}>
				{formatMessage(commonMessages.notifications)}
				{notifications.unread_count > 0 && <>&nbsp;({notifications.unread_count})</>}
			</div>
			<div className={styles.filters}>
				<div className={styles.filters_section}>
					<Select
						options={CATEGORIES_OPTIONS}
						onChange={handleChangeFilterCategory}
						isSearchable={false}
						label={formatMessage(commonMessages.all)}
						value={filter}
					/>
				</div>
				<div className={styles.filters_section}>
					<Tooltip
						id="mark_as_read"
						opener={
							<IconButton
								variant="text"
								icon={<i className="ai ai-notification_check" />}
								size="large"
								onClick={handleMarkAllRead}
							/>
						}
						text={formatMessage(notificationsMessages.mark_as_read)}
						place="top"
						backgroundColor="var(--tooltip-background)"
					/>
				</div>
			</div>
		</div>
	);
};

export default observer(PageHeader);
