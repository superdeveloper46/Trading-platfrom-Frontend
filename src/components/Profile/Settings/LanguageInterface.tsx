import { useNavigate } from "react-router";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import { appLocales, IAppLocale } from "providers/LanguageProvider/i18n";
import RadioChoice from "components/UI/Radio";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import SettingFormWrapper from "./components/SettingFormWrapper";

const LanguageInterface: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { locale, setLocale },
	} = useMst();

	const navigate = useNavigate();
	const [currentLocale, setCurrentLocale] = useState(locale);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setLanguage(value);
	};

	const setLanguage = (language: string) => {
		setCurrentLocale(language);
		setLocale(language);
		navigate(`/${language}${routes.settings.languageInterface}`);
	};

	return (
		<SettingFormWrapper
			breadcrumb={
				<>
					{formatMessage(commonMessages.language_setting)}&nbsp;-&nbsp;
					{formatMessage(commonMessages.language_interface)}
				</>
			}
			title={
				<>
					{formatMessage(commonMessages.language_setting)}&nbsp;-&nbsp;
					{formatMessage(commonMessages.language_interface)}
				</>
			}
			subTitle={formatMessage(commonMessages.language_interface_text)}
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

export default observer(LanguageInterface);
