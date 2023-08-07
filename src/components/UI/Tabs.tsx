import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Tabs.module.scss";

interface IProps {
	className?: string;
	children?: React.ReactNode;
	chip?: boolean;
}

const Tabs: React.FC<IProps> = ({ className, chip, children }) => (
	<div className={cn(styles.tabs, className, chip && styles.chip)}>{children}</div>
);

export default Tabs;
