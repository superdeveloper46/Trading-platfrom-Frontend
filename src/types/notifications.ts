import { INotification } from "models/Notifications";
import { IPaginationParams } from "./general";

export interface IGetNotificationsParams extends IPaginationParams {
	category?: string;
}

export interface INotificationsResponse {
	count: number;
	results: INotification[];
	unread_count: number;
}
