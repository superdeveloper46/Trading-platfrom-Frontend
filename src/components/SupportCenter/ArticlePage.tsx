import React, { useState, KeyboardEvent, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import Error from "components/Error";
import messages from "messages/support";
import common_messages from "messages/common";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/pages/SupportCenter.module.scss";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import ImgViewer from "components/ImgViewer";
import { useSupportArticlePageRequests } from "services/SupportCenterService";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import SearchInput from "./SearchInput";

const ArticlePage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const {
		data: { support_center_article_data, support_center_articles },
		isLoading,
		error,
	} = useSupportArticlePageRequests(slug);
	const [search, setSearch] = useState<string>("");
	const [imgSrcToView, setImgSrcToView] = useState<string | undefined>("");
	const {
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

	const onKeyDown = useCallback(
		(e: KeyboardEvent<Element>) => {
			if (e.key === "Enter" && search.length > 0) {
				localeNavigate(routes.support.getSearchValue(search));
			}
		},
		[search, locale],
	);

	let additionalArticles =
		support_center_article_data &&
		support_center_articles?.results.filter(
			(item) =>
				item?.parent?.slug === support_center_article_data?.parent?.slug &&
				item.slug !== support_center_article_data.slug,
		);
	additionalArticles = additionalArticles && additionalArticles.slice(0, 2);

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
					<div className={styles.input_container}>
						<div className={styles.search_input_wrapper}>
							<SearchInput
								name="search"
								onChange={handleSearch}
								value={search}
								placeholder={formatMessage(common_messages.search)}
								onKeyDown={onKeyDown}
							/>
						</div>
					</div>
				</div>
				<div className={styles.support_center_content}>
					{isLoading && <LoadingSpinner />}
					{error && <Error error={error} />}
					{support_center_article_data && (
						<div className={styles.article}>
							{additionalArticles && additionalArticles[0] && (
								<InternalLink
									className={styles.additional_article}
									to={routes.support.getArticle(additionalArticles[0].slug)}
								>
									<i className="ai ai-warning article-icon" />
									{additionalArticles[0].title}
									<i className="ai ai-chevron_right" />
								</InternalLink>
							)}
							<div className={styles.article_content}>
								{support_center_article_data.cover_img && (
									<img
										className={styles.article_img}
										src={support_center_article_data.cover_image}
										alt={support_center_article_data.title}
									/>
								)}
								<ReactMarkdown
									className={styles.markdown_style}
									components={{
										// eslint-disable-next-line react/no-unstable-nested-components
										blockquote: ({ children }: any) =>
											children && children[0] ? (
												<blockquote>
													<i className="ai ai-quotes" />
													<p>{children[0].props.children}</p>
												</blockquote>
											) : null,
										// eslint-disable-next-line react/no-unstable-nested-components
										img: (props) => {
											const { src, alt } = props;
											return (
												<div className="story-photo" onClick={() => setImgSrcToView(src)}>
													<img src={src} alt={alt} />
												</div>
											);
										},
										// eslint-disable-next-line react/no-unstable-nested-components
										p: ({ children }: any) => {
											const hasImage = !!children.find(
												(child: any) =>
													typeof child === "object" && child.key && !!child.key.match(/image/g),
											);
											return hasImage ? children : <p>{children}</p>;
										},
									}}
								>
									{support_center_article_data.content}
								</ReactMarkdown>
							</div>
							{additionalArticles && additionalArticles[1] && (
								<InternalLink
									className={styles.additional_article}
									to={routes.support.getArticle(additionalArticles[1].slug)}
								>
									<i className="ai ai-warning article-icon" />
									{additionalArticles[1].title}
									<i className="ai ai-chevron_right" />
								</InternalLink>
							)}
						</div>
					)}
				</div>
				<ImgViewer src={imgSrcToView} onClose={() => setImgSrcToView("")} />
			</div>
		</div>
	);
};

export default observer(ArticlePage);
