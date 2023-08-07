import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import commonMessages from "messages/common";
import securityMessages from "messages/security";
import { ReactComponent as MonitorLightLight } from "assets/images/settings/monitor-light-light.svg";
import { ReactComponent as MonitorLightDark } from "assets/images/settings/monitor-light-dark.svg";
import { ReactComponent as MonitorDarkLight } from "assets/images/settings/monitor-dark-light.svg";
import { ReactComponent as MonitorDarkDark } from "assets/images/settings/monitor-dark-dark.svg";
import useTerminalLayout from "hooks/useTerminalLayout";
import styles from "styles/components/Header.module.scss";
import { useMst } from "models/Root";
import useLocalStorage from "hooks/useLocalStorage";
import { TerminalLayoutEnum } from "types/exchange";
import { TERMINAL_LAYOUTS } from "constants/exchange";
import { TERMINAL_LAYOUT_CACHE_KEY } from "utils/cacheKeys";
import { ThemeEnum } from "types/theme";
import InternalLink from "components/InternalLink";
import RadioChoice from "components/UI/Radio";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";

interface Props {
	isExchange?: boolean;
}

const SettingsMenu: React.FC<Props> = ({ isExchange }) => {
	const {
		global,
		account: { profileStatus },
	} = useMst();
	const { formatMessage } = useIntl();
	const navigate = useNavigate();
	const terminalLayout = useTerminalLayout();
	const [cachedTerminalLayout, setCachedTerminalLayout] = useLocalStorage(
		TERMINAL_LAYOUT_CACHE_KEY,
		TerminalLayoutEnum.BASIC,
	);
	const [currentTerminalLayout, setCurrentTerminalLayout] = useState<TerminalLayoutEnum>(
		TERMINAL_LAYOUTS.includes(cachedTerminalLayout as TerminalLayoutEnum)
			? cachedTerminalLayout
			: terminalLayout,
	);

	const handleVariantClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
		const { name } = e.currentTarget.dataset as { name: TerminalLayoutEnum };
		if (name && TERMINAL_LAYOUTS.includes(name)) {
			setCachedTerminalLayout(name);
			setCurrentTerminalLayout(name);
			if (isExchange) {
				navigate({ [queryVars.search]: `?${queryVars.layout}=${name}` });
			}
		}
	};

	const handleChangeTheme = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
		const { name } = e.currentTarget.dataset;
		global.setTheme(name as string);
	};

	return (
		<div className={styles.settings_menu_content}>
			{profileStatus && !profileStatus.two_factor_enabled ? (
				<InternalLink className={styles.settings_menu_two_fa} to={routes.security.authenticator}>
					<span>{formatMessage(securityMessages.twoFA_enable_btn)}</span>
					<i className="ai ai-chevron_right" />
				</InternalLink>
			) : null}
			<div className={styles.settings_menu_theme_container}>
				<span>{formatMessage(commonMessages.select_site_appearance)}</span>
				<div className={styles.settings_menu_theme_setting}>
					<div
						className={styles.settings_menu_theme_setting_item}
						data-name={ThemeEnum.Light}
						onClick={handleChangeTheme}
					>
						{global.theme === ThemeEnum.Light ? <MonitorLightLight /> : <MonitorLightDark />}
						<span>{formatMessage(commonMessages.theme_light)}</span>
						<RadioChoice value={global.theme} name="theme" choice={ThemeEnum.Light} />
					</div>
					<div
						className={styles.settings_menu_theme_setting_item}
						data-name={ThemeEnum.Dark}
						onClick={handleChangeTheme}
					>
						{global.theme === ThemeEnum.Light ? <MonitorDarkLight /> : <MonitorDarkDark />}
						<span>{formatMessage(commonMessages.theme_dark)}</span>
						<RadioChoice value={global.theme} name="theme" choice={ThemeEnum.Dark} />
					</div>
				</div>
			</div>
			<div className={styles.settings_menu_terminal_variant}>
				<span>{formatMessage(commonMessages.select_terminal_type)}</span>
				<div className={styles.settings_menu_terminal_variant_list}>
					<div
						className={cn(
							styles.settings_menu_terminal_variant_list_item,
							currentTerminalLayout === TerminalLayoutEnum.BASIC && styles.active,
						)}
						data-name="basic"
						onClick={handleVariantClick}
					>
						<div>
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
						</div>
						<span>{formatMessage(commonMessages.terminal_basic)}</span>
					</div>
					<div
						className={cn(
							styles.settings_menu_terminal_variant_list_item,
							currentTerminalLayout === TerminalLayoutEnum.STANDARD && styles.active,
						)}
						data-name="standard"
						onClick={handleVariantClick}
					>
						<div className={styles.standard}>
							<span />
							<span />
							<span />
							<span />
							<span />
						</div>
						<span>{formatMessage(commonMessages.terminal_standard)}</span>
					</div>
					<div
						className={cn(
							styles.settings_menu_terminal_variant_list_item,
							currentTerminalLayout === TerminalLayoutEnum.ADVANCED && styles.active,
						)}
						data-name={TerminalLayoutEnum.ADVANCED}
						onClick={handleVariantClick}
					>
						<div className={styles.advanced}>
							<span />
							<span />
							<span />
							<span />
						</div>
						<span>{formatMessage(commonMessages.advanced_exchange)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(SettingsMenu);
