import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import styles from "styles/components/UI/InputExchage.module.scss";

interface Props {
	value: string;
	name?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	labelValue?: string;
	disabled?: boolean;
	appender?: any;
	error?: any | string;
	autoComplete?: boolean;
	placeholder?: string;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	onEnter?: () => void;
	helpText?: string;
	children?: JSX.Element;
	type?: string;
	maxLength?: number;
	inputFocus?: boolean;
	activeGroup?: string;
	groups?: { name: string; label: string }[];
	onGroupChange?: (g: string) => void;
}

const InputExchange: React.FC<Props> = ({
	value,
	name,
	onChange,
	labelValue,
	disabled,
	appender,
	error,
	autoComplete,
	placeholder,
	onKeyDown,
	onEnter,
	helpText,
	children,
	type,
	maxLength,
	inputFocus,
	activeGroup,
	groups,
	onGroupChange,
}) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const groupedMenuRef = useRef<HTMLDivElement>(null);
	const [isGroupedMenuOpen, setIsGroupedMenuOpen] = useState<boolean>(false);
	const grouped = Array.isArray(groups) && groups.length > 0;

	const activeGroupLabel = grouped
		? groups.find((g: { name: string; label: string }) => g.name === activeGroup)?.label ?? "-"
		: "-";

	const handleFocus = (): void => {
		setIsActive(true);
	};

	const handleBlur = (): void => {
		setIsActive(false);
	};

	const handleCloseGroupedMenu = (e: MouseEvent): void => {
		if (!groupedMenuRef?.current?.contains(e.target as Node)) {
			setIsGroupedMenuOpen(false);
		}
	};

	const toggleIsGroupedOpen = (): void => {
		setIsGroupedMenuOpen((prevState) => !prevState);
	};

	const handleGroupChange = (e: React.SyntheticEvent<HTMLDivElement>): void => {
		const { name } = e.currentTarget.dataset;
		if (onGroupChange && name) {
			onGroupChange(name);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (onEnter && e.key === "Enter") {
			onEnter();
		}
		if (onKeyDown) {
			onKeyDown(e);
		}
	};

	const handleOnWheel = (e: React.WheelEvent<HTMLInputElement>) => {
		e.currentTarget.blur();
	};

	useEffect(() => {
		if (inputFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputFocus, inputRef.current]);

	useEffect(() => {
		setTimeout(() => {
			if (isGroupedMenuOpen) {
				document.addEventListener("click", handleCloseGroupedMenu);
			} else {
				document.removeEventListener("click", handleCloseGroupedMenu);
			}
		}, 0);
		return () => document.removeEventListener("click", handleCloseGroupedMenu);
	}, [isGroupedMenuOpen]);

	return (
		<div className={cn(styles.wrapper, disabled && styles.disabled)}>
			{grouped ? (
				<div
					className={cn(styles.grouped_input_container, {
						[styles.active]: isActive,
						[styles.error]: !!error,
					})}
				>
					<div className={styles.grouped_selector} onClick={toggleIsGroupedOpen}>
						<div className={styles.grouped_selector_value}>
							{activeGroupLabel}
							<i className="ai ai-arrow_down" />
						</div>
						{isGroupedMenuOpen && (
							<div className={styles.grouped_selector_menu} ref={groupedMenuRef}>
								{groups.map((g: { name: string; label: string }) => (
									<div
										key={g.name}
										className={styles.grouped_selector_menu_item}
										data-name={g.name}
										onClick={handleGroupChange}
									>
										{g.label}
									</div>
								))}
							</div>
						)}
					</div>
					<input
						className={styles.grouped_input}
						type={type}
						disabled={disabled}
						autoComplete={autoComplete ? "on" : "off"}
						id={name}
						onChange={onChange}
						name={name}
						value={value || ""}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						onWheel={handleOnWheel}
					/>
					{appender}
				</div>
			) : (
				<>
					<input
						className={cn(styles.input, {
							[styles.active]: isActive,
							[styles.error]: !!error,
							[styles.disabled]: disabled,
						})}
						type={type}
						disabled={disabled}
						autoComplete={autoComplete ? "on" : "off"}
						id={name}
						onChange={onChange}
						value={value || ""}
						name={name}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						maxLength={maxLength}
						onFocus={handleFocus}
						onBlur={handleBlur}
						ref={inputRef}
					/>
					<label
						className={cn(styles.placeholder, {
							[styles.active]: isActive,
							[styles.error]: !!error,
							[styles.filled]: value?.length > 0,
						})}
						htmlFor={name}
					>
						{labelValue}
					</label>
					{appender}
				</>
			)}
			{error ? (
				<div className={styles.error_text}>
					<i className="ai ai-info_filled" />
					{error}
				</div>
			) : null}
			{helpText && !error && <div className={styles.help_text}>{helpText}</div>}
			{children}
		</div>
	);
};

export default InputExchange;
