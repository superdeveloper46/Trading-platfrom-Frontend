import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";

const ConfirmEmailService = {
	getConfirmInfo: (token: string) => ApiClient.get(`web/confirm/email`, { token }),
	confirm: (token: string) => ApiClient.post("web/confirm/email", { token, action: "confirm" }),
};

export const useConfirmInfo = (slug: string) =>
	useQuery(["email-confirm-info", slug], async () => {
		const data = await ConfirmEmailService.getConfirmInfo(slug);
		return data ?? null;
	});

export default ConfirmEmailService;
