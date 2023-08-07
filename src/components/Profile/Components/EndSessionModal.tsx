import InfoSnack from "components/InfoSnack";
import Button, { ButtonsGroup } from "components/UI/Button";
import Modal, { Footer, ActionGroup } from "components/UI/Modal";
import SuccessScreen from "components/UI/SuccessScreen";
import accountMessages from "messages/account";
import commonMessages from "messages/common";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import SecurityService from "services/SecurityService";
import errorHandler from "utils/errorHandler";

interface IProps {
	isOpen: boolean;
	onSessionTerminated?(): void;
	onClose(): void;
}

const EndSessionModal: React.FC<IProps> = ({ onClose, onSessionTerminated, isOpen }) => {
	const { formatMessage } = useIntl();
	const [isSuccessful, setSuccessful] = useState<boolean>(false);
	const [isLoading, setLoading] = useState(false);
	const [successText, setSuccessText] = useState<string>("");

	const closeOtherSessions = async (only_web: boolean) => {
		try {
			setLoading(true);
			await SecurityService.closeOtherSession(only_web);
			setSuccessText(
				formatMessage(
					only_web ? accountMessages.all_web_sessions_ended : accountMessages.all_sessions_ended,
				),
			);
			setSuccessful(true);
			onSessionTerminated?.();
		} catch (err) {
			errorHandler(err);
			setSuccessText("");
			setSuccessful(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			iconCode="warning"
			label={formatMessage(accountMessages.end_sessions)}
			onClose={onClose}
			isOpen={isOpen}
		>
			<InfoSnack color="yellow" justify="center" noBorderRadius>
				<span>{formatMessage(accountMessages.sessions_other_than_the_current_one_will_end)}</span>
			</InfoSnack>
			{isSuccessful ? (
				<SuccessScreen>{successText}</SuccessScreen>
			) : (
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							fullWidth
							onClick={() => closeOtherSessions(false)}
							label={formatMessage(accountMessages.end_all_sessions)}
							isLoading={isLoading}
						/>
						<Button
							variant="filled"
							color="primary"
							fullWidth
							iconAlign="left"
							iconCode="web_outlined"
							label={formatMessage(accountMessages.end_only_web_sessions)}
							onClick={() => closeOtherSessions(true)}
							isLoading={isLoading}
						/>
					</ActionGroup>
				</Footer>
			)}
		</Modal>
	);
};

export default EndSessionModal;
