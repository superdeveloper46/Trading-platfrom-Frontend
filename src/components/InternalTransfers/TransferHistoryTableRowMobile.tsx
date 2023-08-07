import React, { useState } from "react";
import { IInternalTransferHistory } from "types/internal_transfers";
import styles from "styles/components/InternalTransfers/TransferHistoryTable.module.scss";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import classnames from "classnames";
import messages from "messages/common";
import halvingMessages from "messages/halving";
import styleProps from "utils/styleProps";
import TransferStatus from "./TransferStatus";
import { getColor, getDateLabelColor, getStatusLabel } from "./InternalTransfersUtil";
import { ActionContainer } from "./TransferCommon";

interface IProps {
	transfer: IInternalTransferHistory;
	onCancel: (txid: string) => void;
}

const TransferHistoryTableRowMobile: React.FC<IProps> = ({ transfer, onCancel }) => {
	const [isExpanded, setExpanded] = useState<boolean>(transfer.status.key === 10);
	const { formatNumber, formatMessage } = useIntl();

	const now = Date.now();
	const diff = dayjs(transfer.valid_till).diff(dayjs(now), "days", true);
	const onExpandClick = () => setExpanded((prev) => !prev);

	return (
		<div className={styles.mobile_wallet_card}>
			<div className={styles.mobile_outlined_card_header}>
				<div className={styles.mobile_order_direction_wrapper}>
					<div className={styles.mobile_currency_name}>{transfer.currency.code}</div>
				</div>
				<div className={styles.mobile_custom_date_wrapper}>
					{dayjs(transfer.date).format("YYYY-MM-DD")}
				</div>
				<div className={styles.order_time_wrapper}>{dayjs(transfer.date).format("HH:mm")}</div>
				<div
					className={classnames(styles.mobile_expand_block, {
						[styles.expanded]: isExpanded,
					})}
					onClick={onExpandClick}
				>
					<TransferStatus transfer={transfer} />
					<i className="ai ai-arrow_down" />
				</div>
			</div>
			<div className={styles.mobile_transfer_data_block}>
				<div className={styles.mobile_row_content}>
					<div className={classnames(styles.mobile_item, styles.mobile_currency_item)}>
						<i className={`ai ai-${transfer.currency.code.toLowerCase()}`} />
						{transfer.currency.code}
					</div>
					<div className={styles.mobile_transfer_data_content}>
						<MobileRowItemProps
							title={`${formatMessage(messages.amount)}:`}
							value={
								<span>
									&nbsp;
									{transfer.is_outgoing ? "-" : "+"}
									&nbsp;
									<b>
										{formatNumber(+transfer.amount, {
											useGrouping: false,
											maximumFractionDigits: 8,
										})}
									</b>
								</span>
							}
						/>
						<MobileRowItemProps
							title={<>{formatMessage(messages.sender)}&nbsp;User ID:&nbsp;</>}
							value={transfer.sender}
						/>
						<MobileRowItemProps
							title={<>{formatMessage(messages.receiver)}&nbsp;User ID:&nbsp;</>}
							value={transfer.receiver.uid}
						/>
					</div>
				</div>
			</div>
			{isExpanded && (
				<div className={styles.mobile_expand_content}>
					<ActionContainer transfer={transfer} onCancel={onCancel} />
					<div className={styles.mobile_row_content}>
						<div className={styles.mobile_status_img_block}>
							<i
								className={classnames(styles.status_icon, "ai ai-lock", {
									[styles.active]: transfer.status.key === 10,
								})}
							/>
							<i
								className={classnames(styles.clock_status_icon, "ai ai-clock")}
								style={styleProps({ "--clock-status-color": `${getColor(transfer)}` })}
							/>
						</div>
						<div className={styles.mobile_status_info}>
							<div className={styles.mobile_column_status_block}>
								<div className={styles.mobile_transfer_status_label}>
									{getStatusLabel(transfer, formatMessage)}
								</div>
								{transfer.status.key === 10 && (
									<div
										className={styles.expand_date_data_valid_to}
										style={styleProps({
											"--expand-date-color": `${getDateLabelColor(transfer)}`,
										})}
									>
										{Math.ceil(Math.abs(diff))}
										{halvingMessages.days.defaultMessage}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TransferHistoryTableRowMobile;

interface IMobileRowItemProps {
	title: string | React.ReactNode;
	value: string | React.ReactNode;
}

const MobileRowItemProps: React.FC<IMobileRowItemProps> = ({ title, value }) => (
	<div className={styles.mobile_row_item}>
		<div className={styles.order_data_item_title}>{title}</div>
		&nbsp;
		{value}
	</div>
);
