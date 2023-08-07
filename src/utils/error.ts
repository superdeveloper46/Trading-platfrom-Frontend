export const transformErrorFromResponse = (error: string | string[]) =>
	Array.isArray(error) ? error.join(" ") : error ?? "";
