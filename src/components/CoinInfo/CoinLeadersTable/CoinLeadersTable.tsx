import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import messages from "messages/coin_info";
import styles from "styles/components/CoinInfo.module.scss";
import Table, { IHeaderColumn } from "components/UI/Table/Table";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { ICurrency, IMarketCapCoin } from "types/coinmarketcap";
import { RowSkeleton } from "components/UI/Table";
import CoinLeadersTableRow from "./CoinLeadersTableRow";

interface IProps {
	isLoading?: boolean;
	coins?: IMarketCapCoin[];
	onClick(coin: IMarketCapCoin, usd?: ICurrency): void;
}

const CoinLeadersTable: React.FC<IProps> = ({ isLoading, coins, onClick }) => {
	const { formatMessage } = useIntl();

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(financeMessages.currency),
			minWidth: "200px",
		},
		{
			label: formatMessage(commonMessages.price),
			align: "right",
			minWidth: "80px",
		},
		{
			label: formatMessage(messages.percent_24),
			align: "right",
			minWidth: "80px",
		},
		{
			label: formatMessage(messages.volume_24),
			align: "right",
			minWidth: "145px",
		},
	];

	return (
		<Table
			header={{
				primary: true,
				className: cn(styles.table_header, styles.leaders),
				columns: columns,
			}}
		>
			{isLoading ? (
				Array.from(Array(10).keys()).map((_, idx) => <RowSkeleton key={idx} cells={columns} />)
			) : coins && coins.length > 0 ? (
				coins.map((coin) => <CoinLeadersTableRow coin={coin} onClick={onClick} key={coin.id} />)
			) : (
				<NoRowsMessage customMessage={formatMessage(commonMessages.no_results)} />
			)}
		</Table>
	);
};

export default CoinLeadersTable;
