import React, { LegacyRef, RefObject, useCallback, useEffect, useRef, useState } from "react";
import styles from "styles/components/UI/ExchangeCryptoInput.module.scss";
import cn from "classnames";

export interface IError {
	status: number;
	code?: string | number;
	detail?: string;
	data?: any;
}

interface IPlaceholder {
	$active?: boolean;
	$filled?: boolean;
	$error?: boolean;
	className?: string;
	htmlFor?: string;
}

interface IInput {
	$active?: boolean;
	$error?: boolean;
	$appear?: any;
	disabled?: boolean;
	className?: string;
	ref?: any;
}

interface IIndicator {
	active: boolean;
	error?: boolean;
}

export const Appender: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	// eslint-disable-next-line jsx-a11y/label-has-associated-control
	<label className={styles.appender}>{children}</label>
);

export const Placeholder: React.FC<IPlaceholder> = (props) => {
	const { $active, $filled, $error, className, children, ...rest } = props;
	return (
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
		<label
			className={cn(styles.placeholder, className, ($active || $filled) && styles.active_or_filled)}
			{...rest}
		>
			{children}
		</label>
	);
};

export const SmallPlaceholder: React.FC<IPlaceholder> = (props) => {
	const { $active, $filled, children } = props;
	return (
		<Placeholder
			className={cn(styles.small_placeholder, ($active || $filled) && styles.active_or_filled)}
			{...props}
		>
			{children}
		</Placeholder>
	);
};

export const Input: React.FC<IInput & React.InputHTMLAttributes<HTMLInputElement>> =
	React.forwardRef<
		React.RefObject<HTMLInputElement>,
		IInput & React.InputHTMLAttributes<HTMLInputElement>
	>((props, ref) => {
		const { $active, $error, className, disabled, ...rest } = props;
		return (
			<input
				className={cn(styles.input, className, disabled && styles.disabled)}
				disabled={disabled}
				ref={ref as LegacyRef<HTMLInputElement>}
				{...rest}
			/>
		);
	});

export const SmallInput: React.FC<IInput & React.InputHTMLAttributes<HTMLInputElement>> = ({
	$appear,
	...rest
}) => <Input className={cn(styles.small_input, $appear && styles.appear)} {...rest} />;

export const Indicator: React.FC<IIndicator> = ({ active, error }) => (
	<div className={cn(styles.indicator, { [styles.active]: active, [styles.error]: error })} />
);

export const HelpText: React.FC<{ className?: string }> = ({ children, className, ...rest }) => (
	<div className={cn(styles.help_text, className)} {...rest}>
		{children}
	</div>
);

export const ErrorText: React.FC<{ className?: string }> = ({ children, className, ...rest }) => (
	<div className={cn(styles.help_text, styles.error_text, className)} {...rest}>
		{children}
	</div>
);

export const Icon: React.FC = ({ children, ...rest }) => (
	<div className={styles.icon} {...rest}>
		{children}
	</div>
);

interface Props {
	name?: string;
	value?: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	labelValue?: string | JSX.Element | Element;
	placeholder?: string;
	disabled?: boolean;
	appender?: any;
	error?: IError | string;
	type?: string;
	autoComplete?: string;
	helpText?: string | JSX.Element;
	children?: React.ReactNode;
	small?: boolean;
	maxLength?: number;
	inputFocus?: boolean;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	icon?: JSX.Element;
	indicatorIsActive?: boolean;
}

const ExchangeCryptoInput: React.FC<Props> = React.memo((props) => {
	const {
		value,
		name,
		onChange,
		labelValue,
		disabled,
		appender,
		error,
		autoComplete = "off",
		placeholder,
		helpText,
		children,
		type = "text",
		maxLength = undefined,
		small,
		onKeyDown,
		inputFocus = false,
		icon,
		indicatorIsActive = false,
	} = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const [isActive, setIsActive] = useState<boolean>(false);
	const handleBlur = useCallback(() => setIsActive(false), []);
	const handleFocus = useCallback(() => setIsActive(true), []);

	const handleOnWheel = (e: React.WheelEvent<HTMLInputElement>) => {
		e.currentTarget.blur();
	};

	useEffect(() => {
		if (inputFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef, inputFocus]);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.input_container}>
					{Boolean(icon) && <Icon>{icon}</Icon>}
					{small ? (
						<SmallInput
							type={type}
							disabled={disabled}
							autoComplete={autoComplete}
							id={name}
							onChange={onChange}
							value={value || ""}
							name={name}
							placeholder={placeholder}
							maxLength={maxLength}
							onFocus={handleFocus}
							onBlur={handleBlur}
							ref={inputRef}
							$active={isActive}
							$error={!!error}
							onKeyDown={onKeyDown}
							onWheel={handleOnWheel}
						/>
					) : (
						<Input
							type={type}
							disabled={disabled}
							autoComplete={autoComplete}
							id={name}
							onChange={onChange}
							value={value || ""}
							name={name}
							placeholder={placeholder}
							maxLength={maxLength}
							onFocus={handleFocus}
							onBlur={handleBlur}
							ref={inputRef}
							$active={isActive}
							$error={!!error}
							onKeyDown={onKeyDown}
							onWheel={handleOnWheel}
						/>
					)}
					{small ? (
						<SmallPlaceholder
							$active={isActive}
							$filled={!!(value || value === 0)}
							htmlFor={name}
							$error={!!error}
						>
							{labelValue}
						</SmallPlaceholder>
					) : (
						<Placeholder
							$active={isActive}
							$filled={!!(value || value === 0)}
							htmlFor={name}
							$error={!!error}
						>
							{labelValue}
						</Placeholder>
					)}
					{appender}
				</div>
				{!!error && <ErrorText>{error}</ErrorText>}
				{!!(helpText && !error) && <HelpText>{helpText}</HelpText>}
				{children}
			</div>
			<Indicator active={isActive || indicatorIsActive} error={!!error} />
		</>
	);
});

export default ExchangeCryptoInput;
