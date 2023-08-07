import React from "react";
import { TableData, TableRow } from "../UI/Table";
import SkeletonLoader from "../UI/Skeleton";

const DepositRowSkeleton: React.FC = () => (
	<TableRow>
		<TableData width="85px">
			<SkeletonLoader />
		</TableData>
		<TableData width="80px">
			<SkeletonLoader />
		</TableData>
		<TableData width="100px">
			<SkeletonLoader />
		</TableData>
		<TableData width="100px">
			<SkeletonLoader />
		</TableData>
		<TableData width="325px">
			<SkeletonLoader />
		</TableData>
		<TableData width="120px">
			<SkeletonLoader />
		</TableData>
	</TableRow>
);

export default DepositRowSkeleton;
