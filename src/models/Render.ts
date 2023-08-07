import { Instance, types as t } from "mobx-state-tree";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";

export const Render = t.model({
	mobileApp: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.MOBILE_APP)),
	paymentServices: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.PAYMENT_SERVICE)),
	alphaCode: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.ALPHA_CODE)),
	listing: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.LISTING)),
	socialListing: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.SOCIAL_LISTING)),
	margin: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.MARGIN)),
	charity: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.CHARITY)),
	referrals: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.REFERRALS)),
	subAccounts: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.SUB_ACCOUNTS)),
	transfers: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.TRANSFERS)),
	welcomeBonus: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.WELCOME_BONUS)),
	competitions: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.COMPETITIONS)),
	news: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.NEWS)),
	cryptoNews: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.CRYPTO_NEWS)),
	stories: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.STORIES)),
	staking: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.STAKING)),
	coinInfo: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.COIN_INFO)),
	buyCrypto: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.BUY_CRYPTO)),
	homeStats: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.HOME_STATS)),
	supportCenter: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.SUPPORT_CENTER)),
	alpCoin: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.ALP_COIN)),
	p2p: t.optional(t.boolean, config.isModuleOn(RenderModuleEnum.P2P)),
	transactionsMonitoring: t.optional(
		t.boolean,
		config.isModuleOn(RenderModuleEnum.TRANSACTIONS_MONITORING),
	),
});

export type IRender = Instance<typeof Render>;
