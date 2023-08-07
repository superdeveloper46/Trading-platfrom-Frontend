import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const Clock: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [time, setTime] = useState(0);

	const tick = () => {
		setTime((prev) => prev + 1000);
	};

	useEffect(() => {
		setIsMounted(true);
		setTime(Date.now());
		const intervalID = setInterval(() => tick(), 1000);

		return () => {
			clearInterval(intervalID);
		};
	}, []);

	return <span>{isMounted && dayjs(time).utc().format("YYYY-MM-DD HH:mm:ss")}</span>;
};

export default Clock;
