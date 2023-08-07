import React, { useState } from "react";
import { useIntl } from "react-intl";

import Modal, {
	ActionGroup,
	Content,
	ContentForm,
	Description,
	Footer,
	SuccessScreen,
} from "components/UI/Modal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import RadioChoice from "components/UI/Radio";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import SecureToken from "components/SecureToken";

enum ReasonsEnum {
	NoPayment = "no-payment",
	ReceivedPayment = "received-payment",
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	orderId: number;
	refetch: () => void;
}

const ConfirmReleaseModal: React.FC<IProps> = ({ onClose, isOpen, orderId, refetch }) => {
	const { formatMessage } = useIntl();

	const [reason, setReason] = useState<ReasonsEnum | "">("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [delayTime, setDelayTime] = useState<string>("");
	const [slug, setSlug] = useState<string>("");

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setReason(e.target.value as ReasonsEnum);
	};

	const releaseChecks = [
		formatMessage(p2pMessages.checking_proof),
		formatMessage(p2pMessages.wait_until_fully),
		formatMessage(p2pMessages.never_accept_3rd_parties),
	];

	const reasons = [
		{
			value: ReasonsEnum.NoPayment,
			label: formatMessage(p2pMessages.i_have_not_receive_payment),
		},
		{
			value: ReasonsEnum.ReceivedPayment,
			label: formatMessage(p2pMessages.i_received_payment),
		},
	];

	const handleSlugChange = (slug: string) => {
		setSlug(slug);
	};

	const handleSecureTokenSuccess = () => {
		setIsSuccessful(true);
	};

	const handleAuthStatusRes = (res: ISecureTokenRes): void => {
		if (res.is_ok) {
			setIsSuccessful(true);
		} else {
			if (res.is_totp_required && !res.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(res.totp_timeout);
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(res.pincode_timeout);
			}
			setSlug(res.slug || "");
		}
	};

	const handleSubmit = () => {
		if (reason === ReasonsEnum.NoPayment) {
			refetch();
			onClose();
		}
		if (reason === ReasonsEnum.ReceivedPayment) {
			setIsLoading(true);
			P2PService.releasePayment({ [queryVars.id]: orderId })
				.then(handleAuthStatusRes)
				.catch(errorHandler)
				.finally(() => setIsLoading(false));
		}
		return null;
	};

	const handleCancelRequest = () => {
		if (slug) {
			P2PService.cancelReleaseRequest(slug).then(() => {
				onClose();
			});
		}
	};

	const handleOnClose = () => {
		onClose();
		if (isSuccessful) {
			refetch();
		}
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={handleOnClose}
			label={formatMessage(p2pMessages.confirm_release)}
		>
			{isSuccessful ? (
				<Content>
					<SuccessScreen>
						<span>{formatMessage(p2pMessages.order_released)}</span>
					</SuccessScreen>
					<ActionGroup>
						<Button
							variant="text"
							color="primary"
							label={formatMessage(commonMessages.ok)}
							onClick={handleOnClose}
							fullWidth
						/>
					</ActionGroup>
				</Content>
			) : tokenType ? (
				<Content>
					<SecureToken
						requestUrl={`web/p2p/deal/approve/${slug}/confirm`}
						resendRequestUrl={`web/p2p/deal/approve/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={handleSlugChange}
						type={tokenType}
						delay={delayTime}
						shouldAutoFocus
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						label={formatMessage(commonMessages.cancel)}
						onClick={handleCancelRequest}
					/>
				</Content>
			) : (
				<>
					<Content>
						<Description noMargin>
							<div className={styles.warning_container}>
								<div className={styles.modal_title}>
									<i className="ai ai-error_circle" />
									{formatMessage(p2pMessages.pay_attention)}
								</div>
								{releaseChecks.map((text, i) => (
									<span key={i}>
										{i + 1}. {text}
									</span>
								))}
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
					</ContentForm>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								onClick={handleSubmit}
								isLoading={isLoading}
								fullWidth
								label={
									reason === ReasonsEnum.ReceivedPayment
										? formatMessage(p2pMessages.confirm_release)
										: formatMessage(p2pMessages.refresh_my_order)
								}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default ConfirmReleaseModal;
