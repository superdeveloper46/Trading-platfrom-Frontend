import React, { useCallback, useEffect, useRef, useState, FocusEvent } from "react";
import { useIntl } from "react-intl";
import { components } from "react-select";
import commonMessages from "messages/common";
import Select from "components/UI/Select";
import usePreviousState from "hooks/usePreviousState";
import styles from "styles/components/UI/CurrencySelect.module.scss";
import cn from "classnames";

export interface ILabel {
	code: string;
	name?: string;
	available?: string;
	precision?: number;
	disabled?: boolean;
	image_png?: string;
	image_svg?: string;
}

export interface IOption {
	label: ILabel;
	value: string;
}

const ValueContainer = React.memo(({ children, ...props }: { children: ILabel }) => (
	<div className={styles.currency_value_container}>
		<i className="ai ai-search" />
		{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
		{/* @ts-ignore */}
		<components.ValueContainer {...props}>{children}</components.ValueContainer>
	</div>
));

const SingleValue = React.memo(({ children, ...props }: any) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore

	<components.SingleValue {...props}>
		<div className={styles.row}>
			<div className={styles.currency_code}>
				{/* <i className={`ai ai-${children.code?.toLowerCase()}`} /> */}
				{children.image_svg || children.image_png ? (
					<img src={children.image_svg || children.image_png} alt={children.code} />
				) : (
					<i className={`ai ai-${children.code.toLowerCase()}`} />
				)}
				{children.code.toUpperCase()}
			</div>
			<div className={styles.currency_name}>({children.name})</div>
		</div>
	</components.SingleValue>
));

const selectStyles = {
	container: (base: any) => ({
		...base,
		position: "absolute",
		width: "calc(100% + 2px)",
		border: `1px solid #007aff`,
		borderTop: "none",
		borderRadius: "0 0 12px 12px",
		top: "calc(100% + 1px)",
		left: "-1px",
		boxShadow: "0 2px 10px rgba(0, 0, 0, .12)",
		backgroundColor: "var(--card-background-color)",
	}),
	valueContainer: (base: any, state: any) => ({
		...base,
		height: "29px",
		lineHeight: "29px",
		padding: "0 18px 0 32px",
		borderRadius: "12px",
		cursor: "auto",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		border: `1px solid ${state.isFocused ? "var(--color-blue)" : "var(--input-normal)"}`,
	}),
	menu: (base: any) => ({
		...base,
		boxShadow: "none",
		position: "relative",
		margin: "0",
		borderTop: "none",
		borderRadius: "0 0 12px 12px",
		overflow: "hidden",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		fontSize: 14,
		padding: "8px 10px 8px 0",
		minHeight: state.selectProps.size === "small" ? "40px" : "44px",
		height: "auto",
		cursor: "pointer",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		transition: ".12s ease",
		backgroundColor: "var(--card-background-color)",
		color: "var(--color-primary)",
		"&:hover": {
			backgroundColor: "var(--dropdown-menu-item-background-hover)",
		},
	}),
	control: (base: any) => ({
		...base,
		outline: "none",
		border: "none",
		backgroundColor: "var(--card-background-color)",
		minHeight: 0,
		height: "auto",
		boxShadow: "none",
		borderRadius: "0",
		fontSize: 14,
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		flexWrap: "none",
	}),
	singleValue: (base: any, state: any) => ({
		...base,
		...(state.isFocused && { display: "none" }),
		color: state.selectProps.disabled ? "var(--input-label-disabled)" : "var(--color-primary)",
		marginLeft: 0,
		paddingLeft: 0,
		backgroundColor: "var(--card-background-color)",
	}),
	input: (base: any) => ({
		...base,
		margin: 0,
		padding: "0",
		height: "100%",
		width: "100%",
		color: "var(--color-primary)",
		transform: "translateY(-1px)",
	}),
	placeholder: () => ({
		display: "none",
	}),
	clearIndicator: (base: any) => ({
		...base,
		padding: "0 5px 0 0",
		marginRight: "5px",
	}),
};

interface Props {
	onSelectChange: (v: any) => void;
	options: IOption[];
	value?: IOption;
	label?: string;
	error?: string;
	isClearable?: boolean;
	onFocus?: (...args: any[]) => void;
	onBlur?: (...args: any[]) => void;
	autoFocus?: boolean;
	withoutLabel?: boolean;
	placeholder?: string;
	mini?: boolean;
	tiny?: boolean;
	disabled?: boolean;
	className?: string;
	isLoading?: boolean;
	style?: React.CSSProperties;
}

const CurrencySelect: React.FC<Props> = React.memo(
	({
		onSelectChange,
		options,
		label,
		value,
		error = "",
		isLoading,
		isClearable = false,
		onFocus,
		onBlur,
		autoFocus = false,
		withoutLabel = false,
		placeholder,
		mini = false,
		disabled,
		className,
		tiny,
		style,
	}) => {
		const { formatMessage } = useIntl();
		const containerRef = useRef<HTMLDivElement>(null);
		const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
		const prevValue = usePreviousState(value?.value ?? null);

		const handleOpenMenu = (): void => {
			if (!disabled) {
				setIsMenuOpen(!isMenuOpen);
			}
		};

		const handleCloseMenuWithOutside = useCallback(
			(e: MouseEvent) => {
				if (!containerRef?.current?.contains(e.target as Node)) {
					setIsMenuOpen(false);
				}
			},
			[containerRef],
		);

		const handleFilterOption = useCallback((option: IOption, inputValue: string) => {
			const { label, value } = option;

			return (
				value?.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
				label?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())
			);
		}, []);

		useEffect(() => {
			if (isMenuOpen) {
				document.addEventListener("click", handleCloseMenuWithOutside);
			} else {
				document.removeEventListener("click", handleCloseMenuWithOutside);
			}
			return () => document.removeEventListener("click", handleCloseMenuWithOutside);
		}, [isMenuOpen]);

		useEffect(() => {
			if (value && value.value !== prevValue && isMenuOpen) {
				setIsMenuOpen(false);
			}
		}, [value]);

		const handleFocus = useCallback(
			(e: FocusEvent<HTMLInputElement>) => {
				if (onFocus) {
					onFocus(e);
				}
			},
			[onFocus],
		);

		const handleBlur = useCallback(
			(e: FocusEvent<HTMLInputElement>) => {
				if (onBlur) {
					onBlur(e);
				}
			},
			[onBlur],
		);

		const Option = React.memo(
			({ children, ...props }: any) => {
				const precision = children.available
					? parseFloat(children.available) > 0
						? children.precision
						: 2
					: 0;
				const { formatNumber } = useIntl();

				return (
					<components.Option {...props}>
						<div title={children.name} className={cn(styles.row, styles.full_width)}>
							<div className={styles.row}>
								<div className={styles.currency_code}>
									{children.image_svg || children.image_png ? (
										<img src={children.image_svg || children.image_png} alt={children.code} />
									) : (
										<i className={`ai ai-${children.code.toLowerCase()}`} />
									)}
									{children.code.toUpperCase()}
								</div>
								{!!children.name && !tiny && (
									<div className={styles.currency_name}>({children.name})</div>
								)}
							</div>
							<div className={styles.row}>
								{children.available ? (
									<div
										className={cn(styles.currency_available, {
											[styles.secondary]: parseFloat(children.available) <= 0,
										})}
									>
										{formatNumber(parseFloat(children.available), {
											useGrouping: false,
											minimumFractionDigits: precision,
											maximumFractionDigits: precision,
										})}
									</div>
								) : null}
								{props.isSelected && (
									<div className={styles.selected_mark}>
										<i className="ai ai-check_mini" />
									</div>
								)}
							</div>
						</div>
					</components.Option>
				);
			},
			(prevProps, nextProps) => prevProps.label === nextProps.label,
		);

		return (
			<div
				className={cn(
					styles.container,
					{
						[styles.focused]: isMenuOpen,
						[styles.disabled]: disabled,
					},
					className,
				)}
				style={style}
				ref={containerRef}
			>
				{!withoutLabel && (
					<div className={styles.label}>
						{label ||
							formatMessage({
								id: "app.containers.finance.table.currency",
								defaultMessage: "Currency",
							})}
					</div>
				)}
				<div
					className={cn(styles.currency_dropdown, {
						[styles.active]: isMenuOpen,
						[styles.mini]: mini,
						[styles.error]: !!error,
					})}
					onClick={handleOpenMenu}
				>
					{value ? (
						<div className={styles.row} title={value.label.name}>
							<div className={styles.currency_code}>
								{value.label.image_svg || value.label.image_png ? (
									<img
										src={value.label.image_svg || value.label.image_png}
										alt={value.label.code}
									/>
								) : (
									<i className={`ai ai-${value.label.code.toLowerCase()}`} />
								)}
								{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
								{/* @ts-ignore */}
								{value.label.code.toUpperCase()}
							</div>
							{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
							{/* @ts-ignore */}
							{!!value.label.name && !tiny && (
								<div className={styles.currency_name}>({value.label.name})</div>
							)}
						</div>
					) : (
						<div className={styles.currency_placeholder}>
							{placeholder || formatMessage(commonMessages.select)}
						</div>
					)}
					{isMenuOpen && (
						<Select
							isLoading={isLoading}
							inputId="currency-select-input"
							onChange={onSelectChange}
							options={options}
							menuIsOpen
							colored
							onFocus={handleFocus}
							autoFocus={autoFocus}
							filterOption={handleFilterOption}
							onBlur={handleBlur}
							controlShouldRenderValue={false}
							value={value}
							label={formatMessage(commonMessages.search)}
							styles={selectStyles as React.CSSProperties}
							mini={mini}
							disabled={disabled || isLoading}
							isClearable={isClearable}
							components={{
								Option,
								SingleValue,
								ValueContainer,
								DropdownIndicator: null,
								IndicatorSeparator: null,
							}}
						/>
					)}
					<div className={cn(styles.currency_dropdown_indicator, mini && styles.mini)}>
						<i className={`ai ai-hint_${isMenuOpen ? "up" : "down"}`} />
					</div>
				</div>
				{!!error && <div className={styles.error_text}>{error}</div>}
			</div>
		);
	},
);

export default CurrencySelect;
