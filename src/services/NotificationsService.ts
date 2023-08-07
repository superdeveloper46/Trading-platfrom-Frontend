import ApiClient from "helpers/ApiClient";
import { IGetNotificationsParams, INotificationsResponse } from "types/notifications";
import { INotification } from "../models/Notifications";

const NotificationsService = {
	getNotifications: (params: IGetNotificationsParams): Promise<INotificationsResponse> =>
		ApiClient.get("web/notifications/", params),
	markAllRead: (): Promise<void> => ApiClient.post("web/notifications/mark-all-read"),
	readNotification: async (uuid: string): Promise<INotification | null> => {
		const notification = await ApiClient.post(`web/notifications/${uuid}/read`);
		return notification ?? null;
	},
};

export default NotificationsService;
