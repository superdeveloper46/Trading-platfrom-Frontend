import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/fees_trading";
import { IPaymentFee } from "types/fees";
import styles from "styles/components/Fees.module.scss";
import { TableData, TableRow } from "components/UI/Table";

const DepositWithdrawFeeRow = ({ fee }: { fee: IPaymentFee }) => {
	const { formatNumber, formatMessage } = useIntl();

	const depositFeeRate = +fee.deposit_fee_rate * 100;
	const depositFeeAmount = +fee.deposit_fee_amount;
	const depositFeeCurrency = fee.currency;

	const withdrawFeeRate = +fee.withdraw_fee_rate * 100;
	const withdrawFeeAmount = +fee.withdraw_fee_amount;
	const withdrawFeeCurrency = fee.withdraw_fee_currency;

	const DepositFee = () => (
		<>
			{depositFeeRate ? (
				<>
					{formatNumber(depositFeeRate, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					%
				</>
			) : null}
			{depositFeeAmount ? (
				<>
					{depositFeeRate ? <>&nbsp;+&nbsp;</> : null}
					{formatNumber(depositFeeAmount, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					&nbsp;
					{depositFeeCurrency}
				</>
			) : null}
		</>
	);

	const WithdrawFee = () => (
		<>
			{withdrawFeeRate ? (
				<>
					{formatNumber(withdrawFeeRate, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					%
				</>
			) : null}
			{withdrawFeeAmount ? (
				<>
					{withdrawFeeRate ? <>&nbsp;+&nbsp;</> : null}
					{formatNumber(withdrawFeeAmount, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					&nbsp;
					{withdrawFeeCurrency}
				</>
			) : null}
		</>
	);

	return (
		<TableRow className={styles.table_row}>
			<TableData column>
				<b>{fee.currency}</b>
				<span>{fee.name}</span>
			</TableData>
			<TableData align="right">
				{depositFeeAmount || depositFeeRate ? <DepositFee /> : formatMessage(messages.free_type)}
			</TableData>
			<TableData align="right">
				{withdrawFeeAmount || withdrawFeeRate ? <WithdrawFee /> : formatMessage(messages.free_type)}
			</TableData>
		</TableRow>
	);
};

export default DepositWithdrawFeeRow;
