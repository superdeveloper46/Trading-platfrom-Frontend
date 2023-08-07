import React, { useState } from "react";
import { IInternalTransferHistory } from "types/internal_transfers";
import { TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import styles from "styles/components/InternalTransfers/TransferHistoryTable.module.scss";
import dayjs from "utils/dayjs";
import commonMessages from "messages/common";
import styleProps from "utils/styleProps";
import { useIntl } from "react-intl";
import classnames from "classnames";
import Tooltip from "components/UI/Tooltip";
import Badge from "components/UI/Badge";
import TransferStatus from "./TransferStatus";
import { getAmountColor, getColor, getStatusLabel } from "./InternalTransfersUtil";
import { ActionContainer } from "./TransferCommon";

interface IProps {
	transfer: IInternalTransferHistory;
	onCancel: (txid: string) => void;
}

const TransferHistoryTableRow: React.FC<IProps> = ({ transfer, onCancel }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isActive, setActive] = useState(false);
	const [isDescription, setDescription] = useState(false);

	const toggleExpand = () => setActive(!isActive);
	const hideDescription = () => setDescription(false);
	const showDescription = () => setDescription(true);

	return (
		<TableRowAdvancedContainer active={isActive}>
			<TableRow active={isActive} onExpand={toggleExpand} isExpandActive>
				<TableData width="150px">
					{dayjs(transfer.date).format("YYYY-MM-DD")}
					<span className={styles.date_secondary}>{dayjs(transfer.date).format("HH:mm")}</span>
				</TableData>
				<TableData align="center" width="100px">
					<TransferStatus transfer={transfer} />
				</TableData>
				<TableData
					align="right"
					className={styles.amount_data}
					style={styleProps({ "--amount-color": `${getAmountColor(transfer)}` })}
					width="120px"
				>
					{transfer.is_outgoing ? "-" : "+"}
					&nbsp;
					{formatNumber(+transfer.amount, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
				</TableData>
				<TableData currency width="100px">
					{transfer.currency.image_png || transfer.currency.image_svg ? (
						<img
							src={transfer.currency.image_png || transfer.currency.image_svg}
							alt={transfer.currency.code}
							className={styles.currency_icon}
							width="24"
							height="24"
						/>
					) : (
						<i className={`ai ai-${transfer.currency.code.toLowerCase()}`} />
					)}
					{transfer.currency.code}
				</TableData>
				<TableData align="right" width="100px">
					{transfer.is_outgoing ? transfer.receiver.uid : transfer.sender}
				</TableData>
				<TableData onMouseLeave={hideDescription} align="center" width="100px">
					{transfer.message && (
						<div className={styles.reply_block}>
							<i
								className={classnames(styles.reply_icon, "ai ai-reply", {
									[styles.active]: isDescription,
								})}
								onClick={showDescription}
							/>
							{isDescription && (
								<Tooltip
									id="avatar-hint"
									opener={<i className="ai ai-avatar" />}
									text={transfer.message}
								/>
							)}
						</div>
					)}
				</TableData>
				<TableData align="right" width="130px">
					{transfer.txid}
				</TableData>
			</TableRow>
			{isActive && (
				<div className={styles.expand_content_container}>
					<div className={styles.expand_content}>
						<TableData className={styles.icon_expand_data} width="150px">
							<i
								className={classnames(styles.status_icon, "ai ai-lock", {
									[styles.active]: transfer.status.key === 10,
								})}
							/>
							<i
								className={classnames(styles.clock_status_icon, "ai ai-clock")}
								style={styleProps({ "--clock-status-color": `${getColor(transfer)}` })}
							/>
						</TableData>
						<TableData align="center" width="100px">
							{getStatusLabel(transfer, formatMessage)}
						</TableData>
						<TableData className={styles.amount_data} width="120px" />
						<TableData width="100px">{transfer.option?.label?.name ?? "--"}</TableData>
						<TableData className={styles.status_container} width="100px" align="right">
							{transfer.receiver.verified && (
								<Badge color="green" alpha>
									{formatMessage(commonMessages.verified)}
								</Badge>
							)}
						</TableData>
						<TableData align="center" width="100px">
							<span className={styles.transfer_message}>{transfer.message}</span>
						</TableData>
						<TableData align="center" width="130px">
							<ActionContainer transfer={transfer} onCancel={onCancel} />
						</TableData>
						<TableData className={styles.table_data_icon} />
					</div>
				</div>
			)}
		</TableRowAdvancedContainer>
	);
};

export default TransferHistoryTableRow;
