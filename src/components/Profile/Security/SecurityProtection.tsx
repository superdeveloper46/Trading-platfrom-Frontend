import { observer } from "mobx-react-lite";
import classnames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import securityMessages from "messages/security";
import accountMessages from "messages/account";
import styles from "styles/pages/ProfileSecurity.module.scss";
import Tooltip from "components/UI/Tooltip";
import errorHandler from "utils/errorHandler";
import SecurityService from "services/SecurityService";
import { IProfileStatus } from "models/Account";
import { routes } from "constants/routing";
import { SecuritySettingsListItem } from "./components/SecurityCommon";
import WhitelistIpModal from "./components/WhitelistIpModal";
import TwoFADisableModal, { IFormBody } from "./components/TwoFADisableModal";

const SecuritySuccess: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={classnames(styles.security_list_item_status, styles.success)}>
			<i className="ai ai-check_filled" />
			{formatMessage(securityMessages.enabled)}
		</div>
	);
};
const SecurityWarning: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={classnames(styles.security_list_item_status, styles.warning)}>
			<i className="ai ai-warning" />
			{formatMessage(securityMessages.disabled)}
		</div>
	);
};

const SecurityDisabled: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={classnames(styles.security_list_item_status, styles.disabled)}>
			<i className="ai ai-info_circle_outline" />
			{formatMessage(securityMessages.unavailable_for_your_account)}
			<Tooltip id="" text={formatMessage(securityMessages.the_feature_will_be_available_soon)} />
		</div>
	);
};

interface IProps {
	profileStatus: IProfileStatus;
	loadProfile(): Promise<void>;
	isLoading: boolean;
}

const SecurityProtection: React.FC<IProps> = ({ profileStatus, loadProfile, isLoading }) => {
	const { formatMessage } = useIntl();
	const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);
	const [disableOpen, setDisableOpen] = useState(false);

	const toggleWhitelistModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.preventDefault();
		setWhitelistModalOpen(!whitelistModalOpen);
	};

	const toggleDisable2Fa = () => setDisableOpen(!disableOpen);

	const disable2Fa = async (formBody: IFormBody) => {
		try {
			await SecurityService.disableTwoFa(formBody.token, formBody.password);
			await loadProfile();
		} catch (err) {
			errorHandler(err);
		}
	};

	return (
		<>
			{whitelistModalOpen && (
				<WhitelistIpModal
					isOpen={whitelistModalOpen}
					onSuccess={loadProfile}
					onClose={toggleWhitelistModal}
					useIpWhitelist={profileStatus?.use_ip_whitelist ?? false}
				/>
			)}
			{disableOpen && (
				<TwoFADisableModal
					isOpen={disableOpen}
					onClose={toggleDisable2Fa}
					disableCallback={disable2Fa}
				/>
			)}
			<div className={styles.security_card}>
				<div className={styles.security_card_header}>
					<div className={styles.security_card_title}>
						{formatMessage(securityMessages.account_security)}
					</div>
				</div>
				<div className={styles.security_list}>
					{profileStatus?.two_factor_enabled ? (
						<SecuritySettingsListItem
							icon="ai ai-2fa"
							title={<span>2FA</span>}
							className={styles.security_list_item_protection}
							onClick={toggleDisable2Fa}
							isLoading={isLoading}
						>
							<SecuritySuccess />
						</SecuritySettingsListItem>
					) : (
						<SecuritySettingsListItem
							icon="ai ai-2fa"
							title={<span>2FA</span>}
							className={styles.security_list_item_protection}
							link={routes.security.authenticator}
							isLoading={isLoading}
						>
							<SecurityWarning />
						</SecuritySettingsListItem>
					)}
					<SecuritySettingsListItem
						icon="ai ai-web_outlined"
						title={<span>{formatMessage(accountMessages.ip_whitelist)}</span>}
						className={styles.security_list_item_protection}
						onClick={toggleWhitelistModal}
						isLoading={isLoading}
					>
						{profileStatus?.use_ip_whitelist ? <SecuritySuccess /> : <SecurityWarning />}
					</SecuritySettingsListItem>
					<SecuritySettingsListItem
						icon="ai ai-wallet-03"
						title={<span>{formatMessage(securityMessages.wallets_white_list)}</span>}
						className={styles.security_list_item_protection}
						isLoading={isLoading}
					>
						<SecurityDisabled />
					</SecuritySettingsListItem>
					<SecuritySettingsListItem
						icon="ai ai-web_outlined"
						title={<span>VIP VPN</span>}
						className={styles.security_list_item_protection}
						isLoading={isLoading}
					>
						<SecurityDisabled />
					</SecuritySettingsListItem>
				</div>
			</div>
		</>
	);
};

export default observer(SecurityProtection);
