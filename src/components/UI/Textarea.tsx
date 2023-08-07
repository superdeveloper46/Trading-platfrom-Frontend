import React, { FC, useEffect, useRef, useState } from "react";
import styles from "styles/components/UI/Textarea.module.scss";
import cn from "classnames";
import { ErrorText, HelpText } from "./ExchangeCryptoInput";

interface Props {
	className?: string;
	name: string;
	value: any;
	onChange?: (value: any) => void;
	labelValue?: string;
	disabled?: boolean;
	error?: any;
	helpText?: string;
	expand?: boolean;
	placeholder?: string;
	activeDetect?: (value: boolean) => void;
	maxLength?: number;
	onKeyDown?: (e: React.KeyboardEvent) => void;
}

const Textarea: FC<Props> = ({
	className,
	value,
	name,
	onChange,
	labelValue,
	disabled = false,
	error,
	helpText,
	placeholder,
	children,
	expand = false,
	maxLength,
	activeDetect,
	onKeyDown,
}) => {
	const [active, setActive] = useState(false);
	const ref = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (expand) {
			ref.current?.addEventListener("keydown", autosize);
		}

		return () => {
			ref.current?.removeEventListener("keydown", autosize);
		};
	}, []);

	const handleLeave = () => {
		setActive(false);
		if (activeDetect) activeDetect(false);
	};

	const handleClick = () => {
		setActive(true);
		if (activeDetect) activeDetect(true);
	};

	const autosize = () => {
		setTimeout(() => {
			ref.current!.style.cssText = "height:56px; padding:0";
			ref.current!.style.cssText = `height:${Number(ref.current?.scrollHeight) + 2}px;`;
		}, 0);
	};

	return (
		<div className={cn(className, styles.wrapper)}>
			<textarea
				className={cn(styles.textarea, {
					[styles.active]: active,
					[styles.expand]: expand,
					[styles.disabled]: disabled,
					[styles.error]: !!error,
				})}
				id={name}
				disabled={disabled}
				onFocus={handleClick}
				onBlur={handleLeave}
				onChange={onChange}
				value={value}
				name={name}
				ref={ref}
				placeholder={placeholder}
				maxLength={maxLength}
				onKeyDown={onKeyDown}
			/>
			{labelValue && (
				<label
					className={cn(styles.placeholder, {
						[styles.active_filled]: active || !!(value || value === 0),
						[styles.active]: active,
						[styles.disabled]: disabled,
						[styles.error]: !!error,
					})}
					htmlFor={name}
				>
					{labelValue}
				</label>
			)}
			{error && <ErrorText className={styles.error_and_help_text}>{error}</ErrorText>}
			{helpText && !error && <HelpText className={styles.error_and_help_text}>{helpText}</HelpText>}
			{children}
		</div>
	);
};

export default Textarea;
