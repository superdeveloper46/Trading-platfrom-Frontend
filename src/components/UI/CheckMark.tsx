import React from "react";
import styles from "styles/components/UI/CheckMark.module.scss";

const CheckMark: React.FC = () => (
	<svg
		className={styles.checkmark}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 52 52"
	>
		<circle className={styles.checkmark_circle} cx="26" cy="26" r="25" />
		<path className={styles.checkmark_check} d="M14.1 27.2l7.1 7.1 16.7-16.8" />
	</svg>
);

export default CheckMark;
