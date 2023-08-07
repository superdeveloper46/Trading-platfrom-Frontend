export interface IUpdateMarketingSubscribeBody {
	send_marketing_email: boolean;
}

export interface INotificationsSettings {
	use_push: boolean;
	use_telegram: boolean;
	notify_finance: boolean;
	notify_listing: boolean;
	notify_contests: boolean;
	notify_promotions: boolean;
	notify_digest: boolean;
	language?: null | string;
}

export interface INotificationsSettingsUpdate {
	language?: null | string;
	notify_contests?: boolean;
	notify_digest?: boolean;
	notify_finance?: boolean;
	notify_listing?: boolean;
	notify_maintenance?: boolean;
	notify_promotions?: boolean;
	notify_security?: boolean;
	use_push?: boolean;
	use_telegram?: boolean;
}

export interface IProfileChange {
	datetime_format: string;
	language: string;
	timezone: string;
}
