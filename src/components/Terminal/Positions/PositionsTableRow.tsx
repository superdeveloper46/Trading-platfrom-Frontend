import Badge from "components/UI/Badge";
import { TableData, TableRow } from "components/UI/Table";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import styles from "styles/pages/Terminal.module.scss";
import useAccountType from "hooks/useAccountType";
import { IBalance } from "models/Account";
import { IMarginOption } from "models/Finance";
import { IPosition } from "models/History";
import { ITicker } from "models/Ticker";
import React from "react";
import { useIntl } from "react-intl";
import { AccountTypeEnum } from "types/account";
import dayjs from "utils/dayjs";
import { ACCOUNT_TYPE } from "constants/exchange";
import { observer } from "mobx-react-lite";

interface Props {
	position: IPosition;
	tickers: ITicker[];
	balancesCross: IBalance[];
	balancesIsolated: IBalance[];
	marginOption: IMarginOption;
}

enum DirectionEnum {
	SHORT = 1,
	LONG = 2,
}

const PositionsTableRow: React.FC<Props> = ({
	position,
	tickers,
	balancesCross,
	balancesIsolated,
	marginOption,
}) => {
	const { formatNumber } = useIntl();
	const type = useAccountType();

	const indexPrice = tickers.find((t) => t.symbol === position.pair?.symbol)?.close ?? 0;
	const pnl = (indexPrice - position.base_price) * position.base_amount;

	const pnlPercentage =
		position.direction === DirectionEnum.SHORT
			? (position.base_price / indexPrice - 1) * 100
			: (indexPrice / position.base_price - 1) * 100;

	const marginBalances = type === AccountTypeEnum.CROSS ? balancesCross : balancesIsolated;

	const balance = marginBalances.find((b: IBalance) =>
		position.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.CROSS]
			? b.code === position.pair?.base_currency_code
			: b.pair?.replace("/", "_") === position.pair?.symbol,
	);

	const balanceQuote = balancesIsolated.find(
		(b: IBalance) => b.code === position.pair?.quote_currency_code && b.pair === balance?.pair,
	);

	const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
		marginOption,
		type === AccountTypeEnum.CROSS ? AccountTypeEnum.CROSS : AccountTypeEnum.ISOLATED,
		balance,
		balanceQuote,
		balancesCross,
		balancesIsolated,
	);

	// const handleClosePosition = (): void => {
	// 	const order: ICreateOrderBody = {
	// 		type: ORDER_TYPE.market.toString(),
	// 		side: (position.direction === 1 ? ORDER_SIDE.buy : ORDER_SIDE.sell).toString(),
	// 		pair: position.pair?.symbol,
	// 		symbol: position.pair?.symbol,
	// 		amount: Math.abs(position.base_amount).toString(),
	// 		wallet_type: position.wallet_type.toString() ?? undefined,
	// 	};
	// 	dispatch(createOrderAdvanced(api, order)).then(() => {
	// 		dispatch(loadBalancesAll(api));
	// 		dispatch(
	// 			loadPositions(api, {
	// 				wallet_type: position.wallet_type,
	// 				pair: position.wallet_type === ACCOUNT_TYPE.isolated ? position.pair.symbol : undefined,
	// 			}),
	// 		);
	// 		if (position.pair) {
	// 			dispatch(
	// 				loadAccountCurrencyStatus(
	// 					api,
	// 					position.wallet_type,
	// 					position.pair.base_currency_code,
	// 					position.pair.quote_currency_code,
	// 					position.wallet_type === ACCOUNT_TYPE.isolated ? position.pair.symbol : undefined,
	// 				),
	// 			);
	// 		}
	// 	});
	// };

	return (
		<TableRow common className={styles.positions_table_row}>
			<TableData column width="200px">
				{position.opened_at ? dayjs(position.opened_at).utc().format("DD/MM/YYYY") : "--"}
				&nbsp;
				<span className="primary">
					{position.opened_at ? dayjs(position.opened_at).utc().format("HH:mm:ss") : "--"}
				</span>
			</TableData>
			<TableData width="100px">{position.pair.symbol.replace("_", "/") ?? "--"}</TableData>
			<TableData align="center" width="80px">
				<Badge alpha color={position.direction === 1 ? "red" : "green"}>
					{position.direction === DirectionEnum.SHORT ? "short" : "long"}
				</Badge>
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(position.base_price, {
					useGrouping: false,
					maximumFractionDigits: position.pair?.price_precision ?? 8,
					minimumFractionDigits: position.pair?.price_precision ?? 0,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{formatNumber(Math.abs(position.base_amount), {
					useGrouping: false,
					maximumFractionDigits: position.pair?.amount_precision ?? 8,
					minimumFractionDigits: position.pair?.amount_precision ?? 0,
				})}
			</TableData>
			<TableData align="right" width="100px">
				{formatNumber(indexPrice, {
					useGrouping: false,
					maximumFractionDigits: position.pair?.price_precision ?? 8,
					minimumFractionDigits: position.pair?.price_precision ?? 0,
				})}
			</TableData>
			<TableData align="right" width="120px">
				{hasLiquidationPrice
					? formatNumber(liquidationPrice, {
							useGrouping: false,
							maximumFractionDigits: marginOption.equity_currency?.precision ?? 8,
							minimumFractionDigits: marginOption.equity_currency?.precision ?? 0,
					  })
					: "--"}
				&nbsp;{balanceQuote?.code}
			</TableData>
			<TableData align="right" width="100px">
				<Badge alpha color={pnl > 0 ? "green" : "red"}>
					{Number.isNaN(pnl) ? (
						"--"
					) : (
						<>
							{pnl > 0 && "+"}
							{formatNumber(pnl, {
								useGrouping: false,
								maximumFractionDigits: position.pair.price_precision,
								minimumFractionDigits: position.pair.price_precision,
							})}
						</>
					)}
					&nbsp;{position.pair.quote_currency_code}
				</Badge>
			</TableData>
			<TableData width="100px">
				<Badge alpha color={pnlPercentage > 0 ? "green" : "red"}>
					{Number.isNaN(pnlPercentage) ? (
						"--"
					) : (
						<>
							{pnlPercentage > 0 && "+"}
							{formatNumber(pnlPercentage, {
								useGrouping: false,
								maximumFractionDigits: 2,
								minimumFractionDigits: 2,
							})}
						</>
					)}
					%
				</Badge>
			</TableData>
		</TableRow>
	);
};

export default observer(PositionsTableRow);
