import ApiClient from "helpers/ApiClient";
import { useQuery } from "react-query";
import { IPaginationParams, IPaginationRes } from "types/general";
import {
	IChangePasswordReqData,
	ILoadSessionsParams,
	IQrCode,
	ISession,
	ISetWhitelistIPsBody,
	IWhitelistIP,
} from "types/profileSecurity";
import { ISecureTokenRes } from "types/secureToken";

const SecurityService = {
	getSession: (params: ILoadSessionsParams): Promise<IPaginationRes<ISession>> =>
		ApiClient.get("web/user/session", params),
	getWhitelistIps: (params: IPaginationParams): Promise<IPaginationRes<IWhitelistIP>> =>
		ApiClient.get("web/profile/white-ips", params),
	changePassword: (data: IChangePasswordReqData): Promise<ISecureTokenRes> =>
		ApiClient.post("web/user/change-password/request", data),
	setWhiteListIps: (body: ISetWhitelistIPsBody) =>
		ApiClient.post("web/profile/security/white-ips-setup", body),
	generateTwoFA: (): Promise<IQrCode> => ApiClient.post("web/profile/two-factor/generate-key", {}),
	enableTwoFa: (token: string) => ApiClient.post("web/profile/two-factor/setup", { token }),
	disableTwoFa: (token: string, password: string) =>
		ApiClient.post("web/profile/two-factor/disable", { token, password }),
	changeUsername: (username: string) => ApiClient.post("web/profile/change-username", { username }),
	closeOtherSession: (only_web: boolean) =>
		ApiClient.post("web/user/session/close-other-sessions", { only_web }),
};

export const useSessions = (params?: ILoadSessionsParams) =>
	useQuery<IPaginationRes<ISession>>(["sessions", params], async () => {
		const data = await SecurityService.getSession(params ?? {});
		return (data ?? null) as IPaginationRes<ISession>;
	});

export default SecurityService;
