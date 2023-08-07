import React from "react";
import { TableData, TableRow } from "./index";
import { IHeaderColumn } from "./Table";
import SkeletonLoader from "../Skeleton";

interface IProps {
	cells: IHeaderColumn[];
	className?: string;
}

const RowSkeleton: React.FC<IProps> = ({ cells, className }) => (
	<TableRow className={className}>
		{cells.map(({ width, maxWidth }, index) => (
			<TableData key={index} width={width} maxWidth={maxWidth}>
				<SkeletonLoader fullWidth fullHeight />
			</TableData>
		))}
	</TableRow>
);

export default RowSkeleton;
