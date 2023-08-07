import React, { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import { ISubAccountBalance, IUpdateSubAccountBody } from "types/subAccounts";
import SubAccountsService from "services/SubAccountsService";
import errorHandler from "utils/errorHandler";
import commonMessages from "messages/common";
import subAccountsMessages from "messages/sub_accounts";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Textarea from "components/UI/Textarea";
import Button from "components/UI/Button";

interface IProps {
	balance: ISubAccountBalance;
	isOpen: boolean;
	onClose: () => void;
	refetchBalances: () => void;
}

const MAX_SYMBOLS_COUNT = 40;

const ChangeNoteModal: React.FC<IProps> = ({ balance, isOpen, onClose, refetchBalances }) => {
	const [note, setNote] = useState<string>(balance?.description || "");
	const [noteError, setNoteError] = useState<string>("");

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { formatMessage } = useIntl();

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNote(e.target.value);

		if (noteError) {
			setNoteError("");
		}
	};

	const handleSubmit = async () => {
		const data: IUpdateSubAccountBody = {
			description: note,
		};
		setIsLoading(true);
		SubAccountsService.updateSubAccount(balance?.uid, data)
			.then(() => {
				refetchBalances();
				onClose();
				toast.success(formatMessage(subAccountsMessages.sub_acc_description_updated));
			})
			.catch(errorHandler)
			.finally(() => setIsLoading(false));
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} label={formatMessage(commonMessages.note)}>
			<>
				<Content>
					<Description noMargin>
						<span>{formatMessage(commonMessages.note_description)}</span>
					</Description>
				</Content>
				<ContentForm>
					<Textarea
						value={note}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						name="note"
						helpText={
							MAX_SYMBOLS_COUNT - note.length === 1
								? formatMessage(commonMessages.one_symbol_left)
								: formatMessage(commonMessages.symbols_left, {
										count: MAX_SYMBOLS_COUNT - note.length,
								  })
						}
						maxLength={MAX_SYMBOLS_COUNT}
					/>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(commonMessages.submit)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={onClose}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default ChangeNoteModal;
