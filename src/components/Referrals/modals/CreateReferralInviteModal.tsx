import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import { ICreateReferralInvite, IReferralInfo } from "types/referrals";
import Button, { ButtonsGroup } from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import Input from "components/UI/Input";
import InputRange from "components/UI/InputRange";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Modal, { ActionGroup, SuccessScreen } from "components/UI/Modal";
import styles from "styles/components/Profile/Referrals/Modals.module.scss";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	info: IReferralInfo | null;
	createReferralInvite: (params: ICreateReferralInvite) => Promise<void>;
}

const CreateReferralInviteModal: React.FC<Props> = ({
	isOpen,
	onClose,
	info,
	createReferralInvite,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [isByDefaultChecked, setIsByDefaultChecked] = useState<boolean>(false);
	const [kickbackRate, setKickbackRate] = useState<number>(80);
	const [note, setNote] = useState<string>("");

	useEffect(() => {
		setIsLoading(false);
		setIsSuccessful(false);
		setIsByDefaultChecked(false);
		setKickbackRate(80);
		setNote("");
	}, [isOpen]);

	const createReferralCode = async () => {
		const data: ICreateReferralInvite = {
			label: note,
			kickback_rate: (100 - kickbackRate) / 100,
			is_default: isByDefaultChecked,
		};
		try {
			setIsLoading(true);
			await createReferralInvite(data);
			setIsSuccessful(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeKickbackRate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKickbackRate(Number(e.target.value));
	};

	const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNote(e.target.value);
	};

	const handleChangeIsByDefaultChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsByDefaultChecked(e.target.checked);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && note) {
			createReferralCode();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			iconCode="referral"
			label={formatMessage(referralsMessages.create_referral_code)}
			onClose={onClose}
		>
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(referralsMessages.referral_code_created)}</span>
				</SuccessScreen>
			) : (
				<>
					<div className={stylesModal.info_snack}>
						{formatMessage(referralsMessages.your_referral_bonus_from_the_referrals_trading_fee, {
							percentage: `${formatNumber(Number(info?.tier?.rate ?? "0") * 100, {
								useGrouping: false,
								maximumFractionDigits: 8,
							})}%`,
						})}
					</div>
					<div className={styles.rates}>
						<div className={styles.rate}>
							<span>{formatMessage(referralsMessages.you_receive)}</span>
							<span className={styles.rate_value}>{kickbackRate}%</span>
						</div>
						<div className={styles.rate}>
							<span>{formatMessage(referralsMessages.referral_gets)}</span>
							<span className={styles.rate_value}>{100 - kickbackRate}%</span>
						</div>
					</div>
					<div className={stylesModal.content}>
						<div className={styles.rate_setup_range}>
							<span className={styles.rate_setup_range_label}>
								{formatMessage(referralsMessages.set_commission_rollback_to_referral)}
							</span>
							<InputRange
								min={0}
								max={100}
								value={kickbackRate}
								onChange={handleChangeKickbackRate}
							/>
							<div className={styles.rate_setup_range_boundary}>
								<span>0%</span>
								<span>100%</span>
							</div>
						</div>
						<Input
							value={note}
							labelValue={formatMessage(referralsMessages.note)}
							onChange={handleChangeNote}
							maxLength={30}
							onKeyDown={handleKeyDown}
							textAlign="align_right"
							helpText={formatMessage(commonMessages.symbols_remaining, {
								amount: 30 - note.length,
							})}
						/>
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
					</div>
					<div className={stylesModal.footer}>
						<ActionGroup>
							<Button
								onClick={createReferralCode}
								isLoading={isLoading}
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(referralsMessages.create_referral_code)}
								disabled={!note}
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

export default CreateReferralInviteModal;
