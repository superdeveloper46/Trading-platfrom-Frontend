import React from "react";
import styles from "styles/components/UI/ProgressBar.module.scss";

interface IProps {
	color:
		| "primary"
		| "secondary"
		| "secondary"
		| "disabled"
		| "coral"
		| "gold"
		| "gold"
		| "demo"
		| "red"
		| "orange"
		| "purple"
		| "blue"
		| "green"
		| "yellow"
		| "green"
		| "promo";
	progress: number;
}

const ProgressBar: React.FC<IProps> = ({ color, progress }) => (
	<div className={styles.container}>
		<div style={{ width: `${progress}%`, backgroundColor: `var(--color-${color})` }} />
	</div>
);

export default ProgressBar;
