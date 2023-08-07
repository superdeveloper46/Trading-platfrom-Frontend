import React from "react";

import SkeletonLoader from "components/UI/Skeleton";
import { useNews } from "services/NewsService";
import styles from "styles/pages/NewsDetails.module.scss";
import { INewsCategoryEnum } from "types/news";
import { queryVars } from "constants/query";
import NewsListItem from "./NewsListItem";

interface IProps {
	currentID: number;
	category: INewsCategoryEnum;
}

const Suggestions: React.FC<IProps> = ({ currentID, category }) => {
	const { data: { results } = { results: [] }, isFetching } = useNews({
		[queryVars.page]: 1,
		[queryVars.page_size]: 20,
		category,
	});
	const suggestions = results.filter((n) => n.id !== currentID).slice(0, 2);

	return (
		<div className={styles.suggestions}>
			{isFetching
				? [...new Array(2)].map((_, i) => <SkeletonLoader key={i} height={420} fullWidth />)
				: suggestions.map((news) => <NewsListItem category={category} key={news.id} news={news} />)}
		</div>
	);
};

export default Suggestions;
