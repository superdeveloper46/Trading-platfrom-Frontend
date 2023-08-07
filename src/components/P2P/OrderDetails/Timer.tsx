import React, { useLayoutEffect, useState } from "react";

import styles from "styles/pages/P2P/OrderDetails.module.scss";
import { getDateFromDiff, getDisplayTimeValue } from "utils/p2p";
import dayjs from "dayjs";

interface IProps {
	active_till: Date;
	isActive: boolean;
}

const Timer: React.FC<IProps> = ({ active_till, isActive }) => {
	const [dateDiff, setDateDiff] = useState(getDateFromDiff(0));

	useLayoutEffect(() => {
		const interval = setInterval(() => {
			const diff = dayjs(active_till).diff(dayjs(Date.now()), "seconds");

			if (diff > 0 && isActive) {
				setDateDiff(getDateFromDiff(diff));
			} else {
				setDateDiff(getDateFromDiff(0));
				clearInterval(interval);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [active_till, isActive]);

	return (
		<div className={styles.timer}>
			{getDisplayTimeValue(dateDiff.minutes).map((char, i) => (
				<span key={i}>{char}</span>
			))}
			:
			{getDisplayTimeValue(dateDiff.seconds).map((char, i) => (
				<span key={i}>{char}</span>
			))}
		</div>
	);
};

export default Timer;
