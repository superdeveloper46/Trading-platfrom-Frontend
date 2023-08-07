/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Switch.module.scss";
import { IInputChange } from "./Input";

interface Props {
	id: string;
	name?: string;
	checked?: boolean;
	disabled?: boolean;
	label?: string;
	secondary?: boolean;
	onChange?: (e: IInputChange) => void;
	className?: string;
}

const Switch: React.FC<Props> = ({
	id = "react-switch",
	checked = false,
	name,
	label,
	disabled,
	onChange,
	secondary,
	className,
}) => {
	const handleChange = (e: IInputChange): void => {
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<div
			className={cn(
				styles.wrapper,
				className,
				disabled && styles.disabled,
				secondary && styles.secondary,
			)}
		>
			{label ? <span>{label}</span> : null}
			<input
				className={styles.checkbox}
				type="checkbox"
				name={name}
				checked={checked}
				onChange={handleChange}
				id={id}
			/>
			<label
				className={cn(styles.label, checked && styles.checked, disabled && styles.disabled)}
				htmlFor={id}
			>
				<span
					className={cn(styles.button, checked && styles.checked, disabled && styles.disabled)}
				/>
			</label>
		</div>
	);
};

export default Switch;
