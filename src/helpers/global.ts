import config from "./config";

export const getColorVariant = (value: number): string => {
	if (value > 0) {
		return "var(--color-green)";
	}
	if (value < 0) {
		return "var(--color-red)";
	}
	return "var(--color-primary)";
};

export const getPageTitle = (title: string) => `${title} | ${config.department}`;
