import { useEffect, useRef } from "react";

const useTimeout = (): typeof timeout => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(
		() => () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		},
		[],
	);

	const timeout = (callback: () => void, delay = 0): void => {
		timerRef.current = setTimeout(callback, delay);
	};

	return timeout;
};

export default useTimeout;
