import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import { TableRow } from "components/UI/Table";
import { ICurrency, IMarketCapCoin } from "types/coinmarketcap";
import styles from "styles/components/CoinInfo.module.scss";
import { useMst } from "models/Root";
import CoinMarketCapService from "services/CoinMarketCapService";
import errorHandler from "utils/errorHandler";
import messages from "messages/coin_info";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { CurrencyCell, PercentCell, PriceCell } from "./CoinTableCommon";

export interface ICoinTableRowProps {
	coin: IMarketCapCoin;
	isListed?: boolean;
	setFavourite: (id: number) => void;
	favouriteList: number[];
	setVoted: (id: number) => void;
	votedList: number[];
}

const CoinTableRow: React.FC<ICoinTableRowProps> = ({
	coin,
	isListed,
	setFavourite,
	favouriteList,
	setVoted,
	votedList,
}) => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
	} = useMst();
	const [usd, setUSD] = useState<ICurrency>();
	const localeNavigate = useLocaleNavigate();

	const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false);
	const [isFavouriteLoading, setIsFavouriteLoading] = useState<boolean>(false);

	useEffect(() => {
		if (coin.quote?.USD) {
			setUSD(coin.quote?.USD);
		}
	}, [coin]);

	const onClick = (e: any) => {
		e?.preventDefault();
		e?.stopPropagation();
		localeNavigate(routes.coin.getCoin(coin.symbol));
	};

	const handleOnFavourite = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();

		if (!isFavouriteLoading) {
			setIsFavouriteLoading(true);
			CoinMarketCapService.setFavorite({
				currency_id: coin.id,
				is_favorite: !favouriteList.includes(coin.id),
			})
				.then(() => {
					setFavourite(coin.id);
				})
				.catch(errorHandler)
				.finally(() => setIsFavouriteLoading(false));
		}
	};

	const handleOnListingClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();

		if (!isVoteLoading) {
			setIsVoteLoading(true);
			if (!coin.currency.is_voted && coin.id && isAuthenticated) {
				CoinMarketCapService.listingVote({
					currency_id: coin.id,
					vote: true,
				})
					.then(() => {
						setVoted(coin.id);
						toast.success(formatMessage(messages.listed_successfully));
					})
					.catch(errorHandler)
					.finally(() => setIsVoteLoading(false));
			}
		}
	};

	const isFavourite = favouriteList.includes(coin.id);
	const isVoted = votedList.includes(coin.id);

	return (
		<TableRow common className={styles.coin_row} onClick={onClick}>
			<CurrencyCell
				isVoteLoading={isVoteLoading}
				isFavouriteLoading={isFavouriteLoading}
				isAuthenticated={isAuthenticated}
				onFavourite={handleOnFavourite}
				onVote={handleOnListingClick}
				isFavourite={isFavourite}
				isVoted={isVoted}
				hideFavourite={!isAuthenticated}
				logo={coin.currency.logo}
				name={coin.name}
				symbol={coin.symbol}
				isListed={isListed}
				minWidth="345px"
			/>
			<PriceCell minWidth="80px" maxWidth="100px" align="right" price={usd?.price} />
			<PercentCell minWidth="80px" align="right" percent={usd?.percent_change_24h} />
			<PercentCell minWidth="80px" align="right" percent={usd?.percent_change_7d} />
			<PriceCell minWidth="145px" align="right" price={usd?.volume_24h} />
			<PriceCell minWidth="145px" align="right" price={usd?.fully_diluted_market_cap} />
		</TableRow>
	);
};

export default React.memo(CoinTableRow);
