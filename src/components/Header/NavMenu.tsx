import React from "react";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import styles from "styles/components/Header.module.scss";
import listingMessages from "messages/listing";
import accountMessages from "messages/account";
import supportMessages from "messages/support";
import exchangeMessages from "messages/exchange";
import Herb from "assets/images/logos/icon-herb.svg";
import { ReactComponent as TradeCandleIcon } from "assets/icons/trade-candle-01.svg";
import { ReactComponent as WalletIcon } from "assets/icons/wallet-01.svg";
import { ReactComponent as PercentIcon } from "assets/icons/percent-01.svg";
import { ReactComponent as AnnouncementIcon } from "assets/icons/announcement-02.svg";
import VisaMastercard from "assets/images/common/visa_mastercard.svg";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import { TERMINAL_LATEST_PAIR_CACHE_KEY } from "utils/cacheKeys";
import useLocalStorage from "hooks/useLocalStorage";
import { AccountTypeEnum } from "types/account";
import config from "helpers/config";
import useAccountType from "hooks/useAccountType";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";
import NavMenuItem from "./NavMenuItem";

interface IProps {
	isLanding?: boolean;
}

const NavMenu: React.FC<IProps> = ({ isLanding }) => {
	const {
		global,
		account: { profileStatus },
		render,
	} = useMst();
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();
	const [latestTerminalPair] = useLocalStorage(
		TERMINAL_LATEST_PAIR_CACHE_KEY,
		config.defaultTerminalPair,
	);
	const type = useAccountType();
	const isAccountMargin = [AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(type);
	const logoPath = isLanding ? global.logoPathHome : global.logoPath;

	return (
		<div className={styles.nav}>
			<InternalLink to={routes.trade.root}>
				<img
					className={styles.nav_logo}
					src={logoPath}
					alt={logoPath ? config.department : ""}
					height="21"
				/>
			</InternalLink>
			<div className={styles.nav_menu}>
				{(render.listing || render.socialListing) && (
					<NavMenuItem
						name="listing"
						message={formatMessage(commonMessages.listing)}
						menu={[
							{
								icon: "listing",
								link: routes.listing.root,
								title: formatMessage(commonMessages.listing),
								subtitle: formatMessage(commonMessages.listing_desc),
								forbid: !render.listing,
							},
							{
								icon: "alc",
								link: routes.socialListing.root,
								title: formatMessage(listingMessages.social_listing_header),
								subtitle: formatMessage(listingMessages.social_listing_desc, { ref: "" }),
								forbid: !render.socialListing,
							},
						]}
					/>
				)}
				{(render.news || render.stories || render.cryptoNews) && (
					<NavMenuItem
						name="news"
						message={formatMessage(commonMessages.news)}
						menu={[
							{
								icon: <AnnouncementIcon />,
								link: routes.news.root,
								title: formatMessage(commonMessages.nav_crypto_news_title),
								subtitle: formatMessage(commonMessages.nav_crypto_news_desc),
								forbid: !render.cryptoNews,
							},
							{
								icon: <AnnouncementIcon />,
								link: routes.newsAlpCom.root,
								title: formatMessage(commonMessages.nav_news_of_exchange_title),
								subtitle: formatMessage(commonMessages.nav_news_of_exchange_desc),
								forbid: !render.news,
							},
							{
								icon: "alpha_stories",
								link: routes.stories.root,
								title: "Alpha Stories",
								subtitle: formatMessage(commonMessages.nav_alpha_stories_desc),
								forbid: !render.stories,
							},
						]}
					/>
				)}
				{render.staking && (
					<NavMenuItem
						link={routes.staking.plans}
						message={formatMessage(commonMessages.staking)}
					/>
				)}
				{render.competitions && (
					<NavMenuItem
						icon="cup competitions"
						link={routes.competitions.root}
						message={formatMessage(commonMessages.competitions)}
					/>
				)}
				{render.p2p && !profileStatus?.is_sub_account && (
					<NavMenuItem link={routes.p2p.root} message="P2P" />
				)}
				{render.transactionsMonitoring && (
					<NavMenuItem icon="fire" link="/aml" message={formatMessage(commonMessages.aml)} />
				)}
				<NavMenuItem
					icon={<TradeCandleIcon />}
					name="exchange"
					message={formatMessage(commonMessages.exchange)}
					menu={[
						{
							icon: <TradeCandleIcon />,
							link: routes.trade.getPair(latestTerminalPair),
							title: formatMessage(commonMessages.spot_terminal),
							subtitle: formatMessage(commonMessages.standard_desc),
							isActive:
								pathname.includes(`/${global.locale}/${URL_VARS.TRADE}/`) && !isAccountMargin,
						},
						{
							icon: <PercentIcon />,
							link: `/${URL_VARS.TRADE}/${config.defaultTerminalMarginPair}?${queryVars.layout}=advanced&${queryVars.type}=cross`,
							title: formatMessage(commonMessages.margin_terminal),
							subtitle: formatMessage(commonMessages.margin_trading_desc),
							isActive: pathname.includes(`/${global.locale}/trade/`) && isAccountMargin,
							forbid: !render.margin,
						},
						{
							icon: <WalletIcon />,
							link: `/${URL_VARS.BUY_CRYPTO}/${config.defaultBuyCryptoPair}`,
							title: formatMessage(commonMessages.buy_crypto),
							subtitle: formatMessage(commonMessages.buy_crypto_desc),
							isActive: pathname.includes(`/${global.locale}/buy-crypto`),
							forbid:
								!render.buyCrypto || (global.isAuthenticated && profileStatus?.is_sub_account),
							img: {
								name: "Visa/Mastercard",
								src: VisaMastercard,
							},
						},
					]}
				/>
				<NavMenuItem
					icon="info-circle"
					name="info"
					menu={[
						{
							icon: "hint_outline_new",
							link: routes.marginTradingFaq,
							title: `${formatMessage(accountMessages.margin_trading)} - FAQ`,
							subtitle: formatMessage(exchangeMessages.margin_trade_faq_desc),
							forbid: !render.margin,
						},
						{
							icon: "listing",
							link: routes.listing.root,
							title: formatMessage(commonMessages.listing),
							subtitle: formatMessage(commonMessages.listing_desc),
							forbid: !render.listing,
						},
						{
							icon: "alc",
							link: routes.socialListing.root,
							title: formatMessage(listingMessages.social_listing_header),
							subtitle: formatMessage(listingMessages.social_listing_desc, { ref: "" }),
							forbid: !render.socialListing,
						},
						{
							icon: "coin_new",
							link: routes.coin.root,
							title: formatMessage(commonMessages.coin_info),
							subtitle: formatMessage(commonMessages.coin_info_name_desc),
							forbid: !render.coinInfo,
						},
						{
							icon: "support_new",
							link: routes.support.root,
							title: formatMessage(supportMessages.support_center),
							subtitle: formatMessage(supportMessages.support_center_search_header),
							forbid: !render.supportCenter,
						},
					]}
				/>
				{render.charity && (
					<NavMenuItem
						img={{ src: Herb, name: "charity" }}
						link={routes.charity}
						isActive
						message={formatMessage(commonMessages.save_ukraine)}
					/>
				)}
			</div>
		</div>
	);
};

export default observer(NavMenu);
