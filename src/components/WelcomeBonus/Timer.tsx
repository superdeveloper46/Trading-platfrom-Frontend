import React, { useLayoutEffect, useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import messages from "messages/welcome_bonus";
import { useMst } from "models/Root";

import styles from "styles/pages/WelcomeBonus.module.scss";

const getDateFromDiff = (diff: number) => {
	const days = Math.floor(diff / (60 * 60 * 24));
	const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
	const minutes = Math.floor((diff % (60 * 60)) / 60);
	const seconds = Math.floor(diff % 60);

	return {
		seconds,
		minutes,
		hours,
		days,
	};
};

const Timer: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
		promo: { status },
	} = useMst();

	const currentDate = new Date();

	const endDate = isAuthenticated ? dayjs(status?.end_at) : dayjs(currentDate).endOf("month");
	const [dateDiff, setDateDiff] = useState(
		getDateFromDiff(endDate.diff(dayjs(Date.now()), "seconds")),
	);

	useLayoutEffect(() => {
		const interval = setInterval(() => {
			const diff = endDate.diff(dayjs(Date.now()), "seconds");

			if (diff > 0) {
				setDateDiff(getDateFromDiff(diff));
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const timer_cells = [
		{
			value: dateDiff.days,
			label: formatMessage(messages.days),
		},
		{
			value: dateDiff.hours,
			label: formatMessage(messages.hours),
		},
		{
			value: dateDiff.minutes,
			label: formatMessage(messages.minutes),
		},
		{
			value: dateDiff.seconds,
			label: formatMessage(messages.seconds),
		},
	];

	return (
		<div className={styles.timer_container}>
			{timer_cells.map(({ value, label }) => (
				<div className={styles.timer_cell} key={label}>
					<div className={styles.timer_cell_value}>{value}</div>
					<div className={cn(styles.timer_cell_value, styles.isDescription)}>{label}</div>
				</div>
			))}
		</div>
	);
};

export default observer(Timer);
