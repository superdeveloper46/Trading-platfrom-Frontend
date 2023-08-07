import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import messages from "messages/support";
import support_image from "assets/images/support_center/24.svg";
import Error from "components/Error";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/pages/SupportCenter.module.scss";
import InternalLink from "components/InternalLink";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { useSupportNews } from "services/SupportCenterService";
import { IError } from "types/supportCenter";
import { routes } from "constants/routing";
import NewsItem from "./NewsItem";

const NewsPage: React.FC = () => {
	const { data, isLoading, error } = useSupportNews();
	const intl = useIntl();

	return (
		<div className={styles.support_center_wrapper}>
			<div className={styles.support_center_block}>
				<InternalLink to={routes.support.root}>
					<div className={styles.support_center_label}>
						<i className="ai ai-chevron_left" />
						{intl.formatMessage(messages.support_center)}
					</div>
				</InternalLink>
				<div className={styles.support_center_header_block}>
					<div className={styles.support_center_content}>
						<div className={styles.search_block_wrapper}>
							<div className={styles.news_search_block}>
								<img src={support_image} alt="Support Center" />
								<div className={styles.header}>{intl.formatMessage(messages.news_header)}</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.support_center_content}>
					<div className={styles.articles_content}>
						{isLoading ? (
							<LoadingSpinner />
						) : data?.results?.length > 0 ? (
							data.results.map((item: any) => <NewsItem key={item.slug} item={item} />)
						) : (
							<NoRowsMessage />
						)}
						{error && <Error error={error as IError} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(NewsPage);
