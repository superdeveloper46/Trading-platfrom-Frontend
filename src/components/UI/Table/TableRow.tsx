import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Table.module.scss";
import TableData from "./TableData";

interface IProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	className?: string;
	active?: boolean;
	common?: boolean;
	onClick?(e: any): void;
	onExpand?: () => void;
	isExpandActive?: boolean;
}

const TableRow: React.FC<IProps> = ({
	children,
	onExpand,
	active,
	common,
	className,
	isExpandActive,
	onClick,
	...rest
}) => (
	<div
		onClick={onClick}
		className={cn(styles.row, className, {
			[styles.active]: active,
			[styles.common]: common,
			[styles.clickable]: !!onClick,
		})}
		{...rest}
	>
		{children}
		{onExpand && (
			<TableData width="60px" maxWidth="60px" align="right">
				{isExpandActive && (
					<button type="button" className={styles.row_expand_button} onClick={onExpand}>
						<i className="ai ai-arrow_down" />
					</button>
				)}
			</TableData>
		)}
	</div>
);

export default TableRow;
