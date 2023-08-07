import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import MainLayout from "layouts/MainLayout";
import { useProject } from "services/SocialListingService";
import SocialListingDetails from "components/SocialListingProject/SocialListingProject";
import { getPageTitle } from "helpers/global";

const SocialListingProject: React.FC = () => {
	const { slug = "" } = useParams<{ slug: string }>();
	const { data: project, isLoading } = useProject(slug);
	const title = getPageTitle(project ? project.symbol : "");

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<SocialListingDetails isLoading={isLoading} project={project} />
		</MainLayout>
	);
};

export default SocialListingProject;
