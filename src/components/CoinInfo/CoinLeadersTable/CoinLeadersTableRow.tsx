import React, { useEffect, useState } from "react";

import { TableRow } from "components/UI/Table";
import { useMst } from "models/Root";
import { ICurrency, IMarketCapCoin } from "types/coinmarketcap";
import styles from "styles/components/CoinInfo.module.scss";
import CoinMarketCapService from "services/CoinMarketCapService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import { CurrencyCell, PriceCell, PercentCell } from "../CoinTable/CoinTableCommon";

interface IProps {
	coin: IMarketCapCoin;
	onClick(coin: IMarketCapCoin, usd?: ICurrency): void;
}

const CoinLeadersTableRow: React.FC<IProps> = ({ coin, onClick }) => {
	const [usd, setUSD] = useState<ICurrency>();
	const {
		global: { isAuthenticated },
	} = useMst();
	const [isFavourite, setIsFavourite] = useState<boolean>(coin.currency.is_favorite);

	useEffect(() => {
		if (coin.quote?.USD) {
			setUSD(coin.quote?.USD);
		}
	}, [coin]);

	const handleOnFavourite = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();

		try {
			CoinMarketCapService.setFavorite({
				[queryVars.currency_id]: coin.id,
				[queryVars.is_favorite]: !coin.currency.is_favorite,
			});
			setIsFavourite((prevState) => !prevState);
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<TableRow common className={styles.leaders_coin_row} onClick={() => onClick(coin, usd)}>
			<CurrencyCell
				isAuthenticated={isAuthenticated}
				onFavourite={handleOnFavourite}
				hideFavourite={!isAuthenticated}
				isFavourite={isFavourite}
				logo={coin.currency.logo}
				name={coin.name}
				symbol={coin.symbol}
				hideListing
				minWidth="200px"
			/>
			<PriceCell align="right" minWidth="80px" price={usd?.price} />
			<PercentCell align="right" minWidth="80px" percent={usd?.percent_change_24h} />
			<PriceCell minWidth="145px" align="right" price={usd?.volume_24h} />
		</TableRow>
	);
};

export default React.memo(CoinLeadersTableRow);
