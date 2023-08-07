import React, { useState } from "react";
import { useIntl } from "react-intl";
import securityMessages from "messages/security";
import commonMessages from "messages/common";
import styles from "styles/pages/ProfileSecurity.module.scss";
import { observer } from "mobx-react-lite";
import { IProfileStatus } from "models/Account";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Tooltip from "components/UI/Tooltip";
import { SecuritySettingsListItem } from "./components/SecurityCommon";
import ChangePasswordModal from "./components/ChangePasswordModal";
import ChangeUsernameModal from "./components/ChangeUsernameModal";

interface IProps {
	profileStatus: IProfileStatus;
	isLoading: boolean;
}

export const SecurityAccount: React.FC<IProps> = ({ profileStatus, isLoading }) => {
	const { formatMessage } = useIntl();
	const [passwordModalOpen, setPasswordModalOpen] = useState(false);
	const [usernameModalOpen, setUsernameModalOpen] = useState(false);

	const togglePasswordModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.preventDefault();
		setPasswordModalOpen(!passwordModalOpen);
	};
	const toggleUsernameModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.preventDefault();
		setUsernameModalOpen(!usernameModalOpen);
	};

	return (
		<>
			{passwordModalOpen && (
				<ChangePasswordModal isOpen={passwordModalOpen} onClose={togglePasswordModal} />
			)}
			{usernameModalOpen && (
				<ChangeUsernameModal isOpen={usernameModalOpen} onClose={toggleUsernameModal} />
			)}
			<div className={styles.security_card}>
				<div className={styles.security_card_header}>
					<div className={styles.security_card_title}>
						{formatMessage(securityMessages.sign_in)}
					</div>
					<span className={styles.security_uid}>
						User ID: {isLoading ? <LoadingSpinner /> : profileStatus?.uid ?? ""}
					</span>
				</div>
				<div className={styles.security_list}>
					<SecuritySettingsListItem
						icon="ai ai-mail"
						title={
							<>
								<div className={styles.wrapped_security_list_item}>
									<span>{formatMessage(securityMessages.email_address)}</span>
									<Tooltip
										id="tooltip_email"
										place="top"
										backgroundColor="var(--tooltip-background)"
										hint
										text={formatMessage(securityMessages.email_hint)}
									/>
								</div>
								<span>{isLoading ? <LoadingSpinner /> : profileStatus?.email ?? "--"}</span>
							</>
						}
					/>
					<SecuritySettingsListItem
						icon="ai ai-lock"
						title={<span>{formatMessage(commonMessages.password)}</span>}
						onClick={togglePasswordModal}
					/>
					<SecuritySettingsListItem
						icon="ai ai-avatar"
						title={
							<>
								<span>
									{isLoading ? (
										<LoadingSpinner />
									) : profileStatus ? (
										profileStatus.username ?? profileStatus.email
									) : (
										"--"
									)}
								</span>
								<span>
									{formatMessage(
										securityMessages.this_name_is_displayed_on_the_public_pages_and_chat,
									)}
								</span>
							</>
						}
						onClick={toggleUsernameModal}
					/>
				</div>
			</div>
		</>
	);
};

export default observer(SecurityAccount);
