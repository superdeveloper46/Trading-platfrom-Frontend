import React from "react";
import cn from "classnames";

import { ReactComponent as Left } from "assets/icons/arrow-left.svg";
import { ReactComponent as Right } from "assets/icons/arrow-right.svg";
import styles from "styles/components/UI/NewPagination.module.scss";

const MIN_VISIBLE_COUNT = 3;

export interface IPagination {
	page: number;
	count: number;
	onChange: (page: number) => void;
}

const Pagination: React.FC<IPagination> = ({ page, count, onChange }) => {
	const list = Array.from({ length: count }, (_, i) => i + 1);
	const k =
		page >= (count > MIN_VISIBLE_COUNT ? MIN_VISIBLE_COUNT : MIN_VISIBLE_COUNT - 1)
			? MIN_VISIBLE_COUNT
			: MIN_VISIBLE_COUNT - 1;
	const start = page > k ? (page < count - k ? page - k : count - k - 1) : 0;
	const end = page >= k ? (page + k < count ? page + 1 : count) : MIN_VISIBLE_COUNT;

	return count > 1 ? (
		<div className={styles.container}>
			<button
				type="button"
				className={styles.page_nav_button}
				onClick={() => {
					if (page > 1) {
						onChange(page - 1);
					}
				}}
				disabled={page <= 1}
			>
				<Left />
			</button>
			<div className={styles.page_list}>
				{page > MIN_VISIBLE_COUNT && (
					<button type="button" className={styles.item} onClick={() => onChange(1)}>
						1
					</button>
				)}
				{start > 1 && (
					<button
						type="button"
						className={styles.item}
						onClick={() => onChange(start - 3 > 1 ? start - 3 : 2)}
					>
						...
					</button>
				)}
				{list.slice(start, end).map((p: number) => (
					<button
						type="button"
						className={cn(styles.item, { [styles.active]: p === page })}
						key={p}
						onClick={() => onChange(p)}
					>
						{p}
					</button>
				))}
				{list.length > 5 && end < count && (
					<button
						type="button"
						className={styles.item}
						onClick={() => onChange(list.length - 3 > end - 1 ? list.length - 3 : end + 1)}
					>
						...
					</button>
				)}
				{end < count && (
					<button type="button" className={styles.item} onClick={() => onChange(list.length)}>
						{list.length}
					</button>
				)}
			</div>
			<button
				type="button"
				className={styles.page_nav_button}
				onClick={() => {
					if (page < count) {
						onChange(page + 1);
					}
				}}
				disabled={page >= count}
			>
				<Right />
			</button>
		</div>
	) : null;
};

export default Pagination;
