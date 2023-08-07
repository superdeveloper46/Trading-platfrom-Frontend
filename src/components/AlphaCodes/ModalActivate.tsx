import React, { useLayoutEffect, useState } from "react";
import { useIntl } from "react-intl";
import messages from "messages/alpha_codes";
import commonMessages from "messages/common";
import form_messages from "messages/form";
import Button from "components/UI/Button";
import Input from "components/UI/Input";
import { toast } from "react-toastify";
import Modal, { ActionGroup } from "components/UI/Modal";
import { IActivateRequestBody } from "types/alphaCodes";
import AlphaCodesService from "services/AlphaCodesService";
import styles from "styles/components/UI/Modal.module.scss";
import errorHandler from "../../utils/errorHandler";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

interface IErrors {
	code?: string;
}

const ModalActivate: React.FC<Props> = ({ isOpen, onClose }) => {
	const { formatMessage } = useIntl();

	const [body, setBody] = useState<IActivateRequestBody>({ code: "" });
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<IErrors>({});

	useLayoutEffect(() => {
		setErrors({});
		setIsLoading(false);
		setBody({ code: "" });
	}, [isOpen]);

	const handleSubmit = (): void => {
		if (!body.code?.length) {
			setErrors({ code: formatMessage(form_messages.required) });
		} else {
			setIsLoading(true);
			AlphaCodesService.activateCode(body)
				.then(() => {
					toast(formatMessage(messages.alpha_code_activated));
					onClose();
				})
				.catch((err) => {
					errorHandler(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrors({ code: "" });
		setBody({ code: e.target.value });
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<Modal label={formatMessage(messages.button_name)} onClose={onClose} isOpen={isOpen}>
			<div className={styles.content}>
				<div className={styles.description}>{formatMessage(messages.enter_code)}</div>
				<Input
					name="code"
					value={body.code}
					onChange={handleOnChange}
					onKeyDown={handleInputKeyDown}
					labelValue="Alpha-Code"
					error={errors.code}
				/>
			</div>
			<div className={styles.footer}>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={handleSubmit}
						isLoading={isLoading}
						label={formatMessage(messages.button_name)}
					/>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						onClick={onClose}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</ActionGroup>
			</div>
		</Modal>
	);
};

export default ModalActivate;
