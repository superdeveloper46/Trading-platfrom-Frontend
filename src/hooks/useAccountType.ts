import { useLocation } from "react-router-dom";
import { AccountTypeEnum } from "types/account";

const useAccountType = (): AccountTypeEnum => {
	const nextTT = new URLSearchParams(useLocation().search).get("type");
	const type = [AccountTypeEnum.SPOT, AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(
		nextTT as AccountTypeEnum,
	)
		? (nextTT as AccountTypeEnum)
		: AccountTypeEnum.SPOT;

	return type;
};

export default useAccountType;
