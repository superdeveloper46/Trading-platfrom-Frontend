import { useNavigate } from "react-router-dom";

import { useMst } from "models/Root";

const useLocaleNavigate = () => {
	const navigate = useNavigate();
	const {
		global: { locale },
	} = useMst();

	return (path: string) => navigate(`/${locale}${path}`);
};

export default useLocaleNavigate;
