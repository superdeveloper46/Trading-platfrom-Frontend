import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/PageCommon.module.scss";
import styleProps from "utils/styleProps";

export const PageHeader: React.FC = ({ children }) => (
	<div className={styles.header_wrapper}>
		<div className={styles.header}>{children}</div>
	</div>
);

export const PageHeaderContent: React.FC<{ masked?: boolean }> = ({ children, masked }) => (
	<div className={cn(styles.header_content, masked && styles.masked)}>
		<div>{children}</div>
	</div>
);

export const PageHeaderNav: React.FC = ({ children }) => (
	<div className={styles.header_nav}>{children}</div>
);

interface IProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	className?: string;
	width?: string;
	maxWidth?: string;
	align?: "center" | "right";
	styleInline?: React.CSSProperties;
}

export const TableHeader: React.FC<IProps> = ({
	children,
	className,
	width,
	maxWidth,
	align,
	styleInline,
	...rest
}) => (
	<div
		style={styleProps({ minWidth: width, maxWidth, ...styleInline })}
		className={cn(className, styles.table_header, align && styles[align])}
		{...rest}
	>
		{children}
	</div>
);
