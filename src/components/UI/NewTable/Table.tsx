import React from "react";
import cn from "classnames";

import styles from "styles/components/UI/NewTable.module.scss";
import { queryVars } from "constants/query";
import TableData from "./TableData";

export enum AlignEnum {
	Right = "right",
	Center = "center",
}

export interface IHeaderColumn {
	label?: string | React.ReactNode;
	width?: string;
	maxWidth?: string;
	minWidth?: string;
	align?: AlignEnum | "right" | "center";
	sort?: string | "asc" | "desc";
	onSortChange?: (name: string) => void;
	name?: string;
	hidden?: boolean;
}

export interface IHeader {
	columns: IHeaderColumn[];
	className?: string;
	primary?: boolean;
	advanced?: boolean;
}

interface IProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	className?: string;
	rowsClassNames?: string;
	header?: IHeader;
	stripped?: boolean;
	spaceBetween?: boolean;
}

const HeaderColumn: React.FC<{ c: IHeaderColumn }> = ({ c }) => {
	const handleClick = () => {
		if (c.onSortChange && c.name) {
			c.onSortChange(c.name);
		}
	};

	return (
		<TableData
			width={c.width}
			maxWidth={c.maxWidth}
			minWidth={c.minWidth}
			data-name={c.name}
			className={cn(styles.header, { [styles.filter]: !!c.sort })}
			align={c.align}
			onClick={handleClick}
		>
			{c.label}
			{c.sort ? (
				<div className={styles.header_sort_group}>
					<i className={cn("ai ai-arrow_up", c.sort === queryVars.asc && styles.active)} />
					<i className={cn("ai ai-arrow_down", c.sort === queryVars.desc && styles.active)} />
				</div>
			) : null}
		</TableData>
	);
};

const Table: React.FC<IProps> = ({
	children,
	className,
	rowsClassNames,
	header,
	stripped,
	spaceBetween,
	...rest
}) => (
	<div
		className={cn(styles.container, className, { [styles.spaceBetween]: spaceBetween })}
		{...rest}
	>
		{header?.columns ? (
			<div
				className={cn(styles.head, header.className, {
					[styles.advanced]: header.advanced,
					[styles.primary]: header.primary,
				})}
			>
				{header.columns.map((c, idx) => !c.hidden && <HeaderColumn c={c} key={idx} />)}
				{header.advanced && <TableData width="60px" maxWidth="60px" />}
			</div>
		) : null}
		<div className={cn(rowsClassNames, styles.rows, stripped && styles.stripped)}>{children}</div>
	</div>
);

export default Table;
