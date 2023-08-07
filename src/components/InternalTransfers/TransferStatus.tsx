import React from "react";
import { IInternalTransferHistory } from "types/internal_transfers";
import styles from "styles/components/InternalTransfers/TransferHistoryTable.module.scss";
import { useIntl } from "react-intl";
import classNames from "classnames";
import styleProps from "utils/styleProps";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import commonMessages from "messages/common";
import { getColor } from "./InternalTransfersUtil";

interface IProps {
	transfer: IInternalTransferHistory;
}

const TransferStatus: React.FC<IProps> = ({ transfer }) => {
	const { formatMessage } = useIntl();
	const { status } = transfer;

	if (status.key === 10) {
		return (
			<i
				className={classNames(styles.new_transfer_icon, "ai ai-shield_transfer")}
				style={styleProps({ "--transfer-color": `${getColor(transfer)}` })}
			/>
		);
	}

	if (transfer.status.key === 30 && transfer.is_outgoing) {
		return (
			<Badge alpha color={BadgeColorEnum.ORANGE}>
				{formatMessage(commonMessages.status_sent)}
			</Badge>
		);
	}

	if (transfer.status.key === 30 && !transfer.is_outgoing) {
		return (
			<Badge alpha color={BadgeColorEnum.GREEN}>
				{formatMessage(commonMessages.status_received)}
			</Badge>
		);
	}

	if (transfer.status.key === 20) {
		return (
			<Badge alpha color={BadgeColorEnum.GREY}>
				{formatMessage(commonMessages.status_canceled)}
			</Badge>
		);
	}

	if (transfer.status.key === 30) {
		return (
			<Badge alpha color={BadgeColorEnum.GREEN}>
				{transfer.status.label}
			</Badge>
		);
	}

	return null;
};

export default TransferStatus;
