import React from "react";
import styles from "styles/pages/Staking.module.scss";
import useWindowSize from "../../../hooks/useWindowSize";
import SkeletonLoader from "../../UI/Skeleton";

const PlanSkeleton: React.FC = () => {
	const { tablet } = useWindowSize();

	return (
		<div className={styles.plan_container}>
			{!tablet ? (
				<>
					<div className={styles.icon}>
						<SkeletonLoader width={65} height={65} />
					</div>
					<div className={styles.right_content}>
						<div className={styles.right_content_section}>
							<div className={styles.about}>
								<div className={styles.label}>
									<SkeletonLoader width={150} />
								</div>
								<div className={styles.description}>
									<SkeletonLoader width={300} count={2} />
								</div>
								<div className={styles.meta}>
									<div className={styles.meta_percentage}>
										<SkeletonLoader width={100} />
									</div>
									<SkeletonLoader width={60} height={20} />
									<div className={styles.meta_min_amount}>
										<span>
											<SkeletonLoader width={90} height={20} />
										</span>
									</div>
								</div>
							</div>
							<div className={styles.actions}>
								<div className={styles.actions_type}>
									<span>
										<SkeletonLoader width={90} />
									</span>
									<SkeletonLoader width={60} height={36} />
								</div>
								<SkeletonLoader height={46} fullWidth />
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className={styles.mobile_info}>
						<div className={styles.icon}>
							<SkeletonLoader width={65} height={65} />
						</div>
						<div className={styles.mobile_info_group}>
							<div className={styles.label}>
								<SkeletonLoader width={100} />
							</div>
						</div>
					</div>
					<div className={styles.mobile_meta}>
						<SkeletonLoader height={26} fullWidth />
					</div>
					<SkeletonLoader height={46} fullWidth />
				</>
			)}
		</div>
	);
};

export default PlanSkeleton;
