import React, { useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { Link } from "react-router-dom";
import cn from "classnames";

import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { OutlinedBadge } from "components/UI/Badge";
import { IDeposit } from "models/Deposit";
import ButtonMicro from "components/UI/ButtonMicro";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor } from "./shared";

interface Props {
	deposit: IDeposit;
}

const PreviousDepositRowMobile: React.FC<Props> = ({ deposit }) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleCopyTXIDToClipboard = () => {
		if (deposit.txid) {
			copyClick(
				deposit.txid,
				formatMessage(financeMessages.copied_to_clipboard, {
					label: "TX",
				}),
			);
		}
	};

	const handleExpandClick = () => {
		setIsExpanded((prevState) => !prevState);
	};

	return (
		<div className={cn(styles.card_mobile, isExpanded && styles.expanded)}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_currency}>{deposit.currency?.code}</div>
				<div className={styles.card_mobile_date_time}>
					<span className={styles.card_mobile_date_time_item}>
						{dayjs(deposit.date).format("DD/MM/YYYY")}
					</span>
					<span className={styles.card_mobile_date_time_item}>
						{dayjs(deposit.date).format("HH:mm")}
					</span>
				</div>
				<OutlinedBadge color={badgeColor(deposit.status.id)}>{deposit.status?.label}</OutlinedBadge>
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleExpandClick}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<i className={`ai ai-${deposit.currency?.code?.toLowerCase()}`} />
				<div className={styles.order_data_item}>
					<div className={styles.order_data_item_title}>
						{formatMessage({ ...historyMessages.orders_table_amount })}:
					</div>
					&nbsp;
					<span className={styles.primary_bold}>
						{formatNumber(+deposit.amount, {
							maximumFractionDigits: 8,
							useGrouping: false,
						})}
						&nbsp;
						{deposit.currency?.code}
					</span>
				</div>
			</div>
			{isExpanded && (
				<div className={styles.expanded_content_container}>
					<div className={styles.card_mobile_tx}>
						<div className={styles.order_data_item_title}>Tx:&nbsp;</div>
						{deposit.txid_url ? (
							<Link to={deposit.txid_url} target="_blank" rel="noopener noreferrer">
								{deposit.txid ?? ""}
							</Link>
						) : (
							deposit.txid ?? ""
						)}
						<ButtonMicro onClick={handleCopyTXIDToClipboard} primary>
							<i className="ai ai-copy_new" />
						</ButtonMicro>
					</div>
				</div>
			)}
		</div>
	);
};

export default PreviousDepositRowMobile;
