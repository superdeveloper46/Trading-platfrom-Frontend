import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/history";
import dayjs from "utils/dayjs";
import styles from "styles/components/FinanceHistory.module.scss";
import { TableData, TableRow } from "components/UI/Table";
import ButtonMicro from "components/UI/ButtonMicro";
import cn from "classnames";
import { BadgeBackgroundColorEnum, OutlinedBadge } from "components/UI/Badge";
import { toast } from "react-toastify";
import { WithdrawalStatusesEnum } from "types/withdrawal";
import commonMessages from "messages/common";
import { IWithdraw, IWithdrawAttributes } from "models/Withdrawal";

interface Props {
	withdraw: IWithdraw;
	onCancelClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const WithdrawRow: React.FC<Props> = ({ withdraw, onCancelClick }) => {
	const { formatMessage, formatNumber } = useIntl();
	const { txid } = withdraw;

	const handleCopyTxID = () => {
		if (txid) {
			window.navigator.clipboard.writeText(txid);
			toast(
				<>
					<i className="ai ai-copy_new" />
					{formatMessage(commonMessages.copied)}
				</>,
			);
		}
	};

	const bColor = badgeColor(withdraw.status.id);

	return (
		<TableRow>
			<TableData width="85px">
				{dayjs(withdraw.date).format("DD/MM/YYYY")}&nbsp;
				<span className={styles.table_data_grey_colored}>
					{dayjs(withdraw.date).format("HH:mm")}
				</span>
			</TableData>
			<TableData translate="no" width="80px">
				{withdraw.payment_method_name}
			</TableData>
			<TableData align="right" width="100px">
				{formatNumber(+withdraw.amount, {
					useGrouping: false,
					maximumFractionDigits: 8,
				})}
				&nbsp;{withdraw.currency_id}
			</TableData>
			<TableData width="100px">
				{withdraw.fee_amount}&nbsp;{withdraw.fee_currency_id}
			</TableData>
			<TableData width="300px" minWidth="300px" className={cn(styles.table_data_tx, styles.column)}>
				<div className={styles.table_data_tx}>
					{withdraw.txid_url ? (
						<a href={withdraw.txid_url} target="_blank" rel="noopener noreferrer">
							{txid || "--"}
						</a>
					) : (
						txid || "--"
					)}
					{txid ? (
						<ButtonMicro onClick={handleCopyTxID} primary>
							<i className="ai ai-copy_new" />
						</ButtonMicro>
					) : null}
				</div>
				{withdraw.attributes &&
					withdraw.attributes.map((attr: IWithdrawAttributes) => (
						<p key={attr.label} className={styles.table_data_attribues}>
							<span className="grey-text">{attr.label}:</span>
							<span>{attr.value}</span>
						</p>
					))}
			</TableData>
			<TableData width="120px" align="center">
				<div className={styles.table_data_status}>
					<OutlinedBadge color={bColor}>{withdraw.status.label}</OutlinedBadge>
					{withdraw.comment && (
						<div className={styles.confirmation_container}>
							{formatMessage(messages.withdraw_comment)}&nbsp;{withdraw.comment}
						</div>
					)}
				</div>
			</TableData>
			<TableData width="80px" maxWidth="80px">
				{withdraw.status.id === 10 && (
					<ButtonMicro data-id={withdraw.id} onClick={onCancelClick}>
						<i className="ai ai-cancel_filled" />
					</ButtonMicro>
				)}
			</TableData>
		</TableRow>
	);
};

export default WithdrawRow;

export const badgeColor = (status: WithdrawalStatusesEnum): BadgeBackgroundColorEnum => {
	switch (status) {
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_NEW:
			return BadgeBackgroundColorEnum.BLUE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_CONFIRMED:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_VERIFIED:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_PROCESSING:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_DONE:
			return BadgeBackgroundColorEnum.GREEN;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_REFUSED:
			return BadgeBackgroundColorEnum.RED;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_CANCELLED:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
		default:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
	}
};
