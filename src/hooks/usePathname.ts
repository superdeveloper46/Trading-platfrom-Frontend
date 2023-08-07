import { useLocation } from "react-router-dom";

const usePathname = () => {
	const { pathname } = useLocation();
	const splittedPath = pathname.split("/");
	const formattedPath = splittedPath.slice(splittedPath.length > 2 ? 2 : 1).join("/");

	return formattedPath;
};

export default usePathname;
