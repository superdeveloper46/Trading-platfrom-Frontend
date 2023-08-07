import React from "react";
import cn from "classnames";

import styles from "styles/components/UI/CheckBox.module.scss";
import { ErrorText } from "./ExchangeCryptoInput";

export interface ICheckbox {
	name: string;
	checked: boolean;
	children?: React.ReactNode;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	required?: boolean;
	centered?: boolean;
	className?: string;
	checkboxClassname?: string;
	error?: any;
}

const CheckBox: React.FC<ICheckbox> = ({
	name,
	disabled = false,
	checked = false,
	children,
	onChange,
	required = false,
	centered = false,
	error,
	className,
	checkboxClassname,
}) => (
	<div className={cn(styles.container, className)}>
		<label
			className={cn(styles.checkbox, checkboxClassname, {
				[styles.disabled]: disabled,
				[styles.centered]: centered,
				[styles.error]: !!error,
			})}
			htmlFor={`checkbox-${name}`}
		>
			<input
				id={`checkbox-${name}`}
				type="checkbox"
				className={cn(styles.input, { [styles.checked]: checked, [styles.disabled]: disabled })}
				name={name}
				onChange={onChange}
				required={required}
			/>
			<span
				className={cn(styles.checkmark, { [styles.checked]: checked, [styles.disabled]: disabled })}
			/>
			<span>{children}</span>
		</label>
		{error && <ErrorText className={styles.error_and_help_text}>{error}</ErrorText>}
	</div>
);

export default CheckBox;
