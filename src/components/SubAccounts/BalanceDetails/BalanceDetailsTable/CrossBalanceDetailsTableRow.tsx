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
import { ICrossBalanceExtended, IIsolatedBalanceExtended } from "./BalanceDetailsTable";

interface Props {
	balance: ICrossBalanceExtended;
	crossMarginOption?: IMarginOption;
	balancesCross: ICrossBalanceExtended[];
	balancesIsolated: IIsolatedBalanceExtended[];
	onMarginTransfer: (code: string, pair?: string) => void;
	onMarginBorrow: (code: string, pair?: string) => void;
	onMarginRepay: (code: string, pair?: string) => void;
}

const CrossBalanceTableRow: React.FC<Props> = ({
	balance,
	crossMarginOption,
	balancesCross,
	balancesIsolated,
	onMarginTransfer,
	onMarginRepay,
	onMarginBorrow,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const currentOption = crossMarginOption || null;

	const equityBase = +balance.balance - balance.debt;
	const equityCurrency = currentOption?.equity_currency;
	const valuationEquityBase = equityCurrency?.code ? balance.valuation?.[equityCurrency.code] : 0;

	const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
		useGrouping: false,
		minimumFractionDigits: balance.precision ?? 0,
		maximumFractionDigits: balance.precision ?? 8,
	};

	const formatColumnNumber = (value: number) =>
		value > 0 ? formatNumber(value, FORMAT_NUMBER_OPTIONS) : "0.00";

	const LiquidationPriceEquity = () => {
		if (currentOption) {
			const { liquidationPrice, hasLiquidationPrice } = useMarginLiquidationPrice(
				currentOption,
				AccountTypeEnum.CROSS,
				balance as unknown as IBalance,
				null,
				balancesCross as unknown as IBalance[],
				balancesIsolated as unknown as IBalance[],
			);

			return (
				<TableData align="right" width="120px">
					<span>
						{hasLiquidationPrice && equityCurrency?.code !== balance.code
							? formatNumber(liquidationPrice, {
									useGrouping: false,
									maximumFractionDigits: equityCurrency?.precision ?? 8,
									minimumFractionDigits: equityCurrency?.precision ?? 0,
							  })
							: "--"}
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
		onMarginTransfer(balance.code);
	};

	const handleMarginBorrow = (): void => {
		onMarginBorrow(balance.code);
	};

	const handleMarginRepay = (): void => {
		onMarginRepay(balance.code);
	};

	return (
		<TableRow className={subAccountsStyles.table_row} common>
			<TableData width="150px">
				<div className={walletsStyles.currency_value}>
					{balance.image_svg || balance.image_png ? (
						<img
							src={balance.image_svg || balance.image_png || ""}
							alt={balance.code}
							width="24"
							height="24"
							loading="lazy"
						/>
					) : (
						<i className={`ai ai-${balance.code?.toLowerCase()}`} />
					)}
					<span>
						<b>{balance.code ?? "-"}</b>
						{balance.name}
					</span>
				</div>
			</TableData>
			<TableData align="right" disabled={!balance.balance} width="120px">
				{formatColumnNumber(balance.balance)}
			</TableData>
			<TableData
				className={walletsStyles.table_data_reserve}
				align="right"
				disabled={balance.reserve === 0}
				width="120px"
			>
				{formatColumnNumber(balance.reserve)}
			</TableData>
			<TableData
				className={walletsStyles.table_data_reserve}
				align="right"
				disabled={balance.debt <= 0}
				width="120px"
			>
				{formatColumnNumber(balance.debt)}
			</TableData>
			<TableData
				align="right"
				width="120px"
				styleInline={styleProps({ color: getColorVariant(equityBase) })}
			>
				{formatNumber(equityBase, {
					useGrouping: false,
					minimumFractionDigits: balance.precision ?? 0,
					maximumFractionDigits: balance.precision ?? 8,
				})}
			</TableData>
			<TableData
				align="right"
				width="120px"
				styleInline={styleProps({ color: getColorVariant(equityBase) })}
			>
				{valuationEquityBase
					? formatNumber(equityBase * valuationEquityBase, {
							useGrouping: false,
							minimumFractionDigits: equityCurrency?.precision ?? 0,
							maximumFractionDigits: equityCurrency?.precision ?? 8,
					  })
					: "--"}
			</TableData>
			<LiquidationPriceEquity />
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
					className={cn(walletsStyles.action_button, !(balance.debt > 0) && walletsStyles.disabled)}
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

export default CrossBalanceTableRow;
