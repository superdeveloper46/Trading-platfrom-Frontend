import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import settingsMessages from "messages/settings";
import { useMst } from "models/Root";
import { ThemeEnum } from "types/theme";
import Icons from "assets/images/settings/header-icons.svg";
import { TerminalLayoutEnum } from "types/exchange";
import { TERMINAL_LAYOUT_CACHE_KEY } from "utils/cacheKeys";
import { appLocales, IAppLocale } from "providers/LanguageProvider/i18n";
import { contentLocaleJoin } from "utils/constants";
import useLocalStorage from "hooks/useLocalStorage";
import { routes } from "constants/routing";
import SettingsPageHeader from "./SettingsPageHeader";
import { SettingsListItem, StandardTerminalVariantIcon } from "./components/SettingsCommon";

const SettingsGeneral: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { theme, locale, contentLocale },
		render,
	} = useMst();

	const [cachedTerminalLayout] = useLocalStorage(
		TERMINAL_LAYOUT_CACHE_KEY,
		TerminalLayoutEnum.BASIC,
	);
	const isDark = theme === ThemeEnum.Dark;

	const contentLocaleNames = appLocales.length
		? appLocales
				.filter((l: IAppLocale) => contentLocale.split(contentLocaleJoin).includes(l.value))
				.map((l: IAppLocale) => l.name)
				.join(", ") ?? "--"
		: "--";

	const interfaceLocale = appLocales.find((l: IAppLocale) => l.value === locale) ?? null;

	return (
		<div className={styles.settings_page_container}>
			<SettingsPageHeader
				title={formatMessage(commonMessages.settings)}
				subtitle={formatMessage(
					settingsMessages.customize_interface_according_to_your_trading_style,
				)}
				img={Icons}
			/>
			<div className={styles.settings_card_container}>
				<div className={styles.settings_header}>
					<div className={styles.settings_card_title}>
						{formatMessage(commonMessages.language_interface)}
					</div>
				</div>
				<div className={styles.settings_list}>
					<SettingsListItem
						icon="ai ai-web_outlined"
						title={formatMessage(commonMessages.language_setting)}
						value={interfaceLocale?.name}
						link={routes.settings.languageInterface}
					/>
					{render.stories && (
						<SettingsListItem
							icon="ai ai-file_text"
							title={formatMessage(commonMessages.language_content)}
							value={contentLocaleNames}
							link={routes.settings.languageContent}
						/>
					)}
					<SettingsListItem
						icon="ai ai-sun"
						title={formatMessage(settingsMessages.interface_theme)}
						value={
							isDark
								? formatMessage(commonMessages.theme_dark)
								: formatMessage(commonMessages.theme_light)
						}
						link={routes.settings.interfaceTheme}
					/>
					<SettingsListItem
						node={<StandardTerminalVariantIcon />}
						title={formatMessage(settingsMessages.terminal_layout)}
						value={formatMessage(
							cachedTerminalLayout === TerminalLayoutEnum.STANDARD
								? commonMessages.terminal_standard
								: cachedTerminalLayout === TerminalLayoutEnum.ADVANCED
								? commonMessages.advanced_exchange
								: commonMessages.terminal_basic,
						)}
						link={routes.settings.terminalLayout}
					/>
				</div>
			</div>
			<div className={styles.settings_card_container}>
				<div className={styles.settings_list}>
					<SettingsListItem
						icon="ai ai-bell-02"
						title={formatMessage(commonMessages.notifications)}
						value=""
						link={routes.settings.notifications}
					/>
				</div>
			</div>
		</div>
	);
};

export default observer(SettingsGeneral);
