import React from "react";
import styles from "styles/pages/Stories.module.scss";
import SkeletonLoader from "components/UI/Skeleton";

const StoriesListItemSkeleton: React.FC = () => (
	<div className={styles.story}>
		<SkeletonLoader height={178} fullWidth />
		<header className={styles.story_header}>
			<div className={styles.story_meta}>
				<span className={styles.story_date}>
					<SkeletonLoader width={60} />
				</span>
				<span className={styles.story_count}>
					<SkeletonLoader width={20} />
					<SkeletonLoader width={60} />
				</span>
			</div>
			<h2>
				<SkeletonLoader fullWidth />
			</h2>
			<section>
				<SkeletonLoader fullWidth />
			</section>
		</header>
	</div>
);

export default StoriesListItemSkeleton;
