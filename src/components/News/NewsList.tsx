import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";

import messages from "messages/news";
import { INews, INewsCategoryEnum } from "types/news";
import styles from "styles/pages/News.module.scss";
import { useNews } from "services/NewsService";
import SkeletonLoader from "components/UI/Skeleton";
import EmptyContent from "components/EmptyContent";
import { queryVars } from "constants/query";
import NewsListItem from "./NewsListItem";

const PAGE_SIZE = 18;

interface IProps {
	category: INewsCategoryEnum;
}

const NewsList: React.FC<IProps> = ({ category }) => {
	const [page, setPage] = useState<number>(1);
	const { formatMessage } = useIntl();
	const {
		data: { results, count } = { results: [], count: 0 },
		isFetching,
		isFetched,
	} = useNews({
		page,
		[queryVars.page_size]: PAGE_SIZE,
		category: category,
	});

	const news = useRef<INews[]>([]);
	news.current = Array.isArray(results)
		? page === 1
			? results
			: news.current.concat(results)
		: [];

	const handlePageChange = () => {
		setPage((prevState) => prevState + 1);
	};

	return (
		<div className={styles.container}>
			<h1>
				{formatMessage(category === INewsCategoryEnum.WORLD ? messages.crypto_news : messages.news)}
			</h1>
			{isFetched && !news.current.length ? <EmptyContent /> : null}
			<InfiniteScroll
				className={styles.list}
				loadMore={handlePageChange}
				hasMore={count / (PAGE_SIZE * page) > 1}
			>
				{news.current.map((news) => (
					<NewsListItem category={category} news={news} key={news.id} />
				))}
				{isFetching &&
					[...new Array(PAGE_SIZE / 2)].map((_, i) => (
						<SkeletonLoader key={i} height={350} fullWidth />
					))}
			</InfiniteScroll>
		</div>
	);
};

export default observer(NewsList);
