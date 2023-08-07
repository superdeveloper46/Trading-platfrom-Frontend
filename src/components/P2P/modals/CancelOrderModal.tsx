import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import Textarea from "components/UI/Textarea";
import RadioChoice from "components/UI/Radio";
import P2PService from "services/P2PService";
import { REASON_MAX_SYMBOLS } from "constants/p2p";
import p2pMessages from "messages/p2p";
import commonMessages from "messages/common";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	orderId: number;
	refetch: () => void;
}

enum ReasonsEnum {
	DontWantToTrade = "dont-want-to-trade",
	RequirementProblems = "requirement-problems",
	ExtraFee = "extra-fee",
	UnsuccessfulPayment = "unsuccessful-payment",
	Other = "other",
}

const CancelOrderModal: React.FC<IProps> = ({ onClose, isOpen, orderId, refetch }) => {
	const { formatMessage } = useIntl();

	const [reason, setReason] = useState<ReasonsEnum | "">("");
	const [otherReason, setOtherReason] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const reasons = [
		{
			value: ReasonsEnum.DontWantToTrade,
			label: formatMessage(p2pMessages.do_not_want_to_trade),
		},
		{
			value: ReasonsEnum.RequirementProblems,
			label: formatMessage(p2pMessages.do_not_meet_requirements),
		},
		{
			value: ReasonsEnum.ExtraFee,
			label: formatMessage(p2pMessages.extra_fee),
		},
		{
			value: ReasonsEnum.UnsuccessfulPayment,
			label: formatMessage(p2pMessages.problem_with_sellers_pm),
		},
		{
			value: ReasonsEnum.Other,
			label: formatMessage(p2pMessages.other_reasons),
		},
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { value } = e.target;
		setOtherReason(value);
	};

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setReason(e.target.value as ReasonsEnum);
	};

	const handleSubmit = () => {
		if (reason) {
			setIsLoading(true);
			P2PService.cancelOrder(orderId, {})
				.then(() => {
					refetch();
					onClose();
					toast.success(formatMessage(p2pMessages.cancelled));
				})
				.finally(() => setIsLoading(false));
		}
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.cancel_order)}
		>
			<>
				<Content>
					<Description noMargin>
						<div className={styles.warning_container}>
							<div className={styles.modal_title}>
								<i className="ai ai-error_circle" />
								{formatMessage(p2pMessages.take_note)}
							</div>
							<span>{formatMessage(p2pMessages.already_paid)}</span>
							<span>{formatMessage(p2pMessages.suspended_for_a_day)}</span>
							<span>{formatMessage(p2pMessages.do_not_reply_15_mins)}</span>
						</div>
					</Description>
				</Content>
				<ContentForm>
					{reasons.map(({ label, value }) => (
						<RadioChoice
							key={value}
							onChange={handleRadioChange}
							label={label}
							value={reason}
							name="reason"
							choice={value}
						/>
					))}
					{reason === ReasonsEnum.Other && (
						<Textarea
							placeholder={formatMessage(p2pMessages.type_your_reason)}
							name="other"
							value={otherReason}
							onChange={handleInputChange}
							maxLength={REASON_MAX_SYMBOLS}
							helpText={formatMessage(
								{ ...commonMessages.symbols_remaining },
								{ amount: REASON_MAX_SYMBOLS - otherReason.length },
							)}
						/>
					)}
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							disabled={!reason}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
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

export default CancelOrderModal;
