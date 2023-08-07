import React from "react";
import PulseLoader from "react-spinners/PulseLoader";
import styles from "styles/components/LoadingSpinner.module.scss";
import cn from "classnames";
import styleProps from "utils/styleProps";

interface Props {
	size?: number;
	margin?: number;
	color?: string;
	align?: "top" | "bottom";
	verticalMargin?: string;
	noMargin?: boolean;
}

const LoadingSpinner: React.FC<Props> = React.memo(
	({ size = 8, margin = 3, color, align, verticalMargin, noMargin }) => (
		<div
			className={cn(styles.container, align && styles[align])}
			style={styleProps({
				margin: verticalMargin ? `${verticalMargin} auto` : noMargin ? "0" : "8% auto",
			})}
		>
			<PulseLoader size={size} margin={margin} color={color || "var(--loader-color)"} />
		</div>
	),
);

export default LoadingSpinner;
