import React from "react";
import { useIntl } from "react-intl";
import competitionsMessages from "messages/competitions";
import { useMst } from "../../models/Root";
import Accordion from "../UI/Accordion";

const FAQ: React.FC = () => {
	const {
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<Accordion
			plain
			sections={[
				{
					label: formatMessage(competitionsMessages.faq_1_default_title),
					value: [
						{
							label: "faq_1_default_link_1",
							value: formatMessage(competitionsMessages.faq_1_default_link_1),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/vse-o-risk-menedzhmente-v-kripto-trejdinge"
									: "https://alp.com/en/stories/important-things-to-know-about-charts-in-crypto-trading",
						},
						{
							label: "faq_1_default_link_2",
							value: formatMessage(competitionsMessages.faq_1_default_link_2),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/tehnicheskij-analiz-rynka-ot-a-do-ya"
									: "https://alp.com/en/stories/important-things-to-know-about-charts-in-crypto-trading",
						},
					],
				},
				{
					label: formatMessage(competitionsMessages.faq_2_title),
					value: [
						{
							label: "faq_2_link_1",
							value: formatMessage(competitionsMessages.faq_2_link_1),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/chto-takoe-kyc-i-kak-proiti-ee-s-pervogo-raza"
									: "https://alp.com/en/stories/what-kyc-and-how-get-through-it",
						},
						{
							label: "faq_2_link_2",
							value: formatMessage(competitionsMessages.faq_2_link_2),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/osnovy-treidinga-na-kriptobirzhe-btc-alpha"
									: "https://alp.com/en/stories/basics-trading-btc-alpha-crypto-exchange",
						},
						{
							label: "faq_2_link_3",
							value: formatMessage(competitionsMessages.faq_2_link_3),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/est-vopros:-chto-takoe-aktivnye-ordera"
									: "https://alp.com/en/stories/got-a-question:-what-active-orders-are-and-how-they-work",
						},
						{
							label: "faq_2_link_4",
							value: formatMessage(competitionsMessages.faq_2_link_4),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/chto-takoe-stop-limit-order"
									: "https://alp.com/en/stories/a-stop-limit-order-and-how-to-use-it",
						},
						{
							label: "faq_2_link_5",
							value: formatMessage(competitionsMessages.faq_2_link_5),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/kak-2fa-pomogaet-polzovatelyu-izbezhat-poteri-aktivov"
									: "https://alp.com/en/stories/how-2fa-helps-users-in-avoiding-the-assets-loss",
						},
						{
							label: "faq_2_link_6",
							value: formatMessage(competitionsMessages.faq_2_link_6),
							link:
								locale === "ru"
									? "https://alp.com/ru/stories/kak-kontrolirovat-dostup-k-akkauntu"
									: "https://alp.com/ru/stories/how-to-control-the-access-to-your-account",
						},
					],
				},
				// {
				// 	label: formatMessage(competitionsMessages.faq_3_title),
				// 	value: [
				// 		{
				// 			label: "faq_3_link_1",
				// 			value: formatMessage(competitionsMessages.faq_3_link_1),
				// 			link:
				// 				locale === "ru"
				// 					? "https://alp.com/ru/stories/polnyj-obzor-demo-trejdinga-na-btc-alpha!"
				// 					: "https://alp.com/en/stories/a-full-overview-of-demo-trading-on-btc-alpha",
				// 		},
				// 	],
				// },
			]}
		/>
	);
};

export default FAQ;
