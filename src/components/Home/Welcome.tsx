import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import Slider, { Settings } from "react-slick";
import cn from "classnames";

import homepageMessages from "messages/home";
import { useNews } from "services/NewsService";
import WelcomeLines from "assets/images/home/welcome-lines.svg";
import WelcomeAstronaut from "assets/images/home/welcome-astronaut.svg";
import SafeImg from "components/UI/SafeImg";
import styles from "styles/pages/Home.module.scss";
import Skeleton from "components/UI/Skeleton";
import { INews } from "types/news";
import config from "helpers/config";
import { queryVars } from "constants/query";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import RegisterBlock from "./RegisterBlock";
import { Particles } from "./Particles";

interface IArrowProps {
	className?: string;
	onClick?: () => void;
}

const isSlickDisabled = (className: string) => className.match("slick-disabled");

const SampleNextArrow = ({ onClick, className }: IArrowProps) => {
	const isDisabled = isSlickDisabled(className || "");
	return (
		<button
			type="button"
			aria-label="next"
			onClick={onClick}
			className={cn(styles.slick_arrow, styles.slick_arrow_next, {
				[styles.slick_disabled]: isDisabled,
			})}
		>
			<i className="ai ai-chevron_right" />
		</button>
	);
};

const SamplePrevArrow = ({ onClick, className }: IArrowProps) => {
	const isDisabled = isSlickDisabled(className || "");
	return (
		<button
			type="button"
			aria-label="prev"
			onClick={onClick}
			className={cn(styles.slick_arrow, styles.slick_arrow_prev, {
				[styles.slick_disabled]: isDisabled,
			})}
		>
			<i className="ai ai-chevron_left" />
		</button>
	);
};

const settings: Settings = {
	dots: false,
	infinite: true,
	speed: 250,
	slidesToShow: 4,
	slidesToScroll: 1,
	autoplay: false,
	lazyLoad: "progressive",
	responsive: [
		{
			breakpoint: 1366,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
			},
		},
		{
			breakpoint: 960,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			},
		},
		{
			breakpoint: 548,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			},
		},
	],
	nextArrow: <SampleNextArrow />,
	prevArrow: <SamplePrevArrow />,
};

interface INewsItemProps {
	news: INews;
}

const NewsItem: React.FC<INewsItemProps> = ({ news }) => (
	<InternalLink to={routes.news.getNews(news.slug || "")}>
		<div className={styles.news_item}>
			<picture>
				<source media="(max-width: 768px)" srcSet={news.image_thumbnail || ""} type="image/webp" />
				<source srcSet={news.image_webp || ""} type="image/webp" />
				<SafeImg src={news.image || ""} alt={news.title ?? "news"} />
			</picture>
		</div>
	</InternalLink>
);

const Welcome: React.FC = () => {
	const { data: { results: news } = { results: [] }, isLoading } = useNews({
		[queryVars.page_size]: 4,
	});
	const { formatMessage } = useIntl();

	let filteredNews = news.filter((n: INews) => !!(n.image || n.image_thumbnail || n.image_webp));
	if (filteredNews.length > 0 && filteredNews.length < 4) {
		while (filteredNews.length < 4) {
			filteredNews = filteredNews.concat(filteredNews);
		}
	}

	return (
		<section className={cn(styles.section, styles.welcome_section)}>
			<Particles />
			<div className={styles.welcome_content}>
				<div className={styles.welcome_title_container}>
					<h1>
						{formatMessage(homepageMessages.welcome_to)}
						<span>{config.department}</span>
					</h1>
					<span>{formatMessage(homepageMessages.welcome_text_desc)}</span>
					<RegisterBlock name="welcome" />
				</div>
				<img src={WelcomeLines} alt="welcome" className={styles.welcome_lines} />
				<img src={WelcomeAstronaut} alt="welcome astronaut" className={styles.welcome_astronaut} />
			</div>
			<div className={styles.news_slider_container}>
				{isLoading ? (
					<div className={styles.news_slider_skeleton}>
						{[...new Array(4)].map((_, i) => (
							<div className={styles.news_item} key={i}>
								<Skeleton width={275} height={135} />
							</div>
						))}
					</div>
				) : Array.isArray(filteredNews) && filteredNews.length > 0 ? (
					<Slider {...settings}>
						{filteredNews.map((n: INews) => (
							<NewsItem news={n} key={n.id} />
						))}
					</Slider>
				) : null}
			</div>
		</section>
	);
};

export default observer(Welcome);
