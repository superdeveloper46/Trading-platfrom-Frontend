import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Input, { Appender } from "components/UI/Input";
import RadioChoice from "components/UI/Radio";
import P2PService from "services/P2PService";
import { queryVars } from "constants/query";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	orderId: number;
	refetch: () => void;
}

enum ReasonsEnum {
	OrderWasCancelledAfterPayment = "order-was-cancelled-after-payment",
	Other = "other",
}

const AppealModal: React.FC<IProps> = ({ onClose, isOpen, orderId, refetch }) => {
	const { formatMessage } = useIntl();

	const [reason, setReason] = useState<ReasonsEnum | "">("");
	const [otherReason, setOtherReason] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const reasons = [
		{
			value: ReasonsEnum.OrderWasCancelledAfterPayment,
			label: formatMessage(p2pMessages.reason_order_cancelled),
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
		if (value.length < 1000) {
			setOtherReason(value);
		}
	};

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setReason(e.target.value as ReasonsEnum);
	};

	const handleSubmit = () => {
		if (reason) {
			setIsLoading(true);
			P2PService.createAppeal({
				[queryVars.deal]: orderId,
				[queryVars.reason]: reason,
				[queryVars.comment]: otherReason,
			})
				.then(() => {
					onClose();
					refetch();
					toast.success(formatMessage(p2pMessages.appeal_sent));
				})
				.finally(() => setIsLoading(false));
		}
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.appeal)}
		>
			<>
				<Content>
					<Description noMargin>
						<div className={styles.warning_container}>
							<div className={styles.modal_title}>
								<i className="ai ai-error_circle" />
								{formatMessage(p2pMessages.negotiations_with_counterparty)}
							</div>
							<span>{formatMessage(p2pMessages.transaction_problem)}</span>
						</div>
					</Description>
					<div className={styles.appeal_container}>
						<div className={styles.modal_title}>{formatMessage(p2pMessages.appeal)}</div>
						<span className={p2pStyles.default_text}>
							{formatMessage(p2pMessages.order_rejected)}
						</span>
					</div>
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
						<Input
							labelValue={formatMessage(p2pMessages.what_is_wrong)}
							name="other"
							value={otherReason}
							appender={<Appender>{otherReason.length}/1000</Appender>}
							onChange={handleInputChange}
						/>
					)}
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
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

export default AppealModal;
