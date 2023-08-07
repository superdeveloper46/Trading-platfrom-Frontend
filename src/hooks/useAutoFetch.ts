import { useEffect, useRef } from "react";

const useAutoFetch = (req: () => void, isOn: boolean, interval = 5000) => {
	const manualFetchInterval = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (isOn) {
			manualFetchInterval.current = setInterval(() => {
				req();
			}, interval);
		} else if (manualFetchInterval.current) {
			clearInterval(manualFetchInterval.current);
		}

		return () => {
			if (manualFetchInterval.current) {
				clearInterval(manualFetchInterval.current);
			}
		};
	}, [isOn]);
};

export default useAutoFetch;
