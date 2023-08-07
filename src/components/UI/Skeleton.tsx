import React from "react";
import Skeleton from "react-loading-skeleton";
import cn from "classnames";
import styles from "styles/components/UI/Skeleton.module.scss";

interface IProps {
	count?: number;
	height?: number;
	width?: number;
	fullWidth?: boolean;
	fullHeight?: boolean;
}

const SkeletonLoader: React.FC<IProps> = ({
	count = 1,
	height = null,
	width,
	fullWidth,
	fullHeight,
}) => (
	<div
		className={cn(styles.container, {
			[styles.full_width]: fullWidth,
			[styles.full_height]: fullHeight,
		})}
	>
		<Skeleton
			duration={1}
			count={count}
			height={height || "auto"}
			width={fullWidth ? "100%" : width}
		/>
	</div>
);

export default SkeletonLoader;
