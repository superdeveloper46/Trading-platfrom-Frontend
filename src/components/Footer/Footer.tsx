import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import cn from "classnames";

import { useMst } from "models/Root";
import messages from "messages/common";
import welcomeMessages from "messages/welcome_bonus";
import support_messages from "messages/support";
import feesMessages from "messages/fees_trading";
import newsMessages from "messages/news";
import alpha_code_messages from "messages/alpha_codes";
import AppleBtnImg from "assets/images/common/app-apple-button-white.svg";
import GoogleBtnImg from "assets/images/common/app-google-button-white.svg";
import styles from "styles/components/Footer.module.scss";
import SupportIcon from "assets/images/common/support-icon.svg";
import useWindowSize from "hooks/useWindowSize";
import Button from "components/UI/Button";
import LocaleSelector from "components/LocaleSelector";
import Clock from "components/Clock";
import InternalLink from "components/InternalLink";
import config from "helpers/config";
import { socialNetworks } from "constants/socialNetworks";
import { routes } from "constants/routing";
import profileInfo from "../Profile/Verification/ProfileInfo";

interface IListItem {
	label: string | React.ReactNode;
	link: string;
	permission: boolean;
}

interface IProps {
	isLanding?: boolean;
}

const year = new Date().getFullYear();

const Footer: React.FC<IProps> = ({ isLanding }) => {
	const {
		global: { isAuthenticated, locale, department },
		account: { profileStatus },
		render,
		promo,
	} = useMst();

	const { mobile, tablet } = useWindowSize();
	const { formatMessage } = useIntl();

	const supportLink = (
		<InternalLink className={styles.support_link} to={routes.support.request}>
			<img src={SupportIcon} alt="support" width="39" height="36" />
			&nbsp;
			{formatMessage(messages.support)}
		</InternalLink>
	);

	const authenticateBlock = useMemo(
		() =>
			!isAuthenticated ? (
				<div className={styles.auth_block}>
					<InternalLink to={routes.register.root}>
						<Button
							variant="filled"
							color="primary"
							fullWidth
							mini={mobile}
							label={formatMessage(messages.register)}
						/>
					</InternalLink>
					<InternalLink to={routes.login.root}>
						<Button
							fullWidth
							variant="text"
							mini={mobile}
							// className={styles.login_btn}
							label={formatMessage(messages.login)}
						/>
					</InternalLink>
				</div>
			) : null,
		[isAuthenticated, mobile],
	);

	const localeSelector = useMemo(
		() => (
			<LocaleSelector
				modalMode={mobile}
				className={styles.locale_selector}
				id="footer"
				isLanding={isLanding}
			/>
		),
		[isLanding, mobile],
	);

	const socialIcons = (
		<div className={styles.icon_container}>
			{socialNetworks(locale).map(({ link, icon, label }) => (
				<a
					key={label}
					className={styles.item}
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${label} ${config.department}`}
				>
					<i className={`ai ai-${icon}`} />
				</a>
			))}
		</div>
	);

	const productsList: IListItem[] = [
		{
			link: routes.trade.root,
			label: formatMessage(messages.exchange),
			permission: true,
		},
		{
			link: routes.stories.root,
			label: "Alpha Stories",
			permission: render.stories,
		},
		{
			link: routes.alphaCodes.root,
			label: formatMessage(alpha_code_messages.alpha_code),
			permission: isAuthenticated && render.alphaCode,
		},
		{
			link: routes.listing.root,
			label: formatMessage(messages.listing),
			permission: render.listing,
		},
		{
			link: routes.p2p.root,
			label: "P2P",
			permission: render.p2p && !profileStatus?.is_sub_account,
		},
		{
			link: routes.welcomeBonus.root,
			label: (
				<span className={styles.welcome_bonus_item}>
					<i className="ai ai-price" />
					{formatMessage(welcomeMessages.$100_bonus)}
				</span>
			),
			permission: render.welcomeBonus && Boolean(!isAuthenticated || promo.status),
		},
	];

	const informationList: IListItem[] = [
		{
			link: "/#",
			label: formatMessage(messages.home),
			permission: true,
		},
		// {
		// 	link: "/halving",
		// 	label: formatMessage(messages.halving),
		// 	permission: true,
		// },
		{
			link: routes.coin.root,
			label: formatMessage(messages.coin_info),
			permission: render.coinInfo,
		},
		{
			link: routes.fees,
			label: formatMessage(messages.fee),
			permission: true,
		},
		{
			link: routes.tradingFees,
			label: formatMessage(feesMessages.trading_fees),
			permission: true,
		},
		{
			link: routes.newsAlpCom.root,
			label: formatMessage(newsMessages.news),
			permission: render.news,
		},
		{
			link: routes.news.root,
			label: formatMessage(newsMessages.crypto_news),
			permission: render.cryptoNews,
		},
		{
			link: routes.support.root,
			label: formatMessage(support_messages.support_center),
			permission: render.supportCenter,
		},
	];

	const companyList: IListItem[] = [
		{
			link: routes.termsOfUse,
			label: "Terms of Use",
			permission: true,
		},
		{
			link: routes.privacyPolicy,
			label: "Privacy Policy",
			permission: true,
		},
		{
			link: routes.riskWarning,
			label: "Risk Warning",
			permission: true,
		},
		{
			link: routes.amlKycPolicy,
			label: "AML/KYC Policy",
			permission: true,
		},
		{
			link: routes.marginAgreement,
			label: "Margin Agreement",
			permission: true,
		},
	];

	return (
		<div className={cn(styles.container, { [styles.landing]: isLanding })}>
			<div className={styles.footer}>
				<div className={cn(styles.column_content, styles.social_column)}>
					{mobile && localeSelector}
					<div className={styles.logos_and_btns}>
						<div className={styles.logo_block}>
							<img
								src={department.logo_white_svg ?? ""}
								alt={department.logo_white_svg ? config.department : ""}
								height="21"
								loading="lazy"
							/>
						</div>
						{!tablet && authenticateBlock}
					</div>
					{!mobile && socialIcons}
					{tablet && authenticateBlock}
				</div>
				<div className={styles.links_container}>
					<div className={styles.list}>
						<div className={styles.header}>{formatMessage(messages.products)}</div>
						{productsList.map(
							({ link, permission, label }, idx) =>
								permission && (
									<div className={styles.item} key={idx}>
										<InternalLink to={link}>{label}</InternalLink>
									</div>
								),
						)}
					</div>
					<div className={styles.list}>
						<div className={styles.header}>{formatMessage(messages.information)}</div>
						{informationList.map(
							({ link, permission, label }, idx) =>
								permission && (
									<div className={styles.item} key={idx}>
										<InternalLink to={link}>{label}</InternalLink>
									</div>
								),
						)}
						<div className={styles.item}>
							<a href={config.publicApiPath} target="_blank" rel="noopener noreferrer">
								{formatMessage(messages.api)}
							</a>
						</div>
					</div>
					<div className={styles.list}>
						<div className={styles.header}>{formatMessage(messages.company)}</div>
						{companyList.map(
							({ link, permission, label }, idx) =>
								permission && (
									<div className={styles.item} key={idx}>
										<InternalLink to={link}>{label}</InternalLink>
									</div>
								),
						)}
					</div>
				</div>
				<div className={cn(styles.column_content, styles.apps_column)}>
					<div className={styles.support_container}>
						{(!tablet || mobile) && supportLink}
						{!mobile && localeSelector}
					</div>
					{render.mobileApp && (
						<div className={styles.mobile_apps}>
							<a href={config.mobileAppAppStore}>
								<img
									src={AppleBtnImg}
									alt="App Store "
									className={styles.image}
									width="150"
									height="45"
								/>
							</a>
							<a href={config.mobileAppGooglePlay}>
								<img
									src={GoogleBtnImg}
									alt="Google Play"
									className={styles.image}
									width="150"
									height="45"
								/>
							</a>
						</div>
					)}
					{tablet && !mobile && supportLink}
				</div>
			</div>
			<div className={styles.footer_copyright}>
				<div className={styles.addresses}>
					<span>
						© {year} {config.department}, {config.departmentAddress}
					</span>
				</div>
				<div className={styles.server_time}>
					<i className="ai ai-clock" />
					{formatMessage(messages.server_time)}: &nbsp;
					<strong>
						<Clock />
					</strong>
				</div>
			</div>
		</div>
	);
};

export default observer(Footer);
