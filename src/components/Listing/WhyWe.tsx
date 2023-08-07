import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import listingMessages from "messages/listing";
import styleProps from "utils/styleProps";
import styles from "styles/pages/Listing.module.scss";

const WhyWe = () => {
	const { formatMessage } = useIntl();

	const advantages = [
		{
			color: "rgba(126, 202, 165, 0.1)",
			icon: "ai-shield-03",
			iconColor: "#7ECAA5",
			title: formatMessage(listingMessages.security),
			desc: formatMessage(listingMessages.security_desc),
		},
		{
			color: "rgba(247, 179, 95, 0.1)",
			icon: "ai-star_filled",
			iconColor: "#F7B35F",
			title: formatMessage(listingMessages.reputation),
			desc: formatMessage(listingMessages.reputation_desc),
		},
		{
			color: "rgba(122, 171, 243, 0.1)",
			icon: "ai-support_new",
			iconColor: "#7AABF3",
			title: formatMessage(listingMessages.support),
			desc: formatMessage(listingMessages.support_desc),
		},
		{
			color: "rgba(253, 135, 185, 0.1)",
			icon: "ai-trade_new",
			iconColor: "#FD87B9",
			title: formatMessage(listingMessages.liquidity),
			desc: formatMessage(listingMessages.liquidity_desc),
		},
		{
			color: "rgba(78, 85, 162, 0.1)",
			icon: "ai-news",
			iconColor: "#4E55A2",
			title: formatMessage(listingMessages.marketing),
			desc: formatMessage(listingMessages.marketing_desc),
		},
	];

	return (
		<div className={cn(styles.content, styles.column, styles.why_we)}>
			<div className={styles.why_we_title}>{formatMessage(listingMessages.why_we_title)}</div>
			<span className={styles.why_we_desc}>{formatMessage(listingMessages.why_we_desc)}</span>
			<div className={styles.why_we_adv}>
				{advantages.map(({ color, desc, icon, iconColor, title }) => (
					<div key={title} className={styles.why_we_item}>
						<div style={styleProps({ backgroundColor: color })} className={styles.icon}>
							<i style={styleProps({ color: iconColor })} className={`ai ${icon}`} />
						</div>
						<div className={styles.meta}>
							<strong>{title}</strong>
							{desc}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default WhyWe;
