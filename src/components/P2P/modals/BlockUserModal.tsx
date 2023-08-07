import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import commonMessages from "messages/common";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Textarea from "components/UI/Textarea";
import RadioChoice from "components/UI/Radio";
import P2PService from "services/P2PService";
import { queryVars } from "constants/query";
import { IUserDetails } from "types/p2p";
import { REASON_MAX_SYMBOLS } from "constants/p2p";
import p2pMessages from "messages/p2p";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	profile: IUserDetails;
	refetch: () => void;
}

enum ReasonsEnum {
	Harassment = "harassment",
	BadCredibility = "bac-credibility",
	MaliciousFeedback = "malicious-feedback",
	ScamSuspicion = "scam-suspicion",
	Other = "other",
}

const BlockUserModal: React.FC<IProps> = ({ onClose, isOpen, profile, refetch }) => {
	const { formatMessage } = useIntl();

	const [reason, setReason] = useState<ReasonsEnum | "">("");
	const [otherReason, setOtherReason] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { value } = e.target;
		setOtherReason(value);
	};

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setReason(e.target.value as ReasonsEnum);
	};

	const reasons = [
		{
			value: ReasonsEnum.Harassment,
			label: formatMessage(p2pMessages.harassment),
		},
		{
			value: ReasonsEnum.BadCredibility,
			label: formatMessage(p2pMessages.bad_credibility),
		},
		{
			value: ReasonsEnum.MaliciousFeedback,
			label: formatMessage(p2pMessages.malicious_feedback),
		},
		{
			value: ReasonsEnum.ScamSuspicion,
			label: formatMessage(p2pMessages.scam),
		},
		{
			value: ReasonsEnum.Other,
			label: formatMessage(p2pMessages.other_reasons),
		},
	];

	const handleSubmit = () => {
		if (reason) {
			setIsLoading(true);
			P2PService.blockUser({
				target: profile.id,
				is_blocked: true,
				[queryVars.reason]: reason,
				[queryVars.comment]: otherReason,
			})
				.then(() => {
					refetch();
					onClose();
					toast.success(formatMessage(p2pMessages.blocked));
				})
				.finally(() => setIsLoading(false));
		}
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={`${formatMessage(p2pMessages.block)} @${profile.nickname}`}
		>
			<>
				<Content>
					<Description noMargin>
						<span className={p2pStyles.default_text}>
							{formatMessage(p2pMessages.not_able_to_trade)}
						</span>
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
							isLoading={isLoading}
							fullWidth
							label={formatMessage(p2pMessages.block)}
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

export default BlockUserModal;
