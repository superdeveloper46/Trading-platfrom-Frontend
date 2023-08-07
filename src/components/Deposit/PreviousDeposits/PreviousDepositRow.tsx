import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import dayjs from "utils/dayjs";
import { TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import styles from "styles/components/DepositWithdrawal.module.scss";
import financeMessages from "messages/finance";
import { IDeposit } from "models/Deposit";
import { DepositStatusesEnum } from "types/deposit";
import Tooltip from "components/UI/Tooltip";
import ButtonMicro from "components/UI/ButtonMicro";
import { OutlinedBadge } from "components/UI/Badge";
import useCopyClick from "hooks/useCopyClick";
import { badgeColor } from "./shared";

interface Props {
	deposit: IDeposit;
}

const PreviousDepositRow: React.FC<Props> = React.memo(({ deposit }) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const [txFullIsOpen, setTxFullIsOpen] = useState<boolean>(false);
	const canceled = deposit.status.id === DepositStatusesEnum.Rejected;

	const handleCopyToClipboard = () => {
		if (deposit.txid) {
			copyClick(
				deposit.txid,
				formatMessage(financeMessages.copied_to_clipboard, {
					label: "TX",
				}),
			);
		}
	};

	const handleClickOuter = useCallback(
		(e: any) => {
			const { target } = e;
			const className = `deposit_${deposit.id}`;
			if (
				!target.className.includes(className) &&
				!target.parentNode.className.includes(className)
			) {
				setTxFullIsOpen(false);
			}
		},
		[deposit],
	);

	const handleClickTx = useCallback(() => {
		if (!canceled && deposit.txid) {
			setTxFullIsOpen(true);
		}
	}, [deposit.txid, canceled]);

	useEffect(() => {
		if (txFullIsOpen) {
			document.addEventListener("click", handleClickOuter);
		} else {
			document.removeEventListener("click", handleClickOuter);
		}
		return () => document.removeEventListener("click", handleClickOuter);
	}, [txFullIsOpen, handleClickOuter]);

	return (
		<TableRowAdvancedContainer className={cn(canceled && styles.canceled)}>
			<TableRow>
				<TableData>
					{dayjs(deposit.date).format("DD/MM/YYYY")}&nbsp;
					<span className={styles.table_data_grey_colored}>
						{dayjs(deposit.date).format("HH:mm")}
					</span>
				</TableData>
				<TableData>
					{`${deposit.currency?.code ?? ""}${
						!!deposit.payment_method_name && `(${deposit.payment_method_name})`
					}`}
				</TableData>
				<TableData>
					{formatNumber(+deposit.amount, {
						maximumFractionDigits: 8,
						useGrouping: false,
					})}
				</TableData>
				<TableData className={cn(styles.table_data_tx, txFullIsOpen && styles.active)}>
					{deposit.txid ? (
						<div className={styles.table_data_tx_val} onClick={handleClickTx}>
							{`${deposit.txid.slice(0, 7)}...${deposit.txid.slice(-5)}`}
							<Tooltip id="txid" place="top" backgroundColor="var(--tooltip-background)">
								{deposit.txid}
							</Tooltip>
						</div>
					) : (
						"-"
					)}
					{txFullIsOpen && (
						<div className={styles.tx_full_container}>
							{deposit.txid_url ? (
								<a href={deposit.txid_url} target="_blank" rel="noopener noreferrer">
									{deposit.txid}
								</a>
							) : (
								deposit.txid
							)}
							<ButtonMicro onClick={handleCopyToClipboard} primary>
								<i className="ai ai-copy_new" />
							</ButtonMicro>
						</div>
					)}
				</TableData>
				<TableData width="100px">
					<span>{deposit.reject_reason}</span>
				</TableData>
				<TableData align="right" maxWidth="150px">
					{deposit.status.id === DepositStatusesEnum.Pending ? (
						<div className={styles.pending_status}>
							<i className="ai ai-clock" />
							{deposit.status.label}
						</div>
					) : (
						<OutlinedBadge color={badgeColor(deposit.status.id)}>
							{deposit.status.label}
						</OutlinedBadge>
					)}
				</TableData>
			</TableRow>
		</TableRowAdvancedContainer>
	);
});

export default PreviousDepositRow;
