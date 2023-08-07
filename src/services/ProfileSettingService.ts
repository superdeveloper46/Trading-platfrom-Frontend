import ApiClient from "helpers/ApiClient";
import {
	INotificationsSettings,
	INotificationsSettingsUpdate,
	IProfileChange,
} from "types/profileSettings";

const ProfileSettingService = {
	changeLocale: (locale: string): Promise<IProfileChange> =>
		ApiClient.patch("web/profile/update", { language: locale }),
	loadNotificationSettings: (): Promise<INotificationsSettings> =>
		ApiClient.get("web/notifications/settings"),
	updateNotificationSettings: (
		data: INotificationsSettingsUpdate,
	): Promise<INotificationsSettings> => ApiClient.patch("web/notifications/settings", data),
};

export default ProfileSettingService;
