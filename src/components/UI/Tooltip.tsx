import cn from "classnames";
import React, { LegacyRef } from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import styles from "styles/components/UI/Tooltip.module.scss";
import { PositionStylesEnum } from "types/shell";
import styleProps from "utils/styleProps";

export interface IHelpTooltipProps extends TooltipProps {
	id: string;
	className?: string;
	contentClassName?: string;
	opener?: React.ReactNode | null;
	openOnClick?: boolean;
	text?: string;
	arrowColor?: string;
	backgroundColor?: string;
	padding?: string;
	textAlign?: "left" | "right" | "center";
	hint?: boolean;
	ref?: LegacyRef<ReactTooltip>;
}

const Tooltip = ({
	id,
	className,
	children,
	opener,
	openOnClick,
	contentClassName,
	place = PositionStylesEnum.RIGHT,
	arrowColor,
	backgroundColor,
	text,
	padding,
	textAlign = "left",
	hint,
	ref,
	...tooltipProps
}: IHelpTooltipProps) => {
	const isDefaultMode = !(opener || hint || text);

	return (
		<>
			{!isDefaultMode ? (
				<div
					data-for={id}
					data-tip
					className={cn(styles.openerWrapper, { [styles.hint]: hint })}
					{...(openOnClick ? { "data-event": "click" } : {})}
				>
					{opener}
					{hint && <i className={cn(styles.question, "ai ai-hint")} />}
				</div>
			) : null}
			<ReactTooltip
				{...tooltipProps}
				id={id}
				effect="solid"
				clickable
				place={place}
				ref={ref}
				className={cn(styles.tooltip, className, {
					[styles.isDefaultMode]: isDefaultMode,
				})}
				backgroundColor={backgroundColor || "var(--tooltip-background) !important"}
				arrowColor={arrowColor || "var(--tooltip-background)"}
				{...(openOnClick ? { globalEventOff: "click" } : {})}
			>
				{children || text ? (
					<div
						style={styleProps({
							...(padding ? { padding } : {}),
							textAlign,
							backgroundColor: backgroundColor || "var(--tooltip-background)",
						})}
						className={cn(contentClassName, styles.content)}
					>
						{children || text}
					</div>
				) : null}
			</ReactTooltip>
		</>
	);
};

export default Tooltip;
