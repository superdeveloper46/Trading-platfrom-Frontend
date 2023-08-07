import React from "react";
import { TableRow, TableData } from "components/UI/Table";
import { useIntl } from "react-intl";
import useAccountType from "hooks/useAccountType";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import { IBalance } from "models/Account";
import { ITicker } from "models/Ticker";
import { IMarginOption } from "models/Finance";
import { AccountTypeEnum } from "types/account";
import styleProps from "utils/styleProps";

export const getValueColor = (value: number): string =>
	value > 0 ? "var(--color-green-light)" : value < 0 ? "var(--color-red)" : "var(--color-primary)";

interface Props {
	balance: IBalance;
	balanceQuote?: IBalance;
	balancesCross: IBalance[];
	balancesIsolated: IBalance[];
	tickers: ITicker[];
	marginOption: IMarginOption;
}

const FundsRow: React.FC<Props> = ({
	balance,
	balanceQuote,
	balancesCross,
	balancesIsolated,
	tickers,
	marginOption,
}) => {
	const { formatNumber } = useIntl();
	const terminalType = useAccountType();

	const equityCurrencyCode = marginOption?.equity_currency?.code ?? "";

	const indexPriceEquityBase =
		tickers.find(
			(t: ITicker) =>
				t.base_currency?.code === balance.code && t.quote_currency?.code === equityCurrencyCode,
		)?.close ?? 0;

	const indexPriceEquityQuote = balanceQuote
		? tickers.find(
				(t: ITicker) =>
					t.base_currency?.code === balanceQuote.code &&
					t.quote_currency?.code === equityCurrencyCode,
		  )?.close ?? 0
		: 0;

	const debtBase = balance.debt;
	const equityBase = +balance.balance - debtBase;

	const debtQuote = balanceQuote
		? +(balanceQuote.borrowed ?? 0) + +(balanceQuote.interest ?? 0)
		: 0;
	const equityQuote = balanceQuote ? +balanceQuote.balance - debtQuote : 0;

	const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
		marginOption,
		terminalType === AccountTypeEnum.CROSS ? AccountTypeEnum.CROSS : AccountTypeEnum.ISOLATED,
		balance,
		balanceQuote,
		balancesCross,
		balancesIsolated,
	);

	const Currency = () => (
		<TableData width="100px">
			{balance.code ? (
				<>
					<i
						className={`ai ai-${balance.code.toLowerCase()}`}
						style={styleProps({ marginRight: "4px" })}
					/>
					&nbsp;
				</>
			) : null}
			{balance.code}
		</TableData>
	);

	const CurrencyIsolated = () => (
		<TableData column width="100px">
			<span className="primary">
				{balance.code ? (
					<>
						<i className={`ai ai-${balance.code.toLowerCase()}`} />
						&nbsp;
					</>
				) : null}
				{balance.code}
			</span>
			<span className="primary">
				{balanceQuote?.code ? (
					<>
						<i className={`ai ai-${balanceQuote.code.toLowerCase()}`} />
						&nbsp;
					</>
				) : null}
				{balanceQuote?.code ?? "--"}
			</span>
		</TableData>
	);

	const Available = () => (
		<TableData align="right" width="120px">
			{formatNumber(balance.available, {
				useGrouping: false,
				minimumFractionDigits: balance.precision ?? 0,
				maximumFractionDigits: balance.precision ?? 8,
			})}
		</TableData>
	);

	const AvailableIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary">
				{formatNumber(balance.available, {
					useGrouping: false,
					minimumFractionDigits: balance.precision ?? 0,
					maximumFractionDigits: balance.precision ?? 8,
				})}
			</span>
			<span className="primary">
				{balanceQuote
					? formatNumber(balanceQuote.available, {
							useGrouping: false,
							minimumFractionDigits: balanceQuote.precision ?? 0,
							maximumFractionDigits: balanceQuote.precision ?? 8,
					  })
					: "_-"}
			</span>
		</TableData>
	);

	const Balance = () => (
		<TableData align="right" width="120px">
			{formatNumber(+balance.balance, {
				useGrouping: false,
				minimumFractionDigits: balance.precision ?? 0,
				maximumFractionDigits: balance.precision ?? 8,
			})}
		</TableData>
	);

	const BalanceIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary">
				{formatNumber(+balance.balance, {
					useGrouping: false,
					minimumFractionDigits: balance.precision ?? 0,
					maximumFractionDigits: balance.precision ?? 8,
				})}
			</span>
			<span className="primary">
				{balanceQuote
					? formatNumber(+balanceQuote.balance, {
							useGrouping: false,
							minimumFractionDigits: balanceQuote.precision ?? 0,
							maximumFractionDigits: balanceQuote.precision ?? 8,
					  })
					: "--"}
			</span>
		</TableData>
	);

	const Debt = () => (
		<TableData align="right" width="120px">
			{formatNumber(debtBase, {
				useGrouping: false,
				minimumFractionDigits: balance.precision ?? 0,
				maximumFractionDigits: balance.precision ?? 8,
			})}
		</TableData>
	);

	const DebtIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary">
				{formatNumber(debtBase, {
					useGrouping: false,
					minimumFractionDigits: balance.precision ?? 0,
					maximumFractionDigits: balance.precision ?? 8,
				})}
			</span>
			<span className="primary">
				{balanceQuote
					? formatNumber(debtQuote, {
							useGrouping: false,
							minimumFractionDigits: balanceQuote.precision ?? 0,
							maximumFractionDigits: balanceQuote.precision ?? 8,
					  })
					: "--"}
			</span>
		</TableData>
	);

	const Position = () => (
		<TableData
			align="right"
			width="120px"
			styleInline={styleProps({ color: getValueColor(equityBase) })}
		>
			{formatNumber(equityBase, {
				useGrouping: false,
				minimumFractionDigits: balance.precision ?? 0,
				maximumFractionDigits: balance.precision ?? 8,
			})}
		</TableData>
	);

	const PositionIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary" style={styleProps({ color: getValueColor(equityBase) })}>
				{formatNumber(equityBase, {
					useGrouping: false,
					minimumFractionDigits: balance.precision ?? 0,
					maximumFractionDigits: balance.precision ?? 8,
				})}
			</span>
			<span className="primary" style={styleProps({ color: getValueColor(equityQuote) })}>
				{balanceQuote
					? formatNumber(equityQuote, {
							useGrouping: false,
							minimumFractionDigits: balanceQuote.precision ?? 0,
							maximumFractionDigits: balanceQuote.precision ?? 8,
					  })
					: "--"}
			</span>
		</TableData>
	);

	const PositionValuation = () => (
		<TableData align="right" width="120px">
			{balance.valuation?.[equityCurrencyCode]
				? formatNumber(equityBase * balance.valuation[equityCurrencyCode], {
						useGrouping: false,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
				  })
				: "--"}
		</TableData>
	);

	const PositionValuationIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary">
				{balance.valuation?.[equityCurrencyCode]
					? formatNumber(equityBase * balance.valuation[equityCurrencyCode], {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  })
					: "--"}
			</span>
			<span className="primary">
				{balanceQuote?.valuation?.[equityCurrencyCode]
					? formatNumber(equityQuote * balanceQuote.valuation[equityCurrencyCode], {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  })
					: "--"}
			</span>
		</TableData>
	);

	const IndexPrice = () => (
		<TableData align="right" width="120px">
			{balance.code === equityCurrencyCode
				? "--"
				: formatNumber(indexPriceEquityBase, {
						useGrouping: false,
						minimumFractionDigits: marginOption.pair?.price_precision ?? 0,
						maximumFractionDigits: marginOption.pair?.price_precision ?? 8,
				  })}
		</TableData>
	);

	const IndexPriceIsolated = () => (
		<TableData column align="right" width="120px">
			<span className="primary">
				{balance.code === equityCurrencyCode
					? "--"
					: formatNumber(indexPriceEquityBase, {
							useGrouping: false,
							minimumFractionDigits: marginOption.pair?.price_precision ?? 0,
							maximumFractionDigits: marginOption.pair?.price_precision ?? 8,
					  })}
			</span>
			<span className="primary">
				{balanceQuote?.code === equityCurrencyCode
					? "--"
					: formatNumber(indexPriceEquityQuote, {
							useGrouping: false,
							minimumFractionDigits: marginOption.pair?.price_precision ?? 0,
							maximumFractionDigits: marginOption.pair?.price_precision ?? 8,
					  })}
			</span>
		</TableData>
	);

	return (
		<TableRow common>
			{balanceQuote ? (
				<>
					<CurrencyIsolated />
					<AvailableIsolated />
					<BalanceIsolated />
					<DebtIsolated />
					<PositionIsolated />
					<PositionValuationIsolated />
					<IndexPriceIsolated />
				</>
			) : (
				<>
					<Currency />
					<Available />
					<Balance />
					<Debt />
					<Position />
					<PositionValuation />
					<IndexPrice />
				</>
			)}
			<TableData align="right" width="120px">
				{!Number.isNaN(liquidationPrice) && hasLiquidationPrice && liquidationPrice > 0 ? (
					<>
						{formatNumber(liquidationPrice, {
							useGrouping: false,
							maximumFractionDigits: marginOption.equity_currency?.precision ?? 2,
							minimumFractionDigits: marginOption.equity_currency?.precision ?? 2,
						})}
						&nbsp;{equityCurrencyCode}
					</>
				) : (
					"--"
				)}
			</TableData>
		</TableRow>
	);
};

export default FundsRow;
