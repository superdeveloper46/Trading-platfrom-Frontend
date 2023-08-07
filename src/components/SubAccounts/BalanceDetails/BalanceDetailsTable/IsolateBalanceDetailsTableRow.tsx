import React from "react";
import { FormatNumberOptions, useIntl } from "react-intl";
import cn from "classnames";

import { TableData, TableRow } from "components/UI/Table";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import walletsStyles from "styles/pages/Wallets.module.scss";
import styleProps from "utils/styleProps";
import { getColorVariant } from "helpers/global";
import { AccountTypeEnum } from "types/account";
import { IMarginOption } from "models/Finance";
import useMarginLiquidationPrice from "hooks/useMarginLiquidationPrice";
import { IBalance } from "models/Account";
import financeMessages from "messages/finance";
import useMarginLevel from "hooks/useMarginLevel";
import { ACCOUNT_TYPE } from "constants/exchange";
import { IIsolatedSubAccountBalance } from "types/subAccounts";
import { ICrossBalanceExtended, IIsolatedBalanceExtended } from "./BalanceDetailsTable";

interface Props {
	balance: IIsolatedBalanceExtended;
	balancesCross: ICrossBalanceExtended[];
	balancesIsolated: IIsolatedSubAccountBalance[];
	onMarginTransfer: (code: string, pair: string) => void;
	onMarginBorrow: (code: string, pair: string) => void;
	onMarginRepay: (code: string, pair: string) => void;
	marginOptions: IMarginOption[];
}

const IsolateBalanceTableRow: React.FC<Props> = ({
	balance,
	balancesCross,
	balancesIsolated,
	onMarginTransfer,
	onMarginRepay,
	onMarginBorrow,
	marginOptions,
}) => {
	const { formatMessage, formatNumber } = useIntl();

	const balanceBase = balance.paired_balance.is_quoted ? balance : balance.paired_balance;
	const balanceQuote = balance.paired_balance.is_quoted ? balance.paired_balance : balance;
	const availableQuote = balanceQuote ? +balanceQuote.balance - +balanceQuote.reserve : 0;

	const debtBase = balanceBase ? balanceBase?.debt ?? 0 : 0;
	const debtQuote = balanceQuote
		? +(balanceQuote?.borrowed ?? 0) + +(balanceQuote?.interest ?? 0)
		: 0;

	const isolatedMarginOption = marginOptions.find(
		(o: IMarginOption) =>
			o.wallet_type === ACCOUNT_TYPE[AccountTypeEnum.ISOLATED] &&
			o.pair?.symbol === balance.pair?.replace("/", "_"),
	);
	const equityBase = +balance.balance - balance.debt;
	const equityQuote = balanceQuote ? +balanceQuote.balance - debtQuote : 0;
	const equityCurrency = isolatedMarginOption?.equity_currency;
	const valuationEquityBase = equityCurrency?.code ? balance.valuation?.[equityCurrency.code] : 0;
	const valuationEquityQuote = equityCurrency?.code
		? balanceQuote.valuation?.[equityCurrency.code]
		: 0;

	const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
		useGrouping: false,
		minimumFractionDigits: balance.precision ?? 0,
		maximumFractionDigits: balance.precision ?? 8,
	};

	const formatColumnNumber = (value: number) =>
		value > 0 ? formatNumber(value, FORMAT_NUMBER_OPTIONS) : "0.00";

	const marginLevel = balance.pair
		? useMarginLevel(
				equityCurrency?.code ?? "",
				balancesCross as unknown as IBalance[],
				balancesIsolated as unknown as IBalance[],
				AccountTypeEnum.ISOLATED,
				balance.pair.replace("/", "_"),
		  ).marginLevel
		: 999;

	const LiquidationPriceEquityIsolated = () => {
		if (isolatedMarginOption) {
			const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
				isolatedMarginOption,
				AccountTypeEnum.ISOLATED,
				balanceBase as IBalance,
				balanceQuote as IBalance,
				balancesCross as unknown as IBalance[],
				balancesIsolated as unknown as IBalance[],
			);

			return (
				<TableData align="right" width="120px">
					<span className="primary">
						{!Number.isNaN(liquidationPrice) && hasLiquidationPrice && liquidationPrice > 0 ? (
							<>
								{formatNumber(liquidationPrice, {
									useGrouping: false,
									maximumFractionDigits: equityCurrency?.precision ?? 8,
									minimumFractionDigits: equityCurrency?.precision ?? 0,
								})}
								&nbsp;{equityCurrency?.code ?? "--"}
							</>
						) : (
							"--"
						)}
					</span>
				</TableData>
			);
		}

		return (
			<TableData align="right" width="120px">
				<span>--</span>
			</TableData>
		);
	};

	const handleMarginTransfer = (): void => {
		onMarginTransfer(balanceBase.code, balance.pair);
	};

	const handleMarginBorrow = (): void => {
		onMarginBorrow(balanceBase.code, balance.pair);
	};

	const handleMarginRepay = (): void => {
		onMarginRepay(balanceBase.code, balance.pair);
	};

	return (
		<TableRow className={subAccountsStyles.table_row} common>
			<TableData className={walletsStyles.table_data_currency} width="100px">
				<div className={walletsStyles.currency_value}>
					<b>{balance.pair ?? "-"}</b>
				</div>
			</TableData>
			<TableData className={walletsStyles.table_data_currency} width="100px" column>
				<div className={walletsStyles.currency_value}>
					{balanceBase?.image_svg || balanceBase?.image_png ? (
						<img
							src={balanceBase.image_svg || balanceBase.image_png}
							alt={balanceBase.code}
							width="24"
							height="24"
						/>
					) : (
						<i className={`ai ai-${balanceBase?.code?.toLowerCase()}`} />
					)}
					<b>{balanceBase?.code ?? "-"}</b>
				</div>
				<div className={walletsStyles.currency_value}>
					{balanceQuote ? (
						balanceQuote.image_svg || balanceQuote.image_png ? (
							<img
								src={balanceQuote.image_svg || balanceQuote.image_png}
								alt={balanceQuote.code}
								width="24"
								height="24"
							/>
						) : (
							<i className={`ai ai-${balanceQuote.code?.toLowerCase()}`} />
						)
					) : null}
					<b>{balanceQuote?.code ?? "-"}</b>
				</div>
			</TableData>
			<TableData align="right" width="120px" column>
				<span className="primary">
					{balance.available > 0
						? formatNumber(balance.available, {
								useGrouping: false,
								minimumFractionDigits: balanceBase?.precision,
								maximumFractionDigits: balanceBase?.precision,
						  })
						: "0.00"}
				</span>
				<span className="primary">
					{availableQuote > 0
						? formatNumber(availableQuote, {
								useGrouping: false,
								minimumFractionDigits: balanceQuote.precision,
								maximumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"}
				</span>
			</TableData>
			<TableData className={walletsStyles.table_data_reserve} column align="right" width="120px">
				<span className="primary">{formatColumnNumber(balanceBase?.reserve)}</span>
				<span className="primary">
					{(balanceQuote?.reserve ?? 0) > 0
						? formatNumber(+balanceQuote.reserve, {
								useGrouping: false,
								maximumFractionDigits: balanceQuote.precision,
								minimumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"}
				</span>
			</TableData>
			<TableData className={walletsStyles.table_data_reserve} column align="right" width="120px">
				<span className="primary">{formatColumnNumber(debtBase)}</span>
				<span className="primary">
					{debtQuote > 0
						? formatNumber(debtQuote, {
								useGrouping: false,
								maximumFractionDigits: balanceQuote.precision,
								minimumFractionDigits: balanceQuote.precision,
						  })
						: "0.00"}
				</span>
			</TableData>
			<TableData column align="right" width="120px">
				<span className="primary" style={styleProps({ color: getColorVariant(equityBase) })}>
					{formatNumber(equityBase, {
						useGrouping: false,
						minimumFractionDigits: balance.precision ?? 0,
						maximumFractionDigits: balance.precision ?? 8,
					})}
				</span>
				<span className="primary" style={styleProps({ color: getColorVariant(equityQuote) })}>
					{formatNumber(equityQuote, {
						useGrouping: false,
						minimumFractionDigits: balanceQuote.precision ?? 0,
						maximumFractionDigits: balanceQuote.precision ?? 8,
					})}
				</span>
			</TableData>
			<TableData column align="right" width="120px">
				<span className="primary" style={styleProps({ color: getColorVariant(equityBase) })}>
					{valuationEquityBase
						? formatNumber(equityBase * valuationEquityBase, {
								useGrouping: false,
								minimumFractionDigits: equityCurrency?.precision ?? 0,
								maximumFractionDigits: equityCurrency?.precision ?? 8,
						  })
						: "--"}
				</span>
				<span className="primary" style={styleProps({ color: getColorVariant(equityQuote) })}>
					{valuationEquityQuote
						? formatNumber(equityQuote * valuationEquityQuote, {
								useGrouping: false,
								minimumFractionDigits: equityCurrency?.precision ?? 0,
								maximumFractionDigits: equityCurrency?.precision ?? 8,
						  })
						: "--"}
				</span>
			</TableData>
			<LiquidationPriceEquityIsolated />
			<TableData width="120px" align="right">
				{marginLevel > 0
					? formatNumber(marginLevel, {
							useGrouping: false,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
					  })
					: "--"}
			</TableData>
			<TableData align="center" />
			<TableData align="center" width="120px">
				<button
					className={walletsStyles.action_button}
					type="button"
					onClick={handleMarginTransfer}
					data-tip
					data-for="margin-transfer"
				>
					<i className="ai ai-mini_arrow_double" />
					{formatMessage(financeMessages.margin_transfer)}
				</button>
			</TableData>
			<TableData align="center" width="120px">
				<button
					className={walletsStyles.action_button}
					type="button"
					onClick={handleMarginBorrow}
					data-tip
					data-for="margin-borrow"
				>
					<i className="ai ai-mini_arrow_double" />
					{formatMessage(financeMessages.borrow)}
				</button>
			</TableData>
			<TableData align="center" width="120px">
				<button
					className={cn(
						walletsStyles.action_button,
						!(debtQuote > 0 || debtBase > 0) && walletsStyles.disabled,
					)}
					type="button"
					onClick={handleMarginRepay}
					data-tip
					data-for="margin-repay"
				>
					<i className="ai ai-mini_arrow_double" />
					{formatMessage(financeMessages.repay)}
				</button>
			</TableData>
		</TableRow>
	);
};

export default IsolateBalanceTableRow;
