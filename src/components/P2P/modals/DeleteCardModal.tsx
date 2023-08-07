import React, { useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import Modal, { ActionGroup, Content, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { IRequisites } from "types/p2p";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pMessages from "messages/p2p";
import commonMessages from "messages/common";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	requisite: IRequisites | null;
	refetch: () => void;
}

const LeaveFeedbackModal: React.FC<IProps> = ({ onClose, isOpen, requisite, refetch }) => {
	const { formatMessage } = useIntl();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleDeleteRequisite = async () => {
		setIsLoading(true);

		return P2PService.deletePaymentRequisite(requisite?.id)
			.then(() => {
				toast.success(formatMessage(p2pMessages.payment_deleted));
				refetch();
				onClose();
			})
			.catch(errorHandler)
			.finally(() => setIsLoading(false));
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.delete_pm)}
		>
			<>
				<Content>
					<span className={p2pStyles.default_text}>
						{formatMessage(p2pMessages.are_you_sure_to_delete, {
							value: <strong>{requisite?.payment_method.name}</strong>,
						})}
					</span>
				</Content>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="secondary"
							onClick={handleDeleteRequisite}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(p2pMessages.delete)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={onClose}
							disabled={isLoading}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default LeaveFeedbackModal;
