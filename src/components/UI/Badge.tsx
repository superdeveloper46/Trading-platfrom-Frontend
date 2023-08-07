import classnames from "classnames";
import React from "react";
import styles from "styles/components/UI/Badge.module.scss";
import { OrderSideEnum } from "types/orders";
import styleProps from "utils/styleProps";

export enum BadgeBackgroundColorEnum {
	RED = "red",
	GREEN = "green",
	BLUE = "blue",
	ORANGE = "orange",
	LIGHT_GREY = "lightGray",
	LIGHT_GREY_DISABLED = "lightGrayDisabled",
	DARK_GREY = "darkGray",
	LIGHT_BLUE = "lightBlue",
	LIGHT_GREEN = "lightGreen",
}

const bg: Record<string, string> = {
	red: "#FF8289",
	green: "#53B987",
	blue: "#007aff",
	orange: "#F79319",
	lightGray: "#787878",
	lightGrayDisabled: "rgba(120, 120, 120, 0.5)",
	darkGray: "#AEAEAE",
	lightBlue: "#C6E4FC",
	lightGreen: "#8EF1B7",
};

const alphaBG: Record<string, string> = {
	red: "rgba(255, 95, 102, 0.1)",
	orange: "rgba(247, 147, 25, 0.1)",
	green: "rgba(83, 185, 135, 0.1)",
	grey: "rgba(158, 158, 158, 0.1)",
	greyDark: "var(--badge-a-dark)",
	violet: "rgba(77, 143, 241, 0.1)",
	blue: "rgba(32, 148, 255, 0.1)",
};

const alphaColors: Record<string, string> = {
	red: "#FF5F66",
	orange: "#F79319",
	green: "#53B987",
	grey: "#AAAAAA",
	greyDark: "var(--badge-a-dark-color)",
	violet: "#9595FF",
	blue: "#62A7E7",
};

export enum BadgeColorEnum {
	RED = "red",
	GREEN = "green",
	ORANGE = "orange",
	GREY = "grey",
	GREY_DARK = "greyDark",
	VIOLET = "violet",
	BLUE = "blue",
}

interface IProps {
	alpha?: boolean;
	disabled?: boolean;
	className?: string;
	directional?: boolean;
	side?: OrderSideEnum;
	color:
		| "red"
		| "green"
		| "orange"
		| "grey"
		| "greyDark"
		| "violet"
		| "blue"
		| BadgeColorEnum
		| BadgeBackgroundColorEnum;
	style?: React.CSSProperties;
}

const Badge: React.FC<IProps> = ({
	alpha,
	color,
	disabled,
	children,
	directional,
	side,
	className,
	style,
}) => {
	const backgroundColor = alpha
		? alphaBG[color]
		: directional
		? side === OrderSideEnum.SELL
			? bg[BadgeColorEnum.RED]
			: bg[BadgeColorEnum.GREEN]
		: bg[color];

	const textColor = alpha ? alphaColors[color] : "";

	return (
		<div
			className={classnames(
				styles.container,
				{
					[styles.direction]: directional,
				},
				className ?? "",
			)}
			style={styleProps({
				background: backgroundColor,
				color: disabled ? "var(--color-disabled)" : textColor,
				"--badge-color": disabled ? "var(--color-disabled)" : textColor,
				...style,
			})}
		>
			{children}
		</div>
	);
};

export const OutlinedBadge: React.FC<IProps> = (props) => {
	const { color, children, className } = props;
	return (
		<Badge
			{...props}
			className={classnames(styles.outlined_badge, className)}
			style={{
				border: `1px solid ${bg[color]}`,
				color: bg[color],
				backgroundColor: "unset",
			}}
		>
			{children}
		</Badge>
	);
};

export default Badge;
