import Button from "components/UI/Button";
import Input from "components/UI/Input";
import Modal, { ActionGroup, Footer, SuccessScreen } from "components/UI/Modal";
import commonMessages from "messages/common";
import formMessages from "messages/form";
import settingsMessages from "messages/settings";
import { useMst } from "models/Root";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import SecurityService from "services/SecurityService";
import styles from "styles/pages/ProfileSecurity.module.scss";
import errorHandler from "utils/errorHandler";

interface IProps {
	isOpen: boolean;
	onClose(): void;
}

const ChangeUsernameModal: React.FC<IProps> = ({ isOpen, onClose }) => {
	const { formatMessage } = useIntl();
	const {
		account: { profileStatus, loadProfileStatus },
	} = useMst();

	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [isSuccessful, setSuccessful] = useState<boolean>(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value);
		if (!usernameError) return;
		setUsernameError("");
	};

	const submit = async () => {
		if (!validate()) return;
		try {
			setLoading(true);
			await SecurityService.changeUsername(username);
			loadProfileStatus();
			setSuccessful(true);
		} catch (err) {
			errorHandler(err, false);
			setSuccessful(false);
		} finally {
			setLoading(false);
		}
	};

	const validate = () => {
		const valid = !!username.trim();
		if (valid) return true;
		setUsernameError(formatMessage(formMessages.required));
		return false;
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			submit();
		}
	};

	return (
		<Modal
			iconCode="change"
			label={formatMessage(settingsMessages.set_username)}
			onClose={onClose}
			isOpen={isOpen}
		>
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(settingsMessages.chat_name_updated)}</span>
				</SuccessScreen>
			) : (
				<>
					<div className={styles.security_modal_content}>
						<div className={styles.security_modal_description}>
							{formatMessage(
								profileStatus?.username
									? settingsMessages.username_set_desc
									: settingsMessages.username_desc,
							)}
						</div>

						<div className={styles.security_modal_form_content}>
							<Input
								name="username"
								value={username}
								onChange={handleInputChange}
								labelValue={formatMessage(settingsMessages.set_username)}
								error={usernameError}
								onKeyDown={handleInputKeyDown}
							/>
						</div>
					</div>
					<Footer>
						<ActionGroup>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.confirm)}
								onClick={submit}
								isLoading={isLoading}
							/>
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								label={formatMessage(commonMessages.cancel)}
								onClick={onClose}
								disabled={isLoading}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default ChangeUsernameModal;
