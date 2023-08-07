import dayjs from "dayjs";
import { queryVars } from "constants/query";
import { YesNoEnum } from "types/general";

export const getUrlParams = (filter: Record<string, any>): string => {
	let urlParams = `?`;

	Object.keys(filter).forEach((k) => {
		if (k === queryVars.date) {
			if (filter[k].startDate && filter[k].endDate) {
				const dateAfter = dayjs(filter.date.startDate).format("YYYY-MM-DD");
				const dateBefore = dayjs(filter.date.endDate).format("YYYY-MM-DD");
				urlParams += `&${queryVars.date_after}=${dateAfter}&${queryVars.date_before}=${dateBefore}`;
			}
		} else if (k === queryVars.sort) {
			if (filter[k]) {
				urlParams += `&${queryVars.ordering}=${filter.sort.value === queryVars.desc ? "-" : ""}${
					filter.sort.name
				}`;
			}
		} else if (filter[k]) {
			urlParams += `&${k}=${filter[k]}`;
		}
	});

	return urlParams.replace(/\?&/, "?");
};

export const getLoadParams = (filter: Record<string, any>): Record<string, any> | any => {
	const params: Record<string, any> = {};

	Object.keys(filter).forEach((k) => {
		if (k === queryVars.date) {
			if (filter.date.startDate) {
				params.date_after = dayjs(filter.date.startDate).format("YYYY-MM-DD");
			}
			if (filter.date.endDate) {
				params.date_before = dayjs(filter.date.endDate).format("YYYY-MM-DD");
			}
		} else if (k === queryVars.sort) {
			if (filter.sort) {
				params.ordering = `${filter.sort.value === queryVars.desc ? "-" : ""}${filter.sort.name}`;
			}
		} else if (k === queryVars.is_active) {
			params.is_active = filter[k];
		} else if (k === queryVars.status) {
			if (filter[k] !== queryVars.all) {
				params.status = filter[k];
			}
		} else if ([YesNoEnum.Yes, YesNoEnum.No].includes(filter[k])) {
			params[k] = `${filter[k] === YesNoEnum.Yes}`;
		} else if (filter[k]) {
			params[k] = `${filter[k]}`;
		}
	});

	return params;
};
