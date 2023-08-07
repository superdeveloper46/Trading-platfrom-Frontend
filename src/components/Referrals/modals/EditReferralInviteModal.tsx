import React, { ChangeEvent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import CheckBox from "components/UI/CheckBox";
import Input from "components/UI/Input";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IEditReferralInvite } from "types/referrals";
import styles from "styles/components/Profile/Referrals/Modals.module.scss";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Modal, { ActionGroup, SuccessScreen } from "components/UI/Modal";
import Button, { ButtonsGroup } from "components/UI/Button";
import { getReferralInvite } from "services/ReferralsService";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	inviteId: number;
	editReferralInvite: (id: number, params: IEditReferralInvite) => Promise<void>;
}

const EditReferralInviteModal: React.FC<Props> = ({
	isOpen,
	onClose,
	inviteId,
	editReferralInvite,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
	const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const [kickbackRate, setKickbackRate] = useState<number>(0);
	const [inviteCode, setInviteCode] = useState<string>("");
	const [isByDefaultChecked, setIsByDefaultChecked] = useState<boolean>(true);
	const [isByDefault, setIsByDefault] = useState<boolean>(true);
	const [note, setNote] = useState<string>("");

	const editReferralCode = async () => {
		const data: IEditReferralInvite = {
			label: note,
			is_default: isByDefaultChecked,
			kickback_rate: Number(
				formatNumber(Number(kickbackRate) / 100, {
					useGrouping: false,
					maximumFractionDigits: 8,
				}),
			),
		};
		try {
			setIsEditLoading(true);
			await editReferralInvite(inviteId, data);
			setIsSuccessful(true);
		} finally {
			setIsEditLoading(false);
		}
	};

	useEffect(() => {
		setIsEditLoading(false);
		setIsInfoLoading(false);
		setIsSuccessful(false);
		setKickbackRate(0);
		setInviteCode("");
		setIsByDefaultChecked(true);
		setIsByDefault(true);
		setNote("");
	}, [isOpen]);

	useEffect(() => {
		(async () => {
			if (isOpen) {
				try {
					setIsInfoLoading(true);
					const invite = await getReferralInvite(inviteId);
					if (invite) {
						setNote(invite.label);
						setIsByDefaultChecked(invite.is_default);
						setIsByDefault(invite.is_default);
						setInviteCode(invite.code ?? "");
						setKickbackRate(Number(invite.kickback_rate ?? 0));
					}
				} finally {
					setIsInfoLoading(false);
				}
			}
		})();
	}, [inviteId, isOpen]);

	const handleChangeNote = (e: ChangeEvent<HTMLInputElement>) => {
		setNote(e.target.value);
	};

	const handleChangeIsByDefaultChecked = (e: ChangeEvent<HTMLInputElement>) => {
		setIsByDefaultChecked(e.target.checked);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			editReferralCode();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			iconCode="referral"
			label={formatMessage(referralsMessages.edit_the_referral_code)}
			onClose={onClose}
		>
			{isInfoLoading ? (
				<LoadingSpinner />
			) : isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(referralsMessages.referral_code_edited)}</span>
				</SuccessScreen>
			) : (
				<>
					<div className={stylesModal.content}>
						<span className={styles.invite_code}>{inviteCode}</span>
						<Input
							value={note}
							labelValue={formatMessage(referralsMessages.note)}
							onChange={handleChangeNote}
							onKeyDown={handleKeyDown}
							maxLength={30}
							textAlign="align_right"
							helpText={formatMessage(commonMessages.symbols_remaining, {
								amount: 30 - note.length,
							})}
						/>
						{!isByDefault && (
							<div className={styles.checkbox_container}>
								<CheckBox
									onChange={handleChangeIsByDefaultChecked}
									checked={isByDefaultChecked}
									name="Set by default"
									required
								>
									{formatMessage(referralsMessages.set_this_code_by_default)}
								</CheckBox>
							</div>
						)}
					</div>
					<div className={stylesModal.footer}>
						<ActionGroup>
							<Button
								onClick={editReferralCode}
								isLoading={isEditLoading}
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.save)}
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
				</>
			)}
		</Modal>
	);
};

export default EditReferralInviteModal;
