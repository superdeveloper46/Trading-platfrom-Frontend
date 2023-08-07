import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import messages from "messages/coin_info";
import styles from "styles/components/CoinInfo.module.scss";
import Table, { IHeaderColumn } from "components/UI/Table/Table";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { IMarketCapCoin } from "types/coinmarketcap";
import { useMst } from "models/Root";
import { RowSkeleton } from "components/UI/Table";
import { observer } from "mobx-react-lite";
import CoinTableRow from "./CoinTableRow";

interface IProps {
	isLoading?: boolean;
	coins?: IMarketCapCoin[];
}

const CoinTable: React.FC<IProps> = ({ coins, isLoading }) => {
	const { formatMessage } = useIntl();
	const { tickers } = useMst();

	const [favouriteList, setFavouriteList] = useState<number[]>([]);
	const [votedList, setVotedList] = useState<number[]>([]);

	const setFavourite = (id: number) => {
		if (favouriteList && favouriteList.includes(id)) {
			return setFavouriteList((prev) => prev.filter((v) => v !== id));
		}
		return setFavouriteList((prev) => [...prev, id]);
	};

	const setVoted = (id: number) => setVotedList((prev) => [...prev, id]);

	useEffect(() => {
		setFavouriteList(
			coins?.filter(({ currency }) => currency.is_favorite).map(({ id }) => id) || [],
		);
	}, [coins]);

	useEffect(() => {
		setVotedList(coins?.filter(({ currency }) => currency.is_voted).map(({ id }) => id) || []);
	}, [coins]);

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.currency),
			name: "currency",
			minWidth: "345px",
		},
		{
			label: formatMessage(commonMessages.price),
			align: "right",
			minWidth: "80px",
			maxWidth: "100px",
		},
		{
			label: formatMessage(messages.percent_24),
			align: "right",
			minWidth: "80px",
		},
		{
			label: formatMessage(messages.percent_7),
			align: "right",
			minWidth: "80px",
		},
		{
			label: formatMessage(messages.volume_24),
			align: "right",
			minWidth: "145px",
		},
		{
			label: formatMessage(messages.market_cap),
			align: "right",
			minWidth: "145px",
		},
	];

	const isListed = (symbol: string): boolean =>
		tickers.list.some((t) => t.base_currency_code === symbol.toLocaleUpperCase()) || false;

	return (
		<Table
			header={{
				primary: true,
				className: styles.table_header,
				columns: columns,
			}}
		>
			{isLoading ? (
				Array.from(Array(20).keys()).map((_, idx) => <RowSkeleton key={idx} cells={columns} />)
			) : coins && coins.length > 0 ? (
				coins.map((coin) => (
					<CoinTableRow
						votedList={votedList}
						setVoted={setVoted}
						favouriteList={favouriteList}
						setFavourite={setFavourite}
						key={coin.id}
						coin={coin}
						isListed={isListed(coin.symbol)}
					/>
				))
			) : (
				<NoRowsMessage customMessage={formatMessage(commonMessages.no_results)} />
			)}
		</Table>
	);
};

export default observer(CoinTable);
