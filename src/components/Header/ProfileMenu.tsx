import React, { useCallback, useEffect, useRef, useState } from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { ReactComponent as BellIcon } from "assets/icons/bell-02.svg";
import { ReactComponent as WalletIcon } from "assets/icons/wallet-03.svg";
import { ReactComponent as FingerprintIcon } from "assets/icons/fingerprint-04.svg";
import { ReactComponent as UsersIcon } from "assets/icons/users-02.svg";
import { ReactComponent as SwitchHorizontalIcon } from "assets/icons/switch-horizontal-02.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/settings-02.svg";
import { ReactComponent as ShieldIcon } from "assets/icons/shield-03.svg";
import { ReactComponent as CodeIcon } from "assets/icons/code-02.svg";
import { ReactComponent as ClockRewindIcon } from "assets/icons/clock-rewind.svg";
import { ReactComponent as FileIcon } from "assets/icons/file-02.svg";
import { ReactComponent as FileCheckIcon } from "assets/icons/file-check-02.svg";
import { ReactComponent as QRCodeIcon } from "assets/icons/qr-code-01.svg";
import messages from "messages/common";
import accountMessages from "messages/account";
import historyMessages from "messages/history";
import security_messages from "messages/security";
import styles from "styles/components/Header.module.scss";
import dropdownStyles from "styles/components/DropdownList.module.scss";
import styleProps from "utils/styleProps";
import SubBadge from "assets/images/sub_accounts/sub-full-badge-icon.svg";
import { useMst } from "models/Root";
import { getActiveMenuElement } from "utils/shell";
import {
	MENU_DIVIDER,
	PageNameEnum,
	PROFILE_MENU_DESKTOP_ORDER,
	PROFILE_MENU_SIDEBAR_ORDER,
	SUB_ACCOUNTS_SUBMENU_PAGES,
} from "constants/navigation";
import InternalLink from "components/InternalLink";
import ButtonMicro from "components/UI/Button/ButtonMicro";
import ExternalLink from "components/ExternalLink";
import { useTradingFees } from "services/TradingFeesService";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import useCopyClick from "hooks/useCopyClick";

interface IProps {
	sidebarMode?: boolean;
	show?: boolean;
	closeMenu?: () => void;
}

const ProfileMenu: React.FC<IProps> = ({ sidebarMode, closeMenu, show }) => {
	const {
		render,
		global: { locale },
		auth: { onLogout },
		account: { profileStatus, avatarColor },
	} = useMst();
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();
	const localeNavigate = useLocaleNavigate();
	const copyClick = useCopyClick();
	const urlLevel =
		pathname?.startsWith(`/${locale}${routes.profile.wallets}/`) ||
		pathname?.startsWith(`/${locale}${routes.history.root}/`)
			? 4
			: 3;
	const [activePage, setActivePage] = useState(getActiveMenuElement(pathname, urlLevel));
	const isSubAccsRoute = SUB_ACCOUNTS_SUBMENU_PAGES.includes(activePage as PageNameEnum);
	const [isSubAccsSubMenuOpened, setIsSubAccsSubMenuOpened] = useState(isSubAccsRoute);
	const [isOrdersSubMenuOpened, setIsOrdersSubMenuOpened] = useState(isSubAccsRoute);
	const ref = useRef<HTMLDivElement>(null);
	const { data: tradingFees } = useTradingFees();

	useEffect(() => {
		const currentPage = getActiveMenuElement(pathname, urlLevel);
		if (activePage !== currentPage) {
			setActivePage(currentPage || "");
		}
	}, [pathname, urlLevel]);

	const handleCopyUIDClipboard = (): void => {
		if (profileStatus?.uid) {
			copyClick(
				profileStatus?.uid,
				formatMessage(messages.copied_to_clipboard, { label: "User ID" }),
			);
		}
	};

	const onMenuClick = useCallback(() => {
		if (typeof closeMenu === "function") {
			closeMenu();
		}
	}, []);

	const handleLogout = (e: React.MouseEvent): void => {
		e.preventDefault();
		onLogout().then(() => {
			localeNavigate(routes.login.redirect(pathname));
		});
	};

	const onTouchMove = useCallback((e: any, el?: any) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	useEffect(() => {
		if (show) {
			ref.current?.addEventListener("touchmove", onTouchMove);
		} else {
			ref.current?.removeEventListener("touchmove", onTouchMove);
		}

		return () => {
			ref.current?.removeEventListener("touchmove", onTouchMove);
		};
	}, [show]);

	const menuItemsOrder = sidebarMode ? PROFILE_MENU_SIDEBAR_ORDER : PROFILE_MENU_DESKTOP_ORDER;

	const menuItems = [
		{
			link: routes.profile.notification,
			icon: <BellIcon />,
			label: formatMessage(messages.notifications),
			pageName: PageNameEnum.Notifications,
		},
		{
			link: routes.profile.wallets,
			icon: <WalletIcon />,
			label: formatMessage(messages.finance),
			pageName: PageNameEnum.Wallets,
		},
		{
			link: routes.verification.root,
			icon: <FingerprintIcon />,
			label: formatMessage(messages.verification),
			pageName: PageNameEnum.Verification,
			forbid: !profileStatus?.is_email_confirmed || profileStatus?.is_sub_account,
		},
		{
			link: routes.referrals.root,
			icon: <UsersIcon />,
			label: formatMessage(messages.referrals),
			pageName: PageNameEnum.Referrals,
			forbid: !render.referrals || profileStatus?.is_sub_account,
		},
		{
			link: routes.history.activeOrders,
			icon: <FileIcon />,
			label: formatMessage(historyMessages.orders),
			pageName: PageNameEnum.Orders,
			isOpened: sidebarMode && isOrdersSubMenuOpened,
			nestedItems: sidebarMode
				? [
						{
							link: routes.history.activeOrders,
							pageName: PageNameEnum.ActiveOrders,
							label: formatMessage(historyMessages.active_orders),
						},
						{
							link: routes.history.closedOrders,
							pageName: PageNameEnum.ClosedOrders,
							label: formatMessage(historyMessages.order_history),
						},
						{
							link: routes.history.tradesHistory,
							pageName: PageNameEnum.TradesHistory,
							label: formatMessage(historyMessages.trades),
						},
						...(render.margin
							? [
									{
										link: routes.history.borrows,
										pageName: PageNameEnum.Borrows,
										label: formatMessage(historyMessages.borrows),
									},
									{
										link: routes.history.repayments,
										pageName: PageNameEnum.Repayments,
										label: formatMessage(historyMessages.repayments),
									},
									{
										link: routes.history.interests,
										pageName: PageNameEnum.Interests,
										label: formatMessage(historyMessages.interests),
									},
									{
										link: routes.history.marginTransfers,
										pageName: PageNameEnum.Transfers,
										label: formatMessage(historyMessages.transfers),
									},
									{
										link: routes.history.marginCalls,
										pageName: PageNameEnum.MarginCalls,
										label: formatMessage(historyMessages.margin_calls),
									},
									{
										link: routes.history.liquidations,
										pageName: PageNameEnum.Liquidations,
										label: formatMessage(historyMessages.liquidations),
									},
							  ]
							: []),
				  ]
				: null,
		},
		...(render.subAccounts
			? [
					{
						link: routes.subAccounts.balances,
						icon: <UsersIcon />,
						label: formatMessage(messages.sub_accounts),
						pageName: PageNameEnum.SubAccounts,
						forbid: profileStatus?.is_sub_account,
						appender: <div className={cn(styles.menu_badge, styles.menu_badge)}>new</div>,
						isOpened: sidebarMode && isSubAccsSubMenuOpened,
						nestedItems: sidebarMode
							? [
									{
										link: routes.subAccounts.balances,
										pageName: PageNameEnum.Balance,
										label: formatMessage(accountMessages.subaccount_balance_sub_accounts),
									},
									{
										link: routes.subAccounts.orderManagement,
										pageName: PageNameEnum.OrderManagement,
										label: formatMessage(accountMessages.subaccount_order_management),
									},
									{
										link: routes.subAccounts.accountManagement,
										pageName: PageNameEnum.AccountManagement,
										label: formatMessage(accountMessages.subaccount_account_management),
									},
									{
										link: routes.subAccounts.apiManagement,
										pageName: PageNameEnum.ApiManagement,
										label: formatMessage(accountMessages.subaccount_api_management),
									},
									{
										link: routes.subAccounts.transferHistory,
										pageName: PageNameEnum.TransferHistory,
										label: formatMessage(accountMessages.subaccount_transfer_history),
									},
									{
										link: routes.subAccounts.loginHistory,
										pageName: PageNameEnum.LoginHistory,
										label: formatMessage(accountMessages.subaccount_login_history),
									},
							  ]
							: null,
					},
			  ]
			: []),
		{
			link: routes.transfers.root,
			icon: <SwitchHorizontalIcon />,
			label: formatMessage(messages.transfer),
			pageName: PageNameEnum.Transfers,
			forbid: !render.transfers || profileStatus?.is_sub_account,
		},
		{
			link: routes.settings.root,
			icon: <SettingsIcon />,
			label: formatMessage(messages.settings),
			pageName: PageNameEnum.Settings,
		},
		{
			link: routes.security.root,
			icon: <ShieldIcon />,
			label: formatMessage(messages.security),
			pageName: PageNameEnum.Security,
		},
		{
			link: routes.api.root,
			icon: <CodeIcon />,
			label: formatMessage(messages.api),
			pageName: PageNameEnum.Api,
		},
		{
			link: routes.financeHistory.deposits,
			icon: <ClockRewindIcon />,
			label: formatMessage(messages.history),
			pageName: PageNameEnum.History,
		},
		{
			link: routes.history.activeOrders,
			icon: <FileIcon />,
			label: formatMessage(historyMessages.active_orders),
			pageName: PageNameEnum.ActiveOrders,
		},
		{
			link: routes.history.closedOrders,
			icon: <FileCheckIcon />,
			label: formatMessage(historyMessages.order_history),
			pageName: PageNameEnum.ClosedOrders,
		},
		{
			link: routes.alphaCodes.root,
			icon: <QRCodeIcon />,
			label: formatMessage(messages.alpha_codes),
			pageName: PageNameEnum.AlphaCode,
			forbid:
				!render.alphaCode || profileStatus?.is_sub_account || !profileStatus?.is_withdraw_enabled,
		},
	];

	const handleNestedMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();

		const name = e.currentTarget.dataset.name as PageNameEnum;

		switch (name) {
			case PageNameEnum.SubAccounts:
				setIsSubAccsSubMenuOpened((prevState) => !prevState);
				break;
			case PageNameEnum.Orders:
				setIsOrdersSubMenuOpened((prevState) => !prevState);
				break;
			default:
				break;
		}
	};

	const profileMenu = (
		<div className={cn(styles.profile_menu_container, { [styles.sidebar_mode]: sidebarMode })}>
			{sidebarMode ? <i className={cn(styles.close_button, "ai ai-cancel_mini")} /> : null}
			<div className={styles.header_dashboard_container}>
				<div className={styles.header_dashboard}>
					<div className={styles.profile_avatar}>
						<i className="ai ai-avatar" style={styleProps({ color: avatarColor })} />
					</div>
					<InternalLink className={styles.profile_dashboard_link} to={routes.dashboard.root} />
					<span className={styles.profile_name}>
						{profileStatus?.username || profileStatus?.email}
					</span>
					<i className="ai ai-chevron_right" />
					<div className={styles.profile_vip_status}>
						<i className="ai ai-vip" />
						{tradingFees?.personal?.fee_tier?.name ?? "VIP ?"}
					</div>
					{profileStatus?.is_sub_account ? <img alt="sub" src={SubBadge} /> : null}
				</div>
			</div>
			<div className={styles.header}>
				<div className={styles.profile_uid}>
					<span>User ID: {profileStatus?.uid}</span>
					<ButtonMicro onClick={handleCopyUIDClipboard}>
						<i className="ai ai-copy_new" />
					</ButtonMicro>
				</div>
				{!profileStatus?.two_factor_enabled && (
					<InternalLink
						className={cn(styles.header_security_link, "secure-link")}
						to={routes.security.authenticator}
					>
						{formatMessage(security_messages.twoFA_enable_btn)}
					</InternalLink>
				)}
			</div>
			<div className={styles.divider} />
			{menuItemsOrder.map((orderName, idx) => {
				if (orderName === MENU_DIVIDER) {
					return <div key={`${orderName}${idx}`} className={styles.divider} />;
				}

				const menuItem = menuItems.find((i) => i.pageName === orderName);

				if (!menuItem) {
					return null;
				}

				const { forbid, icon, pageName, label, link, appender, isOpened, nestedItems } = menuItem;

				return !forbid ? (
					<React.Fragment key={`wrapper_${pageName}_${idx}`}>
						<InternalLink
							key={`link_${pageName}_${idx}`}
							className={cn(styles.profile_link, dropdownStyles.dropdown_list_item, {
								[dropdownStyles.active]: activePage === pageName,
							})}
							to={link || ""}
							name={pageName}
							onClick={nestedItems ? handleNestedMenuClick : undefined}
						>
							{appender || null}
							{icon}
							{label}
							{nestedItems && (
								<i
									className={cn("ai ai-chevron_down", styles.sub_menu_arrow, {
										[styles.active]: isOpened,
									})}
								/>
							)}
						</InternalLink>
						{isOpened && nestedItems && nestedItems.length ? (
							<div className={styles.dropdown_sub_accounts_list}>
								{nestedItems.map((sub_item) => (
									<InternalLink
										key={sub_item.pageName}
										className={cn(styles.profile_link, styles.sub_item, {
											[styles.active]: activePage === sub_item.pageName,
										})}
										to={sub_item.link}
									>
										{sub_item.label}
									</InternalLink>
								))}
							</div>
						) : null}
					</React.Fragment>
				) : null;
			})}
			<div className={styles.divider} />
			<div
				className={cn(styles.profile_link, dropdownStyles.dropdown_list_item)}
				onClick={handleLogout}
			>
				<i className="ai ai-log-out-01" />
				{formatMessage(messages.logout)}
			</div>
			{profileStatus?.extra_links?.length && profileStatus.extra_links.length > 0 ? (
				<>
					<div className={styles.divider} />
					{profileStatus?.extra_links.map((link, idx) => (
						<ExternalLink
							key={idx}
							className={cn(dropdownStyles.dropdown_list_item, styles.profile_link)}
							to={link.url || ""}
						>
							<i className={`ai ${link.icon}`} />
							{link.text}
						</ExternalLink>
					))}
				</>
			) : null}
		</div>
	);

	return sidebarMode ? (
		<>
			{show && <div className={styles.sidebar_overlay} onClick={closeMenu} ref={ref} />}
			<CSSTransition
				classNames={{
					enter: styles.mobile_enter,
					enterActive: styles.mobile_enter_active,
					enterDone: styles.mobile_enter_done,
					exit: styles.mobile_drawer_exit,
					exitActive: styles.mobile_drawer_exit_active,
					exitDone: styles.mobile_drawer_exit_done,
				}}
				id="mobile-drawer"
				timeout={250}
				in={show}
			>
				<div className={cn(styles.mobile_sidebar, styles.profile_sidebar)} onClick={onMenuClick}>
					{profileMenu}
				</div>
			</CSSTransition>
		</>
	) : (
		profileMenu
	);
};

export default observer(ProfileMenu);
