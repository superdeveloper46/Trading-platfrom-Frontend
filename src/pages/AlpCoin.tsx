import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import MainLayout from "layouts/MainLayout";
import styles from "styles/pages/AlpCoin.module.scss";
import messages from "messages/alp_coin";
import SupportImg from "assets/images/alp_coin/support.svg";
import CompanyImg from "assets/images/alp_coin/company.svg";
import dark_Road_Map_desktop_en from "assets/images/alp_coin/Dark_Road_map_Desktop_EN.svg";
import dark_Road_Map_desktop_ru from "assets/images/alp_coin/Dark_Road_map_Desktop_RU.svg";
import dark_Road_Map_phone_en from "assets/images/alp_coin/Dark_Road_map_Mobile_EN.svg";
import dark_Road_Map_phone_ru from "assets/images/alp_coin/Dark_Road_map_Mobile_RU.svg";
import light_Road_Map_desktop_en from "assets/images/alp_coin/Road_map_Desktop_EN.svg";
import light_Road_Map_desktop_ru from "assets/images/alp_coin/Road_map_Desktop_RU.svg";
import light_Road_Map_phone_en from "assets/images/alp_coin/Road_map_Mobile_EN.svg";
import light_Road_Map_phone_ru from "assets/images/alp_coin/Road_map_Mobile_RU.svg";
import AlpCoinImg from "assets/images/alp_coin/alp_coin.svg";
import AlpCoinUsage from "assets/images/alp_coin/alp_coin_usage.svg";
import { useMst } from "models/Root";
import Button from "components/UI/Button";
import useWindowSize from "hooks/useWindowSize";
import InternalLink from "components/InternalLink";
import { getPageTitle } from "helpers/global";
import { routes } from "constants/routing";

interface IThemesDictionary<TValue> {
	[id: string]: TValue;
}

const light = {
	desktop_en: light_Road_Map_desktop_en,
	desktop_ru: light_Road_Map_desktop_ru,
	mobile_en: light_Road_Map_phone_en,
	mobile_ru: light_Road_Map_phone_ru,
};
const dark = {
	desktop_en: dark_Road_Map_desktop_en,
	desktop_ru: dark_Road_Map_desktop_ru,
	mobile_en: dark_Road_Map_phone_en,
	mobile_ru: dark_Road_Map_phone_ru,
};

const whitepapers = {
	ru: "https://drive.google.com/open?id=1M2tJ8nHIP4zEDDXLJp26rfsjXWorD55v",
	en: "https://drive.google.com/open?id=1biSnVEQaKj6wrXbb5YkrbzbjbdUM4xH7",
};

const themes: IThemesDictionary<any> = { light: light, dark: dark };

const useBackground = (theme: string, locale: string) => {
	const { mobile, tablet } = useWindowSize();
	if (!theme || !locale) return "";
	let bkg = `url(${
		themes[theme][`desktop_${locale}`] || themes[theme].desktop_en
	}) center no-repeat`;

	if (tablet) {
		bkg = `url(${themes[theme][`mobile_${locale}`] || themes[theme].mobile_en}) center no-repeat`;
	} else if (mobile) {
		bkg = `url(${
			themes[theme][`mobile_${locale}`] || themes[theme].mobile_en
		}) center / 80 % no-repeat`;
	}

	return bkg;
};

const AlpCoin: React.FC = () => {
	const {
		global: { locale, theme },
		render,
	} = useMst();
	const { formatMessage } = useIntl();
	const background = useBackground(theme, locale);
	const title = getPageTitle("Alp Coin");

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				<div className={styles.alp_coin_card_content}>
					<h1 className={styles.title}>ALP Coin</h1>
					<div className={styles.alp_coin_panel_img}>
						<img src={AlpCoinImg} alt="ALP Coin" />
					</div>
					<div className={styles.alp_coin_text_description}>
						{formatMessage(messages.alp_coin_desc)}
					</div>
					<InternalLink to={routes.trade.getPair("ALP_USDT")}>
						<Button className={styles.wide_button} label={formatMessage(messages.buy_btn)} />
					</InternalLink>
					<div className={cn(styles.alp_coin_panel_img, styles.with_top_margin)}>
						<img src={AlpCoinUsage} alt="ALP Coin usages" />
					</div>
					<div className={styles.alp_coin_main_text}>
						{formatMessage(messages.alp_coin_advantages)}
					</div>
					<div className={styles.alp_coin_text_description}>
						{formatMessage(messages.alp_coin_advantages_desc)}
					</div>
					<div className={styles.feature_set}>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-fees")} />
							<div className={styles.feature_name}>{formatMessage(messages.advantage_1)}</div>
							<div className={styles.feature_description}>
								{formatMessage(messages.advantage_1_desc)}
							</div>
						</div>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-shield-03")} />
							<div className={styles.feature_name}>{formatMessage(messages.advantage_2)}</div>
							<div className={styles.feature_description}>
								{formatMessage(messages.advantage_2_desc)}
							</div>
						</div>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-sentence")} />
							<div className={styles.feature_name}>{formatMessage(messages.advantage_3)}</div>
							<div className={styles.feature_description}>
								{formatMessage(messages.advantage_3_desc)}
							</div>
						</div>
					</div>
					<div>
						<div className={styles.alp_coin_main_text}>{formatMessage(messages.materials)}</div>
						<div className={styles.row}>
							<div className={styles.col}>
								<a
									href={whitepapers[locale === "ru" ? "ru" : "en"]}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className={styles.alp_document}>
										<i className={cn(styles.alp_document_img, styles.pdf_img, "ai ai-pdf")} />
										<div className={styles.alp_document_text}>Whitepaper</div>
									</div>
								</a>
							</div>
							<div className={styles.col}>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://drive.google.com/drive/u/0/folders/1f7b2tHOhK7ptiB0SiqeWm9KY7PAv6rIy"
								>
									<div className={styles.alp_document}>
										<i className={cn(styles.alp_document_img, "ai ai-mediakit")} />
										<div className={styles.alp_document_text}>MediaKit</div>
									</div>
								</a>
							</div>
						</div>
					</div>
					<div className={cn(styles.alp_coin_panel_img, styles.with_top_margin)}>
						<img src={CompanyImg} alt="Company products" />
					</div>
					<div className={styles.alp_coin_main_text}>
						{formatMessage(messages.company_benefits)}
					</div>
					<div className={styles.alp_coin_text_description}>
						{formatMessage(messages.company_benefits_desc)}
					</div>
					<div className={styles.feature_set}>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-paradice")} />
							<div className={styles.feature_name}>{formatMessage(messages.benefit_1)}</div>
						</div>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-development")} />
							<div className={styles.feature_name}>{formatMessage(messages.benefit_3)}</div>
						</div>
						<div className={styles.feature_set_item}>
							<i className={cn(styles.feature_img, "ai ai-star_filled")} />
							<div className={styles.feature_name}>{formatMessage(messages.benefit_2)}</div>
						</div>
					</div>
					<InternalLink to={routes.trade.getPair("ALP_USDT")}>
						<Button className={styles.wide_button} label={formatMessage(messages.buy_btn)} />
					</InternalLink>
					<div className={styles.road_map}>
						<div className={styles.alp_coin_main_text}>{formatMessage(messages.road_map)}</div>
						<div className={cn(styles.road_map, styles.road_map_img_wrapper)}>
							<div className={styles.road_map_block} style={{ background }} />
						</div>
					</div>
					{render.supportCenter && (
						<div className={styles.support_block}>
							<div>
								<img src={SupportImg} alt="Support" />
							</div>
							<div className={styles.alp_coin_main_text}>
								{formatMessage(messages.support_text)}
							</div>
							<div className={styles.alp_coin_text_description}>
								{formatMessage(messages.support_text_desc, {
									ref1: (
										<>
											<br />
											<InternalLink to={routes.support.root} className="text-center">
												{formatMessage(messages.support_link)}
											</InternalLink>
										</>
									),
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default observer(AlpCoin);
