import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import notificationsMessages from "messages/notifications";
import { appLocales, IAppLocale } from "providers/LanguageProvider/i18n";
import RadioChoice from "components/UI/Radio";
import { useMst } from "models/Root";
import ProfileSettingService from "services/ProfileSettingService";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import InternalLink from "components/InternalLink";
import SettingFormWrapper from "./components/SettingFormWrapper";

const LanguageNotification: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { locale },
	} = useMst();

	const [currentLocale, setCurrentLocale] = useState(locale);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setLanguage(value);
	};

	const setLanguage = (language: string) => setCurrentLocale(language);

	useEffect(() => {
		loadLanguage();
	}, []);

	useEffect(() => {
		updateLanguage();
	}, [currentLocale]);

	const loadLanguage = async () => {
		try {
			const data = await ProfileSettingService.loadNotificationSettings();
			if (!data || !data.language) return;
			setCurrentLocale(data.language);
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

	const updateLanguage = async () => {
		try {
			await ProfileSettingService.updateNotificationSettings({ language: currentLocale });
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

	return (
		<SettingFormWrapper
			breadcrumb={formatMessage(commonMessages.language_setting)}
			title={formatMessage(notificationsMessages.language)}
			subTitle={formatMessage(notificationsMessages.choose_notification_language)}
		>
			<div className={styles.settings_list}>
				{appLocales.map((l: IAppLocale) => (
					<div
						key={l.name}
						className={styles.setting_list_item}
						onClick={() => setLanguage(l.value)}
					>
						<div className={styles.setting_list_item_title}>{l.name}</div>
						<RadioChoice choice={l.value} name="locale" value={currentLocale} onChange={onChange} />
					</div>
				))}
			</div>
		</SettingFormWrapper>
	);
};

export default observer(LanguageNotification);
