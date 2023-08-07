import { types as t } from "mobx-state-tree";

export const Status = t.model({
	key: t.number,
	label: t.string,
});
