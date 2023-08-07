import React from "react";
import dayjs from "utils/dayjs";

import Markdown from "components/UI/Markdown";
import { IStory } from "types/stories";
import styles from "styles/pages/StoryDetails.module.scss";
import SkeletonLoader from "components/UI/Skeleton";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";
import Suggestions from "./Suggestions";

interface IProps {
	story?: IStory;
	isLoading: boolean;
}

const PostDetailsSkeleton: React.FC = () => (
	<>
		<SkeletonLoader fullWidth count={2} />
		<div className={styles.meta}>
			<div className={styles.story_meta}>
				<SkeletonLoader width={80} />
				<span className={styles.story_count}>
					<SkeletonLoader width={40} />
				</span>
			</div>
		</div>
		<SkeletonLoader height={400} fullWidth />
		<SkeletonLoader fullWidth height={30} count={25} />
	</>
);

const StoryDetails: React.FC<IProps> = ({ story, isLoading }) => {
	const postUrl = window.location.href;

	return (
		<div className={styles.container}>
			<div className={styles.breadcrumbs_container}>
				<Breadcrumbs
					links={[
						{
							link: routes.stories.root,
							label: "Alpha Stories",
						},
					]}
				/>
			</div>
			{isLoading ? (
				<PostDetailsSkeleton />
			) : story ? (
				<>
					<h1>{story.title}</h1>
					<div className={styles.meta}>
						<div className={styles.story_meta}>
							<span className={styles.story_date}>{dayjs(story.published_at).fromNow()}</span>
							<span className={styles.story_count}>
								<i className="ai ai-eye" />
								{story.views_count}
							</span>
						</div>
					</div>
					{story.lead ? <Markdown content={story.lead} /> : null}
					<div className={styles.share}>
						{[
							{
								link: `https://twitter.com/intent/tweet?url=${postUrl}`,
								iconCode: "twitter",
							},
							{
								link: `https://telegram.me/share/url?url=${postUrl}`,
								iconCode: "telegram",
							},
							{
								link: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
								iconCode: "facebook",
							},
							{
								link: `viber://forward?text==${postUrl}`,
								iconCode: "viber",
							},
							{
								link: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`,
								iconCode: "linkedin",
							},
							{
								link: `fb-messenger://share/?link=${postUrl}`,
								iconCode: "messenger",
							},
							{
								link: `mailto:?subject=${story.title}&body=${postUrl}`,
								iconCode: "mail",
							},
						].map((item, idx) => (
							<a href={item.link} target="_blank" rel="noopener noreferrer" key={idx}>
								<i className={`ai ai-${item.iconCode}`} />
							</a>
						))}
					</div>
					{story.cover_image ? <img src={story.cover_image.file} alt={story.title} /> : null}
					<Markdown content={story.content} />
					<Suggestions category={story.category?.slug ?? ""} currentSlug={story.slug} />
				</>
			) : null}
		</div>
	);
};

export default StoryDetails;
