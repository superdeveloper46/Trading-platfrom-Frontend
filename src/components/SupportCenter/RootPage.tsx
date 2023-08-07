import React, { useState, KeyboardEvent, useCallback } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import messages from "messages/support";
import common_messages from "messages/common";
import support_image1 from "assets/images/support_center/support_center1.svg";
import search_image_disabled_dark from "assets/images/support_center/Search_big_Active_Dark.svg";
import search_image_disabled from "assets/images/support_center/search_disabled.svg";
import chat_shield_dark from "assets/images/support_center/chat_shield_dark.svg";
import chat_shield_light from "assets/images/support_center/chat_shield_light.svg";
import support_img from "assets/images/support_center/24_mini.svg";
import api_img from "assets/images/support_center/api_mini.svg";
import Error from "components/Error";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/pages/SupportCenter.module.scss";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import config from "helpers/config";
import { routes } from "constants/routing";
import { useSupportRootPageRequests } from "services/SupportCenterService";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { ISupportCenterNewsItem } from "types/supportCenter";
import NewsItem from "./NewsItem";
import SearchInput from "./SearchInput";
import CategoriesTree from "./CategoriesTree";

const RootPage: React.FC = () => {
	const {
		data: { support_center_news, support_center_categories, support_center_articles },
		isLoading,
		error,
	} = useSupportRootPageRequests();

	const {
		global: { theme, locale },
	} = useMst();
	const localeNavigate = useLocaleNavigate();
	const { mobile, medium } = useWindowSize();
	const [search, setSearch] = useState("");
	const { formatMessage } = useIntl();

	const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	}, []);

	const onKeyDown = useCallback(
		(e: KeyboardEvent<Element>) => {
			if (e.key === "Enter" && search.length > 0) {
				localeNavigate(routes.support.getSearchValue(search));
			}
		},
		[search, locale],
	);

	return (
		<div className={styles.support_center_wrapper}>
			<div className={styles.support_center_block}>
				<InternalLink
					to={routes.support.root}
					className={cn(styles.support_center_label, styles.disabled)}
				>
					{formatMessage(messages.support_center)}
				</InternalLink>
				<div className={styles.support_center_header_block}>
					<div className={styles.support_center_content}>
						<div className={styles.search_block_wrapper}>
							<div className={styles.search_image}>
								<img
									src={theme === "light" ? search_image_disabled : search_image_disabled_dark}
									alt="Support Center search"
								/>
							</div>
							{!medium && (
								<div className={styles.chat_shield_image}>
									<img
										src={theme === "light" ? chat_shield_light : chat_shield_dark}
										alt="Support Center search"
									/>
								</div>
							)}
							<div className={styles.root_search_block}>
								<img src={support_image1} alt="Support Center" />
								{!mobile && (
									<div className={styles.header}>
										{formatMessage(messages.support_center_search_header)}
									</div>
								)}
								<div className={styles.input_wrapper}>
									<SearchInput
										name="search"
										onChange={handleSearch}
										value={search}
										placeholder={formatMessage(messages.describe_problem)}
										onKeyDown={onKeyDown}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.support_center_content}>
					{isLoading && <LoadingSpinner />}
					{error && <Error error={error} />}
					{support_center_categories && (
						<CategoriesTree
							support_center_categories={support_center_categories}
							support_center_articles={support_center_articles}
							locale={locale}
						/>
					)}
					<div className={styles.docs_and_question_block}>
						<a href={config.publicApiPath} target="_blank" rel="noopener noreferrer">
							<div className={styles.docs_and_question_block_item}>
								<div className={styles.docs_and_question_block_item_header}>
									<img src={api_img} alt="api" />
									{formatMessage(messages.api_doc_block_header)}
								</div>
								<div className={styles.docs_and_question_block_item_body}>
									{formatMessage(messages.api_doc_block_desc)}
									<div className={styles.docs_and_question_block_item_link} />
								</div>
							</div>
						</a>
						<InternalLink to={routes.support.request}>
							<div className={styles.docs_and_question_block_item}>
								<div className={styles.docs_and_question_block_item_header}>
									<img src={support_img} alt="support" />
									{formatMessage(messages.support_block_header)}
								</div>
								<div className={styles.docs_and_question_block_item_body}>
									{formatMessage(messages.support_block_desc)}
									<div className={styles.docs_and_question_block_item_link} />
								</div>
							</div>
						</InternalLink>
					</div>
					{support_center_news?.results?.length > 0 && (
						<div className={styles.news_block}>
							<div className={styles.news_block_header}>
								{formatMessage(messages.all_news)}
								<div className={styles.news_link_text}>
									<InternalLink to={routes.support.news}>
										{formatMessage(common_messages.more)}
										<i className="ai ai-chevron_right" />
									</InternalLink>
								</div>
							</div>
							{support_center_news?.results.map((item: ISupportCenterNewsItem, index: number) => (
								<NewsItem
									key={item.slug}
									item={item}
									hideBottomBorder={index === support_center_news.results.length - 1}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default observer(RootPage);
