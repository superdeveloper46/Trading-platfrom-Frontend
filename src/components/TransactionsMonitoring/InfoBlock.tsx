import React from "react";
import styles from "styles/components/TransactionsMonitoring/InfoBlock.module.scss";
import Skeleton from "react-loading-skeleton";

interface Props {
	loading?: boolean;
	label?: string;
	value?: string | number;
	className?: string;
}

const InfoBlock: React.FC<Props> = (props) => {
	const { loading, label = "", value = "", className } = props;

	return (
		<div className={className}>
			<div className={styles.key}>{label}</div>
			{loading ? (
				<Skeleton borderRadius={2} height={20} enableAnimation />
			) : (
				<span className={styles.value}>{value || "--"}</span>
			)}
		</div>
	);
};

export default InfoBlock;
