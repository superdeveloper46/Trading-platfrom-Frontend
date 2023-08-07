import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import Modal, { ActionGroup, Content, Footer, SuccessScreen } from "components/UI/Modal";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import errorHandler from "utils/errorHandler";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	label: string;
	onConfirmCallback: () => Promise<void>;
	successCallback?: () => void;
}

const DeleteApiKeyModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onConfirmCallback,
	successCallback,
	label,
}) => {
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const { formatMessage } = useIntl();

	const handleDelete = useCallback(() => {
		setIsDeleteLoading(true);
		onConfirmCallback()
			.then(() => {
				setIsSuccessful(true);
				if (typeof successCallback === "function") {
					successCallback();
				}
			})
			.catch(errorHandler)
			.finally(() => setIsDeleteLoading(false));
	}, [onConfirmCallback]);

	return (
		<Modal label=" " isOpen={isOpen} onClose={onClose}>
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(commonMessages.label_is_deleted, { label })}</span>
				</SuccessScreen>
			) : (
				<>
					<Content>
						<div className={stylesModal.modal_icon}>
							<i style={styleProps({ color: "var(--color-red)" })} className="ai ai-trash" />
						</div>
						<span style={styleProps({ margin: "0 0 10px" })} className={stylesModal.title}>
							{formatMessage(commonMessages.you_are_about_to_remove_the_label, { label })}
						</span>
						<div className={stylesModal.description}>
							{formatMessage(commonMessages.are_you_sure_to_remove_the_label, { label })}
						</div>
					</Content>
					<Footer>
						<ActionGroup>
							<Button
								onClick={handleDelete}
								isLoading={isDeleteLoading}
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.confirm)}
							/>
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								onClick={onClose}
								label={formatMessage(commonMessages.back_btn)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default DeleteApiKeyModal;
