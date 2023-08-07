import React, { useCallback, useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";

import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import { OutlinedBadge } from "components/UI/Badge";
import { IWithdraw } from "models/Withdrawal";
import styles from "styles/components/DepositWithdrawal.module.scss";
import Button from "components/UI/Button";
import ButtonMicro from "components/UI/ButtonMicro";
import { TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import Tooltip from "components/UI/Tooltip";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor, getWithdrawStatus } from "./shared";

interface Props {
	withdraw: IWithdraw;
	locale: string;
	onCancel: (amount: string, currencyCode: string, slug: string) => void;
}

const PreviousWithdrawalRow: React.FC<Props> = React.memo(({ withdraw, locale, onCancel }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isNoteTooltipVisible, setIsNoteTooltipVisible] = useState<boolean>(false);
	const status = getWithdrawStatus(withdraw.status?.id ?? 0);
	const localeNavigate = useLocaleNavigate();
	const copyClick = useCopyClick();

	const handleCopyTXIDToClipboard = useCallback(() => {
		if (withdraw.txid) {
			copyClick(
				withdraw.txid,
				formatMessage(financeMessages.copied_to_clipboard, {
					label: "TX",
				}),
			);
		}
	}, [withdraw.txid]);

	// const handleCopyAddressToClipboard = useCallback(() => {
	// 	if (withdraw.attributes?.length) {
	// 		copyClick(
	// 			withdraw.attributes[0].value,
	// 			formatMessage(financeMessages.copied_to_clipboard, {
	// 				label: withdraw.attributes[0].label,
	// 			}),
	// 		);
	// 	}
	// }, [withdraw]);

	const handleContinueClick = useCallback(() => {
		localeNavigate(routes.confirm.getWithdrawConfirm(withdraw.slug || ""));
	}, [locale, withdraw]);

	const handleCancelClick = useCallback(() => {
		onCancel(withdraw.amount?.toString(), withdraw.currency?.code ?? "", withdraw.slug!);
	}, [withdraw]);

	const handleExpand = useCallback(() => {
		setIsExpanded((prevState) => !prevState);
	}, []);

	const handleToggleIsNoteTooltipVisible = useCallback(() => {
		setIsNoteTooltipVisible((prevState) => !prevState);
	}, []);

	return (
		<TableRowAdvancedContainer active={isExpanded}>
			<TableRow isExpandActive={isExpanded}>
				<TableData>
					{dayjs(withdraw.date).format("DD/MM/YYYY")}&nbsp;
					<span className={styles.table_data_grey_colored}>
						{dayjs(withdraw.date).format("HH:mm")}
					</span>
				</TableData>
				<TableData>
					{`${withdraw.currency?.code ?? ""}${
						!!withdraw.payment_method_name && ` (${withdraw.payment_method_name})`
					}`}
				</TableData>
				<TableData>
					{formatNumber(+withdraw.amount, {
						useGrouping: false,
						minimumFractionDigits: 8,
						maximumFractionDigits: 8,
					})}
				</TableData>
				<TableData align="center" width="100px" maxWidth="100px">
					{withdraw.note ? (
						<div
							className={cn(styles.note, isNoteTooltipVisible && styles.active)}
							onClick={handleToggleIsNoteTooltipVisible}
						>
							<i className="ai ai-edit" />
							{isNoteTooltipVisible && (
								<Tooltip id="note" place="top" backgroundColor="var(--tooltip-background)">
									{withdraw.note}
								</Tooltip>
							)}
						</div>
					) : null}
				</TableData>
				<TableData align="right" maxWidth="150px">
					<OutlinedBadge color={badgeColor(withdraw.status.id)}>
						{withdraw.status.label}
					</OutlinedBadge>
				</TableData>
				<TableData icon onClick={handleExpand}>
					<ButtonMicro
						className={cn(styles.expand_row_icon_button, {
							[styles.active]: isExpanded,
						})}
					>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</TableData>
			</TableRow>
			{isExpanded && (
				<div className={styles.withdraw_details}>
					{status === "active" && withdraw.slug && (
						<div className={styles.withdraw_details_actions}>
							<Button
								iconAlign="left"
								iconCode="mini_up_right"
								variant="filled"
								color="primary"
								mini
								label={formatMessage(commonMessages.continue)}
								onClick={handleContinueClick}
							/>
							<Button
								variant="text"
								color="primary"
								mini
								label={formatMessage(commonMessages.cancel)}
								onClick={handleCancelClick}
							/>
						</div>
					)}
					{status === "moderation" && (
						<div className={styles.withdraw_details_moderation}>
							<i className="ai ai-clock" />
							{formatMessage(financeMessages.withdrawal_was_sent_to_moderation)}
						</div>
					)}
					{withdraw.txid ? (
						<div className={styles.withdraw_details_txid}>
							<span>TX:</span>
							{withdraw.txid_url ? (
								<a href={withdraw.txid_url} target="_blank" rel="noopener noreferrer">
									{withdraw.txid}
								</a>
							) : (
								withdraw.txid
							)}
							<ButtonMicro onClick={handleCopyTXIDToClipboard} primary>
								<i className="ai ai-copy_new" />
							</ButtonMicro>
						</div>
					) : null}
					{withdraw.note ? (
						<div className={styles.withdraw_details_note}>
							<i className="ai ai-edit" />
							<span>{withdraw.note}</span>
						</div>
					) : null}
				</div>
			)}
		</TableRowAdvancedContainer>
	);
});

export default PreviousWithdrawalRow;
