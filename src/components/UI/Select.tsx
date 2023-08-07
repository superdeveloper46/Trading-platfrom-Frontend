import React, { CSSProperties } from "react";
import Select, { components } from "react-select";
import { useIntl } from "react-intl";
import styles from "styles/components/UI/Select.module.scss";
import commonMessages from "messages/common";
import cn from "classnames";

const initialStyles = {
	// TODO: Add real type, try to use generic from react-select StylesConfig<>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	control: (base: CSSProperties, state) => ({
		...base,
		outline: "none",
		border: `1px solid ${
			state.selectProps.disabled
				? "var(--input-disabled)"
				: (state.selectProps.error && !state.isFocused && "var(--input-error)") ||
				  (state.isFocused
						? state.selectProps.promo
							? "var(--color-promo-gold)"
							: "var(--color-blue)"
						: "var(--input-normal)")
		}`,
		transition: "border-color 0.2s ease-in-out",
		pointerEvents: state.selectProps.disabled ? "none" : "all",
		backgroundColor: "transparent",
		minHeight: 0,
		height: state.selectProps.mini ? "36px" : "46px",
		":hover": {
			border: `1px solid ${
				state.selectProps.error
					? "var(--input-error)"
					: state.selectProps.promo
					? "var(--color-promo-gold)"
					: "var(--color-blue)"
			}`,
		},
		boxShadow: state.isFocused ? "var(--navmenu-box-shadow)" : "unset",
		borderRadius: state.menuIsOpen ? "12px 12px 0px 0px" : "12px",
		fontSize: 14,
		cursor: "pointer",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	valueContainer: (base: CSSProperties, state) => ({
		...base,
		height: state.selectProps.mini ? "36px" : "46px",
		lineHeight: state.selectProps.mini ? "36px" : "46px",
		padding: state.isMulti ? "0 0 0 10px" : "0 18px 0 10px",
		overflow: state.isMulti ? "auto" : "hidden",
		position: "relative",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	placeholder: (_, state) => ({
		color: state.selectProps.disabled
			? "var(--input-label-disabled)"
			: state.selectProps.error
			? "var(--input-error)"
			: "var(--input-label-normal)",
		fontSize: "14px",
		transition: "0.2s ease",
		padding: "0 10px",
		position: "absolute",
		// ".ai": {
		// 	color: state.selectProps.error ? "var(--input-error)" : "var(--icon-color)",
		// },
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	input: (base: CSSProperties, state) => ({
		...base,
		margin: 0,
		padding: 0,
		height: state.selectProps?.mini ? "36px" : "46px",
		color: "var(--color-primary)",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	indicatorSeparator: () => ({
		display: "none",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	singleValue: (base: CSSProperties, state) => ({
		...base,
		...(state.isFocused && { display: "none" }),
		color: state.selectProps.disabled
			? "var(--input-label-disabled)"
			: state.selectProps.error
			? "var(--input-error)"
			: "var(--color-primary)",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	menu: (base: CSSProperties, state) => ({
		...base,
		zIndex: 202,
		border: `1px solid ${
			state.selectProps.promo ? "var(--color-promo-gold)" : "var(--color-blue)"
		}`,
		borderTopRightRadius: 0,
		borderTopLeftRadius: 0,
		boxShadow: "var(--select-shadow)",
		borderRadius: "0 0 12px 12px",
		overflow: "hidden",
		margin: 0,
		borderTop: `unset`,
		backgroundColor: "transparent",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	dropdownIndicator: (base: CSSProperties, state) => ({
		...base,
		padding: "10px",
		marginBottom: "2px",
		marginRight: state.selectProps.mini ? "0" : "5px",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	clearIndicator: (base: CSSProperties) => ({
		...base,
		padding: "5px",
		marginBottom: "2px",
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	menuList: (base: CSSProperties) => ({
		...base,
		maxHeight: "180px",
		paddingTop: "0",
		backgroundColor: "var(--card-background-color)",
		borderBottomRightRadius: 5,
		borderBottomLeftRadius: 5,
	}),
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	option: (base: CSSProperties, state) => ({
		...base,
		fontSize: 14,
		cursor: "pointer",
		backgroundColor:
			state.isSelected || state.isFocused
				? "var(--table-hover-background)"
				: "var(--card-background-color)",
		color: "var(--color-primary)",
		":hover": {
			backgroundColor: !state.selectProps.error && "var(--table-hover-background)",
		},
		"@media screen and (max-width: 768px)": {
			backgroundColor: "var(--input-background)",
		},
	}),
	multiValue: (base: CSSProperties) => ({
		...base,
		backgroundColor: "var(--background-gray-opaque)",
	}),
	multiValueLabel: (base: CSSProperties) => ({
		...base,
		maxHeight: "24px",
		display: "flex",
		alignItems: "center",
		maxWidth: "150px",
		color: "var(--primary-color)",
	}),
	multiValueRemove: (base: CSSProperties) => ({
		...base,
		color: "var(--primary-color)",
	}),
};

export interface ISelectOption {
	label: string;
	value: string;
}

const DropdownIndicator = React.memo(({ ...props }: any) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	<components.DropdownIndicator {...props}>
		<i
			className={cn(
				styles.dropdown_indicator_icon,
				{
					[styles.mini]: props.selectProps.mini,
					[styles.disabled]: props.selectProps.disabled,
				},
				`ai ai-hint_${props.isFocused ? "up" : "down"}`,
			)}
		/>
	</components.DropdownIndicator>
));

const ClearIndicator = React.memo(({ ...props }: any) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	<components.ClearIndicator {...props}>
		<i
			className={cn(
				styles.clear_indicator_icon,
				{
					[styles.mini]: props.selectProps.mini,
					[styles.disabled]: props.selectProps.disabled,
				},
				"ai ai-cancel_filled",
			)}
		/>
	</components.ClearIndicator>
));

const MenuList = React.memo(({ ...menuProps }: any) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore-start
	<components.MenuList {...menuProps}>
		{menuProps.children}
		{menuProps.selectProps.additionalOption}
	</components.MenuList>
));

const SelectWrapper: React.FC<any> = (props: any) => {
	const { formatMessage } = useIntl();
	const {
		labeled,
		isLoading,
		labeledAbsolute,
		label,
		styles: parentStyles,
		placeholder,
		components,
		error,
		additionalOption,
		selectRef,
	} = props;

	return labeled || labeledAbsolute ? (
		<div className={styles.labeled_container}>
			<div className={cn(styles.label, labeledAbsolute && styles.absolute)}>{label}</div>
			<Select
				{...props}
				ref={selectRef}
				isLoading={isLoading}
				styles={{ ...initialStyles, ...parentStyles }}
				placeholder={placeholder || formatMessage(commonMessages.select)}
				classNamePrefix="react-select-custom"
				error={error}
				additionalOption={additionalOption}
				components={{
					DropdownIndicator,
					ClearIndicator,
					MenuList,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore-start
					...components,
				}}
			/>
		</div>
	) : (
		<Select
			{...props}
			ref={selectRef}
			isLoading={isLoading}
			error={error}
			styles={{ ...initialStyles, ...parentStyles }}
			placeholder={label || formatMessage(commonMessages.select)}
			classNamePrefix="react-select-custom"
			additionalOption={additionalOption}
			components={{
				DropdownIndicator,
				ClearIndicator,
				MenuList,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore-start
				...components,
			}}
		/>
	);
};

export default SelectWrapper;
