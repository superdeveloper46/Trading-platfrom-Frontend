import cookies from "js-cookie";

import ApiClient from "helpers/ApiClient";
import { queryVars } from "constants/query";
import useParamQuery from "./useSearchQuery";

const useSalesDoubler = () => {
	const searchParamQuery = useParamQuery();

	const sendRegister = () => {
		const clickId = searchParamQuery.get(queryVars.aff_sub);
		if (clickId) {
			cookies.set(queryVars.aff_sub, clickId, { expires: 30 });
		}

		const storedClickId = cookies.get(queryVars.aff_sub);
		if (storedClickId) {
			const param = searchParamQuery.get(queryVars.utm_campaign);
			if (param) {
				cookies.set(queryVars.utm_campaign, param, { expires: 30 });

				const id = searchParamQuery.get(queryVars.aff_id);
				if (id) {
					cookies.set(queryVars.aff_id, id, { expires: 30 });
				}

				ApiClient.post("web/marketing/sales-doubler/register", {
					utm_campaign: param,
					aff_sub: storedClickId,
					aff_id: id,
				});
			}
		}
	};

	return {
		sendRegister,
	};
};

export default useSalesDoubler;
