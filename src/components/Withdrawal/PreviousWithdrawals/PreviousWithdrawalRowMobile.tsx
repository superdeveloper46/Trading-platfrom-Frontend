import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import cn from "classnames";

import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import { IWithdraw } from "models/Withdrawal";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { OutlinedBadge } from "components/UI/Badge";
import Button from "components/UI/Button";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import ButtonMicro from "components/UI/ButtonMicro";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor, getWithdrawStatus } from "./shared";

interface Props {
	withdraw: IWithdraw;
	onCancel: (amount: string, currencyCode: string, slug: string) => void;
	locale: string;
}

const PreviousWithdrawalRowMobile: React.FC<Props> = ({ withdraw, onCancel, locale }) => {
	const { formatMessage, formatNumber } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const copyClick = useCopyClick();
	const status = getWithdrawStatus(withdraw.status?.id ?? 0);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleExpandClick = useCallback(() => {
		setIsExpanded((prevState) => !prevState);
	}, []);

	const handleContinueClick = useCallback(() => {
		localeNavigate(routes.confirm.getWithdrawConfirm(withdraw.slug || ""));
	}, [locale, withdraw]);

	const handleCancelClick = useCallback(() => {
		onCancel(withdraw.amount.toString(), withdraw.currency?.code ?? "", withdraw.slug!);
	}, [withdraw, onCancel]);

	const handleCopyToClipboard = () => {
		if (withdraw.txid) {
			copyClick(
				withdraw.txid,
				formatMessage(financeMessages.copied_to_clipboard, {
					label: "TX",
				}),
			);
		}
	};

	const ExpandedContent = () => (
		<div className={styles.expanded_content_container}>
			{withdraw.txid ? (
				<div className={styles.card_mobile_additional_info}>
					<div className={styles.order_data_item_title}>Tx:</div>&nbsp;
					<div className={styles.card_mobile_txid}>
						{withdraw.txid_url ? (
							<a href={withdraw.txid_url} target="_blank" rel="noopener noreferrer">
								{withdraw.txid}
							</a>
						) : (
							withdraw.txid
						)}
						<ButtonMicro onClick={handleCopyToClipboard} primary>
							<i className="ai ai-copy_new" />
						</ButtonMicro>
					</div>
				</div>
			) : null}
			{withdraw.note ? (
				<div className={cn(styles.card_mobile_additional_info, styles.colored)}>
					<i className="ai ai-edit" />
					<span>{withdraw.note}</span>
				</div>
			) : null}
			{status === "moderation" && (
				<div className={styles.card_mobile_additional_info}>
					<i className="ai ai-clock" />
					<span>{formatMessage(financeMessages.withdrawal_was_sent_to_moderation)}</span>
				</div>
			)}
			{status === "active" && (
				<Button
					iconCode="mini_up_right"
					iconAlign="left"
					color="primary"
					onClick={handleContinueClick}
					label={formatMessage(commonMessages.continue)}
					className={styles.continue_button}
				/>
			)}
		</div>
	);

	return (
		<div className={cn(styles.card_mobile, isExpanded && styles.expanded)}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_currency}>{withdraw.currency?.name}</div>
				<div className={styles.card_mobile_date_time}>
					<span className={styles.card_mobile_date_time_item}>
						{dayjs(withdraw.date).format("DD/MM/YYYY")}
					</span>
					<span className={styles.card_mobile_date_time_item}>
						{dayjs(withdraw.date).format("HH:mm")}
					</span>
				</div>
				<OutlinedBadge color={badgeColor(withdraw.status.id)}>
					{withdraw.status.label}
				</OutlinedBadge>
				{status === "active" && withdraw.slug && (
					<div className={styles.card_mobile_action}>
						<ButtonMicro data-id={withdraw.id} onClick={handleCancelClick}>
							<i className="ai ai-trash_filled" />
						</ButtonMicro>
					</div>
				)}
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleExpandClick}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<i className={`ai ai-${withdraw.currency?.code?.toLowerCase()}`} />
				<div className={styles.order_data_item}>
					<div className={styles.order_data_item_title}>
						{formatMessage(historyMessages.deposits_table_channel)}
					</div>
					&nbsp;
					{withdraw.payment_method_name}
				</div>
				<div className={styles.order_data_item}>
					<div className={styles.order_data_item_title}>
						{formatMessage(historyMessages.orders_table_amount)}
					</div>
					&nbsp;
					<span className={styles.primary_bold}>
						{formatNumber(+withdraw.amount, { maximumFractionDigits: 8 })}
						&nbsp;{withdraw.currency?.code}
					</span>
				</div>
				<div className={styles.order_data_item}>
					<div className={styles.order_data_item_title}>
						{formatMessage(historyMessages.trades_table_fee)}
					</div>
					&nbsp;
					{withdraw.fee_amount}&nbsp;{withdraw.fee_currency_id}
				</div>
				{withdraw.attributes
					? withdraw.attributes.map((attr) => (
							<div className={styles.order_data_item} key={attr.label}>
								<div className={styles.order_data_item_title}>{attr.label}</div>:&nbsp;
								<span style={{ wordBreak: "break-all" }}>{attr.value}</span>
							</div>
					  ))
					: null}
			</div>
			{isExpanded && <ExpandedContent />}
		</div>
	);
};

export default PreviousWithdrawalRowMobile;
