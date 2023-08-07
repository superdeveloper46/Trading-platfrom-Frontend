import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/history";
import dayjs from "utils/dayjs";

import ButtonMicro from "components/UI/ButtonMicro";
import styles from "styles/components/FinanceHistory.module.scss";
import { OutlinedBadge } from "components/UI/Badge";
import { IWithdraw } from "models/Withdrawal";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor } from "./WithdrawRow";

interface Props {
	withdraw: IWithdraw;
	onCancelClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const MobileWithdrawRow: React.FC<Props> = ({ withdraw, onCancelClick }) => {
	const isActive = withdraw.status.id === 10;
	const { formatMessage, formatNumber } = useIntl();
	const bColor = badgeColor(withdraw.status.id);
	const copyClick = useCopyClick();

	const handleCopyTxID = () => {
		if (withdraw.txid) {
			copyClick(withdraw.txid);
		}
	};

	return (
		<div className={styles.inner_container}>
			<div className={styles.outlined_card}>
				<div className={styles.outlined_card_header}>
					<div className={styles.order_direction_wrapper}>
						<OutlinedBadge color={bColor}>{withdraw.status.label}</OutlinedBadge>
					</div>
					<div className={styles.order_date_wrapper}>
						{dayjs(withdraw.date).format("DD/MM/YYYY")}
					</div>
					<div className={styles.order_time_wrapper}>{dayjs(withdraw.date).format("HH:mm:ss")}</div>
					{isActive && (
						<div className={styles.order_action_wrapper}>
							<ButtonMicro data-id={withdraw.id} onClick={onCancelClick}>
								<i className="ai ai-trash_filled" />
							</ButtonMicro>
						</div>
					)}
				</div>
				<div className={styles.order_content}>
					<div className={styles.order_data}>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.deposits_table_channel)}
							</div>
							&nbsp;
							{withdraw.payment_method_name}
						</div>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.orders_table_amount)}
							</div>
							&nbsp;
							{formatNumber(+withdraw.amount, {
								maximumFractionDigits: 8,
							})}
							&nbsp;{withdraw.currency_id}
						</div>
						<div className={styles.order_data_item}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.orders_table_amount)}
							</div>
							&nbsp;
							{withdraw.fee_amount}&nbsp;{withdraw.fee_currency_id}
						</div>
						<div className={styles.order_data_item} style={{ flexWrap: "nowrap" }}>
							<div className={styles.order_data_item_title}>
								{formatMessage(messages.deposits_table_transaction)}&nbsp;
							</div>
							<div className={styles.link_container}>
								{withdraw.txid_url ? (
									<a target="_blank" rel="noopener noreferrer" href={withdraw.txid_url}>
										{withdraw.txid}
									</a>
								) : (
									withdraw.txid || ""
								)}
								{withdraw.txid ? (
									<ButtonMicro onClick={handleCopyTxID} primary>
										<i className="ai ai-copy_news" />
									</ButtonMicro>
								) : null}
							</div>
						</div>
						{withdraw.attributes &&
							withdraw.attributes.map((attr) => (
								<div className={styles.order_data_item} key={attr.label}>
									<div className={styles.order_data_item_title}>{attr.label}</div>
									&nbsp;
									<span className={styles.attribute_value}>{attr.value}</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobileWithdrawRow;
