type TFileType = "image/jpeg" | "image/jpg" | "image/png";

export const validateFileType = (file: File, types: TFileType[]): boolean =>
	types.includes(file.type as TFileType);

export const validateFileSize = (file: File, maxSizeInMB: number): boolean =>
	+(file.size / 1024 / 1024).toFixed(1) <= maxSizeInMB;
