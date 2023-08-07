import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import { HOST } from "utils/constants";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import InternalLink from "../InternalLink";

const ShareLink: React.FC = () => {
	const {
		global: { locale },
	} = useMst();

	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const { slug } = useParams<{ slug?: string }>();
	const sharingUrl = `${HOST}/${locale}/competitions/${slug}`;

	const handleCopyLinkToClipboard = () => {
		copyClick(sharingUrl);
	};

	const social_links = [
		{
			link: "https://www.instagram.com/direct/inbox/",
			ariaLabel: "Instagram",
			icon: <i className="ai ai-instagram" />,
		},
		{
			link: `https://twitter.com/intent/tweet?url=${sharingUrl}`,
			ariaLabel: "Twitter",
			icon: <i className="ai ai-twitter" />,
		},
		{
			link: `https://t.me/share/url?url=${sharingUrl}`,
			ariaLabel: "Telegram",
			icon: <i className="ai ai-telegram" />,
		},
		{
			link: `https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`,
			ariaLabel: "Facebook",
			icon: <i className="ai ai-facebook" />,
		},
	];

	return (
		<div className={cn(styles.share_link_container, pageStyles.card, pageStyles.hasMobileBorder)}>
			<div className={styles.header}>
				<div className={styles.title}>
					<i className="ai ai-bar_chart_2" />
					{formatMessage(competitionsMessages.share_the_link_to_the_contest_and_get_a_bonus)}
				</div>
				<div className={styles.share_container}>
					<div className={styles.social_list}>
						{social_links.map(({ link, ariaLabel, icon }, index) => (
							<a
								key={index}
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={ariaLabel}
							>
								{icon}
							</a>
						))}
					</div>
					<button className={styles.copy_btn} type="button" onClick={handleCopyLinkToClipboard}>
						<i className="ai ai-copy_new" />
					</button>
				</div>
			</div>
			<div className={styles.content}>
				<InternalLink to={routes.competitions.getCompetitionBonus(slug || "")}>
					{formatMessage(competitionsMessages.i_have_already_shared_the_link)}
				</InternalLink>
			</div>
		</div>
	);
};

export default observer(ShareLink);
