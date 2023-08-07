import React from "react";
import styles from "styles/components/UI/MarginLeverageSign.module.scss";

interface IProps {
	leverage: number;
}

const MarginLeverageSign: React.FC<IProps> = ({ leverage }) => (
	<div className={styles.container}>{leverage}x</div>
);

export default MarginLeverageSign;
