import React from "react";
import styles from "styles/pages/ProfileSettings.module.scss";

interface IProps {
	title: string;
	subtitle: string;
	img: string;
}

const SettingsPageHeader: React.FC<IProps> = ({ title, subtitle, img }) => (
	<div className={styles.settings_card}>
		<div className={styles.settings_card_section}>
			<div className={styles.settings_card_title}>{title}</div>
			<div className={styles.settings_card_subtitle}>{subtitle}</div>
		</div>
		<img className="aa-fade-in" src={img} alt="settings" width="220" height="94" />
	</div>
);

export default SettingsPageHeader;
