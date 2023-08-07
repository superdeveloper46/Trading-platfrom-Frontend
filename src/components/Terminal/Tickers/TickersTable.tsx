import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import { useMst } from "models/Root";
import styles from "styles/pages/Terminal.module.scss";
import { Table } from "components/UI/Table";
import messages from "messages/exchange";
import commonMessages from "messages/common";
import LoadingSpinner from "components/UI/LoadingSpinner";
import EmptyTableData from "components/EmptyTableData";
import { IHeaderColumn } from "components/UI/Table/Table";
import Tooltip from "components/UI/Tooltip";
import useTerminalLayout from "hooks/useTerminalLayout";
import { TerminalMobileWidgetEnum } from "types/exchange";
import useAccountType from "hooks/useAccountType";
import { queryVars } from "constants/query";
import { URL_VARS } from "constants/routing";
import TickersTableRow from "./TickersTableRow";

interface IProps {
	mobile?: boolean;
}

const TickersTable: React.FC<IProps> = ({ mobile }) => {
	const {
		tickers: { formattedList, filter, isLoaded, updateFavoritePair },
		terminal: { ticker: terminalTicker, setMobileActiveWidget, setIsTickersAbsolute },
		global: { locale, isAuthenticated },
	} = useMst();
	const { formatMessage } = useIntl();
	const navigate = useNavigate();
	const layout = useTerminalLayout();
	const type = useAccountType();
	const [sortName, sortValue] = filter.sort.split(".");

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [formattedList.length]);

	const handleTickerClick = (symbol: string) => {
		navigate(
			`/${locale}/${URL_VARS.TRADE}/${symbol}?${queryVars.layout}=${layout}&${queryVars.type}=${filter.tradeType}`,
		);
		setMobileActiveWidget(TerminalMobileWidgetEnum.TRADE);
		setIsTickersAbsolute(false);
	};

	const handleTickerFavoriteClick = (symbol: string, isFavorite: boolean) => {
		if (isAuthenticated) {
			updateFavoritePair(symbol, isFavorite);
		}
	};

	const handleFilterChange = (name: string) => {
		filter.setSort(`${name}.${sortValue === queryVars.asc ? queryVars.desc : queryVars.asc}`);
	};

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(messages.currency),
			name: "symbol",
		},
		{
			label: formatMessage(messages.price),
			align: "right",
			name: "close",
		},
		{
			label: formatMessage(messages.volume_chart),
			align: "right",
			name: "quote_volume",
		},
		{
			label: "Δ24H",
			align: "right",
			name: "change_percent",
		},
	];

	return (
		<div className={styles.table_container}>
			{!isLoaded && (
				<div className={styles.widget_loader}>
					<LoadingSpinner />
				</div>
			)}
			{formattedList.length ? (
				<>
					<Table
						stripped
						className={styles.tickers_table}
						header={{
							primary: true,
							columns: columns.map((col) => ({
								label: col.label,
								align: col.align,
								name: col.name,
								sort: sortName === col.name ? sortValue : "none",
								onSortChange: handleFilterChange,
							})),
						}}
					>
						{formattedList.map((ticker) => (
							<TickersTableRow
								key={ticker.symbol}
								ticker={ticker}
								isActive={ticker.symbol === terminalTicker?.symbol && filter.tradeType === type}
								onFavoriteClick={handleTickerFavoriteClick}
								onTickerClick={handleTickerClick}
								quotedCurrency={filter.quotedCurrency}
							/>
						))}
					</Table>
					<Tooltip id="low-liquidity" arrowColor="var(--tooltip-background)">
						{formatMessage(commonMessages.low_liquidity_exchange)}
					</Tooltip>
					{!mobile && <Tooltip id="volume" place="bottom" arrowColor="var(--tooltip-background)" />}
				</>
			) : (
				<EmptyTableData />
			)}
		</div>
	);
};

export default observer(TickersTable);
