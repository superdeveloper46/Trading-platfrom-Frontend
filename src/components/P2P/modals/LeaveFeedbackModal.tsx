import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import cn from "classnames";

import Modal, { ActionGroup, Content, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import Textarea from "components/UI/Textarea";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import styles from "styles/pages/P2P/Modals.module.scss";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import { REASON_MAX_SYMBOLS } from "constants/p2p";
import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";

enum FeedbackMarkEnum {
	Positive = "positive",
	Negative = "negative",
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	refetch: () => void;
	orderId: number;
}

const LeaveFeedbackModal: React.FC<IProps> = ({ onClose, isOpen, refetch, orderId }) => {
	const { formatMessage } = useIntl();

	const [feedbackMark, toggleFeedbackMark] = useState<FeedbackMarkEnum>(FeedbackMarkEnum.Positive);
	const [comment, setComment] = useState("");
	const [isAnonymous, toggleIsAnonymous] = useState(false);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = () => {
		if (comment) {
			setIsLoading(true);
			P2PService.leaveFeedback({
				[queryVars.deal]: orderId,
				[queryVars.text]: comment,
				[queryVars.is_anonymous]: isAnonymous,
				[queryVars.is_positive]: feedbackMark === FeedbackMarkEnum.Positive,
			})
				.then(() => {
					toast.success(formatMessage(p2pMessages.feedback_leaved));
					onClose();
					refetch();
				})
				.catch(errorHandler)
				.finally(() => setIsLoading(false));
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { value } = e.target;
		setComment(value);
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.leave_feedback)}
		>
			<>
				<Content>
					<div
						className={cn(p2pStyles.side_selector, styles.feedback_selector, {
							[p2pStyles.right]: feedbackMark === FeedbackMarkEnum.Negative,
						})}
					>
						<div
							onClick={() => toggleFeedbackMark(FeedbackMarkEnum.Positive)}
							className={p2pStyles.side_button}
						>
							{formatMessage(p2pMessages.positive)}
						</div>
						<div
							onClick={() => toggleFeedbackMark(FeedbackMarkEnum.Negative)}
							className={p2pStyles.side_button}
						>
							{formatMessage(p2pMessages.negative)}
						</div>
					</div>
				</Content>
				<ContentForm>
					<Textarea
						onChange={handleInputChange}
						name="description"
						value={comment}
						labelValue={formatMessage(commonMessages.description)}
						maxLength={REASON_MAX_SYMBOLS}
						helpText={formatMessage(
							{ ...commonMessages.symbols_remaining },
							{ amount: REASON_MAX_SYMBOLS - comment.length },
						)}
					/>
					<CheckBox
						onChange={() => toggleIsAnonymous((prevState) => !prevState)}
						name="anonymous"
						checked={isAnonymous}
					>
						{formatMessage(p2pMessages.anonymous_feedback)}
					</CheckBox>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(p2pMessages.post_feedback)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default LeaveFeedbackModal;
