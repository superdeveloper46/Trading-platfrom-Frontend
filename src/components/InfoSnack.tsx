import React from "react";
import cn from "classnames";

import styles from "styles/components/InfoSnack.module.scss";
import styleProps from "utils/styleProps";
import InternalLink from "./InternalLink";

const colors = {
	yellow: "var(--info-snack-color-yellow)",
	red: "var(--info-snack-color-red)",
	grey: "var(--info-snack-color-grey)",
	primary: "var(--info-snack-color-primary)",
};

const colorsAlpha = {
	yellow: "var(--info-snack-color-yellow-a)",
	red: "var(--info-snack-color-red-a)",
	grey: "var(--info-snack-color-grey-a)",
	primary: "var(--info-snack-color-primary-a)",
};

const borderColors = {
	yellow: "var(--info-snack-color-border-yellow)",
	red: "var(--info-snack-color-border-red)",
	grey: "var(--info-snack-color-border-grey)",
	primary: "var(--info-snack-color-border-primary)",
};

const borderColorsAlpha = {
	yellow: "var(--info-snack-color-border-yellow-a)",
	red: "var(--info-snack-color-border-red-a)",
	grey: "var(--info-snack-color-border-grey-a)",
	primary: "var(--info-snack-color-border-primary-a)",
};

interface Props {
	color: "yellow" | "red" | "grey" | "primary";
	link?: string;
	align?: "flex-start" | "flex-end";
	justify?: "flex-start" | "center" | "flex-end";
	outlined?: boolean;
	filled?: boolean;
	big?: boolean;
	iconCode?: string;
	noBorderRadius?: boolean;
	plain?: boolean;
	className?: string;
}

const InfoSnack: React.FC<Props> = React.memo(
	({
		color,
		children,
		link,
		align,
		justify,
		outlined,
		filled,
		big,
		iconCode,
		plain,
		noBorderRadius,
		className,
	}) => (
		<div
			className={cn(styles.container, className, {
				[styles.no_border_radius]: noBorderRadius,
				[styles.filled]: filled,
				[styles.big]: big,
				[styles.plain]: plain,
			})}
			style={styleProps({
				color: filled ? "#fff" : colors[color],
				borderColor: outlined ? borderColors[color] : borderColorsAlpha[color],
				backgroundColor: outlined ? "transparent" : filled ? colors[color] : colorsAlpha[color],
				justifyContent: justify || "flex-start",
				alignItems: align || "center",
			})}
		>
			{link ? <InternalLink to={link} /> : null}
			{iconCode ? (
				<i
					className={`ai ai-${iconCode}`}
					style={styleProps({ color: filled ? "#fff" : colors[color] })}
				/>
			) : null}
			{children}
			{link ? <i className="ai ai-chevron_right" /> : null}
		</div>
	),
);

export default InfoSnack;
