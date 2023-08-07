import React, { useState } from "react";
import { useIntl } from "react-intl";

import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import modalStyles from "styles/components/UI/Modal.module.scss";
import styles from "styles/pages/ListingRequest.module.scss";
import Button from "components/UI/Button";
import cn from "classnames";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

const ChangeNoteModal: React.FC<IProps> = ({ isOpen, onClose }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { formatMessage } = useIntl();

	const handleSubmit = async () => {
		setIsLoading(true);
		// SubAccountsService.updateSubAccount(balance?.uid, data)
		// 	.then(() => {
		// 		refetchBalances();
		// 		onClose();
		// 		toast.success(formatMessage(subAccountsMessages.sub_acc_description_updated));
		// 	})
		// 	.catch(errorHandler)
		// 	.finally(() => setIsLoading(false));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} label="Спасибо за заявку">
			<>
				<Content>
					<Description noMargin>
						<span>Мы просмотрим ваше заявление и свяжемся с вами в ближайшее время.</span>
					</Description>
				</Content>
				<ContentForm className={styles.modal_form}>
					<div
						className={cn(
							modalStyles.body1,
							modalStyles.center,
							modalStyles.color_primary,
							styles.modal_text,
						)}
					>
						Если у вас возникли вопросы, вы можете перейти в FAQ или связаться с поддержкой.
					</div>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							fullWidth
							label="Отправить мне копию на email"
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={onClose}
							fullWidth
							label="Завершить"
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default ChangeNoteModal;
