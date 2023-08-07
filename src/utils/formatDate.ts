import format from "date-fns/format";
import dayjs, { UnitTypeLongPlural } from "dayjs";

export const formatDate = (date: number | string | Date, dateFormat = "dd.MM.yyyy HH:mm:SS") =>
	format(new Date(date), dateFormat);

export const getDaysCountFrom = (date: Date, unit: UnitTypeLongPlural = "days") =>
	Math.abs(dayjs(date).diff(dayjs(Date.now()), unit));
