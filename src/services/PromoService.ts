import ApiClient from "helpers/ApiClient";
import { ISubmitSocialActivityBody } from "components/WelcomeBonusAward/WelcomeBonusAwardForm";

const PromoService = {
	getPromoStatus: (): Promise<void> => ApiClient.get("web/promo/ny22/status"),
	promoPayOut: (): Promise<void> => ApiClient.post("web/promo/ny22/pay-out"),
	submitSocialActivity: (body: ISubmitSocialActivityBody): Promise<void> =>
		ApiClient.post("web/promo/ny22/submit-social-activity", body),
};

export default PromoService;
