export const setArray = <T>(arr: unknown): T[] => (Array.isArray(arr) ? arr : []);

export const setBoolean = (value: unknown): boolean => (typeof value === "boolean" ? value : false);

export const setNumber = (value: unknown): number => (typeof value === "number" ? value : 0);
