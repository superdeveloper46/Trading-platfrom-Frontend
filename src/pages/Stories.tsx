import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Stories.module.scss";
import { Categories, StoriesList } from "components/Stories";
import { getPageTitle } from "helpers/global";

const AlphaStories: React.FC = () => {
	const title = getPageTitle("Alpha Stories");

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
			<div className={styles.container}>
				<Categories />
				<StoriesList />
			</div>
		</MainLayout>
	);
};

export default AlphaStories;
