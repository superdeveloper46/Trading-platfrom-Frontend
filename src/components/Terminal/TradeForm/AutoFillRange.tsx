import React, { useRef } from "react";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import ReactTooltip from "react-tooltip";
import styleProps from "utils/styleProps";
import Tooltip from "components/UI/Tooltip";

interface IProps {
	disabled: boolean;
	value: number;
	onPartChange: (e: React.MouseEvent<HTMLDivElement>) => void;
	onRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AutoFillRange: React.FC<IProps> = ({ disabled, value, onPartChange, onRangeChange }) => {
	const rangeRef = useRef<HTMLSpanElement>(null);

	if (disabled) {
		value = 0;
	}

	const handleRangeInputMouseEnter = () => {
		if (rangeRef.current) {
			ReactTooltip.show(rangeRef.current);
		}
	};

	const handleRangeInputMouseLeave = () => {
		if (rangeRef.current) {
			ReactTooltip.hide(rangeRef.current);
		}
	};

	const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onRangeChange(e);
		setTimeout(() => {
			if (rangeRef.current) {
				ReactTooltip.show(rangeRef.current);
			}
		});
	};

	return (
		<div className={cn(styles.trade_form_wallet_balance_slider, disabled && styles.disabled)}>
			{[0, 25, 50, 75, 100].map((percentage) => (
				<div
					className={cn(styles.trade_form_wallet_balance_slider_part, {
						[styles.inactive]: value >= percentage - 5 && value <= percentage + 5,
						[styles.active]: value >= percentage,
					})}
					key={percentage}
					style={styleProps({ left: `calc(${percentage}% - ${percentage > 0 ? 10 : 0}px)` })}
					data-part={percentage}
					onClick={onPartChange}
					data-tip={`${percentage}%`}
					data-for="wallet-fill-percentage"
				/>
			))}
			<span
				style={styleProps({
					left: `calc(${value}% - ${value > 12 ? 12 : 0}px)`,
				})}
				ref={rangeRef}
				data-tip={`${value}%`}
				data-for="wallet-fill-range-percentage"
			/>
			<input
				type="range"
				min="0"
				max="100"
				value={value}
				onChange={handleRangeChange}
				onMouseLeave={handleRangeInputMouseLeave}
				onMouseEnter={handleRangeInputMouseEnter}
			/>
			<div
				className={styles.trade_form_wallet_balance_slider_progress}
				style={styleProps({ width: `${value}%` })}
			/>
			<Tooltip
				id="wallet-fill-range-percentage"
				className={styles.trade_form_range_tooltip_chosen}
				arrowColor="var(--tooltip-background)"
				place="top"
			/>
			<Tooltip
				id="wallet-fill-percentage"
				className={styles.trade_form_range_tooltip}
				arrowColor="var(--tooltip-background)"
				place="top"
			/>
		</div>
	);
};

export default AutoFillRange;
