import React, { useState } from "react";
import styles from "styles/components/TransactionsMonitoring/GlTag.module.scss";
import cn from "classnames";
import { findColorByTypeScore } from "utils/reportUtils";

const hex2rgba = (hex: string, alpha = 1) => {
	const [r, g, b] = (hex.match(/\w\w/g) || ["0", "0", "0"]).map((x) => parseInt(x, 16));
	return `rgba(${r},${g},${b},${alpha})`;
};

interface Props {
	tag: string;
	score?: number;
	className?: string;
}

const GlTag: React.FC<Props> = (props) => {
	const { tag, score, className } = props;

	return (
		<div
			className={cn(styles.tag, className)}
			style={{
				borderColor: findColorByTypeScore(score),
				backgroundColor: hex2rgba(findColorByTypeScore(score), 0.25),
			}}
		>
			{!!score && (
				<div className={styles.tag_score} style={{ backgroundColor: findColorByTypeScore(score) }}>
					{score}
				</div>
			)}
			<div className={cn({ [styles.tag_presence]: !score })}>{tag}</div>
		</div>
	);
};

export default GlTag;
