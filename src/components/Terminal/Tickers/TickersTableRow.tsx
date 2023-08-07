import React from "react";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import { ITicker, QUOTED_CURRENCIES_FIAT } from "models/Ticker";
import { useIntl } from "react-intl";
import { TableRow, TableData } from "components/UI/Table";
import pairLowIcon from "assets/images/trade/pair-low.svg";
import { formatNumberToString } from "utils/format";
import { observer } from "mobx-react-lite";

interface IProps {
	ticker: ITicker;
	onTickerClick: (symbol: string) => void;
	onFavoriteClick: (symbol: string, isFavorite: boolean) => void;
	isActive?: boolean;
	quotedCurrency: string;
}

const TickersTableRow: React.FC<IProps> = ({
	ticker,
	isActive,
	onTickerClick,
	onFavoriteClick,
	quotedCurrency,
}) => {
	const { formatNumber } = useIntl();
	const isFiat =
		quotedCurrency === "FIAT" || QUOTED_CURRENCIES_FIAT.includes(ticker.quote_currency_code);
	const fixedPercent = +ticker.change_percent.toFixed(2);
	const changePercent = fixedPercent < 0.01 && fixedPercent > -0.01 ? 0 : fixedPercent;

	const handleRowClick = () => {
		onTickerClick(ticker.symbol);
	};

	const toggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		const nextIsFavorite = !ticker.is_favorite;
		ticker.setIsFavorite(nextIsFavorite);
		onFavoriteClick(ticker.symbol, nextIsFavorite);
	};

	return (
		<TableRow
			className={cn(styles.tickers_table_row, { [styles.active]: isActive })}
			onClick={handleRowClick}
		>
			<TableData
				className={styles.tickers_table_row_pair}
				title={`${ticker.base_currency.name}/${ticker.quote_currency.name}`}
			>
				<i
					onClick={toggleFavorite}
					className={cn(`ai ai-star_${ticker.is_favorite ? "filled" : "outlined"}`, {
						[styles.active]: isActive,
						[styles.favorite]: ticker.is_favorite,
					})}
				/>
				&nbsp;
				<div className={styles.tickers_table_row_pair_column_name}>
					<div className={styles.tickers_table_row_currency_name}>
						{!isFiat ? (
							ticker.base_currency_code
						) : (
							<span
								className={cn(styles.tickers_table_row_pair_name, styles.primary)}
								title={`${ticker.base_currency_code}/${ticker.quote_currency_code}`}
							>
								{ticker.base_currency_code}/{ticker.quote_currency_code}
							</span>
						)}
						{ticker.is_low && (
							<div
								className={styles.tickers_table_row_pair_liquidity_sign}
								data-tip
								data-for="low-liquidity"
							>
								<img src={pairLowIcon} alt="Low Liquidity" />
							</div>
						)}
					</div>
					{!isFiat && (
						<div
							className={styles.tickers_table_row_pair_name}
							title={ticker.base_currency?.name ?? "--"}
						>
							{ticker.base_currency?.name ?? "--"}
						</div>
					)}
				</div>
			</TableData>
			<TableData align="right">
				{formatNumber(ticker.close, {
					useGrouping: false,
					minimumFractionDigits: ticker.price_precision ?? 0,
					maximumFractionDigits: ticker.price_precision ?? 8,
				})}
			</TableData>
			<TableData
				align="right"
				data-for="volume"
				data-tip={formatNumber(ticker.quote_volume, {
					useGrouping: true,
					minimumFractionDigits: ticker.amount_precision ?? 0,
					maximumFractionDigits: ticker.amount_precision ?? 8,
				})}
			>
				{formatNumberToString(ticker.quote_volume, ticker.amount_precision)}
			</TableData>
			<TableData
				className={cn(styles.tickers_table_row_change, {
					[styles.red]: changePercent < 0,
					[styles.green]: changePercent > 0,
				})}
				align="right"
			>
				{changePercent > 0 ? "+" : ""}
				{formatNumber(changePercent, {
					useGrouping: false,
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
				%
			</TableData>
		</TableRow>
	);
};

export default observer(TickersTableRow);
