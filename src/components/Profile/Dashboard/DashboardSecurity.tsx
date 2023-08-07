import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { IProfileStatus } from "models/Account";
import useWindowSize from "hooks/useWindowSize";
import accountMessages from "messages/account";
import styles from "styles/components/Profile/Dashboard/DashboardSecurity.module.scss";
import Switch from "components/UI/Switch";
import { IInputChange } from "components/UI/Input";
import SecurityService from "services/SecurityService";
import errorHandler from "utils/errorHandler";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader } from "./DashboardCard";
import WhitelistIpModal from "../Security/components/WhitelistIpModal";
import TwoFADisableModal, { IFormBody } from "../Security/components/TwoFADisableModal";

interface IProps {
	profileStatus?: IProfileStatus;
	isProfileLoading: boolean;
	loadProfile(): Promise<void>;
}

const DashboardSecurity: React.FC<IProps> = ({ profileStatus, isProfileLoading, loadProfile }) => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();
	const localeNavigate = useLocaleNavigate();

	const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);
	const [disableOpen, setDisableOpen] = useState(false);

	const [is2FAChecked, set2FAChecked] = useState<boolean>(
		profileStatus?.two_factor_enabled ?? false,
	);
	const [isAntiFishingCodeChecked, setAntiFishingCodeChecked] = useState<boolean>(
		profileStatus?.anti_phishing_code === "1",
	);
	const [isWhiteListIPChecked, setWhiteListIPChecked] = useState<boolean>(
		profileStatus?.use_ip_whitelist ?? false,
	);
	const [isWhiteListWalletsChecked, setIsWhiteListWalletsChecked] = useState<boolean>(
		profileStatus?.address_whitelist_enabled ?? false,
	);

	const [securityLevel, setSecurityLevel] = useState<number>(0);

	useEffect(() => {
		set2FAChecked(profileStatus?.two_factor_enabled ?? false);
		setAntiFishingCodeChecked(profileStatus?.anti_phishing_code === "1");
		setWhiteListIPChecked(profileStatus?.use_ip_whitelist ?? false);
		setSecurityLevel((_) => {
			let level = 0;
			if (profileStatus) {
				if (profileStatus.two_factor_enabled) {
					level++;
					if (profileStatus.verification_level >= 1) {
						level++;
						if (profileStatus.use_ip_whitelist) {
							level++;
						}
					}
				}
			}
			return level;
		});
	}, [isProfileLoading, profileStatus]);

	const onCheck2Fa = (e: IInputChange) => {
		if (is2FAChecked) {
			toggleDisable2Fa();
			return;
		}
		localeNavigate(routes.security.authenticator);
	};

	const onCheckPhishing = (e: IInputChange): void => {
		setAntiFishingCodeChecked(e.target.checked);
		localeNavigate(routes.security.root);
	};

	const onCheckWhiteListIp = (e: IInputChange): void => {
		toggleWhitelistModal();
	};

	const onCheckWallet = (e: IInputChange): void => {
		setIsWhiteListWalletsChecked(e.target.checked);
		localeNavigate(routes.security.root);
	};

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
			<DashboardCard>
				<DashboardCardHeader link={routes.security.root}>
					<div className={styles.card_title}>
						<i className="ai ai-shield_on" />
						{formatMessage(accountMessages.general_security_level)}&nbsp;(
						{securityLevel})
						{mobile && (
							<span style={{ marginLeft: "15px" }}>
								<i className="ai ai-chevron_right" />
							</span>
						)}
					</div>
					<div className={styles.header_shields}>
						{isProfileLoading ? (
							<LoadingSpinner />
						) : (
							[1, 2, 3].map((level: number) => (
								<i
									key={level}
									className={classnames(`ai ai-shield-03`, {
										[styles.active]: securityLevel >= level,
									})}
								/>
							))
						)}
						{!mobile && (
							<span>
								<i className="ai ai-chevron_right" />
							</span>
						)}
					</div>
				</DashboardCardHeader>
				<div className={styles.options}>
					<Option
						id="2fa-switch"
						header={
							<>
								{!is2FAChecked && <i className="ai ai-shield_transfer" />}
								2FA
							</>
						}
						description={formatMessage(accountMessages.protects_your_account_better)}
						checked={is2FAChecked}
						onCheck={onCheck2Fa}
						isLoading={isProfileLoading}
					/>
					<Option
						id="id-confirmation"
						header={formatMessage(accountMessages.antiphishing_code)}
						description={formatMessage(accountMessages.helps_distinguish_fake_emails)}
						checked={isAntiFishingCodeChecked}
						onCheck={onCheckPhishing}
						isLoading={isProfileLoading}
						disabled
					/>
					<Option
						id="white-list-ip"
						header={formatMessage(accountMessages.ip_whitelist)}
						description={formatMessage(accountMessages.allows_access_to_the_platform)}
						checked={isWhiteListIPChecked}
						onCheck={onCheckWhiteListIp}
						isLoading={isProfileLoading}
					/>
					<Option
						id="white-list-wallets"
						header={formatMessage(accountMessages.wallets_whitelist)}
						description={formatMessage(accountMessages.used_to_withdraw_funds)}
						checked={isWhiteListWalletsChecked}
						onCheck={onCheckWallet}
						isLoading={isProfileLoading}
						disabled
					/>
				</div>
			</DashboardCard>
		</>
	);
};

export default DashboardSecurity;

interface IOptionProps {
	id: string;
	header: React.ReactNode | string;
	description: string;
	checked: boolean;
	isLoading?: boolean;
	onCheck(e: IInputChange): void;
	disabled?: boolean;
}

const Option: React.FC<IOptionProps> = ({
	id,
	header,
	description,
	checked,
	isLoading,
	onCheck,
	disabled,
}) => (
	<div
		className={classnames(styles.option, {
			[styles.disabled]: disabled,
		})}
	>
		{isLoading ? (
			<LoadingSpinner />
		) : (
			<>
				<div className={styles.option_header}>
					<span>{header}</span>
					<Switch id={id} checked={checked} onChange={onCheck} disabled={disabled} />
				</div>
				<span className={styles.option_description}>{description}</span>
			</>
		)}
	</div>
);
