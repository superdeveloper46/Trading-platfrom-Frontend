import React from "react";

import styles from "styles/pages/History/History.module.scss";

interface IProps {
	label: string;
}

const PageHeader: React.FC<IProps> = ({ label }) => (
	<div className={styles.header}>
		<h1>{label}</h1>
	</div>
);

export default PageHeader;
