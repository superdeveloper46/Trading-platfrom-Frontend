import React from "react";
import { INews, INewsCategoryEnum } from "types/news";
import styles from "styles/pages/NewsDetails.module.scss";
import SafeImg from "components/UI/SafeImg";
import dayjs from "utils/dayjs";
import SkeletonLoader from "components/UI/Skeleton";
import Suggestions from "./Suggestions";

interface IProps {
	news?: INews;
	isLoading: boolean;
	category: INewsCategoryEnum;
}

const NewsDetailsSkeleton: React.FC = () => (
	<>
		<SkeletonLoader fullWidth count={2} />
		<div className={styles.meta}>
			<SkeletonLoader width={80} />
			<span className={styles.count}>
				<SkeletonLoader width={40} />
			</span>
		</div>
		<SkeletonLoader height={400} fullWidth />
		<SkeletonLoader fullWidth height={30} count={6} />
	</>
);

const NewsDetails: React.FC<IProps> = ({ news, isLoading, category }) => (
	<div className={styles.container}>
		{isLoading ? (
			<NewsDetailsSkeleton />
		) : news ? (
			<>
				<h1>{news.title}</h1>
				<div className={styles.meta}>
					<span className={styles.date}>{dayjs(news.date * 1000).fromNow()}</span>
					<span className={styles.count}>
						<i className="ai ai-eye" />
						{news.views}
					</span>
				</div>
				<picture>
					<source
						media="(max-width: 768px)"
						srcSet={news.image_thumbnail || ""}
						type="image/webp"
					/>
					<source srcSet={news.image_webp || ""} type="image/webp" />
					<SafeImg src={news.image || ""} alt={news.title || ""} />
				</picture>
				<div
					className={styles.content}
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: news.text ?? "" }}
				/>
				<Suggestions category={category} currentID={news.id} />
			</>
		) : null}
	</div>
);

export default NewsDetails;
