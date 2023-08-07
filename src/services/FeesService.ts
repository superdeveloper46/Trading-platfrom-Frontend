import ApiClient from "helpers/ApiClient";
import { IFeeRates, IPaymentFee } from "types/fees";
import { useQuery } from "react-query";

const FeesService = {
	loadFeeRates: (): Promise<IFeeRates> => ApiClient.get("web/finance/fee-rates"),
	loadPaymentFees: (): Promise<IPaymentFee[]> => ApiClient.get("web/finance/payment-fees"),
};

export const usePaymentFees = () =>
	useQuery(["payment-fees"], async () => {
		const data = await FeesService.loadPaymentFees();

		const payments_fees: {
			usd: IPaymentFee[];
			crypto: IPaymentFee[];
			eur: IPaymentFee[];
			isPaymentFeesEmpty: boolean;
		} = {
			usd: [],
			crypto: [],
			eur: [],
			isPaymentFeesEmpty: true,
		};

		data?.forEach((fee: IPaymentFee) => {
			switch (fee.currency) {
				case "USD":
					payments_fees.usd.push(fee);
					break;
				case "EUR":
					payments_fees.eur.push(fee);
					break;
				default:
					payments_fees.crypto.push(fee);
					break;
			}
		});

		payments_fees.isPaymentFeesEmpty =
			payments_fees.usd.length + payments_fees.eur.length + payments_fees.crypto.length === 0;

		return payments_fees;
	});

export default FeesService;
