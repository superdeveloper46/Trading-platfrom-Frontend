const useRiskLevelRate = (level: number, zones: number[]): number => {
	if (zones.length < 3) {
		return 0;
	}

	const [green, yellow, red] = zones;

	if (level <= red) {
		return 0.8;
	}
	if (level <= yellow) {
		return 0.5;
	}
	if (level <= green) {
		return 0.2;
	}

	return 0;
};

export default useRiskLevelRate;
