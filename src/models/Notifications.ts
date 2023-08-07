import { cast, flow, Instance, types as t } from "mobx-state-tree";

import { queryVars } from "constants/query";
import { IGetNotificationsParams, INotificationsResponse } from "types/notifications";
import NotificationsService from "services/NotificationsService";

const Notification = t.model({
	uuid: t.string,
	created_at: t.string,
	category: t.string,
	read_at: t.maybeNull(t.string),
	level: t.number,
	title: t.string,
	text: t.string,
	text_md: t.optional(t.maybeNull(t.string), null),
	image: t.maybeNull(t.string),
	action_url: t.maybeNull(t.string),
});

export type INotification = Instance<typeof Notification>;

export const Notifications = t
	.model({
		results: t.optional(t.array(Notification), []),
		latest: t.optional(t.array(Notification), []),
		count: t.optional(t.number, 0),
		unread_count: t.optional(t.number, 0),
		isLoading: t.optional(t.boolean, false),
		isLoaded: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		loadNotifications: flow(function* (params?: IGetNotificationsParams) {
			try {
				self.isLoading = true;
				const notificationsRes: INotificationsResponse =
					yield NotificationsService.getNotifications(params || {});
				if (Array.isArray(notificationsRes.results)) {
					self.results = cast(notificationsRes.results);
					self.count = notificationsRes.count;
					self.unread_count = notificationsRes.unread_count;
				}
			} catch (err) {
				console.error(err);
			} finally {
				self.isLoaded = true;
				self.isLoading = false;
			}
		}),
		loadLatestNotifications: flow(function* () {
			try {
				self.isLoading = true;
				const latest: INotificationsResponse = yield NotificationsService.getNotifications({
					[queryVars.page]: 1,
					[queryVars.page_size]: 5,
				});
				if (Array.isArray(latest.results)) {
					self.latest = cast(latest.results);
					self.unread_count = latest.unread_count;
				}
			} catch (err) {
				console.error(err);
			} finally {
				self.isLoaded = true;
				self.isLoading = false;
			}
		}),
	}));
