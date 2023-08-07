import React from "react";
import styles from "styles/components/TransactionsMonitoring/GlStatusBlock.module.scss";
import cn from "classnames";

interface Props {
	label: string;
	className?: string;
}

const GlStatusBlock: React.FC<Props> = ({ label, className }) => (
	<div className={cn(styles.container, className)}>
		<i className={cn("ai ai-warning", styles.icon)} />
		<div className={styles.label}>{label}</div>
	</div>
);

export default GlStatusBlock;
