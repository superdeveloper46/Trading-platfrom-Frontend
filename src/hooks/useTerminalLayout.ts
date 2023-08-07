import cache from "helpers/cache";
import { useLocation } from "react-router-dom";
import { TerminalLayoutEnum } from "types/exchange";
import { TERMINAL_LAYOUT_CACHE_KEY } from "utils/cacheKeys";

const useTerminalLayout = (): TerminalLayoutEnum => {
	const cachedLayout = cache.getItem(TERMINAL_LAYOUT_CACHE_KEY, TerminalLayoutEnum.STANDARD);
	const nextTL = new URLSearchParams(useLocation().search).get("layout") as TerminalLayoutEnum;
	const layout: TerminalLayoutEnum = [
		TerminalLayoutEnum.BASIC,
		TerminalLayoutEnum.STANDARD,
		TerminalLayoutEnum.ADVANCED,
	].includes(nextTL ?? "")
		? nextTL
		: cachedLayout;

	return layout;
};

export default useTerminalLayout;
