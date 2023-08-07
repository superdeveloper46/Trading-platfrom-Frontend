import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { unix } from "dayjs";

import messages from "messages/home";
import styles from "styles/pages/News.module.scss";
import InternalLink from "components/InternalLink";
import SafeImg from "components/UI/SafeImg";
import useWindowSize from "hooks/useWindowSize";
import { INews, INewsCategoryEnum } from "types/news";
import { routes } from "constants/routing";

interface IProps {
	news: INews;
	category: INewsCategoryEnum;
}

const NewsListItem: React.FC<IProps> = ({ news, category }) => {
	const { medium } = useWindowSize();
	const { formatMessage } = useIntl();
	const link = `${category === INewsCategoryEnum.WORLD ? "news" : "news-alpcom"}/${news.slug}`;
	const url = window.location.href;

	return (
		<div className={styles.list_item}>
			<InternalLink to={`/${link}`} />
			<div className={styles.list_item_picture_link}>
				<picture>
					<source
						media="(max-width: 768px)"
						srcSet={news.image_thumbnail || ""}
						type="image/webp"
					/>
					<source srcSet={news.image_webp || ""} type="image/webp" />
					<SafeImg src={news.image || ""} alt={news.title || ""} />
				</picture>
			</div>
			<div className={styles.list_item_share}>
				{[
					{
						icon: "facebook",
						link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
					},
					{
						icon: "twitter",
						link: `https://twitter.com/intent/tweet?url=${url}`,
					},
					{
						icon: "telegram",
						link: `https://telegram.me/share/url?url=${url}`,
					},
				].map((item, idx) => (
					<a key={idx} href={item.link} target="_blank" rel="noreferrer">
						<i className={cn(styles.network_icon, `ai ai-${item.icon}`)} />
					</a>
				))}
				<div className={styles.list_item_view_counter}>
					<i className="ai ai-eye" />
					&nbsp;
					{news.views}
				</div>
				<div className={styles.list_item_date}>
					{unix(news.date)
						.utc()
						.format(medium ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}
				</div>
			</div>
			<div className={styles.list_item_content}>
				<h2>{news.title}</h2>
				{news.short_text ? (
					<span
						className={styles.list_item_text}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: news.short_text ?? "" }}
					/>
				) : null}
			</div>
			<div className={styles.list_item_learn_more}>
				<InternalLink className="blue-text" to={routes.news.getNews(news.slug || "")}>
					{formatMessage(messages.learn_more)} &nbsp;
					<i className="ai ai-arrow_right blue-text" />
				</InternalLink>
			</div>
		</div>
	);
};

export default NewsListItem;
