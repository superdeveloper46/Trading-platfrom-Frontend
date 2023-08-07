import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import classnames from "classnames";

import { usePromotedPairs } from "services/HomeService";
import { useStories } from "services/StoriesService";
import { IStory } from "types/stories";
import styles from "styles/pages/Stories.module.scss";
import EmptyContent from "components/EmptyContent";
import useWindowSize from "hooks/useWindowSize";
import { queryVars } from "constants/query";
import PromotedPair from "./PromotedPair";
import StoriesListItem from "./StoriesListItem";
import StoriesListItemSkeleton from "./StoriesListItemSkeleton";

const PAGE_SIZE = 25;

const StoriesList: React.FC = () => {
	const { slug = "" } = useParams<{ slug: string }>();
	const { tablet } = useWindowSize();
	const [params, setParams] = useState<{
		page: number;
		category: string;
	}>({
		page: 1,
		category: slug,
	});
	const {
		data: { results, count } = { results: [], count: 0 },
		isFetching,
		isFetched,
	} = useStories({
		...params,
		[queryVars.page_size]: PAGE_SIZE,
	});
	const { data: promotedPairs = [] } = usePromotedPairs();
	const stories = useRef<IStory[]>([]);
	stories.current = Array.isArray(results)
		? params.page === 1
			? results
			: stories.current.concat(results)
		: [];

	const handlePageChange = () => {
		setParams((prevState) => ({
			...prevState,
			page: prevState.page + 1,
		}));
	};

	useEffect(() => {
		setParams(() => ({
			page: 1,
			category: slug,
		}));
	}, [slug]);

	return (
		<>
			{isFetched && !stories.current.length ? <EmptyContent /> : null}
			<div className={styles.stories}>
				{stories.current.slice(0, tablet ? 6 : 5).map((s, idx) => (
					<StoriesListItem story={s} key={idx} />
				))}
			</div>
			{stories.current.length && promotedPairs.length ? (
				<div className={styles.top_pairs}>
					{promotedPairs.map((p) => (
						<PromotedPair key={p.symbol} pair={p} />
					))}
				</div>
			) : null}
			<InfiniteScroll
				className={styles.stories}
				loadMore={handlePageChange}
				hasMore={count / (PAGE_SIZE * params.page) > 1}
			>
				{stories.current.slice(tablet ? 6 : 5).map((s, idx) => (
					<StoriesListItem story={s} key={idx} />
				))}
			</InfiniteScroll>
			{isFetching && (
				<div className={classnames(styles.stories, "aa-fade-in")}>
					{[...new Array(PAGE_SIZE)].map((_, idx) => (
						<StoriesListItemSkeleton key={idx} />
					))}
				</div>
			)}
		</>
	);
};

export default StoriesList;
