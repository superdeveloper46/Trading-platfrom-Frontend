import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import messages from "messages/support";
import search_dark from "assets/images/support_center/Search_Dark.svg";
import search_light from "assets/images/support_center/Search_Light.svg";
import Error from "components/Error";
import NoResultsMessage from "components/Table/NoResultsMessage";
import styles from "styles/pages/SupportCenter.module.scss";
import InternalLink from "components/InternalLink";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { useSupportSearch } from "services/SupportCenterService";
import { useMst } from "models/Root";
import { IError } from "types/supportCenter";
import { routes } from "constants/routing";
import SearchItem, { SupportCenterSearchItem } from "./SearchItem";

const SearchPage: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { theme },
	} = useMst();
	const [searchParams] = useSearchParams();
	const { value, ...rest } = Object.fromEntries(searchParams);
	const { data, isLoading, error } = useSupportSearch({ ...rest, search: value });

	return (
		<div className={styles.support_center_wrapper}>
			<div className={styles.support_center_block}>
				<InternalLink to={routes.support.root}>
					<div className={styles.support_center_label}>
						<i className="ai ai-chevron_left" />
						{formatMessage(messages.support_center)}
					</div>
				</InternalLink>
				<div className={styles.support_center_header_block}>
					<div className={styles.support_center_content}>
						<div className={styles.search_block_wrapper}>
							<div className={styles.search_block}>
								<img src={theme === "light" ? search_light : search_dark} alt="Support Center" />
								<div className={styles.header}>
									{formatMessage(messages.search_results)}
									&nbsp;
									<div className={cn(styles.header, styles.search_value)}>&quot;{value}&quot;</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.support_center_content}>
					<div className={styles.articles_content}>
						{isLoading ? (
							<LoadingSpinner />
						) : data?.results?.length > 0 ? (
							data?.results?.map((item: SupportCenterSearchItem) => (
								<SearchItem searchValue={value as string} key={item.slug} item={item} />
							))
						) : (
							<NoResultsMessage />
						)}
						{error && <Error error={error as IError} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(SearchPage);
