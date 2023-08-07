import dayjs, { Dayjs, unix } from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export function transformDate(date: number, format?: undefined): Dayjs;
export function transformDate(date: number, format: string): string;
export function transformDate(date: number, format?: string): string | Dayjs;
export function transformDate(date: number, format?: string): string | Dayjs {
	const formattedDate = unix(date).utc();
	return format ? formattedDate.format(format) : formattedDate;
}

export default dayjs;
