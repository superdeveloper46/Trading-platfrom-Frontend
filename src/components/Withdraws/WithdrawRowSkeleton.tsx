import React from "react";
import { TableRow, TableData } from "components/UI/Table";
import SkeletonLoader from "components/UI/Skeleton";

const WithdrawRowSkeleton: React.FC = () => (
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
		<TableData width="550px">
			<SkeletonLoader />
		</TableData>
		<TableData width="120px">
			<SkeletonLoader />
		</TableData>
	</TableRow>
);

export default WithdrawRowSkeleton;
