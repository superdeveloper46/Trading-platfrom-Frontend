import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Button from "components/UI/Button";
import modalStyles from "styles/components/UI/Modal.module.scss";
import styles from "styles/components/Profile/Api/DeleteApiKeyModal.module.scss";
import messages from "messages/common";
import cn from "classnames";
import Modal, { ActionGroup, SuccessScreen } from "components/UI/Modal";
import { deleteApiKey } from "services/ApiService";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	label: string;
	slug: string;
}

const DeleteApiKeyModal: React.FC<Props> = ({ isOpen, onClose, slug, label }) => {
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const { apiKeys } = useMst();

	const handleDelete = useCallback(async () => {
		setIsDeleteLoading(true);
		await deleteApiKey(slug);
		await apiKeys.getApiKeys();
		setIsSuccessful(true);
		setIsDeleteLoading(false);
	}, [apiKeys, slug]);

	useEffect(() => {
		setIsSuccessful(false);
	}, [isOpen]);

	return (
		<Modal iconCode="trash" label={label} onClose={onClose} isOpen={isOpen}>
			<div className={modalStyles.header} />
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(messages.label_is_deleted, { label })}</span>
				</SuccessScreen>
			) : (
				<>
					<div className={modalStyles.content}>
						<div className={cn(modalStyles.modal_icon, styles.trash_icon)}>
							<i className="ai ai-trash" />
						</div>
						<div className={cn(modalStyles.title, styles.modal_title)}>
							{formatMessage(messages.you_are_about_to_remove_the_label, { label })}
						</div>
						<div className={modalStyles.description}>
							{formatMessage(messages.are_you_sure_to_remove_the_label, { label })}
						</div>
					</div>
					<div className={modalStyles.footer}>
						<ActionGroup>
							<Button
								onClick={handleDelete}
								isLoading={isDeleteLoading}
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(messages.confirm)}
							/>
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								onClick={onClose}
								label={formatMessage(messages.back_btn)}
							/>
						</ActionGroup>
					</div>
				</>
			)}
		</Modal>
	);
};

export default observer(DeleteApiKeyModal);
