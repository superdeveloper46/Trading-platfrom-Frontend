import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import cn from "classnames";

import InternalLink from "components/InternalLink";
import styles from "styles/pages/Stories.module.scss";
import messages from "messages/common";
import { useCategories } from "services/StoriesService";
import SkeletonLoader from "components/UI/Skeleton";
import { routes } from "constants/routing";

const Categories: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const { data: categories = [], isLoading } = useCategories();
	const { formatMessage } = useIntl();

	return (
		<div className={styles.categories}>
			<div>
				{categories.length > 0 && (
					<InternalLink to={routes.stories.root} className={cn({ [styles.active]: !slug })}>
						<h2>{formatMessage(messages.all)}</h2>
					</InternalLink>
				)}
				{isLoading
					? [...new Array(5)].map((_, i) => (
							<InternalLink key={i} to={routes.stories.root}>
								<SkeletonLoader width={45} />
							</InternalLink>
					  ))
					: categories.map((c) => (
							<InternalLink
								key={c.slug}
								to={routes.stories.getCategory(c.slug || "")}
								className={cn({ [styles.active]: slug === c.slug })}
							>
								<h2>{c.title}</h2>
							</InternalLink>
					  ))}
			</div>
		</div>
	);
};

export default Categories;
