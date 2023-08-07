import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import Tab from "components/UI/Tab";
import styles from "styles/pages/Terminal.module.scss";
import { TradeTypeEnum } from "types/exchange";
import { useMst } from "models/Root";
import config from "helpers/config";
import useAccountType from "hooks/useAccountType";
import { queryVars } from "constants/query";
import { URL_VARS } from "constants/routing";

const LeverateSign: React.FC = ({ children }) => (
	<span className={styles.margin_leverate_sign}>{children}</span>
);

const TradeTypeTabs: React.FC = () => {
	const { pair: symbol } = useParams<{ pair: string }>();
	const {
		global: { locale },
		terminal: { setIsTickersExpanded, isTickersExpanded },
		tickers: { quotedCurrencies, maxCrossLeverage, maxIsolatedLeverage, filter },
	} = useMst();
	const navigate = useNavigate();

	const type = useAccountType();

	const handleTradeTypeChange = (nextType: string): void => {
		const activeSymbolQuoted = symbol?.split("_")?.[1] || "USD";
		filter.setTradeType(nextType as TradeTypeEnum);
		filter.setQuotedCurrency(
			quotedCurrencies[nextType].includes(activeSymbolQuoted)
				? activeSymbolQuoted
				: quotedCurrencies[nextType]?.[0],
		);

		if (!isTickersExpanded) {
			setIsTickersExpanded(true);
		}

		navigate(
			`/${locale}/${URL_VARS.TRADE}/${config.defaultTerminalMarginPair}?${queryVars.layout}=advanced&${queryVars.type}=${nextType}`,
		);
	};

	useEffect(() => {
		filter.setTradeType(type as unknown as TradeTypeEnum);
	}, [type]);

	const tabs = [
		{
			name: TradeTypeEnum.SPOT,
			label: TradeTypeEnum.SPOT,
		},
		{
			name: TradeTypeEnum.CROSS,
			label: (
				<>
					CROSS MARGIN
					<LeverateSign>
						{maxCrossLeverage !== -Infinity && maxCrossLeverage ? maxCrossLeverage : "--"}x
					</LeverateSign>
				</>
			),
		},
		{
			name: TradeTypeEnum.ISOLATED,
			label: (
				<>
					ISOLATED MARGIN
					<LeverateSign>
						{maxIsolatedLeverage !== -Infinity && maxIsolatedLeverage ? maxIsolatedLeverage : "--"}x
					</LeverateSign>
				</>
			),
		},
	];

	return (
		<div className={cn(styles.tickers_tabs, styles.tabs)}>
			{tabs.map((t) => (
				<Tab
					key={t.name}
					name={t.name}
					isActive={filter.tradeType === t.name}
					onClick={handleTradeTypeChange}
					label={t.label}
				/>
			))}
		</div>
	);
};

export default observer(TradeTypeTabs);
