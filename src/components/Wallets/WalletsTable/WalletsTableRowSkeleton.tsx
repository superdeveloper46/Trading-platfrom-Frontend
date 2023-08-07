import SkeletonLoader from "components/UI/Skeleton";
import { TableData, TableRow } from "components/UI/Table";
import React from "react";
import styles from "styles/pages/Wallets.module.scss";
import { AccountTypeEnum } from "types/account";

interface Props {
	type?: AccountTypeEnum;
}

const WalletsTableRowSkeleton: React.FC<Props> = ({ type }) => (
	<TableRow common>
		{type === AccountTypeEnum.ISOLATED && (
			<TableData align="center" width="100px">
				<SkeletonLoader fullHeight fullWidth />
			</TableData>
		)}
		<TableData className={styles.table_data_currency} width="100px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData align="center" width="120px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData className={styles.table_data_reserve} align="center" width="120px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData align="center" width="120px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		{type === AccountTypeEnum.CROSS && (
			<>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
			</>
		)}
		{type === AccountTypeEnum.ISOLATED && (
			<>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
				<TableData align="center" width="120px">
					<SkeletonLoader fullHeight fullWidth />
				</TableData>
			</>
		)}
		{type === AccountTypeEnum.SPOT && (
			<TableData align="center" width="140px">
				<SkeletonLoader fullHeight fullWidth />
			</TableData>
		)}
		<TableData align="center" />
		<TableData align="center" width="100px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData align="center" width="120px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData align="center" width="100px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
		<TableData align="center" width="100px">
			<SkeletonLoader fullHeight fullWidth />
		</TableData>
	</TableRow>
);

export default WalletsTableRowSkeleton;
