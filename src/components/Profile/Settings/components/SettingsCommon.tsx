import React from "react";
import styles from "styles/pages/ProfileSettings.module.scss";
import InternalLink from "components/InternalLink";
import classnames from "classnames";

export const BasicTerminalVariantIcon: React.FC = () => (
	<div className={styles.terminal_variant_list_item_icon}>
		<span />
		<span />
		<span />
		<span />
		<span />
		<span />
	</div>
);

export const StandardTerminalVariantIcon: React.FC = () => (
	<div className={classnames(styles.terminal_variant_list_item_icon, styles.standard)}>
		<span />
		<span />
		<span />
		<span />
		<span />
	</div>
);

export const FullscreenTerminalIcon: React.FC = () => (
	<div className={classnames(styles.terminal_variant_list_item_icon, styles.fullscreen)}>
		<span />
		<span />
		<span />
		<span />
	</div>
);
interface ISettingsListItemProps {
	icon?: string;
	node?: React.ReactNode;
	title: string;
	value?: string;
	link: string;
}

export const SettingsListItem: React.FC<ISettingsListItemProps> = ({
	icon,
	node,
	title,
	value,
	link,
}) => (
	<InternalLink className={styles.settings_list_item} to={link}>
		<div className={styles.settings_list_item_title}>
			{icon && <i className={icon} />}
			{node && node}
			{title}
		</div>
		<div className={styles.settings_list_item_value}>{value}</div>
		<i className="ai ai-chevron_right" />
	</InternalLink>
);
