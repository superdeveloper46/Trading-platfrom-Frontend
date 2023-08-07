import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Table.module.scss";
import styleProps from "utils/styleProps";

interface IProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	className?: string;
	disabled?: boolean;
	half?: boolean;
	width?: string;
	maxWidth?: string;
	minWidth?: string;
	header?: boolean;
	currency?: boolean;
	align?: "center" | "right";
	dateMode?: boolean;
	column?: boolean;
	icon?: boolean;
	styleInline?: React.CSSProperties;
	crop?: boolean;
}

const TableData: React.FC<IProps> = ({
	children,
	disabled,
	className,
	width,
	maxWidth,
	minWidth,
	header,
	align,
	currency,
	half,
	dateMode,
	column,
	icon,
	styleInline,
	crop,
	...rest
}) => (
	<div
		style={styleProps({ width, maxWidth, minWidth, ...styleInline })}
		className={cn(styles.data, className, align && styles[align], {
			[styles.disabled]: disabled,
			[styles.currency]: currency,
			[styles.date]: dateMode,
			[styles.header]: header,
			[styles.half]: half,
			[styles.column]: column,
			[styles.icon]: icon,
			[styles.crop]: crop,
		})}
		{...rest}
	>
		{children}
	</div>
);

export default TableData;
