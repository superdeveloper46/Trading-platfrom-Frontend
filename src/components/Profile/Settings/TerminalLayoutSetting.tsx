import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import settingsMessages from "messages/settings";
import RadioChoice from "components/UI/Radio";
import useLocalStorage from "hooks/useLocalStorage";
import { TerminalLayoutEnum } from "types/exchange";
import { TERMINAL_LAYOUT_CACHE_KEY } from "utils/cacheKeys";
import SettingFormWrapper from "./components/SettingFormWrapper";
import {
	BasicTerminalVariantIcon,
	FullscreenTerminalIcon,
	StandardTerminalVariantIcon,
} from "./components/SettingsCommon";

// TODO: Convert Fullscreen to Advanced
const TerminalLayoutSetting: React.FC = () => {
	const { formatMessage } = useIntl();
	const [cachedTerminalLayout, setCachedTerminalLayout] = useLocalStorage(
		TERMINAL_LAYOUT_CACHE_KEY,
		TerminalLayoutEnum.BASIC,
	);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setTerminal(value);
	};

	const setTerminal = (type: string) => setCachedTerminalLayout(type);

	return (
		<SettingFormWrapper
			breadcrumb={formatMessage(settingsMessages.terminal_layout)}
			title={formatMessage(settingsMessages.terminal_layout)}
			subTitle={formatMessage(commonMessages.select_terminal_type)}
			footer
		>
			<div className={styles.settings_list}>
				<div
					className={styles.setting_list_item}
					onClick={() => setTerminal(TerminalLayoutEnum.BASIC)}
				>
					<div className={styles.setting_list_item_title}>
						<BasicTerminalVariantIcon />
						{formatMessage(commonMessages.terminal_basic)}
					</div>
					<RadioChoice
						onChange={onChange}
						value={cachedTerminalLayout}
						name="terminal-layout"
						choice={TerminalLayoutEnum.BASIC}
					/>
				</div>
				<div
					className={styles.setting_list_item}
					onClick={() => setTerminal(TerminalLayoutEnum.STANDARD)}
				>
					<div className={styles.setting_list_item_title}>
						<StandardTerminalVariantIcon />
						{formatMessage(commonMessages.terminal_standard)}
					</div>
					<RadioChoice
						onChange={onChange}
						value={cachedTerminalLayout}
						name="terminal-layout"
						choice={TerminalLayoutEnum.STANDARD}
					/>
				</div>
				<div
					className={styles.setting_list_item}
					onClick={() => setTerminal(TerminalLayoutEnum.FULLSCREEN)}
				>
					<div className={styles.setting_list_item_title}>
						<FullscreenTerminalIcon />
						{formatMessage(commonMessages.advanced_exchange)}
					</div>
					<RadioChoice
						onChange={onChange}
						value={cachedTerminalLayout}
						name="terminal-layout"
						choice={TerminalLayoutEnum.FULLSCREEN}
					/>
				</div>
			</div>
		</SettingFormWrapper>
	);
};

export default TerminalLayoutSetting;
