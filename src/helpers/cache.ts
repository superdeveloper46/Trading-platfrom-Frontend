const cache = {
	setItem: (key: string, value: unknown) => window.localStorage.setItem(key, JSON.stringify(value)),
	getItem: (key: string, initialValue: string) => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : JSON.parse(initialValue);
		} catch (error) {
			return initialValue;
		}
	},
};

export default cache;
