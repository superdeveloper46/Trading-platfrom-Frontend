import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { ReactComponent as FileIcon } from "assets/icons/file-02.svg";
import { ReactComponent as WalletIcon } from "assets/icons/wallet-03.svg";
import { ReactComponent as FileCheckIcon } from "assets/icons/file-check-02.svg";
import { ReactComponent as BellIcon } from "assets/icons/bell-02.svg";
import { ReactComponent as LayoutGridIcon } from "assets/icons/layout-grid-01.svg";
import { ReactComponent as CardDownloadIcon } from "assets/icons/credit-card-download.svg";
import { ReactComponent as CardUploadIcon } from "assets/icons/credit-card-upload.svg";
import { ReactComponent as SwitchHorizontalIcon } from "assets/icons/switch-horizontal-02.svg";
import { ReactComponent as QRCodeIcon } from "assets/icons/qr-code-01.svg";
import { ReactComponent as ClockRewindIcon } from "assets/icons/clock-rewind.svg";
import { ReactComponent as TradeCandleIcon } from "assets/icons/trade-candle-01.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/settings-02.svg";
import { ReactComponent as CoinsHandIcon } from "assets/icons/coins-hand.svg";
import { ReactComponent as CoinsSwapIcon } from "assets/icons/coins-swap-01.svg";
import { ReactComponent as BarChartIcon } from "assets/icons/bar-chart-10.svg";
import { ReactComponent as TargetIcon } from "assets/icons/target-05.svg";
import { ReactComponent as FileXIcon } from "assets/icons/file-x-02.svg";
import useWindowSize from "hooks/useWindowSize";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import historyMessages from "messages/history";
import styleProps from "utils/styleProps";
import styles from "styles/components/Header.module.scss";
import SubBadge from "assets/images/sub_accounts/sub-badge-icon.svg";
import { routes } from "constants/routing";
import LocaleSelector from "../LocaleSelector";
import SettingsMenu from "./SettingsMenu";
import AppMobileMenu from "./AppMobileMenu";
import ProfileMenu from "./ProfileMenu";
import NotificationsMenu from "./NotificationsMenu";
import NavMenuItem, { IMenuItem } from "./NavMenuItem";

interface IMenuItemProps {
	className?: string;
	menuClassName?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
	chevron?: boolean;
	menu?: React.ReactNode;
	name: string;
	tag?: "button" | "div";
	label?: string;
}

const ActionMenuItem: React.FC<IMenuItemProps> = ({
	tag = "button",
	className,
	onClick,
	menuClassName,
	icon,
	menu,
	name,
	chevron,
	label,
}) => {
	const { desktop } = useWindowSize();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const handleMouseEnter = () => {
		setIsMenuOpen(true);
	};

	const handleMouseLeave = () => {
		setIsMenuOpen(false);
	};

	const handleMenuClick = () => {
		setIsMenuOpen((prevState) => !prevState);
		if (onClick) {
			onClick();
		}
	};

	return tag === "div" ? (
		<div
			data-name={`${name}-menu`}
			onClick={handleMenuClick}
			onMouseLeave={handleMouseLeave}
			className={cn(styles.action_menu_item, className)}
		>
			<div className={styles.menu_item_hover_area} onMouseEnter={handleMouseEnter} />
			{icon}
			{label ? <span>{label}</span> : null}
			{desktop && isMenuOpen && (
				<div className={cn(menuClassName, styles.dropdown_menu)}>{menu}</div>
			)}
			{chevron && <i className={`ai ai-arrow_${isMenuOpen ? "up" : "down"}`} />}
		</div>
	) : (
		<button
			type="button"
			name={`${name}-menu`}
			onClick={handleMenuClick}
			onMouseLeave={handleMouseLeave}
			className={cn(styles.action_menu_item, className)}
		>
			<div className={styles.menu_item_hover_area} onMouseEnter={handleMouseEnter} />
			{icon}
			{label ? <span>{label}</span> : null}
			{desktop && isMenuOpen && (
				<div className={cn(menuClassName, styles.dropdown_menu)}>{menu}</div>
			)}
			{chevron && <i className={`ai ai-arrow_${isMenuOpen ? "up" : "down"}`} />}
		</button>
	);
};

interface IProps {
	isLanding?: boolean;
	toggleMainSidebar: () => void;
	toggleProfileSidebar: () => void;
	isExchange?: boolean;
}

const ActionMenu: React.FC<IProps> = ({
	isLanding,
	toggleMainSidebar,
	toggleProfileSidebar,
	isExchange,
}) => {
	const { desktop } = useWindowSize();
	const {
		global,
		account: {
			profileStatus,
			avatarColor,
			isDepositEnabled,
			isWithdrawEnabled,
			isTransferEnabled,
			isAlphaCodeEnabled,
		},
		notifications: { unread_count: unreadNotificationsCount },
		render,
	} = useMst();
	const { formatMessage } = useIntl();

	const handleProfileMenuClick = () => {
		if (!desktop) {
			toggleProfileSidebar();
		}
	};

	const walletsMenu: IMenuItem[] = [
		{
			icon: <LayoutGridIcon />,
			link: routes.profile.wallets,
			title: formatMessage(commonMessages.overview),
		},
		{
			icon: <WalletIcon />,
			link: routes.profile.fundingWallet,
			// title: formatMessage(commonMessages.overview),
			title: "Funding Wallet",
		},
		{
			icon: <CardDownloadIcon />,
			link: routes.profile.createDeposit,
			path: routes.profile.createDepositCurrency,
			title: formatMessage(financeMessages.deposit),
			forbid: !isDepositEnabled,
		},
		{
			icon: <CardUploadIcon />,
			link: routes.profile.createWithdraw,
			path: routes.profile.createWithdrawCurrency,
			title: formatMessage(financeMessages.withdraw),
			forbid: !isWithdrawEnabled,
		},
		{
			icon: <SwitchHorizontalIcon />,
			link: routes.transfers.root,
			title: formatMessage(financeMessages.transfer),
			forbid: !isTransferEnabled || !render.transfers,
		},
		{
			icon: <QRCodeIcon />,
			link: routes.alphaCodes.root,
			title: formatMessage(commonMessages.alpha_codes),
			forbid: !isAlphaCodeEnabled || !render.alphaCode,
		},
		{
			icon: <ClockRewindIcon />,
			link: routes.financeHistory.deposits,
			title: formatMessage(commonMessages.history),
		},
	];

	const ordersMenu: IMenuItem[] = [
		{
			icon: <FileIcon />,
			link: routes.history.activeOrders,
			title: formatMessage(historyMessages.active_orders),
		},
		{
			icon: <FileCheckIcon />,
			link: routes.history.closedOrders,
			title: formatMessage(historyMessages.order_history),
		},
		{
			icon: <TradeCandleIcon />,
			link: routes.history.tradesHistory,
			title: formatMessage(historyMessages.trades),
		},
		{
			icon: <CoinsHandIcon />,
			link: routes.history.borrows,
			title: formatMessage(historyMessages.borrows),
			forbid: !render.margin,
		},
		{
			icon: <CoinsSwapIcon />,
			link: routes.history.repayments,
			title: formatMessage(historyMessages.repayments),
			forbid: !render.margin,
		},
		{
			icon: <BarChartIcon />,
			link: routes.history.interests,
			title: formatMessage(historyMessages.interests),
			forbid: !render.margin,
		},
		{
			icon: <SwitchHorizontalIcon />,
			link: routes.history.marginTransfers,
			title: formatMessage(historyMessages.transfers),
			forbid: !render.margin,
		},
		{
			icon: <TargetIcon />,
			link: routes.history.marginCalls,
			title: formatMessage(historyMessages.margin_calls),
			forbid: !render.margin,
		},
		{
			icon: <FileXIcon />,
			link: routes.history.liquidations,
			title: formatMessage(historyMessages.liquidations),
			forbid: !render.margin,
		},
	];

	return (
		<div className={styles.action_menu}>
			{global.isAuthenticated && (
				<>
					{desktop && (
						<>
							<ActionMenuItem
								name="notifications"
								icon={
									<button
										type="button"
										className={cn(styles.notifications_menu_button, {
											[styles.landing]: isLanding,
										})}
										data-tip
										data-for="notifications"
										data-event="click"
									>
										<BellIcon />
										{unreadNotificationsCount > 0 && (
											<span>{Math.min(unreadNotificationsCount, 99)}</span>
										)}
									</button>
								}
								tag="div"
								menuClassName={styles.notifications_menu_custom_tooltip}
								menu={<NotificationsMenu />}
								className={styles.notifications_menu_nav_menu_container}
							/>
							<NavMenuItem
								alignRight
								menuStyle={styleProps({ width: "275px" })}
								icon={<WalletIcon />}
								name="wallet"
								message={formatMessage(historyMessages.wallet)}
								menu={walletsMenu}
							/>
							<NavMenuItem
								alignRight
								menuStyle={styleProps({ width: "275px" })}
								icon={<FileIcon />}
								name="orders"
								message={formatMessage(historyMessages.orders)}
								menu={ordersMenu}
							/>
						</>
					)}
					<ActionMenuItem
						tag="div"
						icon={
							<div className={styles.header_profile_avatar} aria-label="profile">
								<i className="ai ai-avatar" style={styleProps({ color: avatarColor })} />
								{profileStatus?.is_sub_account ? <img src={SubBadge} alt="sub" /> : null}
							</div>
						}
						onClick={handleProfileMenuClick}
						menuClassName={styles.profile_menu}
						name="profile"
						className={styles.profile}
						menu={desktop && <ProfileMenu />}
					/>
				</>
			)}
			{desktop ? (
				<>
					{global.isAuthenticated ? null : (
						<>
							<InternalLink to={routes.login.root}>
								<span className={styles.action_menu_login}>
									{formatMessage(commonMessages.login)}
								</span>
							</InternalLink>
							<InternalLink to={routes.register.root}>
								<span className={styles.action_menu_register}>
									{render.welcomeBonus && (
										<span className={styles.action_menu_register_badge}>+ $100</span>
									)}
									{formatMessage(commonMessages.register)}
								</span>
							</InternalLink>
						</>
					)}
					<ActionMenuItem
						icon={<SettingsIcon />}
						name="settings"
						menuClassName={styles.settings_menu}
						className={styles.action_menu_settings}
						menu={<SettingsMenu isExchange={isExchange} />}
					/>
					<LocaleSelector
						wrapperClassName={styles.action_menu_locale}
						id="header"
						isLanding={isLanding}
					/>
					{render.mobileApp && (
						<ActionMenuItem
							icon={<i className="ai ai-app" />}
							name="mobile-app"
							menuClassName={styles.mobile_apps_menu_tooltip}
							className={styles.action_menu_mobile_app}
							menu={<AppMobileMenu />}
						/>
					)}
				</>
			) : (
				<button
					onClick={toggleMainSidebar}
					className={styles.action_menu_mobile_hamburger}
					name="mobile-menu"
					type="button"
				>
					<i className="ai ai-hamburger" />
				</button>
			)}
		</div>
	);
};

export default observer(ActionMenu);
