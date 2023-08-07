import React from "react";

import styles from "styles/pages/SupportCenter.module.scss";
import { routes } from "constants/routing";
import InternalLink from "../InternalLink";

export interface SupportCenterSearchItem {
	title: string;
	text: any;
	slug: string;
	content: string;
}

interface Props {
	item: SupportCenterSearchItem;
	searchValue: string;
}

const SearchItem: React.FC<Props> = ({ item, searchValue }) => {
	const text = item.content.replace(/<[^>]*>/g, "");
	const valuePos = (searchValue && text.indexOf(searchValue)) || 0;
	const displayString = text?.substring(valuePos - 40);
	const nextValPos = displayString?.indexOf(searchValue);
	const partOne = displayString?.substring(0, nextValPos);
	const partTwo = searchValue && displayString?.substring(nextValPos + searchValue.length);

	return (
		<InternalLink className={styles.search_item_wrapper} to={routes.support.getArticle(item.slug)}>
			<span className={styles.search_item_header}>
				{item.title}
				<i className="ai ai-search" />
			</span>
			<span className={styles.search_item_body}>
				{partOne}
				&nbsp;
				<span className={styles.search_item_value}>{searchValue}</span>
				&nbsp;
				{partTwo}
			</span>
		</InternalLink>
	);
};

export default SearchItem;
