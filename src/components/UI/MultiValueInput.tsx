import classnames from "classnames";
import React, { useRef, useState } from "react";
import styles from "styles/components/UI/MultiValueInput.module.scss";
import inputStyles from "styles/components/UI/Input.module.scss";

interface IProps {
	name?: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	labelValue?: string;
	disabled?: boolean;
	error?: string;
	type?: string;
	helpText?: JSX.Element;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	maxLength?: number;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const MultiValueInput: React.FC<IProps> = ({
	value,
	name,
	onChange,
	onKeyDown,
	labelValue,
	disabled,
	error,
	type,
	maxLength,
	children,
	helpText,
	onBlur,
}) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFocus = () => setIsActive(true);
	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		setIsActive(false);
		onBlur?.(e);
	};

	const handleMultiInputClick = () => {
		setIsActive(true);
		if (inputRef?.current) {
			inputRef.current.focus();
		}
	};

	return (
		<div className={styles.wrapper}>
			<div
				className={classnames(styles.container, {
					[styles.active]: isActive,
					[styles.error]: !!error,
				})}
				onClick={handleMultiInputClick}
			>
				{children}
				<span
					className={classnames(styles.placeholder, {
						[styles.active]: isActive,
						[styles.error]: !!error,
						[styles.filled]: !!(value.trim() || Array.isArray(children)),
					})}
				>
					{labelValue}
				</span>
				<input
					type={type}
					disabled={disabled}
					ref={inputRef}
					id={name}
					value={value || ""}
					name={name}
					maxLength={maxLength}
					onFocus={handleFocus}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onBlur={handleBlur}
					autoComplete="off"
				/>
			</div>
			{error && <div className={classnames(inputStyles.help_text, inputStyles.error)}>{error}</div>}
			{helpText && !error && (
				<div className={classnames(inputStyles.help_text, styles.help_text)}>{helpText}</div>
			)}
		</div>
	);
};

export default MultiValueInput;
