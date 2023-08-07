import { IApiKeyDetails } from "models/ApiKeys";
import { useState } from "react";

const useApiRow = (apiKey: IApiKeyDetails, onDelete: (slug: string, label: string) => void) => {
	const [isActive, setActive] = useState<boolean>(false);

	const limitToIps: string[] = apiKey.limit_to_ips ?? [];
	const allowedSymbols: string[] = apiKey.allowed_symbols ?? [];

	const toggleExpand = () => setActive(!isActive);
	const deleteApiKey = (): void => onDelete(apiKey.slug, apiKey.label);

	return {
		isActive,
		toggleExpand,
		deleteApiKey,
		limitToIps,
		allowedSymbols,
	};
};

export default useApiRow;
