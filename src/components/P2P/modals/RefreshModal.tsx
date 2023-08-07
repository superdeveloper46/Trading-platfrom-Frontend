import React, { useState } from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import CheckBox from "components/UI/CheckBox";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Input, { Appender } from "components/UI/Input";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

const RefreshModal: React.FC<IProps> = ({ onClose, isOpen }) => {
	const { formatMessage } = useIntl();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label="Whoops, something went wrong."
		>
			<>
				<Content>
					<div className={styles.notification_container}>
						<span className={styles.modal_title}>Ad has been updated.</span>
						<span className={p2pStyles.default_text}>Please refresh the ads list.</span>
					</div>
				</Content>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={() => console.log("refresh")}
							isLoading={isLoading}
							fullWidth
							label="Refresh"
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default RefreshModal;
