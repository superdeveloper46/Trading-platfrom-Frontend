import React, { useCallback, useEffect, useRef, useState, FocusEvent } from "react";
import { useIntl } from "react-intl";
import { components } from "react-select";
import cn from "classnames";

import commonMessages from "messages/common";
import Select from "components/UI/Select";
import usePreviousState from "hooks/usePreviousState";
import styles from "styles/components/UI/CurrencyMiniSelect.module.scss";

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

const selectStyles = {
	container: (base: any, state: any) => ({
		...base,
		height: "100%",
		minWidth: "105px",
	}),
	input: (base: any, state: any) => ({
		...base,
		height: "100%",
	}),
	control: (base: any) => ({
		...base,
		backgroundColor: "var(--background-color)",
		border: "none",
		borderRadius: "12px",
		cursor: "pointer",
		maxHeight: "100%",
		height: "100%",
	}),
	dropdownIndicator: (base: any, state: any) => ({
		...base,
		marginRight: "2px",
		marginBottom: 0,
		padding: "10px",
		fontSize: "8px",
	}),
	valueContainer: (base: any, state: any) => ({
		...base,
		height: "100%",
		padding: "2px 0 2px 12px",
	}),
	indicatorsContainer: (base: any, state: any) => ({
		...base,
		height: "100%",
	}),
};

const ValueContainer = React.memo(({ children, ...props }: { children: ILabel }) => (
	<div className={styles.currency_value_container}>
		{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
		{/* @ts-ignore */}
		<components.ValueContainer {...props}>{children}</components.ValueContainer>
	</div>
));

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
				<div className={cn(styles.row, styles.full_width)}>
					<div className={styles.row}>
						<div className={styles.currency_code}>
							{children.image_svg || children.image_png ? (
								<img src={children.image_svg || children.image_png} alt={children.code} />
							) : (
								<i className={`ai ai-${children.code.toLowerCase()}`} />
							)}
							{children.code.toUpperCase()}
						</div>
					</div>
					<div className={styles.row}>
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

const SingleValue = React.memo(({ children, ...props }: any) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore

	<components.SingleValue {...props}>
		<div className={styles.row}>
			<div className={styles.currency_code}>
				{console.log({ props })}
				{!props.selectProps.menuIsOpen && (
					<>
						{children.image_svg || children.image_png ? (
							<img src={children.image_svg || children.image_png} alt={children.code} />
						) : (
							<i className={`ai ai-${children.code.toLowerCase()}`} />
						)}
						{children.code.toUpperCase()}
					</>
				)}
			</div>
		</div>
	</components.SingleValue>
));

type Props = Record<string, any>;

const CurrencyMiniSelect: React.FC<Props> = React.memo(({ ...props }) => (
	<Select
		styles={selectStyles as React.CSSProperties}
		components={{
			Option,
			SingleValue,
			DropdownIndicator,
			// ValueContainer,
		}}
		{...props}
	/>
));

export default CurrencyMiniSelect;
