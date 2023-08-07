import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/pages/WelcomeBonus.module.scss";
import styleProps from "utils/styleProps";
import ExternalLink from "components/ExternalLink";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import AwardModal from "./modals/AwardModal";

interface IProps {
	isDone?: boolean;
}

const SocialCard: React.FC<IProps> = ({ isDone }) => {
	const {
		global: { locale },
	} = useMst();

	const copyClick = useCopyClick();
	const { mobile } = useWindowSize();
	const [isModalOpened, setIsModalOpened] = useState(false);

	const sharingUrl = `https:/${window.location.hostname}/${locale}${routes.welcomeBonus.root}`;

	const openModal = () => {
		setIsModalOpened(true);
	};

	const { formatMessage } = useIntl();

	const onCopyClick = () => {
		copyClick(sharingUrl, formatMessage(messages.linkWasCopied));
	};

	return (
		<div
			className={styles.card_wrapper}
			style={styleProps({ width: "100%" })}
			{...(mobile && !isDone && !isModalOpened ? { onClick: openModal } : {})}
		>
			<AwardModal
				isOpen={isModalOpened}
				onClose={() => setIsModalOpened(false)}
				awardAmount={10}
				isSocialCard
				title={formatMessage(messages.socialActivities)}
			/>
			{isDone ? <i className={cn(styles.card_checkmark, "ai ai-check_filled")} /> : null}
			{mobile && <i className={cn(styles.award_card_action_icon, "ai ai-chevron_right")} />}
			<div className={cn(styles.social_card_container, { [styles.isDone]: isDone })}>
				<div className={cn(styles.card_bonus, styles.marginTop)}>$10</div>
				<div className={styles.card_task_meta}>
					<span className={styles.card_task_title}>{formatMessage(messages.socialActivities)}</span>
					<ul className={styles.card_desc_list}>
						<li>{formatMessage(messages.shareSocialNetworks)}</li>
						<li>
							<ExternalLink to="/app/download">
								{formatMessage(messages.downloadAppCTA)}
							</ExternalLink>
						</li>
						<li>
							<ExternalLink
								to={locale === "ru" ? "https://t.me/btcalpha_ru" : "https://t.me/btcalpha"}
							>
								{formatMessage(messages.subscribeTelegram)}
							</ExternalLink>
						</li>
					</ul>
				</div>
				<div className={styles.card_share_block}>
					<span className={styles.secondary_text}>{formatMessage(messages.shareWithFriends)}</span>
					<div className={styles.social_list}>
						<a
							href="https://www.instagram.com/direct/inbox/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
						>
							<i className="ai ai-instagram" />
						</a>
						<a
							href={`https://twitter.com/intent/tweet?url=${sharingUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Twitter"
						>
							<i className="ai ai-twitter" />
						</a>
						<a
							href={`https://t.me/share/url?url=${sharingUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Telegram"
						>
							<i className="ai ai-telegram" />
						</a>
						<a
							href={`https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Facebook"
						>
							<i className="ai ai-facebook" />
						</a>
						{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
						<i className="ai ai-copy_new" onClick={onCopyClick} />
					</div>
					<InternalLink className={styles.bonus_link} to={routes.welcomeBonus.bonus}>
						{formatMessage(messages.getShareBonus)}
					</InternalLink>
				</div>
			</div>
		</div>
	);
};

export default observer(SocialCard);
