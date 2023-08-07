import { cast, flow, Instance, types as t } from "mobx-state-tree";
import ApiService from "services/ApiService";
import { IGetApiKeysParams, IGetApiKeysRes } from "types/profile";

const ApiKeys = t.model({
	allowed_symbols: t.maybeNull(t.array(t.string)),
	can_margin: t.boolean,
	can_trade: t.boolean,
	can_withdraw: t.boolean,
	created_at: t.string,
	label: t.string,
	limit_to_ips: t.maybeNull(t.array(t.string)),
	prefix: t.string,
	key: t.string,
	slug: t.string,
	used_at: t.maybeNull(t.string),
});

export type IApiKeyDetails = Instance<typeof ApiKeys>;

export const ProfileApiKeys = t
	.model({
		apiKeys: t.optional(t.array(ApiKeys), []),
		count: t.optional(t.number, 0),
		isLoading: t.optional(t.boolean, false),
	})
	.actions((self) => ({
		getApiKeys: flow(function* (params?: IGetApiKeysParams) {
			try {
				self.isLoading = true;
				const apiKeysRes: IGetApiKeysRes = yield ApiService.loadApiKeysRequest(params || {});
				if (Array.isArray(apiKeysRes.results)) {
					self.apiKeys = cast(apiKeysRes.results);
					self.count = apiKeysRes.count;
				}
			} catch (err) {
				console.error(err);
			} finally {
				self.isLoading = false;
			}
		}),
	}));
