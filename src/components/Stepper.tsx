import React from "react";
import cn from "classnames";

import styles from "styles/components/Stepper.module.scss";
import styleProps from "utils/styleProps";
import usePreviousState from "hooks/usePreviousState";

export interface IStep {
	id: string | number;
	label: string;
	onClick?: () => void;
	disabled?: boolean;
}

interface IProps {
	active: string | number;
	className?: string;
	steps: IStep[];
	disabled?: boolean;
	color?: string;
}

const ANIMATION_DURATION = 0.5;

const Stepper: React.FC<IProps> = ({ className, active, steps, disabled, color }) => {
	const activeIndex = steps.findIndex((s) => s.id === active);
	const previousActiveIndex = usePreviousState<number>(activeIndex);
	const isGoingBack = activeIndex < previousActiveIndex;

	const differenceBetweenLastAndCurrentActiveIndex = Math.abs(activeIndex - previousActiveIndex);

	const animationDurationPerEach =
		ANIMATION_DURATION / differenceBetweenLastAndCurrentActiveIndex || 1;

	const activeColor = color || "#ffaf4f";

	return (
		<div className={cn(styles.container, className)}>
			{steps.map(({ id, onClick, label, disabled: stepDisabled }, i) => {
				const isActive = active === id || i < activeIndex;
				const isCurrent = active === id;
				const isFirst = i === 0;

				const differenceBetweenActive = Math.abs(previousActiveIndex - i);

				return (
					<React.Fragment key={id}>
						<div
							{...(isCurrent || disabled || stepDisabled || !onClick ? {} : { onClick: onClick })}
							className={cn(styles.step, {
								[styles.active]: isActive,
								[styles.current]: isCurrent,
								[styles.disabled]: stepDisabled,
							})}
						>
							<div
								style={styleProps({
									backgroundColor: isActive ? activeColor : "var(--input-disabled)",
									transition: `all 0s ease ${
										isGoingBack
											? (previousActiveIndex - i) * animationDurationPerEach
											: differenceBetweenActive * animationDurationPerEach
									}s`,
								})}
								className={styles.stepNumber}
							>
								{i + 1}
							</div>
							<span className={styles.label}>{label}</span>
						</div>
						{!isFirst && (
							<div
								className={cn(styles.progress_line, { [styles.active]: isActive })}
								style={styleProps({
									width: `${100 / (steps.length - 1)}%`,
									left: `${(100 / (steps.length - 1)) * (i - 1)}%`,
								})}
							>
								<div
									style={styleProps({
										backgroundColor: activeColor,
										transition: `all ${animationDurationPerEach}s ease ${
											isGoingBack
												? (previousActiveIndex - i) * animationDurationPerEach
												: (differenceBetweenActive - 1) * animationDurationPerEach
										}s`,
									})}
								/>
							</div>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default Stepper;
