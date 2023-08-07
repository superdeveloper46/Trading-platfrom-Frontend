import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import { TableData, TableRow } from "components/UI/Table";
import { IBalance } from "models/Account";
import styles from "styles/pages/Terminal.module.scss";
import { formatNumberNoRounding } from "utils/format";
import InternalLink from "components/InternalLink";
import { AccountTypeEnum } from "types/account";
import { routes } from "constants/routing";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	minimumFractionDigits: 2,
	maximumFractionDigits: 8,
};

interface IProps {
	type: AccountTypeEnum;
	balance: IBalance;
}

const Pair: React.FC<Pick<IProps, "balance">> = ({ balance }) => (
	<>
		{balance.image_svg || balance.image_png ? (
			<img src={(balance.image_svg || balance.image_png) ?? ""} alt={balance.code} />
		) : (
			<i className={`ai ai-${balance.code.toLowerCase()}`} />
		)}
		<div className={cn(styles.wallets_row_value, styles.left)}>
			<b>{balance.pair ?? "-"}</b>
		</div>
	</>
);

const AvailableIsolated: React.FC<Pick<IProps, "balance">> = ({ balance }) => {
	const { formatNumber } = useIntl();
	const balanceBase = balance.paired_balance?.is_quoted ? balance : balance.paired_balance;
	const balanceQuote = balance.paired_balance?.is_quoted ? balance.paired_balance : balance;

	const formatColumnNumber = (value: number) =>
		value > 0 ? formatNumber(value, FORMAT_NUMBER_OPTIONS) : "0.00";

	return (
		<div className={styles.isolated_row}>
			<div className={cn(styles.wallets_row_value)}>
				<div className={styles.wallets_row_currency_primary}>
					{formatColumnNumber(+balanceBase.available)}
					{balanceBase.code && <>&nbsp;{balanceBase.code}</>}
				</div>
				<div className={styles.wallets_row_currency_secondary}>
					{formatColumnNumber(+balanceBase.reserve)}
				</div>
			</div>
			<div className={cn(styles.wallets_row_value)}>
				<div className={styles.wallets_row_currency_primary}>
					{formatColumnNumber(+balanceQuote.available)}
					{balanceQuote.code && <>&nbsp;{balanceQuote.code}</>}
				</div>
				<div className={styles.wallets_row_currency_secondary}>
					{formatColumnNumber(+balanceQuote.reserve)}
				</div>
			</div>
		</div>
	);
};

const WalletsRow: React.FC<IProps> = ({ type, balance }) => {
	const isIsolated = type === AccountTypeEnum.ISOLATED;
	return (
		<TableRow
			className={cn(styles.wallets_row, {
				[styles.isolated_row]: isIsolated,
			})}
		>
			<TableData className={styles.wallets_row_currency}>
				{isIsolated ? (
					<Pair balance={balance} />
				) : (
					<>
						{balance.image_svg || balance.image_png ? (
							<img src={(balance.image_svg || balance.image_png) ?? ""} alt={balance.code} />
						) : (
							<i className={`ai ai-${balance.code.toLowerCase()}`} />
						)}
						<div className={cn(styles.wallets_row_value, styles.left)}>
							<div className={styles.wallets_row_currency_primary}>{balance.code}</div>
							<div className={styles.wallets_row_currency_secondary}>{balance.name}</div>
						</div>
					</>
				)}
			</TableData>
			<TableData align="right" className={styles.wallets_row_num}>
				{isIsolated ? (
					<AvailableIsolated balance={balance} />
				) : (
					<div className={styles.wallets_row_value}>
						<div className={styles.wallets_row_balance}>
							{formatNumberNoRounding(balance.available, balance.precision ?? 8)}
						</div>
						<div className={styles.wallets_row_currency_secondary}>
							{+balance.reserve > 0.00000001
								? formatNumberNoRounding(+balance.reserve, balance.precision ?? 2)
								: 0.0}
						</div>
					</div>
				)}
			</TableData>
			<TableData width="50px" align="right">
				<InternalLink to={routes.profile.getDepositCurrency(balance.code)}>
					<button type="button" className={styles.wallets_row_deposit_btn}>
						<i className="ai ai-plus_mini" />
					</button>
				</InternalLink>
			</TableData>
		</TableRow>
	);
};
export default observer(WalletsRow);
