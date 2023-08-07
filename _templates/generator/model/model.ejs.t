---
to: src/models/<%=Name%>.ts
---

import { applySnapshot, getSnapshot, Instance, types as t } from "mobx-state-tree";

export const <%=Name%> = t
	.model({})
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({}));

export type I<%=Name%> = Instance<typeof <%=Name%>>;
