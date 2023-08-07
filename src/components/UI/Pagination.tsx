import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/components/UI/Pagination.module.scss";

const MIN_VISIBLE_COUNT = 4;

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
			<span className={styles.label}>formatMessage(messages.page)</span>
			<div className={styles.page_list}>
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
			{count > 1 && (
				<div className={styles.page_nav}>
					{page > 4 && count > 5 && (
						<button type="button" className={styles.page_nav_button} onClick={() => onChange(1)}>
							<i className="ai ai-chevron_double_left" />
						</button>
					)}
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
						<i className="ai ai-chevron_left" />
					</button>
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
						<i className="ai ai-chevron_right" />
					</button>
				</div>
			)}
		</div>
	) : null;
};

export default Pagination;
