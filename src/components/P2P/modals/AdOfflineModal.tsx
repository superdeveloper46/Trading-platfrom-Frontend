import React, { useState } from "react";
import { useIntl } from "react-intl";

import Modal, { ActionGroup, Content, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import styles from "styles/pages/P2P/Modals.module.scss";
import InternalLink from "../../InternalLink";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

const AdOfflineModal: React.FC<IProps> = ({ onClose, isOpen }) => {
	const { formatMessage } = useIntl();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label="Ad is Offline"
		>
			<>
				<Content>
					<div className={styles.notification_container}>
						<span className={p2pStyles.default_text}>
							This Ad is now Offiline. Please choose another Ad.
						</span>
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
							label="Understood"
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default AdOfflineModal;
