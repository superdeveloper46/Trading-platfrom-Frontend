import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import { IError } from "types/referrals";
import styles from "styles/components/UI/SearchInput.module.scss";
import cn from "classnames";

interface IProps {
	name?: string;
	value?: string | number;
	className?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	labelValue?: string | JSX.Element | Element;
	placeholder?: string;
	disabled?: boolean;
	appender?: any;
	onEnter?: () => void;
	error?: IError | string;
	type?: string;
	autoComplete?: string;
	helpText?: string;
	children?: React.ReactNode;
	small?: boolean;
	maxLength?: number;
	inputFocus?: boolean;
	noMargin?: boolean;
	onKeyDown?: (e: React.KeyboardEvent) => void;
}

const SearchInput: React.FC<IProps> = React.memo(
	({
		value,
		name,
		className,
		onChange,
		labelValue,
		disabled,
		appender,
		error,
		autoComplete = "off",
		placeholder,
		onEnter,
		helpText,
		children,
		type = "text",
		maxLength,
		small,
		onKeyDown,
		inputFocus = false,
	}) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const [isActive, setIsActive] = useState<boolean>(!!value);
		const handleBlur = useCallback(() => setIsActive(false), []);
		const handleFocus = useCallback(() => setIsActive(true), []);
		const { formatMessage } = useIntl();

		useEffect(() => {
			if (inputFocus && inputRef.current) {
				inputRef.current.focus();
			}
		}, [inputRef, inputFocus]);

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (onEnter && e.key === "Enter") {
				onEnter();
			} else if (onKeyDown) {
				onKeyDown(e);
			}
		};

		return (
			<div className={styles.container}>
				<div className={cn(styles.input_container, className)}>
					<i className="ai ai-search" />
					<input
						className={cn(styles.input, {
							[styles.small]: small,
							[styles.filled]: !!value,
							[styles.active]: isActive,
							[styles.error]: !!error,
						})}
						id={name}
						type={type}
						disabled={disabled}
						autoComplete={autoComplete}
						onChange={onChange}
						value={value || ""}
						name={name}
						placeholder={placeholder ?? formatMessage(commonMessages.search)}
						maxLength={maxLength}
						onFocus={handleFocus}
						onBlur={handleBlur}
						ref={inputRef}
						onKeyDown={handleKeyDown}
					/>
					<label
						className={cn(styles.placeholder, {
							[styles.active]: isActive,
							[styles.filled]: !!(value || value === 0),
							[styles.error]: !!error,
							[styles.small]: small,
						})}
						htmlFor={name}
					>
						{labelValue}
					</label>
					{appender}
				</div>
				{error ? <div className={cn(styles.help_text, styles.error_text)}>{error}</div> : null}
				{helpText && !error ? <div className={styles.help_text}>{helpText}</div> : null}
				{children}
			</div>
		);
	},
);

export const SearchAppender: React.FC<{ onClick?: () => void }> = ({ children, onClick }) => (
	// eslint-disable-next-line jsx-a11y/label-has-associated-control
	<div className={styles.search_appender} onClick={onClick}>
		{children}
	</div>
);

export default SearchInput;
