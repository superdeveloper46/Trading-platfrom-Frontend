import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Button, { ButtonsGroup } from "components/UI/Button";
import styles from "styles/components/Profile/Referrals/Modals.module.scss";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Modal, { ActionGroup, SuccessScreen } from "components/UI/Modal";
import { getReferralInvite } from "services/ReferralsService";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	inviteId: number;
	deleteReferralInvite: (id: number) => Promise<void>;
}

const DeleteReferralInviteModal: React.FC<Props> = ({
	isOpen,
	onClose,
	inviteId,
	deleteReferralInvite,
}) => {
	const { formatMessage } = useIntl();
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
	const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [inviteCode, setInviteCode] = useState<string>("");

	useEffect(() => {
		setIsDeleteLoading(false);
		setIsSuccessful(false);
		setIsInfoLoading(false);
		setInviteCode("");
	}, [isOpen]);

	const handleDeleteReferralCode = async () => {
		try {
			setIsDeleteLoading(true);
			await deleteReferralInvite(inviteId);
			setIsSuccessful(true);
		} finally {
			setIsDeleteLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			if (isOpen) {
				try {
					setIsInfoLoading(true);
					const invite = await getReferralInvite(inviteId);
					if (invite && invite?.code) {
						setInviteCode(invite.code);
					}
				} finally {
					setIsInfoLoading(false);
				}
			}
		})();
	}, [inviteId, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			iconCode="referral"
			label={formatMessage(referralsMessages.remove_referral_code)}
			onClose={onClose}
		>
			{isInfoLoading ? (
				<LoadingSpinner />
			) : isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(referralsMessages.referral_code_removed)}</span>
				</SuccessScreen>
			) : (
				<>
					<div className={stylesModal.content}>
						<span className={styles.invite_code}>{inviteCode}</span>
						<div className={stylesModal.description}>
							{formatMessage(referralsMessages.remove_referral_code_question)}
						</div>
					</div>
					<div className={stylesModal.footer}>
						<ActionGroup>
							<Button
								onClick={handleDeleteReferralCode}
								isLoading={isDeleteLoading}
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.confirm)}
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

export default DeleteReferralInviteModal;
