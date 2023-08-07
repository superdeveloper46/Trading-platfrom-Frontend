export const getDisplayTimeValue = (value: number) => {
	if (value < 10) {
		return [0, value];
	}

	return value.toString().split("");
};

export const getDateFromDiff = (diff: number) => {
	const minutes = Math.floor((diff % (60 * 60)) / 60);
	const seconds = Math.floor(diff % 60);

	return {
		seconds,
		minutes,
	};
};

export const getPercentageOf = (value1: number, value2: number) => {
	if (value1 === 0 || value2 === 0) {
		return 0;
	}
	return Math.floor((value1 / value2) * 100 * 100) / 100;
};
