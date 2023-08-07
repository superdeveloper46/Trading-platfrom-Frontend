import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";

import Breadcrumbs from "components/Breadcrumbs";
import styles from "styles/pages/ProfileSettings.module.scss";
import notificationsMessages from "messages/notifications";
import commonMessages from "messages/common";
import settingsMessages from "messages/settings";
import InternalLink from "components/InternalLink";
import Icons from "assets/images/settings/notifications-header-icons.svg";
import Switch from "components/UI/Switch";
import { useMst } from "models/Root";
import ProfileSettingService from "services/ProfileSettingService";
import { routes } from "constants/routing";
import SettingsPageHeader from "./SettingsPageHeader";

interface IProps {
	title: string;
	subtitle: string;
	icon: string;
	link?: string;
}

const NotificationListItem: React.FC<IProps> = ({ title, subtitle, icon, link, children }) => (
	<div className={styles.notification_list_item}>
		<i className={icon} />
		<div className={styles.settings_list_item_label}>
			<span>{title}</span>
			<span>{subtitle}</span>
		</div>
		{children}
		{link && <InternalLink to={link} className={styles.notification_list_item_link} />}
	</div>
);

interface ISubscriptions {
	notify_digest: boolean;
	notify_finance: boolean;
	notify_contests: boolean;
	notify_promotions: boolean;
	use_telegram: boolean;
	use_push: boolean;
	[key: string]: boolean;
}

const NotificationSettings: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		account: { profileStatus },
	} = useMst();
	const [isMarketingSubscribed, setMarketingSubscribed] = useState(false);
	const [subscriptions, setSubscriptions] = useState<ISubscriptions>({
		notify_digest: false,
		notify_finance: false,
		notify_contests: false,
		notify_promotions: false,
		use_telegram: false,
		use_push: false,
	});

	useEffect(() => {
		loadSubscriptions();
	}, []);

	useEffect(() => {
		if (profileStatus) {
			setMarketingSubscribed(profileStatus.send_marketing_email);
		}
	}, [profileStatus]);

	useEffect(() => {
		updateSubscriptions();
	}, [subscriptions]);

	const loadSubscriptions = async () => {
		try {
			const data = await ProfileSettingService.loadNotificationSettings();
			if (!data) return;
			setSubscriptions({
				notify_digest: data.notify_digest,
				notify_finance: data.notify_finance,
				notify_contests: data.notify_contests,
				notify_promotions: data.notify_promotions,
				use_telegram: data.use_telegram,
				use_push: data.use_push,
			});
		} catch (err: any) {
			if (!err) return;
			toast(
				<>
					<i className="ai ai-error_outline" />
					{err.message}
				</>,
			);
		}
	};

	const updateSubscriptions = async () => {
		try {
			await ProfileSettingService.updateNotificationSettings({ ...subscriptions });
		} catch (err: any) {
			if (!err) return;
			toast(
				<>
					<i className="ai ai-error_outline" />
					{err.message}
				</>,
			);
		}
	};

	const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked, name } = e.target;
		setSubscriptions((prevState) => ({
			...prevState,
			[name]: checked,
		}));
	};

	const handleMarketingSubscribedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setMarketingSubscribed(checked);
	};

	return (
		<div className={styles.settings_page_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.settings.root,
						label: formatMessage(commonMessages.settings),
					},
				]}
				current={formatMessage(commonMessages.notifications)}
			/>
			<SettingsPageHeader
				title={formatMessage(commonMessages.notifications)}
				subtitle={formatMessage(notificationsMessages.here_you_can_configure_notifications)}
				img={Icons}
			/>
			<div className={styles.settings_card_container}>
				<div className={styles.settings_header}>
					<div className={styles.settings_card_title}>
						{formatMessage(notificationsMessages.general_notifications)}
					</div>
				</div>
				<div className={styles.settings_list}>
					<NotificationListItem
						title={formatMessage(notificationsMessages.system_notifications)}
						subtitle={formatMessage(
							notificationsMessages.important_notifications_about_your_account,
						)}
						icon="ai ai-tool"
					>
						<Switch id="system" disabled checked />
					</NotificationListItem>
					<NotificationListItem
						title={formatMessage(notificationsMessages.trading_notifications)}
						subtitle={formatMessage(notificationsMessages.notification_about_your_deals)}
						icon="ai ai-coin_outline"
					>
						<Switch
							id="notify_finance"
							name="notify_finance"
							checked={subscriptions.notify_finance}
							onChange={onChange}
						/>
					</NotificationListItem>
					<NotificationListItem
						title={formatMessage(notificationsMessages.news_digest)}
						subtitle={formatMessage(notificationsMessages.news_compilation_about_market_events)}
						icon="ai ai-alpha_stories"
					>
						<Switch
							id="notify_digest"
							name="notify_digest"
							checked={subscriptions.notify_digest}
							onChange={onChange}
						/>
					</NotificationListItem>
					<NotificationListItem
						title={formatMessage(notificationsMessages.activities)}
						subtitle={formatMessage(notificationsMessages.contests_and_competitions)}
						icon="ai ai-cup"
					>
						<Switch
							id="notify_contests"
							name="notify_contests"
							checked={subscriptions.notify_contests}
							onChange={onChange}
						/>
					</NotificationListItem>
					<NotificationListItem
						title={formatMessage(notificationsMessages.promotions)}
						subtitle={formatMessage(
							notificationsMessages.important_news_and_events_of_the_platform,
						)}
						icon="ai ai-target"
					>
						<Switch
							id="notify_promotions"
							name="notify_promotions"
							checked={subscriptions.notify_promotions}
							onChange={onChange}
						/>
					</NotificationListItem>
				</div>
			</div>

			<div className={styles.settings_card_container}>
				<div className={styles.settings_list}>
					<NotificationListItem
						title={formatMessage(notificationsMessages.email_notifications)}
						subtitle={formatMessage(settingsMessages.send_marketing_email)}
						icon="ai ai-mail_outline_new"
					>
						<Switch
							id="marketing_emails"
							name="marketing_emails"
							checked={isMarketingSubscribed}
							onChange={handleMarketingSubscribedChange}
						/>
					</NotificationListItem>
				</div>
			</div>

			<div className={styles.settings_card_container}>
				<div className={styles.settings_list}>
					<NotificationListItem
						title={formatMessage(notificationsMessages.telegram)}
						subtitle={formatMessage(notificationsMessages.telegram_notifications)}
						icon="ai ai-telegram"
					>
						<Switch
							id="use_telegram"
							name="use_telegram"
							checked={subscriptions.use_telegram}
							onChange={onChange}
						/>
					</NotificationListItem>
				</div>
			</div>

			<div className={styles.settings_card_container}>
				<div className={styles.settings_list}>
					<NotificationListItem
						title={formatMessage(notificationsMessages.language)}
						subtitle={formatMessage(notificationsMessages.language)}
						icon="ai ai-web_outlined"
						link={routes.settings.languageNotifications}
					>
						<i className="ai ai-chevron_right" />
					</NotificationListItem>
				</div>
			</div>
		</div>
	);
};

export default observer(NotificationSettings);
