import React from "react";
import { useIntl } from "react-intl";

import messages from "messages/history";
import dayjs from "utils/dayjs";
import styles from "styles/components/FinanceHistory.module.scss";
import { OutlinedBadge } from "components/UI/Badge";
import { IDeposit } from "models/Deposit";
import ButtonMicro from "components/UI/ButtonMicro";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor } from "./DepositRow";
import { DEPOSIT_STATUS } from "./constants";

interface Props {
	deposit: IDeposit;
}

const MobileDepositRow: React.FC<Props> = ({ deposit }) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();

	const handleCopyTxID = () => {
		if (deposit.txid) {
			copyClick(deposit.txid);
		}
	};

	const bColor = badgeColor(deposit.status.id);

	return (
		<div className={styles.inner_container}>
			<div className={styles.outlined_card}>
				<div className={styles.outlined_card_header}>
					<div className={styles.order_direction_wrapper}>
						<OutlinedBadge color={bColor}>{deposit.status.label}</OutlinedBadge>
					</div>
					<div className={styles.order_date_wrapper}>
						{dayjs(deposit.date).format("DD/MM/YYYY")}
					</div>
					<div className={styles.order_time_wrapper}>{dayjs(deposit.date).format("HH:mm:ss")}</div>
				</div>
				<div className={styles.order_content}>
					<div className={styles.order_data}>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.deposits_table_channel)}
							</div>
							&nbsp;
							{deposit.payment_method_name}
						</div>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.orders_table_amount)}
							</div>
							&nbsp;
							{formatNumber(+deposit.amount, {
								maximumFractionDigits: 8,
							})}
							&nbsp;{deposit.currency_id}
						</div>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.trades_table_fee)}
							</div>
							&nbsp;
							{deposit.fee_value}&nbsp;{deposit.currency_id}
						</div>
						<div className={styles.order_data_item} style={{ flexWrap: "nowrap" }}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.deposits_table_transaction)}&nbsp;
							</div>
							<div className={styles.order_data_tx}>
								{deposit.txid_url ? (
									<a target="_blank" rel="noopener noreferrer" href={deposit.txid_url}>
										{deposit.txid}
									</a>
								) : (
									deposit.txid || ""
								)}
								{deposit.txid ? (
									<ButtonMicro onClick={handleCopyTxID} primary>
										<i className="ai ai-copy_new" />
									</ButtonMicro>
								) : null}
							</div>
						</div>
						{deposit.status.id !== DEPOSIT_STATUS.CONFIRMED && deposit.confirmations && (
							<div className={styles.order_data_item}>
								<div className={styles.order_data_item_title}>
									{formatMessage(messages.confirmation_status, {
										confirmations: deposit.confirmations,
										required_confirmations: deposit.required_confirmations,
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobileDepositRow;
