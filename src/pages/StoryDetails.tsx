import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import { StoryDetails as StoryDetailsContent } from "components/Stories";
import { useStoryDetails } from "services/StoriesService";
import { useParams } from "react-router-dom";
import { getPageTitle } from "helpers/global";

const StoryDetails: React.FC = () => {
	const { slug = "" } = useParams<{ slug: string }>();
	const { data: story, isLoading } = useStoryDetails(slug);
	const title = getPageTitle(`${story ? `${story.title} | ` : ""}Alpha Stories`);

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<StoryDetailsContent story={story} isLoading={isLoading} />
		</MainLayout>
	);
};

export default StoryDetails;
