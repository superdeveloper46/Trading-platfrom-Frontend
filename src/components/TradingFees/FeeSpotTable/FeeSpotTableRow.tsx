import { TableRow, TableData } from "components/UI/Table";
import React from "react";
import { FormatNumberOptions, useIntl } from "react-intl";
import { ITradingFeesTier } from "types/tradingFees";
import feesMessages from "messages/fees_trading";
import styles from "styles/pages/TradingFees.module.scss";
import classNames from "classnames";

const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
	useGrouping: false,
	minimumFractionDigits: 4,
	maximumFractionDigits: 4,
};
interface IProps {
	tier: ITradingFeesTier;
	isCurrentTier: boolean;
	hasALPFee: boolean;
}

const ActiveTier: React.FC = () => <div className={styles.fee_active_tier} />;

const FeeSpotTableRow: React.FC<IProps> = ({ tier, hasALPFee, isCurrentTier }) => {
	const { formatNumber } = useIntl();
	return hasALPFee ? (
		<TableRow
			className={classNames({
				[styles.fee_table_row_active]: isCurrentTier,
			})}
		>
			{isCurrentTier && <ActiveTier />}
			<TableData width="80px" maxWidth="80px" align="center">
				{tier.name}
			</TableData>
			<TableData width="100px" maxWidth="100px" align="right">
				{`≥ ${tier.min_volume} BTC`}
			</TableData>
			<TableData width="35px" maxWidth="35px" align="center">
				&
			</TableData>
			<TableData width="100px" maxWidth="100px">
				{`≥ ${tier.min_token} ALP`}
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.maker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.taker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.maker_fee_rate ?? 0) * 100 * 0.8, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.taker_fee_rate ?? 0) * 100 * 0.8, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.maker_fee_rate ?? 0) * 100 * 0.64, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData half width="90px" maxWidth="90px">
				{formatNumber((tier.taker_fee_rate ?? 0) * 100 * 0.64, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
		</TableRow>
	) : (
		<TableRow
			className={classNames({
				[styles.fee_table_row_active]: isCurrentTier,
			})}
		>
			{isCurrentTier && <ActiveTier />}
			<TableData width="80px" maxWidth="80px" align="center">
				{tier.name}
			</TableData>
			<TableData width="100px" align="right">
				{`≥ ${tier.min_volume} BTC`}
			</TableData>
			<TableData width="45px" />
			<TableData half width="90px">
				{formatNumber((tier.maker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
			<TableData half width="90px">
				{formatNumber((tier.taker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}%
			</TableData>
		</TableRow>
	);
};

interface IInfoRowProps {
	hasALPFee: boolean;
}

export const InfoRow: React.FC<IInfoRowProps> = ({ hasALPFee }) => {
	const { formatMessage } = useIntl();

	return hasALPFee ? (
		<TableRow>
			<TableData width="80px" maxWidth="80px" />
			<TableData disabled width="100px" maxWidth="100px" align="right">
				{formatMessage(feesMessages.table_days_30)}
			</TableData>
			<TableData disabled width="35px" maxWidth="35px" align="center">
				&
			</TableData>
			<TableData disabled width="100px" maxWidth="100px">
				ALP
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData disabled half width="90px" maxWidth="90px">
				Maker
			</TableData>
			<TableData disabled half width="90px" maxWidth="90px">
				Taker
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData disabled half width="90px" maxWidth="90px">
				Maker
			</TableData>
			<TableData disabled half width="90px" maxWidth="90px">
				Taker
			</TableData>
			<TableData width="45px" maxWidth="45px" />
			<TableData disabled half width="90px" maxWidth="90px">
				Maker
			</TableData>
			<TableData disabled half width="90px" maxWidth="90px">
				Taker
			</TableData>
		</TableRow>
	) : (
		<TableRow>
			<TableData width="80px" maxWidth="80px" />
			<TableData disabled width="100px" align="right">
				{formatMessage(feesMessages.table_days_30)}
			</TableData>
			<TableData width="45px" />
			<TableData disabled half width="90px">
				Maker
			</TableData>
			<TableData disabled half width="90px">
				Taker
			</TableData>
		</TableRow>
	);
};

export default FeeSpotTableRow;
