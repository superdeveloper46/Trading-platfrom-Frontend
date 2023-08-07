import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/components/InternalTransfers/CreateTransfer.module.scss";
import commonMessages from "messages/common";
import internalTransfersMessages from "messages/transfers";
import TransferImg from "assets/images/internal_transfers/transfer.svg";
import Button, { ButtonsGroup } from "components/UI/Button";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

interface IProps {
	isAuthenticated: boolean;
}

const CreateTransfer: React.FC<IProps> = ({ isAuthenticated }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.card}>
			<h1 className={styles.title}>{formatMessage(commonMessages.transfer)}</h1>
			<img src={TransferImg} alt="Transfer" width="189" height="73" />
			<span className={styles.subtitle}>
				{formatMessage(internalTransfersMessages.transfer_desc)}
			</span>
			<ButtonsGroup>
				<InternalLink to={isAuthenticated ? routes.transfers.create : routes.login.root}>
					<Button
						variant="filled"
						color="primary"
						fullWidth
						label={formatMessage(internalTransfersMessages.create_transfer)}
					/>
				</InternalLink>
			</ButtonsGroup>
		</div>
	);
};

export default observer(CreateTransfer);
