import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import accountMessages from "messages/account";
import commonMessages from "messages/common";
import Modal, { ActionGroup, Content, Description, Footer } from "components/UI/Modal";
import InfoSnack from "components/InfoSnack";
import Button from "components/UI/Button";
import styles from "styles/pages/SubAccounts/CreateSubApi.module.scss";
import apiStyles from "styles/pages/SubAccounts/ApiManagement.module.scss";
import useCopyClick from "hooks/useCopyClick";

interface Props {
	publicKey: string;
	secretKey: string;
	isOpen: boolean;
	onClose: () => void;
}

const ApiCreatedModal: React.FC<Props> = ({ publicKey, secretKey, onClose, isOpen }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			iconCode="ai ai-change"
			label={formatMessage(accountMessages.subaccount_api_created)}
		>
			<Content>
				<Description noMargin>
					<span>
						{formatMessage(accountMessages.subaccount_api_created_desc, {
							secret_key: formatMessage(accountMessages.subaccount_api_secret_key),
							can_only_see_once: formatMessage(accountMessages.subaccount_api_can_only_see_once),
						})}
					</span>
				</Description>
			</Content>
			<div className={styles.keys_container}>
				<div className={styles.key_container}>
					<span>{formatMessage(accountMessages.subaccount_api_public_key_label)}:</span>
					<div className={styles.key_value}>
						<span>{publicKey}</span>
						<i
							className={cn(apiStyles.copy_btn, apiStyles.modal, "ai ai-copy_new")}
							onClick={() => copyClick(publicKey)}
						/>
					</div>
				</div>
				<div className={styles.key_container}>
					<span>{formatMessage(accountMessages.subaccount_api_secret_key_label)}:</span>
					<div className={styles.key_value}>
						<span>{secretKey}</span>
						<i
							className={cn(apiStyles.copy_btn, apiStyles.modal, "ai ai-copy_new")}
							onClick={() => copyClick(secretKey)}
						/>
					</div>
				</div>
			</div>
			<div className={styles.snack_container}>
				<InfoSnack color="red" align="flex-start" justify="center">
					<i className={cn(styles.snack_icon, "ai ai-warning")} />
					<span>{formatMessage(accountMessages.subaccount_api_key_security_warning)}</span>
				</InfoSnack>
			</div>
			<Footer>
				<ActionGroup noMargin>
					<Button
						variant="filled"
						color="primary"
						onClick={onClose}
						fullWidth
						label={formatMessage(commonMessages.submit)}
					/>
				</ActionGroup>
			</Footer>
		</Modal>
	);
};

export default ApiCreatedModal;
