import React, { useState } from "react";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";
import { useIntl } from "react-intl";
import securityMessages from "messages/security";
import commonMessages from "messages/common";

import errorHandler from "utils/errorHandler";
import { IQrCode } from "types/profileSecurity";
import LoadingSpinner from "components/UI/LoadingSpinner";
import QRCode from "components/UI/QRCode";
import Input from "components/UI/Input";
import Button, { ButtonsGroup } from "components/UI/Button";

interface IProps {
	qrCode?: IQrCode;
	setupCallback: (token: string) => void;
	onSuccess(): void;
	handlePrevClick(): void;
}

const AuthenticatorQrCodeStep: React.FC<IProps> = ({
	qrCode,
	setupCallback,
	handlePrevClick,
	onSuccess,
}) => {
	const { formatMessage } = useIntl();
	const [isLoading, setLoading] = useState(false);
	const [token, setToken] = useState<string>("");

	const onTokenChange = (e: React.ChangeEvent<HTMLInputElement>): void => setToken(e.target.value);

	const handleKeyDown = (e: React.KeyboardEvent) => e.key === "Enter" && submit();

	const submit = async () => {
		try {
			setLoading(true);
			await setupCallback(token);
			onSuccess();
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.content}>
			<div className={styles.title}>{formatMessage(securityMessages.scan_the_qr_code)}</div>
			<div className={styles.subtitle}>
				{formatMessage(securityMessages.disabling_2fa_will_only_be_possible_for_verified_users)}
			</div>
			{isLoading || !qrCode ? (
				<LoadingSpinner verticalMargin="25px" />
			) : (
				<QRCode value={qrCode.otpauth_url} code={qrCode.key} />
			)}
			<div className={styles.form_content}>
				<Input
					name="token"
					value={token}
					onChange={onTokenChange}
					onKeyDown={handleKeyDown}
					labelValue={formatMessage(commonMessages.enter_2fa)}
					type="text"
				/>
				<ButtonsGroup>
					<Button
						variant="filled"
						color="primary"
						label={formatMessage(commonMessages.submit)}
						fullWidth
						disabled={!token}
						isLoading={isLoading}
						onClick={submit}
					/>
					<Button
						variant="text"
						color="primary"
						label={formatMessage(commonMessages.back_btn)}
						fullWidth
						isLoading={isLoading}
						onClick={handlePrevClick}
					/>
				</ButtonsGroup>
			</div>
		</div>
	);
};

export default AuthenticatorQrCodeStep;
