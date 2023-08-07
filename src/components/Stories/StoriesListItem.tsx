import React from "react";
import classnames from "classnames";

import InternalLink from "components/InternalLink";
import Markdown from "components/UI/Markdown";
import { IStory } from "types/stories";
import styles from "styles/pages/Stories.module.scss";
import dayjs from "utils/dayjs";
import SafeImg from "components/UI/SafeImg";
import { routes } from "constants/routing";

interface IProps {
	story: IStory;
}

const StoriesListItem: React.FC<IProps> = ({ story }) => (
	<div className={classnames(styles.story, "aa-fade-in")}>
		<InternalLink key={story.slug} to={routes.stories.getStory(story.slug)} />
		{story.cover_image ? <SafeImg src={story.cover_image.file} alt={story.title} /> : null}
		<header className={styles.story_header}>
			<div className={styles.story_meta}>
				<span className={styles.story_date}>{dayjs(story.published_at).fromNow()}</span>
				<span className={styles.story_count}>
					<i className="ai ai-eye" />
					{story.views_count}
				</span>
			</div>
			<h2>{story.title}</h2>
			<section>
				<Markdown content={story.lead ?? ""} />
			</section>
		</header>
	</div>
);

export default StoriesListItem;
