import React, { useState } from "react";
import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { QUOTED_CURRENCIES_FIAT } from "models/Ticker";
import { TradeTypeEnum } from "types/exchange";
import { TickersQuotedEnum } from "types/ticker";

const QuotedCurrenciesTabs: React.FC = () => {
	const {
		tickers: { filter, quotedCurrencies },
		terminal: { isTickersExpanded, setIsTickersExpanded },
	} = useMst();

	const handleTabsChange = (name: string) => {
		if (name) {
			filter.setQuotedCurrency(name);
		}

		if (!isTickersExpanded) {
			setIsTickersExpanded(true);
		}
	};

	return (
		<div className={cn(styles.tickers_tabs, styles.tabs)}>
			<Tab
				name={TickersQuotedEnum.FAVORITES}
				onClick={handleTabsChange}
				isActive={filter.quotedCurrency === TickersQuotedEnum.FAVORITES}
				label={
					<i
						data-name={TickersQuotedEnum.FAVORITES}
						className={cn(
							styles.tickers_favorites,
							`ai ai-star_${
								filter.quotedCurrency === TickersQuotedEnum.FAVORITES ? "filled" : "outlined"
							}`,
							filter.quotedCurrency === TickersQuotedEnum.FAVORITES && styles.active,
						)}
					/>
				}
			/>
			{quotedCurrencies[filter.tradeType].map((currency) => (
				<Tab
					key={currency}
					name={currency}
					onClick={handleTabsChange}
					label={currency}
					isActive={filter.quotedCurrency === currency}
				/>
			))}
			{filter.tradeType === TradeTypeEnum.SPOT && QUOTED_CURRENCIES_FIAT.length > 0 && (
				<Tab
					name={TickersQuotedEnum.FIAT}
					onClick={handleTabsChange}
					isActive={[...QUOTED_CURRENCIES_FIAT, TickersQuotedEnum.FIAT].includes(
						filter.quotedCurrency,
					)}
					label={TickersQuotedEnum.FIAT}
				/>
			)}
		</div>
	);
};

export default observer(QuotedCurrenciesTabs);
