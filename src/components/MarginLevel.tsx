import React from "react";
import styles from "styles/components/MarginLevel.module.scss";
import cn from "classnames";
import RiskLevelUmbrellaImg from "assets/images/common/risk-level-umbrella.svg";
import RiskLevelArrowImg from "assets/images/common/risk-level-arrow.svg";
import { useIntl } from "react-intl";
import styleProps from "utils/styleProps";

interface IProps {
	percentage: number;
	marginLevel: number;
	inline?: boolean;
}

const MarginLevel: React.FC<IProps> = ({ percentage, marginLevel, inline = false }) => {
	const { formatNumber } = useIntl();
	const deg = (percentage * 180) / 100 - 90;

	return (
		<div className={cn(styles.container, inline && styles.inline)}>
			<span>{deg < -45 ? "Low risk" : deg < 45 ? "Medium risk" : "High risk"}</span>
			<div className={styles.indicator}>
				<img
					className={styles.umbrella}
					src={RiskLevelUmbrellaImg}
					width="62"
					height="32"
					alt="risk-level-indicator"
				/>
				<img
					className={styles.arrow}
					style={styleProps({
						transform: ` rotate(${deg}deg)`,
					})}
					src={RiskLevelArrowImg}
					width="6"
					height="15"
					alt="risk-level-arrow"
				/>
			</div>
			<b>
				{!Number.isNaN(marginLevel)
					? formatNumber(marginLevel, {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  })
					: "--"}
			</b>
		</div>
	);
};

export default MarginLevel;
