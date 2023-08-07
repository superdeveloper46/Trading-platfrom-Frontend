import React from "react";

import styles from "styles/pages/WelcomeBonus.module.scss";
import useWindowSize from "hooks/useWindowSize";
import styleProps from "utils/styleProps";
import SkeletonLoader from "components/UI/Skeleton";

const AwardCardsSkeleton: React.FC = () => {
	const { mobile } = useWindowSize();

	return (
		<div className={styles.skeleton_container}>
			<div
				className={styles.award_card_skeleton_container}
				style={styleProps({ width: mobile ? "100%" : "48%" })}
			>
				<SkeletonLoader fullWidth height={mobile ? 65 : 240} />
			</div>
			<div
				className={styles.award_card_skeleton_container}
				style={styleProps({ width: mobile ? "100%" : "48%" })}
			>
				<SkeletonLoader fullWidth height={mobile ? 65 : 240} />
			</div>
			<div className={styles.award_card_skeleton_container} style={styleProps({ width: "100%" })}>
				<SkeletonLoader fullWidth height={mobile ? 65 : 140} />
			</div>
		</div>
	);
};

export default AwardCardsSkeleton;
