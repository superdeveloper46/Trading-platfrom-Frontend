import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import MainLayout from "layouts/MainLayout";
import messages from "messages/common";
import { useNewsDetails } from "services/NewsService";
import { NewsDetails as NewsDetailsContent } from "components/News";
import { getPageTitle } from "helpers/global";
import { INewsCategoryEnum } from "types/news";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

interface IProps {
	category: INewsCategoryEnum;
}

const NewsDetails: React.FC<IProps> = ({ category }) => {
	const { slug = "" } = useParams<{ slug: string }>();
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const { data: news, isLoading } = useNewsDetails(slug, () => localeNavigate(routes.news.root));
	const title = getPageTitle(
		news ? `${news.title} | ${formatMessage(messages.news)}` : formatMessage(messages.news),
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
			<NewsDetailsContent category={category} news={news} isLoading={isLoading} />
		</MainLayout>
	);
};

export default observer(NewsDetails);
