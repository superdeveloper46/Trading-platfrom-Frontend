import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "styles/components/CoinInfo.module.scss";
import { useMst } from "models/Root";
import { getLoadParams, getUrlParams } from "utils/filter";
import { useCoins } from "services/CoinMarketCapService";
import { PAGE_SIZE } from "constants/coin_info";
import { ILoadCoinsParams } from "types/coinmarketcap";
import useParamQuery from "hooks/useSearchQuery";
import Pagination from "components/UI/Pagination";
import { queryVars } from "constants/query";
import CoinTable from "./CoinTable/CoinTable";
import { CoinTableFilter } from "./CoinTable/CoinTableCommon";
import ScrollToTheTop from "./ScrollToTheTop";

export interface ICoinInfoFilter {
	[queryVars.search]: string;
	[queryVars.is_favorite]: boolean;
	[queryVars.page]: number;
}

const AllCoins: React.FC = () => {
	const navigate = useNavigate();
	const query = useParamQuery();

	const { tickers } = useMst();
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
		[queryVars.page_size]: PAGE_SIZE,
	});

	const { isFetching, data: coins } = useCoins(loadParams);

	const loadTickers = () => {
		tickers.loadTickers();
	};

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

	const handlePageChange = (page: number): void => {
		setFilter((prev) => ({ ...prev, page }));
		navigate({ [queryVars.search]: getUrlParams({ ...filter, page }) });
		setLoadParams({
			...getLoadParams(filter),
			[queryVars.page]: page,
			[queryVars.page_size]: PAGE_SIZE,
		});
	};

	useEffect(() => {
		loadTickers();
	}, []);

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
			<CoinTable coins={coins?.results} isLoading={isFetching} />
			{coins && coins.results.length ? (
				<div className={styles.pagination_container}>
					<Pagination
						count={Math.ceil(coins.count / PAGE_SIZE)}
						page={filter.page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
			<ScrollToTheTop />
		</div>
	);
};

export default AllCoins;
