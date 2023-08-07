import React, { HTMLInputTypeAttribute, useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
import styles from "styles/components/UI/Input.module.scss";
import Tooltip from "./Tooltip";

export type IInputChange = React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>;
type TInputAutoCompleteAttribute = "off" | "on";

export const getFieldAutoComplete = (field: string): string => {
	switch (field) {
		case "card":
			return "cc-number";
		case "first_name":
			return "given-name";
		case "last_name":
			return "family-name";
		case "nickname":
			return "nickname";
		case "postal_code":
			return "postal-code";
		case "email":
			return "email";
		case "login":
			return "email";
		case "username":
			return "username";
		default:
			return "off";
	}
};

export interface IInput {
	name?: string;
	type?: HTMLInputTypeAttribute;
	value?: string | number;
	error?: string | string[] | React.ReactNode;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	onEnter?: () => void;
	labelValue?: string;
	placeholder?: string;
	helpText?: string | JSX.Element | React.ReactNode;
	textAlign?: "align_left" | "align_right";
	appender?: JSX.Element | React.ReactNode | string;
	autoComplete?: TInputAutoCompleteAttribute;
	autoFocus?: boolean;
	small?: boolean;
	promo?: boolean;
	maxLength?: number;
	children?: React.ReactNode;
	password?: boolean;
	autoActive?: boolean;
	search?: boolean;
	className?: string;
	containerClassName?: string;
	hint?: string;
}

const Input: React.FC<IInput> = React.memo(
	({
		value,
		name,
		onChange,
		onFocus,
		onBlur,
		disabled,
		appender,
		error,
		password,
		autoComplete,
		placeholder,
		labelValue,
		hint,
		helpText,
		textAlign = "align_left",
		type = "text",
		maxLength = undefined,
		small,
		onKeyDown,
		onEnter,
		autoFocus = false,
		promo = false,
		search,
		className,
		containerClassName,
	}) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const [isActive, setIsActive] = useState<boolean>(document.activeElement === inputRef.current);

		useEffect(() => {
			if (autoFocus) {
				setIsActive(!!value);
			}
		}, [value, autoFocus]);

		const handleBlur = useCallback(() => {
			setIsActive(false);
			if (onBlur) {
				onBlur();
			}
		}, [onBlur]);

		const handleFocus = useCallback(() => {
			setIsActive(true);
			if (onFocus) {
				onFocus();
			}
		}, [onFocus]);

		const [passwordType, setPasswordType] = useState<string>("password");

		const handleChangePasswordType = () => {
			setPasswordType((prevState) => (prevState === "text" ? "password" : "text"));
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (type === "number" && e.key === "-") {
				return e.preventDefault();
			}
			if (onEnter && e.key === "Enter") {
				return onEnter();
			}
			if (onKeyDown) {
				return onKeyDown(e);
			}
			return null;
		};

		const handleOnWheel = (e: React.WheelEvent<HTMLInputElement>) => {
			e.currentTarget.blur();
		};

		const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (type === "number") {
				return onChange({
					...e,
					target: {
						...e.target,
						name: e.target.name,
						value: +e.target.value < 0 ? Math.abs(+e.target.value).toString() : e.target.value,
					},
				});
			}
			return onChange(e);
		};

		useEffect(() => {
			if (autoFocus && inputRef.current) {
				inputRef.current.focus();
			}
		}, [inputRef, autoFocus]);

		return (
			<div className={cn(styles.container, containerClassName)}>
				<div className={cn(styles.input_container, search && styles.search, className)}>
					{search && <i className="ai ai-search" />}
					<input
						className={cn(styles.input, {
							[styles.disabled]: disabled,
							[styles.active]: isActive,
							[styles.error]: !!error,
							[styles.promo]: promo,
							[styles.small]: small,
							[styles.search]: search,
							[styles.password]: password,
						})}
						onKeyDown={handleKeyDown}
						disabled={disabled}
						autoComplete={autoComplete || getFieldAutoComplete(name ?? "")}
						id={name}
						onChange={handleOnChange}
						value={value || ""}
						ref={inputRef}
						type={password ? passwordType : type}
						name={name}
						placeholder={placeholder}
						maxLength={maxLength}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onWheel={handleOnWheel}
					/>
					{labelValue ? (
						<div
							className={cn(styles.placeholder, {
								[styles.active]: isActive,
								[styles.filled]: !!(value || value === 0),
								[styles.error]: !!error,
								[styles.promo]: promo,
								[styles.hint]: !!hint,
								[styles.disabled]: disabled,
								[styles.small]: small,
								[styles.search]: search,
							})}
						>
							{labelValue}
							{hint && (isActive || !!(value || value === 0)) && (
								<Tooltip
									className={styles.hint}
									id={`${labelValue}${hint}`}
									hint
									place="bottom"
									text={hint}
								/>
							)}
						</div>
					) : null}
					{password ? (
						<div className={cn(styles.password_appender, !!error && styles.error)}>
							<i
								className={`ai password-field ${
									passwordType === "password" ? "ai-eye" : "ai-eye_disabled"
								}`}
								onClick={handleChangePasswordType}
							/>
						</div>
					) : (
						appender || null
					)}
				</div>
				{error ? (
					<div className={cn(styles.help_text, styles.error)}>
						{Array.isArray(error) ? error.join(" ") : error}
					</div>
				) : null}
				{helpText && !error ? (
					<div className={cn(styles.help_text, { [`${styles[textAlign]}`]: true })}>{helpText}</div>
				) : null}
			</div>
		);
	},
);

export default Input;

interface AppenderProps {
	className?: string;
	children: React.ReactNode;
	onClick?: () => void;
}

export const Appender: React.FC<AppenderProps> = ({ children, className, onClick }) => (
	<div onClick={onClick} className={cn(styles.appender, className)}>
		{children}
	</div>
);

export const AppenderDivider: React.FC = ({ children }) => (
	<div className={styles.appender_divider}>{children}</div>
);

export const AppenderButton: React.FC<AppenderProps> = ({ children, onClick, className }) => (
	<button type="button" onClick={onClick} className={cn(styles.appender_button, className)}>
		{children}
	</button>
);
