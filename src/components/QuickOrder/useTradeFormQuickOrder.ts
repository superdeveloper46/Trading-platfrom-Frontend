import useTradeForm from "hooks/useTradeForm";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { getBalance } from "helpers/account";
import { IPair } from "models/Terminal";
import { AccountTypeEnum } from "types/account";

const useTradeFormQuickOrder = (
	pair: IPair | Record<string, any> = {},
	side: OrderSideEnum,
	balances: any,
	isAuthenticated: boolean,
) => {
	const currentBalance = pair
		? getBalance(
				side === OrderSideEnum.BUY ? pair.quote_currency_code : pair.base_currency_code,
				pair.symbol,
				AccountTypeEnum.SPOT,
				balances,
				[],
				[],
		  )
		: null;

	return useTradeForm(
		pair ?? {},
		side,
		OrderTypeEnum.MARKET,
		"amount",
		null,
		{ currentBalance: currentBalance as any },
		isAuthenticated,
	);
};

export default useTradeFormQuickOrder;
