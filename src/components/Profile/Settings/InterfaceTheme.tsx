import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import settingsMessages from "messages/settings";
import { useMst } from "models/Root";
import MonitorLightLight from "assets/images/settings/monitor-light-light.svg";
import MonitorLightDark from "assets/images/settings/monitor-light-dark.svg";
import MonitorDarkLight from "assets/images/settings/monitor-dark-light.svg";
import MonitorDarkDark from "assets/images/settings/monitor-dark-dark.svg";
import RadioChoice from "components/UI/Radio";
import { ThemeEnum } from "types/theme";
import { observer } from "mobx-react-lite";
import SettingFormWrapper from "./components/SettingFormWrapper";

const InterfaceTheme: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { theme, setTheme },
	} = useMst();

	const onChangeTheme = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
		const { name } = e.currentTarget.dataset as { name: ThemeEnum };
		setTheme(name);
	};

	return (
		<SettingFormWrapper
			breadcrumb={formatMessage(settingsMessages.interface_theme)}
			title={formatMessage(settingsMessages.interface_theme)}
			subTitle={formatMessage(commonMessages.select_site_appearance)}
			content
			footer
		>
			<div className={styles.theme_container}>
				<div className={styles.theme} data-name="light" onClick={onChangeTheme}>
					<img src={theme === "light" ? MonitorLightLight : MonitorLightDark} alt="theme-light" />
					<RadioChoice value={theme} name="theme" choice={ThemeEnum.Light} />
					<span>{formatMessage(commonMessages.theme_light)}</span>
				</div>
				<div className={styles.theme} data-name="dark" onClick={onChangeTheme}>
					<img src={theme === "light" ? MonitorDarkLight : MonitorDarkDark} alt="theme-dark" />
					<RadioChoice value={theme} name="theme" choice={ThemeEnum.Dark} />
					<span>{formatMessage(commonMessages.theme_dark)}</span>
				</div>
			</div>
		</SettingFormWrapper>
	);
};

export default observer(InterfaceTheme);
