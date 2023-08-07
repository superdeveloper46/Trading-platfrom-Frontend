import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { ICurrency, ILoadCoinsParams, IMarketCapCoin } from "types/coinmarketcap";
import messages from "messages/coin_info";
import { useGainers, useLosers } from "services/CoinMarketCapService";
import { getLoadParams, getUrlParams } from "utils/filter";
import { PAGE_SIZE } from "constants/coin_info";
import useParamQuery from "hooks/useSearchQuery";
import styles from "styles/components/CoinInfo.module.scss";
import { routes } from "constants/routing";
import { queryVars } from "constants/query";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { ICoinInfoFilter } from "./AllCoins";
import { CoinTableFilter } from "./CoinTable/CoinTableCommon";
import CoinLeadersTable from "./CoinLeadersTable/CoinLeadersTable";

interface IProps {
	coins?: IMarketCapCoin[];
	isLoading: boolean;
	onClick(coin: IMarketCapCoin, usd?: ICurrency): void;
}

const Leaders: React.FC = () => {
	const navigate = useNavigate();
	const localeNavigate = useLocaleNavigate();
	const query = useParamQuery();

	const queryPage = +(query.get(queryVars.page) || 1);
	const querySearch = query.get(queryVars.search) || "";
	const queryIsFavouriteOnly = query.get(queryVars.is_favorite) || false;

	const [filter, setFilter] = useState<ICoinInfoFilter>({
		[queryVars.search]: querySearch,
		[queryVars.page]: queryPage,
		[queryVars.is_favorite]: Boolean(queryIsFavouriteOnly),
	});

	const [loadParams, setLoadParams] = useState<ILoadCoinsParams>({
		...getLoadParams(filter),
		[queryVars.page]: queryPage,
	});

	const { isFetching: isGainersLoading, data: gainers } = useGainers(loadParams);
	const { isFetching: isLosersLoading, data: losers } = useLosers(loadParams);

	const toggleIsFavourite = (isFavourite: boolean) => {
		const nextFilter: ICoinInfoFilter = {
			...filter,
			[queryVars.is_favorite]: isFavourite,
			[queryVars.search]: "",
			[queryVars.page]: 1,
		};
		setFilter(nextFilter);
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.is_favorite]: isFavourite }),
		});
		setLoadParams(getLoadParams({ ...nextFilter }));
	};

	const onSearchInput = (v: string): void => {
		setFilter((prev) => ({
			...prev,
			search: v,
		}));
	};

	const handleSearch = (): void => {
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }),
		});
		setLoadParams({
			...getLoadParams(filter),
			[queryVars.page]: 1,
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	const handleReset = (): void => {
		const nextFilter: ICoinInfoFilter = {
			[queryVars.is_favorite]: false,
			[queryVars.search]: "",
			[queryVars.page]: 1,
		};
		setFilter(nextFilter);
		navigate({ [queryVars.search]: getUrlParams({ ...nextFilter }) });
		setLoadParams(getLoadParams({ ...nextFilter }));
	};

	const onClick = (coin: IMarketCapCoin) => {
		localeNavigate(routes.coin.getCoin(coin.symbol));
	};

	return (
		<div className={styles.page}>
			<CoinTableFilter
				searchValue={filter.search}
				searchCoin={onSearchInput}
				handleSearch={handleSearch}
				handleReset={handleReset}
				isFavourite={filter.is_favorite}
				onFavourite={() => toggleIsFavourite(!filter.is_favorite)}
			/>
			<div className={styles.leaders_container}>
				<Gainers coins={gainers?.results} isLoading={isGainersLoading} onClick={onClick} />
				<Losers coins={losers?.results} isLoading={isLosersLoading} onClick={onClick} />
			</div>
		</div>
	);
};

export default Leaders;

const Gainers: React.FC<IProps> = ({ coins, isLoading, onClick }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.leader}>
			<span className={styles.title}>{formatMessage(messages.leaders)}</span>
			<CoinLeadersTable coins={coins} isLoading={isLoading} onClick={onClick} />
		</div>
	);
};

const Losers: React.FC<IProps> = ({ coins, isLoading, onClick }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.leader}>
			<span className={styles.title}>{formatMessage(messages.losers)}</span>
			<CoinLeadersTable coins={coins} isLoading={isLoading} onClick={onClick} />
		</div>
	);
};
