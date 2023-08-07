import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import styles from "styles/pages/P2P/Merchant.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import cardsImg from "assets/images/p2p/merchant-cards.png";
import phoneImg from "assets/images/p2p/merchant-phone.png";
import Button from "components/UI/Button";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { useMerchantRequestStatus } from "services/P2PService";
import { MerchantStatusEnum } from "types/p2p";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useWindowSize from "hooks/useWindowSize";
import p2pMessages from "messages/p2p";
import messages from "messages/common";
import verificationMessages from "messages/verification";

const MerchantCards = () => {
	const { formatMessage } = useIntl();
	const {
		account: { profileStatus },
	} = useMst();

	const { mobile } = useWindowSize();

	const { data: status, isFetching } = useMerchantRequestStatus();

	const localeNavigate = useLocaleNavigate();

	const requirements = [
		{
			label: formatMessage(p2pMessages.verification_lvl1),
			isReady: (profileStatus?.verification_level || 0) >= 1,
			actionLabel: mobile
				? formatMessage(verificationMessages.apply)
				: formatMessage(p2pMessages.pass_1lvl),
			link: routes.verification.identity,
		},
		{
			label: formatMessage(p2pMessages.verification_lvl2),
			isReady: (profileStatus?.verification_level || 0) >= 2,
			actionLabel: mobile
				? formatMessage(verificationMessages.apply)
				: formatMessage(p2pMessages.pass_2lvl),
			link: routes.verification.address,
		},
		{
			label: formatMessage(p2pMessages.two_factor_auth),
			isReady: profileStatus?.two_factor_enabled,
			actionLabel: mobile
				? formatMessage(verificationMessages.apply)
				: formatMessage(p2pMessages.enable_2fa),
			link: routes.security.authenticator,
		},
	];

	const isValid =
		requirements.every(({ isReady }) => isReady) &&
		status &&
		[MerchantStatusEnum.DEFAULT, MerchantStatusEnum.CANCELLED_BY_MODERATOR].includes(status.status);

	const handleRedirect = () => {
		if (isValid) {
			localeNavigate(routes.p2p.becomeMerchant);
		}
	};

	const buttonLabel: string = (() => {
		switch (status?.status) {
			case MerchantStatusEnum.MODERATION:
				return formatMessage(p2pMessages.on_moderation);
			case MerchantStatusEnum.MERCHANT:
				return formatMessage(p2pMessages.already_merchant);
			default:
				return formatMessage(p2pMessages.become_merchant);
		}
	})();

	return isFetching ? (
		<LoadingSpinner />
	) : (
		<div className={styles.card_wrapper}>
			<div className={cn(styles.card, styles.promo)}>
				<span className={styles.card_title}>
					<i className="ai ai-check_filled" />
					{formatMessage(p2pMessages.verified_badges)}
				</span>
				<span className={p2pStyles.default_text}>
					{formatMessage(p2pMessages.verified_badges_desc)}
				</span>
				<img className={styles.cards_image} src={cardsImg} alt="cards" />
			</div>
			<div className={cn(styles.card, styles.promo)}>
				<span className={styles.card_title}>{formatMessage(p2pMessages.customer_support)}</span>
				<span className={p2pStyles.default_text}>
					{formatMessage(p2pMessages.customer_support_desc)}
				</span>
				<img className={styles.phone_image} src={phoneImg} alt="phone" />
			</div>
			<div className={styles.card}>
				<span className={styles.card_title}>{formatMessage(messages.information)}</span>
				<div className={styles.card_separator} />
				<div className={styles.card_main}>
					<div className={styles.information_item}>
						<span className={p2pStyles.smallcaps_label}>{formatMessage(p2pMessages.nickname)}</span>
						<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
							{profileStatus?.username}
						</span>
					</div>
					<div className={styles.information_item}>
						<span className={p2pStyles.smallcaps_label}>{formatMessage(messages.email)}</span>
						<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
							{profileStatus?.email}
						</span>
					</div>
					<div className={styles.information_item}>
						<span className={p2pStyles.smallcaps_label}>{formatMessage(p2pMessages.region)}</span>
						<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
							{profileStatus?.residence_country}
						</span>
					</div>
					{/* <div className={styles.information_item}> */}
					{/*	<span className={p2pStyles.smallcaps_label}>available currency</span> */}
					{/*	<span className={cn(p2pStyles.default_text, p2pStyles.bold)}> */}
					{/*		UAH EUR GBP USD PLN CZK KZT GEL THB TRY RUB NPR LKR */}
					{/*	</span> */}
					{/* </div> */}
				</div>
			</div>
			<div className={styles.card}>
				<span className={styles.card_title}>{formatMessage(p2pMessages.requirements)}</span>
				<div className={styles.card_separator} />
				<div className={cn(styles.card_main, styles.requirements)}>
					{requirements.map(({ isReady, actionLabel, label, link }, i) => (
						<div key={i} className={styles.requirement_item}>
							<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>{label}</span>
							{isReady ? (
								<div className={p2pStyles.ready_badge}>
									{formatMessage(messages.ready)} <i className="ai ai-check_outlined" />
								</div>
							) : (
								<InternalLink className={styles.link} to={link}>
									{actionLabel} <i className="ai ai-arrow_right" />
								</InternalLink>
							)}
						</div>
					))}
				</div>
				<Button
					onClick={handleRedirect}
					className={styles.become_merchant_btn}
					fullWidth
					disabled={!isValid}
					label={buttonLabel}
				/>
			</div>
		</div>
	);
};

export default MerchantCards;
