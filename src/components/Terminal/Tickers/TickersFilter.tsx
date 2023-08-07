import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import { observer } from "mobx-react-lite";
import styles from "styles/pages/Terminal.module.scss";
import Input from "components/UI/Input";
import Switch from "components/UI/Switch";
import { TradeTypeEnum } from "types/exchange";

const TickersFilter: React.FC = () => {
	const {
		tickers: { filter, hasLowLiquidity },
	} = useMst();
	const { formatMessage } = useIntl();

	const isFilterMargin =
		filter.tradeType === TradeTypeEnum.CROSS || filter.tradeType === TradeTypeEnum.ISOLATED;

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		filter.setSearch(e.target.value);
	};

	const handleLowLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		filter.setLowLiquidity(e.target.checked);
	};

	return (
		<div className={styles.tickers_filter}>
			<Input
				small
				search
				value={filter.search}
				placeholder={formatMessage(commonMessages.search)}
				onChange={handleSearchChange}
			/>
			{!isFilterMargin && hasLowLiquidity && (
				<Switch
					id="show-low-liquidity"
					secondary
					label={formatMessage(commonMessages.low_liquidity_short)}
					checked={filter.lowLiquidity}
					className={cn(styles.tickers_filter_switch, filter.lowLiquidity && styles.checked)}
					onChange={handleLowLiquidityChange}
				/>
			)}
		</div>
	);
};

export default observer(TickersFilter);
