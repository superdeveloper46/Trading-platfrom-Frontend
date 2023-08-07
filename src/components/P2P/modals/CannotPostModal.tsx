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

const NotificationModal: React.FC<IProps> = ({ onClose, isOpen }) => {
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
						<span className={styles.modal_title}>You cannot post any Ad now.</span>
						<span className={p2pStyles.default_text}>
							To optimize P2P trading expreience, you need to meet certain conditions to publish an
							advertisement. You can also apply to become a merchant or place an order directly.{" "}
							<InternalLink to="#">Learn more</InternalLink>
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

export default NotificationModal;
