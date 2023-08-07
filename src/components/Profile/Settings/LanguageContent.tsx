import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import { appLocales, IAppLocale } from "providers/LanguageProvider/i18n";
import { useMst } from "models/Root";
import { contentLocaleJoin } from "utils/constants";
import CheckBox from "components/UI/CheckBox";
import { routes } from "constants/routing";
import SettingFormWrapper from "./components/SettingFormWrapper";

const LanguageContent: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { contentLocale, setContentLocale },
	} = useMst();

	const [isAll, setAll] = useState<boolean>(false);
	const [locales, setLocales] = useState<string[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSuccessfull, setSuccessfull] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		setLocales(contentLocale ? contentLocale.split("+") : []);
	}, []);

	useEffect(() => {
		setAll(locales.length === appLocales.length);
	}, [locales]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name } = e.target;
		setLanguage(name);
	};

	const setLanguage = (language: string) =>
		setLocales((list) => {
			if (locales.indexOf(language) > -1) {
				list = locales.filter((i) => i !== language);
			} else {
				list.push(language);
			}
			return [...list];
		});

	const onAllChange = (all: boolean): void => {
		setAll(all);
		setLocales(all ? [...appLocales.map((l) => l.value)] : []);
	};

	const onSubmit = () => {
		setLoading(true);
		setContentLocale(locales.join(contentLocaleJoin));
		setLoading(false);
		setSuccessfull(true);
		navigate(routes.settings.root);
	};

	return (
		<SettingFormWrapper
			breadcrumb={
				<>
					{formatMessage(commonMessages.language_setting)}&nbsp;-&nbsp;
					{formatMessage(commonMessages.language_content)}
				</>
			}
			title={
				<>
					{formatMessage(commonMessages.language_setting)}&nbsp;-&nbsp;
					{formatMessage(commonMessages.language_content)}
				</>
			}
			subTitle={formatMessage(commonMessages.language_content_text)}
			onSubmit={onSubmit}
			isLoading={isLoading}
			isSuccessful={isSuccessfull}
		>
			<div className={styles.settings_list}>
				<div className={styles.setting_list_item} onClick={() => onAllChange(!isAll)}>
					<div className={styles.setting_list_item_title}>All</div>
					<CheckBox name="*" checked={isAll} onChange={() => onAllChange(!isAll)} />
				</div>
				{appLocales.map((l: IAppLocale) => (
					<div
						key={l.name}
						className={styles.setting_list_item}
						onClick={() => setLanguage(l.value)}
					>
						<div className={styles.setting_list_item_title}>{l.name}</div>
						<CheckBox name={l.value} checked={locales.indexOf(l.value) > -1} onChange={onChange} />
					</div>
				))}
			</div>
		</SettingFormWrapper>
	);
};

export default LanguageContent;
