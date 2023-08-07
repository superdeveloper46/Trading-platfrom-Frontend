import { useState } from "react";
import cache from "helpers/cache";

const useLocalStorage = (key: string, initialValue: string) => {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		return cache.getItem(key, initialValue);
	});

	const setValue = (value: unknown) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			cache.setItem(key, valueToStore);
		} catch (error) {
			console.log(error);
		}
	};

	return [storedValue, setValue];
};

export default useLocalStorage;
