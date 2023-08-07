import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useMst } from "models/Root";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import stylesTable from "styles/components/UI/Table.module.scss";
import { observer } from "mobx-react-lite";
import { Table } from "components/UI/Table";
import messages from "messages/recent_trades";
import { List } from "react-virtualized/dist/commonjs/List";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import { IHeaderColumn } from "components/UI/Table/Table";
import { IRecentTrade } from "models/Terminal";
import EmptyTableData from "components/EmptyTableData";
import { ITicker } from "models/Ticker";
import RecentTradesRow from "./RecentTradesRow";
import LoadingOverlay from "../LoadingOverlay";

interface IRecentTradeRowRenderer {
	key: string | number;
	index: number;
	style: React.CSSProperties;
	parent: {
		props: {
			data: IRecentTrade[];
			ticker: ITicker;
			pricePrecision: number;
			amountPrecision: number;
		};
	};
}

const RecentTradesRowRenderer = (props: IRecentTradeRowRenderer): JSX.Element => (
	<RecentTradesRow {...props} />
);

const RecentTrades: React.FC = () => {
	const {
		terminal: { pair, recentTrades },
	} = useMst();
	const [scrollTop, setScrollTop] = useState<number>(0);
	const { formatMessage } = useIntl();

	const handleScroll = (e: { scrollTop: number }): void => {
		setScrollTop(e.scrollTop);
	};

	const columns: IHeaderColumn[] = [
		{
			label: `${formatMessage(messages.price_usd)} ${pair?.base_currency_code ?? "--"}`,
		},
		{
			label: pair?.base_currency_code ?? "--",
			align: "right",
		},
		{
			label: formatMessage(messages.date),
			align: "right",
		},
	];

	return (
		<div className={styles.recent_trades}>
			<LoadingOverlay />
			{recentTrades.length ? (
				<>
					<Table
						className={styles.recent_trades_table}
						header={{
							primary: true,
							columns,
						}}
					/>
					<div
						className={styles.recent_trades_table_wrapper}
						key={`${pair?.symbol ?? ""}_${recentTrades.length}`}
					>
						<AutoSizer>
							{({ height, width }) => (
								<List
									width={width}
									className={cn(styles.recent_trades_list, stylesTable.rows, stylesTable.stripped)}
									height={height}
									rowCount={recentTrades.length}
									rowHeight={20}
									overscanRowCount={8}
									// @ts-ignore
									rowRenderer={RecentTradesRowRenderer}
									data={recentTrades}
									onScroll={handleScroll}
									scrollTop={scrollTop}
									pricePrecision={pair?.price_precision ?? 3}
									amountPrecision={pair?.amount_precision ?? 6}
								/>
							)}
						</AutoSizer>
					</div>
				</>
			) : (
				<EmptyTableData />
			)}
		</div>
	);
};

export default observer(RecentTrades);
