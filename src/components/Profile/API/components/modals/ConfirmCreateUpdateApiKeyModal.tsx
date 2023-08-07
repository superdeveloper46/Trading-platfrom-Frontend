import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import Button from "components/UI/Button";
import SecureToken from "components/SecureToken";
import Tooltip from "components/UI/Tooltip";
import commonMessages from "messages/common";
import Modal, { ActionGroup, BodyContainer, Content, Footer } from "components/UI/Modal";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Badge from "components/UI/Badge";
import { IApiKeyRequestDetails } from "types/profile";
import styles from "styles/components/Profile/Api/ConfirmCreateUpdateApiKeyModal.module.scss";
import ButtonMicro from "components/UI/ButtonMicro";
import { useMst } from "models/Root";
import { getApiKeyCreatingDetails, getApiKeyUpdatingDetails } from "services/ApiService";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import InfoSnack from "components/InfoSnack";
import useCopyClick from "hooks/useCopyClick";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	variant: "create" | "update";
	slug: string;
}

const ConfirmCreateUpdateApiKeyModal: React.FC<Props> = ({ isOpen, onClose, slug, variant }) => {
	const { formatMessage } = useIntl();
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [details, setDetails] = useState<IApiKeyRequestDetails | null>(null);
	const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(true);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const { apiKeys } = useMst();
	const copyClick = useCopyClick();

	const handleCopyApiKeyToClipboard = () => {
		if (details?.api_key_created?.key) {
			copyClick(
				details.api_key_created.key,
				formatMessage(commonMessages.copied_to_clipboard, {
					label: "Api Key",
				}),
			);
		}
	};

	const handleCopySecretKeyToClipboard = () => {
		if (details?.api_key_created?.secret) {
			copyClick(
				details.api_key_created.secret,
				formatMessage(commonMessages.copied_to_clipboard, {
					label: "Secret Key",
				}),
			);
		}
	};

	useEffect(() => {
		(async function () {
			try {
				const details = await (variant === "create"
					? getApiKeyCreatingDetails(slug)
					: getApiKeyUpdatingDetails(slug));

				if (details) {
					setDetails(details);
					if (details.is_totp_required && !details.is_totp_ok) {
						setTokenType(SecureTokenTypeEnum.OTPCODE);
					} else if (details.is_pincode_required && !details.is_pincode_ok) {
						setTokenType(SecureTokenTypeEnum.PINCODE);
					}
				}
			} finally {
				setIsDetailsLoading(false);
			}
		})();
	}, []);

	const handleSecureTokenSuccess = (details: ISecureTokenRes): void => {
		apiKeys.getApiKeys();
		setIsSuccessful(true);
		setDetails(details as IApiKeyRequestDetails);
	};

	const getLabel = () => {
		if (isSuccessful) {
			return `API Key ${variant === "create" ? "created" : "updated"}`;
		}

		return "Safety system";
	};

	const getIcon = () => {
		if (isSuccessful) {
			return "info_outlined";
		}

		return "locked";
	};

	return (
		<Modal iconCode={getIcon()} label={getLabel()} onClose={onClose} isOpen={isOpen}>
			{isSuccessful ? (
				<>
					<BodyContainer>
						{variant === "create" && (
							<InfoSnack color="yellow" iconCode="error_circle" justify="center">
								Save the secret key, it only shows up once!
							</InfoSnack>
						)}
						<div className={styles.key_successfully_created}>
							<i className="ai ai-check_outline" />
							<span>
								Your API key has been successfully {variant === "create" ? "created" : "updated"}
								<span>{details?.label}</span>
							</span>
						</div>
						{variant === "create" && (
							<div className={styles.keys_list}>
								<div className={styles.keys_list_item}>
									<span>Key:</span>
									<span>
										{details?.api_key_created?.key}&nbsp;
										<ButtonMicro primary colored onClick={handleCopyApiKeyToClipboard}>
											<i className="ai ai-copy_new" />
										</ButtonMicro>
									</span>
								</div>
								<div className={styles.keys_list_item}>
									<span className={styles.secret}>
										<i className="ai ai-warning" />
										&nbsp;Secret:&nbsp;
										<Tooltip
											hint
											id={`hint_${slug}`}
											text="You can no longer view the secret key as it is displayed once when you add the API."
										/>
									</span>
									<span>
										{details?.api_key_created?.secret}&nbsp;
										<ButtonMicro primary colored onClick={handleCopySecretKeyToClipboard}>
											<i className="ai ai-copy_new" />
										</ButtonMicro>
									</span>
								</div>
							</div>
						)}
						<div className={styles.info_list}>
							<span>Permitted actions:</span>
							<span>
								Read{details?.api_key_created?.can_trade ? ", Trade" : ""}
								{details?.api_key_created?.can_withdraw ? ", Withdraw" : ""}
								{details?.api_key_created?.can_margin ? ", Margin" : ""}
							</span>
							<span>Restrictions IP&apos;s:</span>
							{details?.limit_to_ips?.length ? (
								<div className={styles.badge_list}>
									{details.limit_to_ips.map((ip: string) => (
										<Badge alpha color="violet">
											{ip}
										</Badge>
									))}
								</div>
							) : (
								<span>--</span>
							)}
							<span>Available pairs:</span>
							{details?.api_key?.allowed_symbols?.length ? (
								<div className={styles.badge_list}>
									{details.api_key.allowed_symbols.map((symbol: string) => (
										<Badge key={symbol} alpha color="green">
											{symbol.replace(/_/g, "/")}
										</Badge>
									))}
								</div>
							) : (
								<span>all</span>
							)}
						</div>
					</BodyContainer>
					<Footer>
						<ActionGroup>
							<Button variant="filled" color="primary" onClick={onClose} label="Ok" fullWidth />
						</ActionGroup>
					</Footer>
				</>
			) : isDetailsLoading ? (
				<LoadingSpinner />
			) : details ? (
				<>
					<Content>
						{tokenType ? (
							<SecureToken
								onSuccess={handleSecureTokenSuccess}
								requestUrl={`web/api/${variant}/${slug}/confirm`}
								resendRequestUrl={`web/api/${variant}/${slug}/resend`}
								type={tokenType}
								delay={tokenType === "otpcode" ? details.totp_timeout : details.pincode_timeout}
								shouldAutoFocus
								variant={SecureTokenVariantEnum.SPINNER}
								fullSize
							/>
						) : null}
					</Content>
					<Footer>
						<ActionGroup>
							<Button
								label={formatMessage(commonMessages.cancel)}
								variant="text"
								color="primary"
								fullWidth
								onClick={onClose}
							/>
						</ActionGroup>
					</Footer>
				</>
			) : null}
		</Modal>
	);
};

export default observer(ConfirmCreateUpdateApiKeyModal);
