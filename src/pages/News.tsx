import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import MainLayout from "layouts/MainLayout";
import newsMessages from "messages/news";
import { NewsList } from "components/News";
import { getPageTitle } from "helpers/global";
import { INewsCategoryEnum } from "types/news";

interface IProps {
	category: INewsCategoryEnum;
}

const News: React.FC<IProps> = ({ category }) => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(
		formatMessage(
			category === INewsCategoryEnum.WORLD ? newsMessages.crypto_news : newsMessages.news,
		),
	);

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
			<NewsList key={category} category={category} />
			{/* Unique key is required thing to prevent bugs with Infinite loop */}
		</MainLayout>
	);
};

export default News;
