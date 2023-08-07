import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { matchPath, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import cookies from "js-cookie";

import { routes, URL_VARS } from "constants/routing";
import { useMst } from "models/Root";
import useLocalStorage from "hooks/useLocalStorage";
import { availableLocales, defaultLocale } from "providers/LanguageProvider/i18n";
import { LOCALE_CACHE_KEY } from "utils/cacheKeys";
import useParamQuery from "hooks/useSearchQuery";
import Home from "pages/Home";
import Staking from "pages/Staking";
import MarginFAQ from "pages/MarginFAQ";
import Listing from "pages/Listing";
import News from "pages/News";
import AMLKYCPolicy from "pages/AMLKYCPolicy";
import RiskWarning from "pages/RiskWarning";
import PrivacyPolicy from "pages/PrivacyPolicy";
import TermsOfUse from "pages/TermsOfUse";
import Login from "pages/Login";
import ResetPassword from "pages/ResetPassword";
import Stories from "pages/Stories";
import StoryDetails from "pages/StoryDetails";
import NewsDetails from "pages/NewsDetails";
import SocialListing from "pages/SocialListing";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";
import Terminal from "pages/Terminal";
import BuyCrypto from "pages/BuyCrypto";
import Register from "pages/Register";
import SubAccounts from "pages/SubAccounts/SubAccounts";
import Wallets from "pages/Wallets";
import Competitions from "pages/Competitions";
import CompetitionDetails from "pages/CompetitionDetails";
import SocialListingProject from "pages/SocialListingProject";
import TradingFees from "pages/TradingFees";
import ProfileVerification from "pages/ProfileVerification";
import AuthenticatedRoute from "components/AuthenticatedRoute/AuthenticatedRoute";
import SupportCenter from "pages/SupportCenter";
import SocialListingDonatesHistory from "pages/SocialListingDonatesHistory";
import SocialListingHistory from "pages/SocialListingHistory";
import ProfileAPI from "pages/ProfileAPI";
import Notifications from "pages/Notifications";
import NotificationDetails from "pages/NotificationDetails";
import ProfileSecurity from "pages/ProfileSecurity";
import ProfileSettings from "pages/ProfileSettings";
import Referrals from "pages/Referrals";
import AlphaCodes from "pages/AlphaCodes";
import ProfileDashboard from "pages/ProfileDashboard";
import FinanceHistory from "pages/FinanceHistory";
import PageNotFound from "pages/PageNotFound";
import WalletDetails from "pages/WalletDetails";
import Deposit from "pages/Deposit";
import Withdrawal from "pages/Withdrawal";
import WithdrawVerification from "pages/WithdrawVerification";
import ConfirmPages from "pages/ConfirmPages";
import MultiCharts from "pages/MultiCharts";
import Transfers from "pages/Transfers";
import History from "pages/History/History";
import Fees from "pages/Fees";
import WelcomeBonus from "pages/WelcomeBonus";
import WelcomeBonusAward from "pages/WelcomeBonusAward";
import EmailConfirmation from "pages/EmailConfirmation";
import { HOST, REFERRAL_CODE_KEY, SHARING_LINK_PREFIX } from "utils/constants";
import CharityUA from "pages/CharityUA";
import CoinInfo from "pages/CoinInfo";
import MobileChart from "pages/MobileChart";
import MarginAgreement from "pages/MarginAgreement";
import { INewsCategoryEnum } from "types/news";
import CoinDetails from "pages/CoinDetails";
import ListingRequest from "pages/ListingRequest";
import TransactionsMonitoring from "pages/TransactionsMonitoring";
import P2P from "pages/P2P/P2P";
import FundingWallet from "pages/FundingWallet";

interface IRoute {
	path: string;
	component: React.ReactNode;
	authenticatedRoute?: boolean;
	isParent?: boolean;
}

export const routesProps: IRoute[] = [
	{
		path: routes.root,
		component: <Home />,
	},
	{
		path: routes.profile.root,
		component: <Navigate to={routes.profile.dashboard} />,
		authenticatedRoute: true,
	},
	{
		path: routes.verification.root,
		component: <ProfileVerification />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.dashboard.root,
		component: <ProfileDashboard />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.settings.root,
		component: <ProfileSettings />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.api.root,
		component: <ProfileAPI />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.security.root,
		component: <ProfileSecurity />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.profile.notification,
		component: <Notifications />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.notificationDetails,
		component: <NotificationDetails />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.wallets,
		component: <Wallets />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.fundingWallet,
		component: <FundingWallet />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.walletDetails,
		component: <WalletDetails />,
		authenticatedRoute: true,
	},
	{
		path: routes.history.root,
		component: <History />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.trade.root,
		component: <Navigate to={routes.trade.getPair(config.defaultTerminalPair)} />,
	},
	{
		path: routes.trade.pair,
		component: <Terminal />,
	},
	{
		path: routes.amlKycPolicy,
		component: <AMLKYCPolicy />,
	},
	{
		path: routes.riskWarning,
		component: <RiskWarning />,
	},
	{
		path: routes.privacyPolicy,
		component: <PrivacyPolicy />,
	},
	{
		path: routes.marginAgreement,
		component: <MarginAgreement />,
	},
	{
		path: routes.termsOfUse,
		component: <TermsOfUse />,
	},
	{
		path: routes.login.root,
		component: <Login />,
	},
	{
		path: routes.register.root,
		component: <Register />,
	},
	{
		path: routes.resetPassword,
		component: <ResetPassword />,
	},
	{
		path: routes.tradingFees,
		component: <TradingFees />,
	},
	{
		path: routes.support.root,
		component: <SupportCenter />,
		isParent: true,
	},
	{
		path: routes.charting,
		component: <MobileChart />,
	},
	{
		path: routes.multiCharts,
		component: <MultiCharts />,
	},
	{
		path: routes.financeHistory.root,
		component: <FinanceHistory />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.profile.createDeposit,
		component: <Navigate to={routes.profile.getDepositCurrency("USDT")} />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.createDepositCurrency,
		component: <Deposit />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.createWithdraw,
		component: <Navigate to={routes.profile.getWithdrawCurrency("BTC")} />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.createWithdrawCurrency,
		component: <Withdrawal />,
		authenticatedRoute: true,
	},
	{
		path: routes.profile.verifyWithdraw,
		component: <WithdrawVerification />,
		authenticatedRoute: true,
	},
	{
		path: routes.confirm.email,
		component: <EmailConfirmation />,
		isParent: true,
	},
	{
		path: routes.confirm.root,
		component: <ConfirmPages />,
		authenticatedRoute: true,
		isParent: true,
	},
	{
		path: routes.fees,
		component: <Fees />,
	},
];

if (config.isModuleOn(RenderModuleEnum.P2P)) {
	routesProps.push({
		path: routes.p2p.root,
		component: <P2P />,
		isParent: true,
	});
}

if (config.isModuleOn(RenderModuleEnum.TRANSFERS)) {
	routesProps.push({
		path: routes.transfers.root,
		component: <Transfers />,
		authenticatedRoute: true,
		isParent: true,
	});
}

if (config.isModuleOn(RenderModuleEnum.ALPHA_CODE)) {
	routesProps.push({
		path: routes.alphaCodes.root,
		component: <AlphaCodes />,
		authenticatedRoute: true,
		isParent: true,
	});
}

if (config.isModuleOn(RenderModuleEnum.REFERRALS)) {
	routesProps.push({
		path: routes.referrals.root,
		component: <Referrals />,
		authenticatedRoute: true,
		isParent: true,
	});
}

if (config.isModuleOn(RenderModuleEnum.BUY_CRYPTO)) {
	routesProps.push(
		{
			path: routes.buyCrypto.root,
			component: <BuyCrypto />,
		},
		{
			path: routes.buyCrypto.pair,
			component: <BuyCrypto />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.COIN_INFO)) {
	routesProps.push({
		path: routes.coin.root,
		component: <CoinInfo />,
		isParent: true,
	});
	routesProps.push({
		path: routes.coin.details,
		component: <CoinDetails />,
	});
}

if (config.isModuleOn(RenderModuleEnum.STAKING)) {
	routesProps.push({
		path: routes.staking.root,
		component: <Staking />,
		isParent: true,
	});
}

if (config.isModuleOn(RenderModuleEnum.STORIES)) {
	routesProps.push(
		{
			path: routes.stories.root,
			component: <Stories />,
		},
		{
			path: routes.stories.category,
			component: <Stories />,
		},
		{
			path: routes.stories.story,
			component: <StoryDetails />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.NEWS)) {
	routesProps.push(
		{
			path: routes.newsAlpCom.root,
			component: <News category={INewsCategoryEnum.EXCHANGE} />,
		},
		{
			path: routes.news.news,
			component: <NewsDetails category={INewsCategoryEnum.EXCHANGE} />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.CRYPTO_NEWS)) {
	routesProps.push(
		{
			path: routes.news.root,
			component: <News category={INewsCategoryEnum.WORLD} />,
		},
		{
			path: routes.news.news,
			component: <NewsDetails category={INewsCategoryEnum.WORLD} />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.COMPETITIONS)) {
	routesProps.push(
		{
			path: routes.competitions.root,
			component: <Competitions />,
		},
		{
			path: routes.competitions.details,
			component: <CompetitionDetails />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.LISTING)) {
	routesProps.push(
		{
			path: routes.listing.root,
			component: <Listing />,
		},
		{
			path: routes.listing.request,
			component: <ListingRequest />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.SOCIAL_LISTING)) {
	routesProps.push(
		{
			path: routes.socialListing.root,
			component: <SocialListing />,
		},
		{
			path: routes.socialListing.history,
			component: <SocialListingHistory />,
		},
		{
			path: routes.socialListing.project,
			component: <SocialListingProject />,
		},
		{
			path: routes.socialListing.projectDonatesHistory,
			component: <SocialListingDonatesHistory />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.MARGIN)) {
	routesProps.push({
		path: routes.marginTradingFaq,
		component: <MarginFAQ />,
	});
}

if (config.isModuleOn(RenderModuleEnum.CHARITY)) {
	routesProps.push({
		path: routes.charity,
		component: <CharityUA />,
	});
}

if (config.isModuleOn(RenderModuleEnum.WELCOME_BONUS)) {
	routesProps.push(
		{
			path: routes.welcomeBonus.root,
			component: <WelcomeBonus />,
		},
		{
			path: routes.welcomeBonus.bonus,
			component: <WelcomeBonusAward />,
		},
	);
}

if (config.isModuleOn(RenderModuleEnum.TRANSACTIONS_MONITORING)) {
	routesProps.push({
		path: routes.aml,
		component: <TransactionsMonitoring />,
	});
}

if (config.isModuleOn(RenderModuleEnum.SUB_ACCOUNTS)) {
	routesProps.push({
		path: routes.subAccounts.root,
		component: <SubAccounts />,
		authenticatedRoute: true,
		isParent: true,
	});
}

interface ILocaleProviderProps {
	children: React.ReactNode;
}

const LocaleProvider: React.FC<ILocaleProviderProps & any> = ({ children }) => {
	const { locale } = useParams<{ locale: string }>();
	const { pathname, search } = useLocation();
	const [cachedLocale] = useLocalStorage(LOCALE_CACHE_KEY, defaultLocale);
	const { global } = useMst();

	const isValidLocale = locale && availableLocales.includes(locale);
	const nextCachedLocale = availableLocales.includes(cachedLocale) ? cachedLocale : defaultLocale;
	const nextLocale = isValidLocale ? locale : nextCachedLocale;
	const splittedPath = pathname.split("/");

	let nextPath = nextLocale;

	if (splittedPath.length > 1 && !isValidLocale) {
		const formattedPath = splittedPath.slice(splittedPath.length > 2 ? 2 : 1).join("/");
		for (let i = 0; i < routesProps.length; i++) {
			const route = routesProps[i];
			if (route.path.includes(`/${formattedPath}`)) {
				nextPath = `/${nextLocale}/${formattedPath}${search}`;
				break;
			}
		}
	}

	useEffect(() => {
		global.setLocale(nextLocale);
	}, []);

	return isValidLocale ? children : <Navigate to={nextPath} />;
};

const ReferralRedirect = () => {
	const query = useParamQuery();
	const referralCode = query.get(REFERRAL_CODE_KEY);
	if (referralCode) {
		cookies.set(REFERRAL_CODE_KEY, referralCode);
	}

	window.location.replace(
		`https://link.btc-alpha.io/app/?link=${SHARING_LINK_PREFIX}${referralCode}&apn=com.btcalpha.exchange&amv=1.1.0&isi=1437629304&ibi=com.btc-alpha&imv=1.9.15&ofl=${HOST}/en?${REFERRAL_CODE_KEY}=${referralCode}`,
	);

	return <div />;
};

const CachedLocaleRedirect = () => {
	const [cachedLocale] = useLocalStorage(LOCALE_CACHE_KEY, defaultLocale);
	const { pathname, search } = useLocation();
	const nextLocale = availableLocales.includes(cachedLocale) ? cachedLocale : defaultLocale;

	let path = null;
	for (let i = 0; i < routesProps.length; i++) {
		const route = routesProps[i];
		path = matchPath(route.isParent ? `${route.path}/*` : route.path, pathname);
		if (path) {
			break;
		}
	}

	return path ? (
		<Navigate to={`/${nextLocale}${pathname === "/" ? "" : pathname}${search}`} />
	) : (
		<PageNotFound />
	);
};

const RouterURL: React.FC = () => {
	const {
		account: { profileStatus },
	} = useMst();

	return (
		<Routes>
			{routesProps
				.filter(({ path }) => {
					switch (path) {
						case routes.buyCrypto.pair:
						case routes.competitions.root:
						case routes.competitions.details:
						case routes.competitions.bonus:
						case routes.transfers.root:
						case routes.verification.root:
						case routes.alphaCodes.root:
						case routes.p2p.root:
							return !profileStatus?.is_sub_account;
						default:
							return true;
					}
				})
				.map(({ path, component, authenticatedRoute, isParent }) => (
					<Route
						key={path}
						path={`/:${URL_VARS.LOCALE}${path}${isParent ? "/*" : ""}`}
						element={
							authenticatedRoute ? (
								<AuthenticatedRoute>
									<LocaleProvider path={path}>{component}</LocaleProvider>
								</AuthenticatedRoute>
							) : (
								<LocaleProvider path={path}>{component}</LocaleProvider>
							)
						}
					/>
				))}
			<Route path={routes.invite} element={<ReferralRedirect />} />
			<Route path={URL_VARS.DEAD_END_ROUTE} element={<CachedLocaleRedirect />} />
		</Routes>
	);
};

export default observer(RouterURL);
