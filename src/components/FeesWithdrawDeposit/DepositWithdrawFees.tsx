import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/fees_trading";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/components/Fees.module.scss";
import { IPaymentFee } from "types/fees";
import { usePaymentFees } from "services/FeesService";
import DepositWithdrawFeeRow from "./DepositWithdrawFeeRow";
import { Table, TableData, TableRow } from "../UI/Table";
import { IHeaderColumn } from "../UI/Table/Table";
import NoResultsMessage from "../Table/NoResultsMessage";

const DepositWithdrawFees = () => {
	const { formatMessage } = useIntl();
	const { data: payments_fees, isLoading } = usePaymentFees();

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(messages.deposit_withdraw_currency),
		},
		{
			label: formatMessage(messages.deposit_withdraw_deposit_fee),
			align: "right",
		},
		{
			label: formatMessage(messages.deposit_withdraw_withdraw_fee),
			align: "right",
		},
	];

	return (
		<div className={styles.card_panel}>
			{isLoading || !payments_fees ? (
				<LoadingSpinner />
			) : payments_fees.isPaymentFeesEmpty ? (
				<NoResultsMessage />
			) : (
				<>
					<h5 className={styles.header}>{formatMessage(messages.deposit_withdraw_header)}</h5>
					<Table header={{ columns }}>
						{!!payments_fees.usd.length && (
							<>
								<TableRow active>
									<TableData className={styles.group_title}>USD</TableData>
								</TableRow>
								{payments_fees.usd.map((fee: IPaymentFee, index: number) => (
									<DepositWithdrawFeeRow fee={fee} key={`usd_${index}`} />
								))}
							</>
						)}
						{!!payments_fees.eur.length && (
							<>
								<TableRow active>
									<TableData className={styles.group_title}>EUR</TableData>
								</TableRow>
								{payments_fees.eur.map((fee: IPaymentFee, index: number) => (
									<DepositWithdrawFeeRow fee={fee} key={`eur_${index}`} />
								))}
							</>
						)}
						{!!payments_fees.crypto.length && (
							<>
								<TableRow active>
									<TableData className={styles.group_title}>
										{formatMessage(messages.deposit_withdraw_cryptocurrencies)}
									</TableData>
								</TableRow>
								{payments_fees.crypto.map((fee: IPaymentFee, index: number) => (
									<DepositWithdrawFeeRow fee={fee} key={`crypto_${index}`} />
								))}
							</>
						)}
					</Table>
				</>
			)}
		</div>
	);
};

export default DepositWithdrawFees;
