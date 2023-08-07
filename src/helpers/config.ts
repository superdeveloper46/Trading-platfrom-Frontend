import { RenderModuleEnum } from "types/render";

const config = {
	department: process.env.REACT_APP_DEPARTMENT_NAME,
	departmentAddress: process.env.REACT_APP_DEPARTMENT_ADDRESS,

	apiPrefix: process.env.REACT_APP_SERVER_API_PREFIX ?? "",
	serverStaticPrefix: process.env.REACT_APP_SERVER_STATIC_PREFIX ?? "",
	sessionCookieName: process.env.REACT_APP_SESSION_COOKIE_NAME ?? "",
	deviceIDCookieName: process.env.REACT_APP_DEVICEID_COOKIE_NAME ?? "",
	csrfCookieName: process.env.REACT_APP_CSRF_COOKIE_NAME ?? "",

	salesDoubler: process.env.REACT_APP_SALES_DOUBLER ?? "",

	wsPrefix: process.env.REACT_APP_WS_PREFIX ?? "",

	gaID: process.env.REACT_APP_GA_ID ?? "",

	defaultTerminalPair: process.env.REACT_APP_DEFAULT_TERMINAL_PAIR ?? "BTC_USDT",
	defaultTerminalMarginPair: process.env.REACT_APP_DEFAULT_TERMINAL_MARGIN_PAIR ?? "BTC_USDT",
	defaultBuyCryptoPair: process.env.REACT_APP_DEFAULT_BUY_CRYPTO_PAIR ?? "USD_BTC",

	tickersQuotedCurrenciesBase: process.env.REACT_APP_TICKERS_QUOTED_CURRENCIES_BASE ?? "",
	tickersQuotedCurrenciesFiat: process.env.REACT_APP_TICKERS_QUOTED_CURRENCIES_FIAT ?? "",
	tickersQuotedCurrenciesDemo: process.env.REACT_APP_TICKERS_QUOTED_CURRENCIES_DEMO ?? "",

	ratesQuotedCurrencies: process.env.REACT_APP_RATES_QUOTED_CURRENCIES ?? "",
	maxOrderBookSize: process.env.REACT_APP_MAX_ORDERBOOK_SIZE ?? "100",

	mobileAppAppStore: process.env.REACT_APP_APP_STORE ?? "",
	mobileAppGooglePlay: process.env.REACT_APP_GOOGLE_PLAY ?? "",

	publicApiPath: process.env.REACT_APP_PUBLIC_API_PATH ?? "",

	mobileDownloadLink: process.env.REACT_APP_MOBILE_DOWNLOAD_LINK ?? "",

	[RenderModuleEnum.MOBILE_APP]: process.env.REACT_APP_MODULE_MOBILE_APP ?? "",
	[RenderModuleEnum.PAYMENT_SERVICE]: process.env.REACT_APP_MODULE_PAYMENT_SERVICES ?? "",
	[RenderModuleEnum.ALPHA_CODE]: process.env.REACT_APP_MODULE_ALPHA_CODE ?? "",
	[RenderModuleEnum.LISTING]: process.env.REACT_APP_MODULE_LISTING ?? "",
	[RenderModuleEnum.SOCIAL_LISTING]: process.env.REACT_APP_MODULE_SOCIAL_LISTING ?? "",
	[RenderModuleEnum.MARGIN]: process.env.REACT_APP_MODULE_MARGIN ?? "",
	[RenderModuleEnum.CHARITY]: process.env.REACT_APP_MODULE_CHARITY ?? "",
	[RenderModuleEnum.REFERRALS]: process.env.REACT_APP_MODULE_REFERRALS ?? "",
	[RenderModuleEnum.SUB_ACCOUNTS]: process.env.REACT_APP_MODULE_SUB_ACCOUNTS ?? "",
	[RenderModuleEnum.TRANSFERS]: process.env.REACT_APP_MODULE_TRANSFERS ?? "",
	[RenderModuleEnum.WELCOME_BONUS]: process.env.REACT_APP_MODULE_WELCOME_BONUS ?? "",
	[RenderModuleEnum.COMPETITIONS]: process.env.REACT_APP_MODULE_COMPETITIONS ?? "",
	[RenderModuleEnum.NEWS]: process.env.REACT_APP_MODULE_NEWS ?? "",
	[RenderModuleEnum.STORIES]: process.env.REACT_APP_MODULE_STORIES ?? "",
	[RenderModuleEnum.STAKING]: process.env.REACT_APP_MODULE_STAKING ?? "",
	[RenderModuleEnum.COIN_INFO]: process.env.REACT_APP_MODULE_COIN_INFO ?? "",
	[RenderModuleEnum.BUY_CRYPTO]: process.env.REACT_APP_MODULE_BUY_CRYPTO ?? "",
	[RenderModuleEnum.HOME_STATS]: process.env.REACT_APP_MODULE_HOME_STATS ?? "",
	[RenderModuleEnum.SUPPORT_CENTER]: process.env.REACT_APP_MODULE_SUPPORT_CENTER ?? "",
	[RenderModuleEnum.CRYPTO_NEWS]: process.env.REACT_APP_MODULE_CRYPTO_NEWS ?? "",
	[RenderModuleEnum.ALP_COIN]: process.env.REACT_APP_MODULE_ALP_COIN ?? "",
	[RenderModuleEnum.TRANSACTIONS_MONITORING]:
		process.env.REACT_APP_MODULE_TRANSACTIONS_MONITORING ?? "",
	[RenderModuleEnum.P2P]: process.env.REACT_APP_MODULE_P2P ?? "",

	isModuleOn: (key: RenderModuleEnum): boolean => config[key] === "true",
};

export default config;
