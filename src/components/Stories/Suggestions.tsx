import classnames from "classnames";
import SkeletonLoader from "components/UI/Skeleton";
import React from "react";
import { useStories } from "services/StoriesService";
import styles from "styles/pages/StoryDetails.module.scss";
import StoriesListItem from "./StoriesListItem";

interface IProps {
	category: string;
	currentSlug: string;
}

const Suggestions: React.FC<IProps> = ({ category, currentSlug }) => {
	const { data: { results } = { results: [] }, isFetching } = useStories({ category });
	const suggestions = results.filter((p) => p.slug !== currentSlug).slice(0, 2);

	return (
		<div className={classnames(styles.suggestions, "aa-fade-in")}>
			{isFetching
				? [...new Array(2)].map((_, i) => <SkeletonLoader key={i} height={350} fullWidth />)
				: suggestions.map((story) => <StoriesListItem key={story.slug} story={story} />)}
		</div>
	);
};

export default Suggestions;
