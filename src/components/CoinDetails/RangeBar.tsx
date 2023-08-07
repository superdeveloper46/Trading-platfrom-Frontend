import React from "react";
import styles from "styles/components/UI/RangeBar.module.scss";
import arrow from "assets/images/coin_info/arrow.svg";
import { useIntl } from "react-intl";
import messages from "messages/coin_info";

interface Props {
	min: number;
	max: number;
	percent: number;
	formatter?(value: number): string;
}

const RangeBar: React.FC<Props> = ({ min, max, percent, formatter }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.container}>
			<span>{formatMessage(messages.min)}</span>
			<span>$ {formatter?.(min) ?? min}</span>
			<div className={styles.scale_back}>
				<img
					src={arrow}
					alt=""
					className={styles.arrow}
					style={{ left: `${(percent * 66) / 100 - 8}px` }}
				/>
				<div className={styles.scale} style={{ width: `${(percent * 66) / 100}px` }} />
			</div>
			<span>{formatMessage(messages.max)}</span>
			<span>$ {formatter?.(max) ?? max}</span>
		</div>
	);
};

export default RangeBar;
