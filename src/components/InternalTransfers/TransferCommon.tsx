import React from "react";
import classnames from "classnames";
import dayjs from "utils/dayjs";
import { useIntl } from "react-intl";

import { IInternalTransferHistory } from "types/internal_transfers";
import styles from "styles/components/InternalTransfers/TransferHistoryTable.module.scss";
import formStyles from "styles/components/InternalTransfers/CreateTransferForm.module.scss";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import commonMessages from "messages/common";
import styleProps from "utils/styleProps";
import { routes } from "constants/routing";
import { getStatusIcon, getStatusLabel, getStatusIconColor } from "./InternalTransfersUtil";

interface IActionContainerProps {
	transfer: IInternalTransferHistory;
	onCancel: (txid: string) => void;
}

export const ActionContainer: React.FC<IActionContainerProps> = ({ transfer, onCancel }) => {
	const { formatMessage } = useIntl();
	const now = Date.now();
	const onCancelClick = () => onCancel(transfer.txid);

	return (
		<div className={styles.actions_container}>
			{transfer.status.key === 10 ? (
				<>
					{transfer.can_accept && !transfer.can_cancel && (
						<InternalLink to={routes.transfers.getAcceptTransfer(transfer.txid)}>
							<Button
								variant="filled"
								color="primary"
								iconAlign="left"
								iconCode="plus_mini"
								mini
								label={formatMessage(commonMessages.accept)}
							/>
						</InternalLink>
					)}
					{!transfer.can_accept && transfer.is_outgoing && (
						<Button
							variant="filled"
							color="quinary"
							mini
							iconCode="cancel_mini"
							iconAlign="left"
							disabled={!transfer.can_cancel}
							onClick={onCancelClick}
							label={formatMessage(commonMessages.cancel)}
						/>
					)}
					{!transfer.can_cancel && dayjs(transfer.valid_till).isBefore(dayjs(now)) && (
						<i className={classnames(styles.status_icon, "ai ai-cancel_filled")} />
					)}
				</>
			) : (
				<div className={styles.status_container}>
					<i
						className={classnames(styles.status_icon, getStatusIcon(transfer.status.key))}
						style={styleProps({ color: getStatusIconColor(transfer.status.key) })}
					/>
					{getStatusLabel(transfer, formatMessage)}
				</div>
			)}
		</div>
	);
};

export interface ICreatedTransferInfoItem {
	title: string | React.ReactNode;
	subtitle: string | React.ReactNode;
	className?: string;
}

export const TransferInfoItem: React.FC<ICreatedTransferInfoItem> = ({
	title,
	subtitle,
	className,
}) => (
	<div className={classnames(formStyles.created_transfer_info_item, className)}>
		<span>{title}</span>
		<span>{subtitle}</span>
	</div>
);
