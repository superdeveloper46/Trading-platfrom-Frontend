import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import { useMst } from "models/Root";
import Modal, { Content, Footer } from "components/UI/Modal";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import { ActionTypeEnum } from "../AwardCard";

interface IProps {
	title?: string;
	isSocialCard?: boolean;
	buttonLabel?: string;
	buttonRedirectUrl?: string;
	awardAmount?: number;
	actionType?: ActionTypeEnum;
	isOpen: boolean;
	onClose: () => void;
}

const AwardModal: React.FC<IProps> = ({
	isSocialCard,
	buttonRedirectUrl,
	title,
	buttonLabel,
	awardAmount,
	actionType,
	isOpen,
	onClose,
}) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	const {
		global: { locale },
	} = useMst();

	const sharingUrl = `https://${window.location.hostname}/${locale}${routes.welcomeBonus.root}`;

	const onCopyClick = () => {
		copyClick(sharingUrl, formatMessage(messages.linkWasCopied));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} label={title}>
			<Content centered>
				<div className={styles.modal_award_bonus_icon}>${awardAmount}</div>
				{isSocialCard ? (
					<div className={styles.modal_social_desc_list}>
						<li>{formatMessage(messages.shareSocialNetworks)}</li>
						<li>
							<InternalLink
								className={styles.modal_redirect_link}
								onClick={onClose}
								to="/app/download"
							>
								{formatMessage(messages.downloadAppCTA)}
							</InternalLink>
						</li>
						<li>
							<a
								className={cn(styles.external_link, styles.modal_link)}
								onClick={onClose}
								href={locale === "ru" ? "https://t.me/btcalpha_ru" : "https://t.me/btcalpha"}
								target="_blank"
								rel="noopener noreferrer"
							>
								{formatMessage(messages.subscribeTelegram)}
							</a>
						</li>
					</div>
				) : actionType === ActionTypeEnum.trade ? (
					<span className={styles.award_description}>
						{formatMessage(messages.tradeToGetReward)}
					</span>
				) : (
					formatMessage(messages.verificationCTA, {
						verification: (
							<a
								className={cn(styles.external_link, styles.modal_link)}
								onClick={onClose}
								href={`/${locale}/${routes.verification.root}`}
							>
								{formatMessage(messages.identityVerification)}
							</a>
						),
					})
				)}
				{isSocialCard ? (
					<>
						<span className={styles.modal_secondary_title}>
							{formatMessage(messages.shareWithFriends)}
						</span>
						<div className={styles.modal_social_icon_list}>
							<a
								onClick={onClose}
								href={`https://twitter.com/intent/tweet?url=${sharingUrl}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
							>
								<i className="ai ai-twitter" />
							</a>
							<a
								onClick={onClose}
								href={`https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<i className="ai ai-facebook" />
							</a>
							<a
								onClick={onClose}
								href={`https://t.me/share/url?url=${sharingUrl}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Telegram"
							>
								<i className="ai ai-telegram" />
							</a>
							<a
								onClick={onClose}
								href="https://www.instagram.com/direct/inbox/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<i className="ai ai-instagram" />
							</a>
							{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
							<i className="ai ai-copy_new" onClick={onCopyClick} />
						</div>
					</>
				) : null}
			</Content>
			{!isSocialCard && (
				<Footer>
					<InternalLink
						className={styles.card_link_button}
						onClick={onClose}
						to={buttonRedirectUrl || ""}
					>
						<i className="ai ai-balance_outline" />
						{buttonLabel || formatMessage(messages.deposit)}
					</InternalLink>
				</Footer>
			)}
		</Modal>
	);
};

export default AwardModal;
