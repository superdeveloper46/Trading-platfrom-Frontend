import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import subAccountsMessages from "messages/sub_accounts";
import securityMessages from "messages/security";
import { ISubAccount } from "types/subAccounts";
import useWindowSize from "hooks/useWindowSize";
import SubAccountsService from "services/SubAccountsService";
import { TableData, TableRow } from "components/UI/Table";
import Badge from "components/UI/Badge";
import Switch from "components/UI/Switch";
import styles from "styles/pages/SubAccounts/AccountManagement.module.scss";
import errorHandler from "utils/errorHandler";
import Tooltip from "components/UI/Tooltip";
import InternalLink from "components/InternalLink";
import {
	AssetsManagementModal,
	ChangeEmailModal,
	ChangePasswordModal,
	TradingPermissionsModal,
} from "components/SubAccounts/modals";
import TwoFADisableModal from "components/Profile/Security/components/TwoFADisableModal";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { ITooltipPosition } from "types/shell";

enum ModalTypesEnum {
	EmailChange = "email-change",
	PasswordChange = "password-change",
	TradingPermissions = "trading-permissions",
	AssetManagement = "asset-management",
}

interface Props {
	subAccount: ISubAccount;
	reFetchList: () => void;
}

const AccountManagementTableRow: React.FC<Props> = ({ subAccount, reFetchList }) => {
	const [isChangeEmailOpen, setIsChangeEmailOpen] = useState<boolean>(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
	const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
	const [isTradingModalOpen, setIsTradingModalOpen] = useState<boolean>(false);
	const [is2FAModalOpen, setIs2FAModalOpen] = useState<boolean>(false);

	const { mobile } = useWindowSize();

	const [isApiEnabled, setIsApiEnabled] = useState<boolean>(subAccount.is_api_enabled);
	const [isLoginEnabled, setIsLoginEnabled] = useState<boolean>(subAccount.is_login_enabled);
	const [isActive] = useState<boolean>(subAccount.is_active);

	const localeNavigate = useLocaleNavigate();
	const { formatMessage } = useIntl();

	const toggleIsApiEnabled = () => {
		if (isActive) {
			SubAccountsService.updateSubAccount(subAccount.uid, { is_api_enabled: !isApiEnabled })
				.then(() => {
					toast(
						formatMessage(
							isApiEnabled
								? subAccountsMessages.sub_acc_api_disabled
								: subAccountsMessages.sub_acc_api_enabled,
						),
					);
					setIsApiEnabled((prevState) => !prevState);
				})
				.catch(errorHandler);
		}
	};

	const toggleIsLoginEnabled = () => {
		if (isActive) {
			SubAccountsService.updateSubAccount(subAccount.uid, {
				is_login_enabled: !isLoginEnabled,
			})
				.then(() => {
					toast(
						formatMessage(
							isLoginEnabled
								? subAccountsMessages.sub_acc_login_disabled
								: subAccountsMessages.sub_acc_login_enabled,
						),
					);
					setIsLoginEnabled((prevState) => !prevState);
				})
				.catch(errorHandler);
		}
	};

	const toggleIsActive = () => {
		SubAccountsService.updateSubAccount(subAccount.uid, {
			is_active: !isActive,
		})
			.then(() => {
				toast(
					formatMessage(
						isActive ? subAccountsMessages.sub_acc_disabled : subAccountsMessages.sub_acc_enabled,
					),
				);
				reFetchList();
			})
			.catch(errorHandler);
	};

	const handle2FASettingsClick = useCallback(() => {
		if (!subAccount.is_active) {
			toast(formatMessage(subAccountsMessages.activate_sub_account_first));
		} else if (subAccount.two_factor_enabled) {
			setIs2FAModalOpen(true);
		} else {
			localeNavigate(
				`${routes.subAccounts.authenticator}?${URL_VARS.SUB_ACCOUNT}=${subAccount.uid}`,
			);
		}
	}, [subAccount]);

	const openModal = (type: ModalTypesEnum) => {
		switch (type) {
			case ModalTypesEnum.EmailChange:
				return setIsChangeEmailOpen(true);
			case ModalTypesEnum.PasswordChange:
				return setIsChangePasswordOpen(true);
			case ModalTypesEnum.AssetManagement:
				return setIsAssetModalOpen(true);
			case ModalTypesEnum.TradingPermissions:
				return setIsTradingModalOpen(true);
			default:
				return null;
		}
	};

	const overridePositionHandler = (
		{ top, left }: ITooltipPosition,
		node: null | HTMLDivElement | HTMLSpanElement,
	) => ({
		top:
			window.innerHeight < top + (node?.offsetHeight || 0)
				? window.innerHeight - (node?.offsetHeight || 0) - 20
				: top,
		left:
			window.innerWidth < left + (node?.offsetWidth || 0) + 10
				? window.innerWidth < (node?.offsetWidth || 0) + 140
					? 10
					: window.innerWidth - (node?.offsetWidth || 0) - 140
				: left,
	});

	return (
		<>
			<TableRow className={subAccountsStyles.table_row} common>
				<TableData crop width="200px" maxWidth="200px">
					{subAccount.login}
				</TableData>
				<TableData crop width="100px">
					{subAccount.uid}
				</TableData>
				<TableData crop width="150px">
					{subAccount.email}
				</TableData>
				<TableData width="120px">{dayjs(subAccount.created_at).format("DD/MM/YY")}</TableData>
				<TableData align="center" width="200px">
					<div
						className={styles.assets_container}
						onClick={() => openModal(ModalTypesEnum.TradingPermissions)}
					>
						<Badge alpha color="green">
							{formatMessage(accountMessages.spot)}
						</Badge>
						{subAccount.is_margin_enabled && (
							<>
								&nbsp;
								<Badge alpha color="green">
									{formatMessage(accountMessages.margin)}
								</Badge>
							</>
						)}
					</div>
				</TableData>
				<TableData align="center" width="150px">
					<div
						className={styles.assets_container}
						onClick={() => openModal(ModalTypesEnum.AssetManagement)}
					>
						{subAccount.is_deposit_enabled && (
							<>
								<Badge color="green">{formatMessage(commonMessages.deposit)}</Badge>
								&nbsp;
							</>
						)}
						{subAccount.is_withdraw_enabled && (
							<Badge color="green">{formatMessage(commonMessages.withdraw)}</Badge>
						)}
						{!(subAccount.is_deposit_enabled || subAccount.is_withdraw_enabled) && "--"}
					</div>
				</TableData>
				<TableData align="center" width="80px">
					<div className={styles.switch_container}>
						<Switch
							disabled={!isActive}
							id={`api_${subAccount.uid}`}
							onChange={toggleIsApiEnabled}
							checked={isApiEnabled}
						/>
					</div>
				</TableData>
				<TableData align="center" width="80px">
					<div className={styles.switch_container}>
						<Switch
							disabled={!isActive}
							id={`login_${subAccount.uid}`}
							onChange={toggleIsLoginEnabled}
							checked={isLoginEnabled}
						/>
					</div>
				</TableData>
				<TableData align="center" width="90px">
					<div className={styles.switch_container}>
						<Switch
							id={`acc_state_${subAccount.uid}`}
							onChange={toggleIsActive}
							checked={isActive}
						/>
					</div>
				</TableData>
				<TableData align="right" width="140px">
					<Tooltip
						opener={
							<div className={styles.settings_button}>
								<i className="ai ai-settings-02" />
								<span>{formatMessage(commonMessages.settings)}</span>
							</div>
						}
						id={`clickme_${subAccount.uid}`}
						place="bottom"
						scrollHide={!mobile}
						arrowColor="transparent"
						className={styles.tooltip}
						contentClassName={styles.tooltip}
						openOnClick
						padding="0"
						clickable
						isCapture
						overridePosition={(pos, _e, _et, node) => overridePositionHandler(pos, node)}
					>
						<div className={styles.settings_menu}>
							<div
								className={styles.item}
								onClick={() => openModal(ModalTypesEnum.TradingPermissions)}
							>
								{formatMessage(accountMessages.subaccount_trading_permissions)}
								<i className="ai ai-chevron_right" />
							</div>
							<div
								className={styles.item}
								onClick={() => openModal(ModalTypesEnum.AssetManagement)}
							>
								{formatMessage(accountMessages.subaccount_asset_management)}
								<i className="ai ai-chevron_right" />
							</div>
							<div className={styles.item} onClick={() => openModal(ModalTypesEnum.EmailChange)}>
								{formatMessage(accountMessages.subaccount_email_change)}
								<i className="ai ai-chevron_right" />
							</div>
							<div className={styles.item} onClick={() => openModal(ModalTypesEnum.PasswordChange)}>
								{formatMessage(securityMessages.password_change)}
								<i className="ai ai-chevron_right" />
							</div>
							<div className={styles.item} onClick={handle2FASettingsClick}>
								{formatMessage(accountMessages.subaccount_2fa_settings)}
								<i className="ai ai-chevron_right" />
							</div>
							<InternalLink
								to={routes.subAccounts.getApiCreateQuery({
									[URL_VARS.SUB_ACCOUNT]: subAccount.uid,
								})}
							>
								<div className={styles.item}>
									{formatMessage(accountMessages.subaccount_add_api_key)}
									<i className="ai ai-chevron_right" />
								</div>
							</InternalLink>
							<InternalLink to={routes.subAccounts.getApiDetails(subAccount.uid)}>
								<div className={styles.item}>
									{formatMessage(accountMessages.account_api_keys)}
									<i className="ai ai-chevron_right" />
								</div>
							</InternalLink>
						</div>
					</Tooltip>
				</TableData>
			</TableRow>
			<ChangeEmailModal
				subAccount={subAccount}
				isOpen={isChangeEmailOpen}
				onClose={() => setIsChangeEmailOpen(false)}
			/>
			<ChangePasswordModal
				subAccount={subAccount}
				isOpen={isChangePasswordOpen}
				onClose={() => setIsChangePasswordOpen(false)}
				forSubAccount
			/>
			<AssetsManagementModal
				subAccount={subAccount}
				isOpen={isAssetModalOpen}
				onClose={() => setIsAssetModalOpen(false)}
				onSuccessCallback={() => reFetchList()}
			/>
			<TradingPermissionsModal
				subAccount={subAccount}
				isOpen={isTradingModalOpen}
				onClose={() => setIsTradingModalOpen(false)}
				onSuccessCallback={() => reFetchList()}
			/>
			<TwoFADisableModal
				isOpen={is2FAModalOpen}
				onClose={() => setIs2FAModalOpen(false)}
				disableCallback={(body) =>
					SubAccountsService.disable2FASub({ ...body, [queryVars.sub_account]: subAccount.uid })
				}
				successCallback={() => reFetchList()}
				subAccountMode
			/>
		</>
	);
};

export default AccountManagementTableRow;
