import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";

import { TableData, TableRow } from "components/UI/Table";
import { IDeposit } from "models/Deposit";
import styles from "styles/components/FinanceHistory.module.scss";
import messages from "messages/history";
import { BadgeColorEnum, OutlinedBadge } from "components/UI/Badge";
import ButtonMicro from "components/UI/ButtonMicro";
import useCopyClick from "hooks/useCopyClick";
import { DEPOSIT_STATUS } from "./constants";

interface Props {
	deposit: IDeposit;
}

const DepositRow: React.FC<Props> = ({ deposit }) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const { txid } = deposit;

	const handleCopyTxID = () => {
		if (txid) {
			copyClick(txid);
		}
	};

	const bColor = badgeColor(deposit.status.id);

	return (
		<TableRow>
			<TableData width="85px" dateMode>
				{dayjs(deposit.date).format("DD/MM/YYYY")}&nbsp;
				<span className={styles.table_data_grey_colored}>
					{dayjs(deposit.date).format("HH:mm:ss")}
				</span>
			</TableData>
			<TableData translate="no" width="80px">
				{deposit.payment_method_name}
			</TableData>
			<TableData align="right" width="100px">
				{formatNumber(+deposit.amount, {
					maximumFractionDigits: 8,
				})}
				&nbsp;{deposit.currency_id}
			</TableData>
			<TableData width="100px">
				{+deposit.fee_value === 0 ? (
					"-"
				) : (
					<>
						{deposit.fee_value}&nbsp;{deposit.currency_id}
					</>
				)}
			</TableData>
			<TableData width="300px" minWidth="300px">
				<div className={styles.table_data_tx}>
					{deposit.txid_url ? (
						<a href={deposit.txid_url} target="_blank" rel="noopener noreferrer">
							{txid}
						</a>
					) : (
						<span>{txid || "--"}</span>
					)}
					{txid ? (
						<ButtonMicro onClick={handleCopyTxID} primary>
							<i className="ai ai-copy_new" />
						</ButtonMicro>
					) : null}
				</div>
			</TableData>
			<TableData width="100px">
				<span>{deposit.reject_reason}</span>
			</TableData>
			<TableData width="200px" minWidth="200px" align="center">
				<div className={styles.table_data_status}>
					<OutlinedBadge color={bColor}>{deposit.status.label}</OutlinedBadge>
					{deposit.status.id !== DEPOSIT_STATUS.CONFIRMED && deposit.confirmations !== null && (
						<div className={styles.confirmation_container}>
							{formatMessage(messages.confirmation_status, {
								confirmations: deposit.confirmations,
								required_confirmations: deposit.required_confirmations,
							})}
						</div>
					)}
				</div>
			</TableData>
		</TableRow>
	);
};

export const badgeColor = (status: DEPOSIT_STATUS): BadgeColorEnum => {
	let color: BadgeColorEnum;

	switch (status) {
		case DEPOSIT_STATUS.PENDING:
			color = BadgeColorEnum.BLUE;
			break;
		case DEPOSIT_STATUS.MODERATION:
			color = BadgeColorEnum.ORANGE;
			break;
		case DEPOSIT_STATUS.CONFIRMED:
			color = BadgeColorEnum.GREEN;
			break;
		case DEPOSIT_STATUS.REJECTED:
			color = BadgeColorEnum.RED;
			break;
		default:
			color = BadgeColorEnum.RED;
			break;
	}

	return color;
};

export default DepositRow;
