import React from "react";
import SkeletonLoader from "components/UI/Skeleton";
import styles from "styles/components/Profile/Notifications/NotificationDetails.module.scss";

const NotificationDetailsSkeleton: React.FC = () => (
	<div className={styles.container}>
		<div className={styles.meta}>
			<SkeletonLoader width={30} height={22} />
			<span>
				<SkeletonLoader width={90} height={22} />
			</span>
		</div>
		<h2 className={styles.title}>
			<SkeletonLoader fullWidth height={22} />
		</h2>
		<span className={styles.body}>
			<SkeletonLoader fullWidth height={42} count={3} />
		</span>
	</div>
);

export default NotificationDetailsSkeleton;
