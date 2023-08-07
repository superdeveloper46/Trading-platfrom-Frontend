import React from "react";
import cn from "classnames";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/P2PHeader.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { ReactComponent as HamburgerIcon } from "assets/icons/menu-hamburger.svg";
import Tooltip from "components/UI/Tooltip";
import { routes, URL_VARS } from "constants/routing";
import { getUrlParams } from "utils/filter";
import { queryVars } from "constants/query";
import DropdownWithContent from "components/DropdownWithContent";
import InternalLink from "components/InternalLink";
import useWindowSize from "hooks/useWindowSize";
import p2pMessages from "messages/p2p";
import historyMessages from "messages/history";

export type TActiveNavItemType =
	| typeof URL_VARS.MAIN
	| typeof URL_VARS.USER_CENTER
	| typeof URL_VARS.ORDERS
	| typeof URL_VARS.ADS;

const Header = () => {
	const { formatMessage } = useIntl();
	const { medium } = useWindowSize();

	const { pathname } = useLocation();

	const flowNavItems = [
		// {
		// 	id: "express",
		// 	label: "Express",
		// 	hint: "Express text",
		// },
		{
			id: URL_VARS.MAIN,
			label: formatMessage(p2pMessages.p2p_label),
			hint: formatMessage(p2pMessages.p2p_desc),
		},
	];

	const otherNavItems = [
		{
			id: URL_VARS.ORDERS,
			label: formatMessage(historyMessages.orders),
		},
		{
			id: URL_VARS.ADS,
			label: formatMessage(p2pMessages.ads),
			hint: formatMessage(p2pMessages.ads_hint),
		},
	];

	const userCenterLinks = [
		{
			id: "overview",
			label: formatMessage(p2pMessages.overview),
			link: routes.p2p.userCenter,
		},
		{
			id: URL_VARS.PAYMENT_METHODS,
			label: formatMessage(p2pMessages.payment_methods),
			link: `${routes.p2p.userCenter}${getUrlParams({
				[queryVars.tab]: URL_VARS.PAYMENT_METHODS,
			})}`,
		},
		{
			id: URL_VARS.FEEDBACK,
			label: formatMessage(p2pMessages.feedback),
			link: `${routes.p2p.userCenter}${getUrlParams({
				[queryVars.tab]: URL_VARS.FEEDBACK,
			})}`,
		},
		{
			id: URL_VARS.BLOCKED_USERS,
			label: formatMessage(p2pMessages.blocked_users),
			link: `${routes.p2p.userCenter}${getUrlParams({
				[queryVars.tab]: URL_VARS.BLOCKED_USERS,
			})}`,
		},
	];

	const createNewAdd = (
		<InternalLink to={routes.p2p.createOrder} className={p2pStyles.button_link}>
			<i className="ai ai-plus" />
			{formatMessage(p2pMessages.post_new_ad)}
		</InternalLink>
	);

	return (
		<div className={styles.container}>
			<div className={styles.image} />
			<div className={styles.control_panel}>
				<div className={p2pStyles.nav_bar}>
					{flowNavItems.map(({ id, label, hint }) => (
						<InternalLink
							key={id}
							to={`${routes.p2p.root}/${id}`}
							className={cn(p2pStyles.nav_item, p2pStyles.main_header, {
								[p2pStyles.active]: pathname.includes(id),
							})}
						>
							<span>{label}</span>
							{hint && <Tooltip id={id} hint text={hint} />}
						</InternalLink>
					))}
				</div>
				{!medium && (
					<>
						<div className={cn(p2pStyles.nav_bar, p2pStyles.marginLeft)}>
							{otherNavItems.map(({ id, label, hint }) => (
								<InternalLink
									key={id}
									to={`${routes.p2p.root}/${id}`}
									className={cn(p2pStyles.nav_item, p2pStyles.main_header, {
										[p2pStyles.active]: pathname.includes(id),
									})}
								>
									<span>{label}</span>
									{hint && <Tooltip id={id} hint text={hint} />}
								</InternalLink>
							))}
							<DropdownWithContent
								className={styles.dropdown}
								label={({ isOpened }) => (
									<div
										className={cn(p2pStyles.nav_item, p2pStyles.main_header, {
											[p2pStyles.active]: pathname.includes(URL_VARS.USER_CENTER),
											[p2pStyles.isOpened]: isOpened,
										})}
									>
										<span>
											{formatMessage(p2pMessages.p2p_label)}{" "}
											{formatMessage(p2pMessages.user_center)}
										</span>
										<Tooltip
											id="user-center-hint"
											hint
											text={formatMessage(p2pMessages.user_center_hint)}
										/>
									</div>
								)}
							>
								{({ close }) => (
									<div className={styles.user_center_dropdown_content}>
										{userCenterLinks.map((item, i) => (
											<InternalLink onClick={close} to={item.link} className={styles.item} key={i}>
												{item.label}
											</InternalLink>
										))}
									</div>
								)}
							</DropdownWithContent>
						</div>
						{createNewAdd}
					</>
				)}
				{medium && (
					<DropdownWithContent
						className={cn(p2pStyles.dropdown_container, p2pStyles.main_header)}
						label={() => (
							<div className={p2pStyles.filter}>
								<HamburgerIcon />
							</div>
						)}
					>
						{({ close }) => (
							<div onClick={close} className={cn(p2pStyles.filter_content, p2pStyles.table_filter)}>
								{createNewAdd}
								<InternalLink to={routes.p2p.orders}>
									{formatMessage(historyMessages.orders)}
								</InternalLink>
								<InternalLink to={routes.p2p.ads}>{formatMessage(p2pMessages.ads)}</InternalLink>
								<InternalLink to={routes.p2p.userCenter}>
									{formatMessage(p2pMessages.user_center)}
								</InternalLink>
							</div>
						)}
					</DropdownWithContent>
				)}
			</div>
		</div>
	);
};

export default Header;
