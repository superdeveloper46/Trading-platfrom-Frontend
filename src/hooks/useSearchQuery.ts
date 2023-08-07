import { useLocation } from "react-router-dom";

const useParamQuery = (): URLSearchParams => new URLSearchParams(useLocation().search);

export default useParamQuery;
