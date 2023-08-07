import React from "react";
import styles from "styles/components/UI/Radio.module.scss";
import cn from "classnames";
import { IInputChange } from "./Input";

interface Props {
	className?: string;
	label?: string;
	choice: string;
	name: string;
	value: string;
	onChange?: (e: IInputChange) => void;
	card?: boolean;
	error?: boolean;
}

const RadioChoice: React.FC<Props> = ({
	className,
	label,
	choice,
	name,
	value,
	onChange,
	card,
	error,
}) => {
	const handleOnChange = (e: IInputChange) => {
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<>
			<input
				type="radio"
				className={cn(styles.input, { [styles.checked]: value === choice })}
				id={`id_${name}_${choice}`}
				value={choice}
				onChange={handleOnChange}
				name={name}
			/>
			<label
				className={cn(className, styles.label, {
					[styles.labeled]: !!label,
					[styles.checked]: value === choice,
					[styles.card]: card,
					[styles.error]: error,
				})}
				htmlFor={`id_${name}_${choice}`}
			>
				{label}
			</label>
		</>
	);
};

export default RadioChoice;
