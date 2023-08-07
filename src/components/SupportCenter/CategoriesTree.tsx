import React from "react";
import { useIntl } from "react-intl";

import messages from "messages/common";
import { IArticle, ISupportCenterArticles, ISupportCenterCategories } from "types/supportCenter";
import Accordion from "components/UI/Accordion";
import styles from "styles/pages/SupportCenter.module.scss";
import { routes } from "constants/routing";

interface Props {
	support_center_categories?: ISupportCenterCategories;
	support_center_articles?: ISupportCenterArticles;
	locale: string;
}

const CategoriesTree: React.FC<Props> = ({
	support_center_categories,
	support_center_articles,
	locale,
}) => {
	const { formatMessage } = useIntl();
	const categoriesSlugs =
		support_center_categories?.results?.map((articleCat: IArticle) => articleCat.slug) ?? [];

	const categories =
		categoriesSlugs.map((slug: string | null) => ({
			title:
				support_center_categories?.results?.find((articleCat: IArticle) => articleCat.slug === slug)
					?.title ?? "-",
			articles: support_center_articles?.results?.filter(
				(article: IArticle) => article?.parent_slug === slug,
			),
		})) ?? [];

	const sections = categories.map((category: { title: string; articles?: IArticle[] }) => ({
		label: category.title,
		value:
			category.articles?.map((article: IArticle) => ({
				label: article.slug || "",
				value: article.title || "",
				link: `/${locale}/${routes.support.getArticle(article.slug || "")}`,
				sameWindow: true,
			})) || [],
	}));

	return (
		<div className={styles.content_container}>
			{support_center_articles && support_center_articles.results?.length > 0 ? (
				<Accordion plain sections={sections} />
			) : (
				formatMessage(messages.no_match_search)
			)}
		</div>
	);
};

export default CategoriesTree;
