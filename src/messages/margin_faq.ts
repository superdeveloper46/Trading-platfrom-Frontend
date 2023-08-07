import { defineMessages } from "react-intl";

export default defineMessages({
	page_title: {
		id: "app.containers.terminal.page_title",
		defaultMessage: "FAQ on margin trading",
	},
	page_subtitle: {
		id: "app.containers.terminal.page_subtitle",
		defaultMessage: "Everything you wanted to know about it",
	},
	faq_1_title: {
		id: "app.containers.terminal.faq_1_title",
		defaultMessage: "How is margin trading different from spot trading?",
	},
	faq_1_description: {
		id: "app.containers.terminal.faq_1_description",
		defaultMessage:
			"Spot trading is when you trade only from the funds that are available on your balance. Margin trading gives you the opportunity to invest borrowed funds in trading, thereby increasing your profits.\n\nThe loan is provided by the cryptocurrency platform or other traders for a percentage of your trades.",
	},
	faq_2_title: {
		id: "app.containers.terminal.faq_2_title",
		defaultMessage: "What is margin?",
	},
	faq_2_description: {
		id: "app.containers.terminal.faq_2_description",
		defaultMessage:
			"Margin is the amount of collateral that is blocked on your account when you open a deal as collateral for the borrowed funds that you receive for trading. The more leverage, the less margin is required, but the more are the risks. However, it is not necessary to trade aggressively simply because you can - with careful and strategically verified trading, the risks will be much less.",
	},
	faq_3_title: {
		id: "app.containers.terminal.faq_3_title",
		defaultMessage: "How is the margin calculated?",
	},
	faq_3_description: {
		id: "app.containers.terminal.faq_3_description",
		defaultMessage:
			"In pairs where the US dollar is the main currency, the current rate is not taken into account, and where it is secondary, it is taken. Why is that? Because in the first case, nothing is recalculated.",
	},
	faq_4_title: {
		id: "app.containers.terminal.faq_4_title",
		defaultMessage: "What is Leverage?",
	},
	faq_4_description: {
		id: "app.containers.terminal.faq_4_description",
		defaultMessage:
			"Leverage is the amount of borrowed funds that depends on your margin. For example, x10 leverage is an amount of funds that is 10 times the amount of your margin. From this amount, you cover the amount of the margin, and the rest is covered by the lender.",
	},
	faq_5_title: {
		id: "app.containers.terminal.faq_5_title",
		defaultMessage: "What is required to start margin trading?",
	},
	faq_5_description: {
		id: "app.containers.terminal.faq_5_description",
		defaultMessage:
			"Isolated margin trading is available to registered members of the platform. In order to start cross-margin trading, you need to open a cross-margin account. You can take a loan manually or automatically when placing an order.",
	},
	faq_6_title: {
		id: "app.containers.terminal.faq_6_title",
		defaultMessage: "How is cross-margin trading different from isolated trading?",
	},
	faq_6_description: {
		id: "app.containers.terminal.faq_6_description",
		defaultMessage:
			"Isolated margin applies only to individual cryptocurrency pairs, as well as the risks of such trading. Its level is calculated for each account separately, and the liquidation of positions here does not affect other accounts. This margin is added manually.\n\nCross-margin applies to all assets and trading pairs of the user.\n\nThere can be only one cross margin account. The margin level, accordingly, is calculated based on the total amount of your assets, and the liquidation of one position means the liquidation of all the others.",
	},
	faq_7_title: {
		id: "app.containers.terminal.faq_7_title",
		defaultMessage: "What type of margin trading should a beginner start with?",
	},
	faq_7_description: {
		id: "app.containers.terminal.faq_7_description",
		defaultMessage:
			"Beginners are advised to start with isolated margin, as in this case the trading risks are less. Cross-margin is a more advanced level, there are more risks, but also more opportunities.",
	},
	faq_8_title: {
		id: "app.containers.terminal.faq_8_title",
		defaultMessage: "How is debt repaid on the platform?",
	},
	faq_8_description: {
		id: "app.containers.terminal.faq_8_description",
		defaultMessage:
			"To pay off the debt, it is imperative to use the same coin in which the debt was taken. First, the funds will go to pay interest on the debt, and everything else will go directly to pay it, so it is important to ensure that you have enough funds in your account in the required cryptocurrency. You can repay the entire debt at once or in parts.",
	},
	faq_9_title: {
		id: "app.containers.terminal.faq_9_title",
		defaultMessage: "What is the margin level and how is it calculated?",
	},
	faq_9_description: {
		id: "app.containers.terminal.faq_9_description",
		defaultMessage:
			"The margin level is a coefficient that helps you assess your risks and affects the number of actions available to you. It is calculated using the following formula:\n\nTotal asset value\n\nThe total cost of borrowed funds + interest on them\n\nLet's look at the margin levels using the example of x3 leverage:\n\nIf the quotient is more than 2, you can borrow, trade and transfer funds to a spot account. If the value is less than 2, you will no longer be able to transfer funds to the spot account. A margin level of 1.5 and below means that the option to borrow funds is not available to you, and a value of 1.1 or below means a margin call to liquidate.",
	},
	faq_10_title: {
		id: "app.containers.terminal.faq_10_title",
		defaultMessage: "What is margin call?",
	},
	faq_10_description: {
		id: "app.containers.terminal.faq_10_description",
		defaultMessage:
			"A margin call is a notification that you need to deposit margin in order to continue trading, otherwise the position will be liquidated. You can receive such notifications in any way convenient for you - via SMS, e-mail or a message on our website.",
	},
	faq_11_title: {
		id: "app.containers.terminal.faq_11_title",
		defaultMessage: "When does liquidation occur?",
	},
	faq_11_description: {
		id: "app.containers.terminal.faq_11_description",
		defaultMessage:
			"The position is liquidated when the margin level reaches the liquidation value.\n\nLiquidation upon reaching levels depending on the leverage on ALP.COM:\n\nLeverage x3, x5, x10\nMargin call level 1.3, 1.15, 1.08\nLiquidation level 1.1, 1.05, 1.03",
	},
});
