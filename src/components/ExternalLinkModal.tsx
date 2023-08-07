import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/common";
import Modal, { ActionGroup } from "components/UI/Modal";
import styles from "styles/components/ExternalLinkModal.module.scss";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	link: string;
}

const ExternalLinkModal: React.FC<IProps> = ({ isOpen, onClose, link }) => {
	const { formatMessage } = useIntl();

	const handleSubmit = () => {
		const nextWindow = window.open(link, "_blank", "noopener,noreferrer");
		if (nextWindow) {
			nextWindow.opener = null;
			nextWindow.focus();
		}
		onClose();
	};

	return (
		<Modal label={formatMessage(messages.external_link_modal)} isOpen={isOpen} onClose={onClose}>
			<div className={stylesModal.info_snack}>
				{formatMessage(messages.external_link_modal_desc)}
			</div>
			<div className={stylesModal.content}>
				<div className={stylesModal.description}>
					{formatMessage(messages.external_link_modal_text_1)}
				</div>
				<div className={styles.external_link}>{link}</div>
			</div>
			<div className={stylesModal.footer}>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={handleSubmit}
						label={formatMessage(messages.external_link_follow)}
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
		</Modal>
	);
};

export default ExternalLinkModal;
