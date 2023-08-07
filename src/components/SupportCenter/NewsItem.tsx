import React from "react";
import cn from "classnames";
import { FormattedMessage } from "react-intl";

import messages from "messages/exchange";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/SupportCenter.module.scss";
import { routes } from "constants/routing";
import { ISupportCenterNewsItem } from "../../types/supportCenter";

interface Props {
	item: ISupportCenterNewsItem;
	hideBottomBorder?: boolean;
}

const NewsItem: React.FC<Props> = ({ item, hideBottomBorder = false }) => (
	<div className={cn(styles.news_item_wrapper, !hideBottomBorder && styles.with_bottom_border)}>
		<div className={styles.news_item_header}>
			<InternalLink to={routes.support.getArticle(item.slug)}>
				{item.title}
				{/* TODO: where is listing item?? it's empty block */}
				<div className={styles.listing_icon} />
			</InternalLink>
		</div>
		<div className={styles.news_item_body}>{item.content}</div>
		<div className={styles.news_item_link}>
			<InternalLink to={routes.support.getArticle(item.slug)}>
				<FormattedMessage {...messages.details} />
				<i className="ai ai-chevron_right" />
			</InternalLink>
		</div>
	</div>
);

export default NewsItem;
