import React from "react";
import styles from "styles/components/UI/IconButton.module.scss";
import cn from "classnames";

type TVariant = "filled" | "text";
type TColor = "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";
type TSize = "small" | "medium" | "large";

interface Props {
	className?: string;
	disabled?: boolean;
	variant?: TVariant;
	color?: TColor;
	icon?: JSX.Element;
	size?: TSize;
	onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const IconButton: React.FC<Props> = ({
	className,
	variant = "filled",
	color = "secondary",
	size = "medium",
	icon,
	onClick,
	disabled,
	...rest
}) => (
	<button
		className={cn(className, styles.container, styles[size], styles[variant], styles[color], {
			[styles.disabled]: disabled,
		})}
		onClick={onClick}
		type="button"
		{...rest}
	>
		{icon}
	</button>
);

export default IconButton;
