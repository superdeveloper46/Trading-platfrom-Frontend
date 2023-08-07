import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Table.module.scss";

interface IProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	className?: string;
	active?: boolean;
	disabled?: boolean;
}

const TableRowAdvancedContainer: React.FC<IProps> = ({
	children,
	active,
	disabled,
	className,
	...rest
}) => (
	<div
		className={cn(styles.row_advanced_container, className, {
			[styles.active]: active,
			[styles.disabled]: disabled,
		})}
		{...rest}
	>
		{children}
	</div>
);

export default TableRowAdvancedContainer;
