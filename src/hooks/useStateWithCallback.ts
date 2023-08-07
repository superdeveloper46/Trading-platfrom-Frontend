import { useCallback, useEffect, useState } from "react";

type CallbackType<T> = (state: T) => void;

const useStateWithCallback = <T>(
	initialValue: T,
): [T, (value: T, callback?: CallbackType<T>) => void] => {
	const [data, setData] = useState<{ value: T; callback?: CallbackType<T> }>({
		value: initialValue,
		callback: undefined,
	});

	useEffect(() => {
		const callback = data.callback;
		if (callback) {
			callback(data.value);
		}
	}, [data.value]);

	const setStateWithCallback = useCallback((value: T, callback?: CallbackType<T>) => {
		setData({ value, callback });
	}, []);

	return [data.value, setStateWithCallback];
};

export default useStateWithCallback;
