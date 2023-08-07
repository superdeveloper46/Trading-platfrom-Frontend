import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { FormattedMessage, MessageDescriptor } from "react-intl";

import styles from "styles/components/Sidebar.module.scss";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import financeMessages from "messages/finance";
import exchangeMessages from "messages/exchange";
import historyMessages from "messages/history";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import classnames from "classnames";
import AppleBtnImg from "assets/images/common/app-apple-button.svg";
import GoogleBtnImg from "assets/images/common/app-google-button.svg";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { getActiveMenuElement, getParentMenuElement } from "utils/shell";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";
import { socialNetworks } from "constants/socialNetworks";
import { routes } from "constants/routing";

// TODO
interface IMenuListItem {
	link: string;
	name: string;
	message: MessageDescriptor;
	hidden?: boolean;
	iconClass?: string;
	list?: IMenuListItem[];
	active?: boolean;
}

interface ISocialItem {
	link: string;
	iconClass: string;
	label: string;
}

const profileMenu: IMenuListItem = {
	link: routes.profile.root,
	name: "profile",
	message: commonMessages.my_profile,
	iconClass: "user",
	list: [
		{
			link: routes.dashboard.root,
			name: "dashboard",
			message: commonMessages.dashboard,
		},
		{
			link: routes.security.root,
			name: "security",
			message: commonMessages.security,
		},
		{
			link: routes.settings.root,
			name: "settings",
			message: commonMessages.settings,
		},
		{
			link: routes.verification.root,
			name: "verification",
			message: commonMessages.verification,
		},
		{
			link: routes.profile.notification,
			name: "notifications",
			message: commonMessages.notifications,
		},
		{
			link: routes.api.root,
			name: "api",
			message: commonMessages.api,
		},
	],
};

const subAccountMenu: IMenuListItem = {
	link: routes.subAccounts.root,
	name: "sub-account",
	message: accountMessages.subaccount_table_account,
	iconClass: "list",
	list: [
		{
			link: routes.subAccounts.balances,
			name: "balance",
			message: accountMessages.subaccount_balance_sub_accounts,
		},
		{
			link: routes.subAccounts.orderManagement,
			name: "order-management",
			message: accountMessages.subaccount_order_management,
		},
		{
			link: routes.subAccounts.accountManagement,
			name: "account-management",
			message: accountMessages.subaccount_account_management,
		},
		{
			link: routes.subAccounts.apiManagement,
			name: "api-management",
			message: accountMessages.subaccount_api_management,
		},
		{
			link: routes.subAccounts.transferHistory,
			name: "transfer-history",
			message: accountMessages.subaccount_transfer_history,
		},
		{
			link: routes.subAccounts.loginHistory,
			name: "login-history",
			message: accountMessages.subaccount_login_history,
		},
	],
};

const historyMenu: IMenuListItem = {
	link: routes.history.root,
	name: "history",
	message: historyMessages.orders,
	iconClass: "list",
	list: [
		{
			link: routes.history.activeOrders,
			name: "active-orders",
			message: historyMessages.active_orders,
		},
		{
			link: routes.history.closedOrders,
			name: "closed-orders",
			message: historyMessages.order_history,
		},
		{
			link: routes.history.tradesHistory,
			name: "trades-history",
			message: historyMessages.trades,
		},
		...(config.isModuleOn(RenderModuleEnum.MARGIN)
			? [
					{
						link: routes.history.borrows,
						name: "borrows",
						message: historyMessages.borrows,
					},
					{
						link: routes.history.repayments,
						name: "repayments",
						message: historyMessages.repayments,
					},
					{
						link: routes.history.interests,
						name: "interests",
						message: historyMessages.interests,
					},
					{
						link: routes.history.marginTransfers,
						name: "transfers",
						message: historyMessages.transfers,
					},
					{
						link: routes.history.marginCalls,
						name: "margin-calls",
						message: historyMessages.margin_calls,
					},
					{
						link: routes.history.liquidations,
						name: "liquidations",
						message: historyMessages.liquidations,
					},
			  ]
			: []),
	],
};

const SocialItem: React.FC<ISocialItem> = ({ label, link, iconClass }) => (
	<a
		key={label}
		className="btn-icon alpha-icons-space"
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		aria-label={`${label} ${config.department}`}
	>
		<i className={`ai ${iconClass}`} />
	</a>
);

const MobileLinks: React.FC = () => (
	<div className={styles.sidebar_mobile_links}>
		<AppleButton />
		<GoogleButton />
	</div>
);

const AppleButton = () => (
	<a href={config.mobileAppAppStore} target="_blank" rel="noopener noreferrer">
		<img className={styles.sidebar_mobile_app_img} src={AppleBtnImg} alt="logo" />
	</a>
);

const GoogleButton = () => (
	<a
		className="app-link"
		href={config.mobileAppGooglePlay}
		target="_blank"
		rel="noopener noreferrer"
	>
		<img className={styles.sidebar_mobile_app_img} src={GoogleBtnImg} alt="logo" />
	</a>
);

const FooterAddress: React.FC = () => (
	<div className={styles.sidebar_footer_address}>
		© {new Date().getFullYear()} {config.department}, {config.departmentAddress}
	</div>
);

const MenuListItem: React.FC<IMenuListItem> = ({ link, active, name, message, iconClass }) => (
	<InternalLink to={`${link}`} key={name}>
		<div
			className={classnames(styles.sidebar_list_item, {
				[styles.active]: active,
			})}
		>
			{iconClass && <i className={`ai ai-${iconClass} left`} />}
			<FormattedMessage {...message} />
		</div>
	</InternalLink>
);

interface IProps {
	menuLevel?: SidebarMenuLevelsEnum;
}

const Sidebar: React.FC<IProps> = ({ menuLevel }) => {
	const {
		global: { locale },
		account: { isDepositEnabled, isWithdrawEnabled, isTransferEnabled, isAlphaCodeEnabled },
		render,
	} = useMst();

	const location = useLocation();

	const [activePage, setActivePage] = useState(
		getActiveMenuElement(location?.pathname, menuLevel ?? 4),
	);
	const [parentCategory, setParentCategory] = useState(
		getParentMenuElement(location?.pathname, menuLevel ?? 4),
	);

	useEffect(() => {
		setActivePage(getActiveMenuElement(location?.pathname ?? "", menuLevel ?? 4));
		setParentCategory(getParentMenuElement(location?.pathname, menuLevel ?? 4));
	}, [location]);

	const walletMenu: IMenuListItem = {
		link: routes.profile.wallets,
		name: "wallets",
		message: financeMessages.my_wallet,
		iconClass: "wallet",
		list: [
			{
				link: routes.profile.wallets,
				name: "wallets",
				message: exchangeMessages.wallets,
			},
			{
				link: routes.profile.fundingWallet,
				name: "funding-wallet",
				message: commonMessages.funding_wallet,
			},
			{
				link: routes.profile.getDepositCurrency("USDT"),
				name: "create-deposit",
				message: financeMessages.deposit,
				hidden: !isDepositEnabled,
			},
			{
				link: routes.profile.getWithdrawCurrency("BTC"),
				name: "create-withdraw",
				message: commonMessages.withdraw,
				hidden: !isWithdrawEnabled,
			},
			{
				link: routes.transfers.root,
				name: "transfers",
				message: financeMessages.transfer,
				hidden: !render.transfers || !isTransferEnabled,
			},
			{
				link: routes.alphaCodes.root,
				name: "alpha-code",
				message: commonMessages.alpha_codes,
				hidden: !render.alphaCode || !isAlphaCodeEnabled,
			},
			{
				link: routes.financeHistory.deposits,
				name: "history",
				message: commonMessages.history,
			},
		],
	};

	const menuList: IMenuListItem[] = [profileMenu, subAccountMenu, walletMenu, historyMenu];

	const currentList: IMenuListItem | undefined = menuList.find(
		(i: IMenuListItem) => i.name === parentCategory,
	);

	console.log({ currentList, menuList, parentCategory });

	return (
		<div className={styles.sidebar_container}>
			<div className={styles.sidebar_list_container}>
				{currentList && (
					<>
						<div className={styles.sidebar_current_list_title}>
							{currentList.iconClass && <i className={`ai ai-${currentList.iconClass} left`} />}
							<FormattedMessage {...currentList.message} />
						</div>
						{Array.isArray(currentList.list) &&
							currentList.list.map(
								(item: IMenuListItem) =>
									!item.hidden && (
										<MenuListItem
											key={item.name}
											{...item}
											active={
												activePage === item.name || (parentCategory === item.name && !activePage)
											}
										/>
									),
							)}
					</>
				)}
			</div>
			<div className={styles.sidebar_footer_container}>
				<div className={styles.sidebar_divider} />
				<div className={styles.sidebar_footer} id="footer-links">
					<div className={styles.sidebar_footer_icons_container}>
						{socialNetworks(locale).map((item) => (
							<SocialItem
								key={item.label}
								link={item.link}
								label={item.label}
								iconClass={`ai-${item.icon}`}
							/>
						))}
					</div>
					{render.mobileApp && <MobileLinks />}
					<FooterAddress />
				</div>
			</div>
		</div>
	);
};

export default observer(Sidebar);
