import React, { useCallback, useState } from "react";
import styles from "styles/components/UI/Accordion.module.scss";
import cn from "classnames";
import AccordionRow from "./AccordionRow";

export interface ISection {
	label: string;
	value: string | ISection[] | JSX.Element;
	link?: string;
}

interface Props {
	className?: string;
	sections: ISection[];
	plain?: boolean;
	title?: string | React.ReactNode;
}

const Accordion: React.FC<Props> = React.memo(({ className, sections, plain, title }) => {
	const [activeRow, setActiveRow] = useState<number | null>(null);

	const handleRowToggle = useCallback(
		(idx: number) => {
			setActiveRow(activeRow === idx ? null : idx);
		},
		[activeRow],
	);

	return (
		<div className={cn(styles.list, className)}>
			{title && <div className={styles.title}>{title}</div>}
			{sections.map((s: ISection, idx: number) => (
				<AccordionRow
					key={idx}
					plain={plain}
					section={s}
					toggle={() => handleRowToggle(idx)}
					collapsed={idx !== activeRow}
				/>
			))}
		</div>
	);
});

export default Accordion;
