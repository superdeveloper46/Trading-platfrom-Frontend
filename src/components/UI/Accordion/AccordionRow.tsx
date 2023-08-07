import React, { useRef } from "react";
import cn from "classnames";
import styles from "styles/components/UI/Accordion.module.scss";
import { ISection } from "./Accordion";

interface IProps {
	section: ISection;
	collapsed: boolean;
	toggle: () => void;
	plain?: boolean;
}

const AccordionRow: React.FC<IProps> = React.memo(({ section, collapsed, toggle, plain }) => {
	const headerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const handleToggle = () => {
		toggle();
	};

	const maxContainerHeight = collapsed
		? `${Math.max(headerRef?.current?.scrollHeight ?? 0, 30) + 20}px`
		: `${(contentRef?.current?.scrollHeight || 300) + 72}px`;

	return (
		<div
			className={cn(styles.list_item, { [styles.collapsed]: collapsed })}
			style={{ height: maxContainerHeight }}
		>
			<div
				className={styles.list_item_header}
				style={{ minHeight: `${Math.max(headerRef?.current?.scrollHeight ?? 0, 30) + 20}px` }}
				onClick={handleToggle}
			>
				{section.link ? (
					<a href={section.link} target="_blank" rel="noopener noreferrer">
						<span className={styles.list_item_label} ref={headerRef}>
							{section.label}
						</span>
					</a>
				) : (
					<span className={styles.list_item_label} ref={headerRef}>
						{section.label}
					</span>
				)}
				<div className={cn(styles.list_item_icon, { [styles.open]: !collapsed })}>
					<i className="ai ai-chevron_down" />
				</div>
			</div>
			<div className={styles.list_item_content_container}>
				<div
					className={cn(styles.list_item_content, {
						[styles.plain]: plain,
						[styles.parent]: Array.isArray(section.value),
					})}
					ref={contentRef}
				>
					{Array.isArray(section.value)
						? section.value.map((s: ISection) => (
								<div
									className={cn(styles.list_item_content, styles.list_item_content_item, {
										[styles.linked]: !!s.link,
									})}
									key={s.label}
								>
									{s.link ? (
										<a href={s.link} target="_blank" rel="noopener noreferrer">
											{s.value}
										</a>
									) : (
										s.value
									)}
								</div>
						  ))
						: section.value}
				</div>
			</div>
		</div>
	);
});

export default AccordionRow;
