import React, { useCallback, useEffect, useRef, useState } from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import cn from "classnames";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import HerbIcon from "assets/images/common/herb-icon.svg";
import feesMessages from "messages/fees_trading";
import AppleBtnImg from "assets/images/common/app-apple-button.svg";
import GoogleBtnImg from "assets/images/common/app-google-button.svg";
import messages from "messages/common";
import newsMessages from "messages/news";
import bonusMessages from "messages/welcome_bonus";
import socialListingMessages from "messages/listing";
import styles from "styles/components/Header.module.scss";
import { ThemeEnum } from "types/theme";
import { useMst } from "models/Root";
import Switch from "components/UI/Switch";
import Button from "components/UI/Button";
import useWindowSize from "hooks/useWindowSize";
import InternalLink from "components/InternalLink";
import config from "helpers/config";
import { PageNameEnum } from "constants/navigation";
import useLocalStorage from "hooks/useLocalStorage";
import { TERMINAL_LATEST_PAIR_CACHE_KEY } from "utils/cacheKeys";
import useAccountType from "hooks/useAccountType";
import { AccountTypeEnum } from "types/account";
import LanguageSettingsModal from "components/LanguageSettingsModal";
import { socialNetworks } from "constants/socialNetworks";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";
import { disableDocumentScroll, enableDocumentScroll } from "utils/browser";

const year = new Date().getFullYear();

interface Props {
	show?: boolean;
	activePage?: PageNameEnum | string;
	closeMenu: () => void;
}

const MobileSidebar: React.FC<Props> = ({ show, activePage, closeMenu }) => {
	const {
		global: { locale, isAuthenticated, theme, setTheme },
		account: { profileStatus },
		render,
	} = useMst();
	const { mobile } = useWindowSize();
	const { pathname } = useLocation();
	const { formatMessage } = useIntl();
	const [latestTerminalPair] = useLocalStorage(
		TERMINAL_LATEST_PAIR_CACHE_KEY,
		config.defaultTerminalPair,
	);
	const ref = useRef<HTMLDivElement>(null);
	const type = useAccountType();
	const isAccountMargin = [AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(type);

	const [isLocaleModalOpened, toggleLocaleModal] = useState(false);

	const onTouchMove = useCallback((e: any, el?: any) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const onMenuClick = useCallback(() => {
		closeMenu();
	}, []);

	const handleThemeToggleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const toggleTheme = () => {
		setTheme(theme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark);
	};

	useEffect(() => {
		if (show) {
			ref.current?.addEventListener("touchmove", onTouchMove);
			disableDocumentScroll();
		} else {
			ref.current?.removeEventListener("touchmove", onTouchMove);
			enableDocumentScroll();
		}

		return () => {
			ref.current?.removeEventListener("touchmove", onTouchMove);
			enableDocumentScroll();
		};
	}, [show]);

	const mainMenuItems = [
		{
			link: routes.trade.getPair(latestTerminalPair),
			label: formatMessage(messages.exchange),
			icon: <i className="ai ai-exchange" />,
			isActive: pathname.includes(`/${locale}/${URL_VARS.TRADE}/`) && !isAccountMargin,
		},
		{
			link: `/${URL_VARS.TRADE}/${config.defaultTerminalMarginPair}?${queryVars.layout}=advanced&${queryVars.type}=cross`,
			label: "Cross Margin",
			icon: <i className="ai ai-exchange" />,
			isActive:
				pathname.includes(`/${locale}/${URL_VARS.TRADE}/`) && type === AccountTypeEnum.CROSS,
			forbid: !render.margin,
		},
		{
			link: `/${URL_VARS.TRADE}/${config.defaultTerminalMarginPair}?${queryVars.layout}=advanced&${queryVars.type}=isolated`,
			label: "Isolated Margin",
			icon: <i className="ai ai-exchange" />,
			isActive:
				pathname.includes(`/${locale}/${URL_VARS.TRADE}/`) && type === AccountTypeEnum.ISOLATED,
			forbid: !render.margin,
		},
		{
			link: routes.aml,
			label: formatMessage(messages.aml),
			icon: <i className="ai ai-file_text" />,
			isActive: activePage === PageNameEnum.AML,
			forbid: !render.transactionsMonitoring,
		},
		{
			link: routes.staking.root,
			label: formatMessage(messages.staking),
			icon: <i className="ai ai-layers" />,
			isActive: activePage === PageNameEnum.Staking,
			forbid: !render.staking,
		},
		{
			link: routes.competitions.root,
			label: formatMessage(messages.competitions),
			icon: <i className="ai ai-cup" />,
			isActive: activePage === PageNameEnum.Competitions,
			forbid: !render.competitions,
		},
		{
			link: routes.stories.root,
			label: "Alpha Stories",
			icon: <i className="ai ai-alpha_stories" />,
			isActive: activePage === PageNameEnum.Stories,
			forbid: !render.stories,
		},
		// {
		// 	link: "/halving",
		// 	label: formatMessage(messages.halving_header),
		// 	icon: <i className="ai ai-btc" />,
		// 	isActive: activePage === PageNameEnum.Halving,
		// },
		{
			link: URL_VARS.ROOT,
			label: formatMessage(messages.home),
			icon: <i className="ai ai-home" />,
		},
		{
			link: routes.buyCrypto.getPair("USD_BTC"),
			label: formatMessage(messages.buy_crypto),
			icon: <i className="ai ai-btc" />,
			isActive: activePage === PageNameEnum.BuyCrypto,
			forbid: !render.buyCrypto || (isAuthenticated && profileStatus?.is_sub_account),
		},
		{
			link: routes.tradingFees,
			label: formatMessage(feesMessages.trading_fees),
			icon: <i className="ai ai-fees" />,
			isActive: activePage === PageNameEnum.TradingFees,
		},
		{
			link: routes.newsAlpCom.root,
			label: formatMessage(newsMessages.news),
			icon: <i className="ai ai-news" />,
			isActive: activePage === PageNameEnum.NewsCrypto,
			forbid: !render.news,
		},
		{
			link: routes.p2p.root,
			label: "P2P",
			icon: <i className="ai ai-p2p" />,
			isActive: activePage === PageNameEnum.P2P,
			forbid: !render.p2p || profileStatus?.is_sub_account,
		},
		{
			link: routes.news.root,
			label: formatMessage(newsMessages.crypto_news),
			icon: <i className="ai ai-news" />,
			isActive: activePage === PageNameEnum.News,
			forbid: !render.cryptoNews,
		},
		{
			link: routes.support.root,
			label: formatMessage(messages.support),
			icon: <i className="ai ai-support" />,
			isActive: activePage === PageNameEnum.Support,
			forbid: !render.supportCenter,
		},
		{
			link: routes.socialListing.root,
			label: formatMessage(socialListingMessages.social_listing_header),
			icon: <i className="ai ai-alc" />,
			isActive: activePage === PageNameEnum.SocialListing,
			forbid: !render.socialListing,
		},
		{
			link: routes.listing.root,
			label: formatMessage(messages.listing),
			icon: <i className="ai ai-listing" />,
			isActive: activePage === PageNameEnum.Listing,
			forbid: !render.listing,
		},
	];

	return (
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
				<div className={styles.mobile_sidebar} onClick={onMenuClick}>
					<i className={cn(styles.close_button, "ai ai-close")} />
					{!isAuthenticated && (
						<div className={styles.auth_block}>
							<InternalLink to={routes.login.root}>
								<Button
									fullWidth
									variant="outlined"
									mini={mobile}
									// className={styles.login_btn}
									label={formatMessage(messages.login)}
								/>
							</InternalLink>
							<InternalLink to={routes.register.root}>
								<Button
									variant="filled"
									color="primary"
									fullWidth
									mini={mobile}
									label={formatMessage(messages.register)}
								/>
							</InternalLink>
						</div>
					)}
					<div
						className={cn(styles.mobile_sidebar_item, styles.change_theme)}
						id="change-theme"
						onClick={handleThemeToggleClick}
					>
						<i className="ai ai-moon" />
						<span className={styles.dark_mode_label}>{formatMessage(messages.dark_mode)}</span>
						<Switch
							id="dark-mode-switch"
							checked={theme === ThemeEnum.Dark}
							onChange={toggleTheme}
						/>
					</div>
					<div
						className={cn(styles.mobile_sidebar_item, styles.pointer)}
						onClick={() => toggleLocaleModal(true)}
					>
						<i className="ai ai-web_outlined" />
						{formatMessage(messages.language_setting)}
					</div>
					{render.charity && (
						<InternalLink to={routes.charity}>
							<div className={cn(styles.mobile_sidebar_item, styles.save_ukraine)}>
								<img className={styles.save_ukraine_icon} alt="UA herb" src={HerbIcon} />
								{formatMessage(bonusMessages.save_ukraine)}
							</div>
						</InternalLink>
					)}
					{mainMenuItems.map((item) =>
						item.forbid ? null : (
							<InternalLink key={item.label} to={item.link}>
								<div className={cn(styles.mobile_sidebar_item, { [styles.active]: item.isActive })}>
									{item.icon}
									{item.label}
								</div>
							</InternalLink>
						),
					)}
					<div className={styles.sidebar_divider} />
					<div className={styles.mobile_sidebar_footer} id="footer-links">
						<div className={styles.icons_container}>
							{socialNetworks(locale).map((social) => (
								<a
									key={social.label}
									href={social.link}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`${social.label} ${config.department}`}
								>
									<i className={`ai ai-${social.icon}`} />
								</a>
							))}
						</div>
						{render.mobileApp && (
							<div className={styles.mobile_app_links}>
								<a href={config.mobileAppAppStore}>
									<img
										className={styles.link_image}
										src={AppleBtnImg}
										alt="logo"
										width="140"
										height="50"
									/>
								</a>
								<a className="app-link" href={config.mobileAppGooglePlay}>
									<img
										className={styles.link_image}
										src={GoogleBtnImg}
										alt="logo"
										width="140"
										height="50"
									/>
								</a>
							</div>
						)}
						<span className={styles.address}>
							© {year} {config.department}, {config.departmentAddress}
						</span>
					</div>
				</div>
			</CSSTransition>
			<LanguageSettingsModal
				isOpen={isLocaleModalOpened}
				onClose={() => toggleLocaleModal(false)}
			/>
		</>
	);
};

export default observer(MobileSidebar);
