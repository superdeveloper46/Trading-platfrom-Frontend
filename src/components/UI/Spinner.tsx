import React from "react";
import styles from "styles/components/UI/Spinner.module.scss";
import styleProps from "utils/styleProps";

interface IProps {
	size?: number;
}

const Spinner: React.FC<IProps> = ({ size = 24 }) => (
	<div className={styles.container} style={styleProps({ "--ui-spinner-size": `${size}px` })}>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45" strokeDasharray={Math.PI * 90} />
		</svg>
	</div>
);

export default Spinner;
