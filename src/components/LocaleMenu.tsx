import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/components/LocaleSelector.module.scss";
import cs from "classnames";
import commonMessages from "messages/common";
import { queryVars } from "constants/query";
import { appLocales, availableLocales } from "providers/LanguageProvider/i18n";
import { ReactComponent as SettingsIcon } from "assets/icons/settings-02.svg";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import usePathname from "hooks/usePathname";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageSettingsModal from "./LanguageSettingsModal";

const LocaleMenu: React.FC = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	const pathname = usePathname();
	const { formatMessage } = useIntl();
	const { global } = useMst();

	const [isLocaleModalOpened, toggleLocaleModal] = useState(false);

	const handleChangeLocale = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
		const locale = e.currentTarget.dataset.name;
		if (locale) {
			global.setLocale(locale);
			const nextPath = [...availableLocales, ""].includes(pathname) ? "" : pathname;
			navigate({
				[queryVars.pathname]: `/${locale}/${nextPath}`,
				[queryVars.search]: search,
			});
		}
	};

	return (
		<div className={styles.locale_menu_content}>
			<div className={styles.locale_list}>
				{appLocales.map((lang: { name: string; value: string }) => (
					<div
						className={cs(styles.locale_list_item, {
							[styles.active]: global.locale === lang.value,
						})}
						key={lang.name}
						data-name={lang.value}
						onClick={handleChangeLocale}
					>
						{lang.name}
					</div>
				))}
			</div>
			<div className={styles.locale_settings} onClick={() => toggleLocaleModal(true)}>
				<span>{formatMessage(commonMessages.language_setting)}</span>
				<SettingsIcon />
			</div>
			<LanguageSettingsModal
				isOpen={isLocaleModalOpened}
				onClose={() => toggleLocaleModal(false)}
			/>
		</div>
	);
};

export default observer(LocaleMenu);
