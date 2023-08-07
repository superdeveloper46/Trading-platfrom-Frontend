import React, { useState } from "react";
import { useIntl } from "react-intl";
import cookies from "js-cookie";

import Modal, { ActionGroup, Content, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import styles from "styles/pages/P2P/Modals.module.scss";
import { COOKIE_ACCEPTED, COOKIE_P2P_SCAMMER_ATTENTION } from "constants/p2p";
import p2pMessages from "messages/p2p";
import commonMessages from "messages/common";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

const NotificationModal: React.FC<IProps> = ({ onClose, isOpen }) => {
	const { formatMessage } = useIntl();

	const [isAgreed, toggleAgreed] = useState<boolean>(false);

	const handleSubmit = () => {
		if (isAgreed) {
			cookies.set(COOKIE_P2P_SCAMMER_ATTENTION, COOKIE_ACCEPTED);
			onClose();
		}
	};

	const handleAgree = () => {
		toggleAgreed((prev) => !prev);
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.pay_attention)}
		>
			<>
				<Content>
					<div className={styles.notification_container}>
						<span className={p2pStyles.default_text}>
							{formatMessage(p2pMessages.notification_scam_alert)}
						</span>
					</div>
				</Content>
				<ContentForm>
					<CheckBox name="agree" onChange={handleAgree} checked={isAgreed}>
						{formatMessage(p2pMessages.agree_to_info_above)}
					</CheckBox>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							disabled={!isAgreed}
							onClick={handleSubmit}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default NotificationModal;
