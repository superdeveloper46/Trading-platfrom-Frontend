import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/Button.module.scss";
import InternalLink from "components/InternalLink";
import { ReactComponent as Loader } from "./loader.svg";

export interface IButton {
	className?: string;
	onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
	onSubmit?: (body: any) => void;
	disabled?: boolean;
	variant?: "filled" | "text" | "outlined";
	color?: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";
	mini?: boolean;
	fullWidth?: boolean;
	label: string | JSX.Element;
	isLoading?: boolean;
	iconCode?: string;
	iconAlign?: "left" | "right" | "center";
	type?: "submit" | "button";
	isInternalLink?: boolean;
	to?: string;
	fontVariant?: "bold" | "medium" | "normal";
}

interface IButtonsGroupProps {
	fullWidth?: boolean;
	style?: React.CSSProperties;
}

export const ButtonsGroup: React.FC<IButtonsGroupProps> = ({ fullWidth, style, children }) => (
	<div style={style} className={cn(styles.buttons_group, { [styles.fullWidth]: fullWidth })}>
		{children}
	</div>
);

const Button: React.FC<IButton> = ({
	className,
	label,
	onClick,
	onSubmit,
	disabled,
	variant = "filled",
	color = "primary",
	fullWidth,
	iconCode,
	iconAlign = "left",
	isLoading,
	mini,
	isInternalLink,
	to,
	type = "button",
	fontVariant = "normal",
}) => {
	const handleClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
		if (!disabled && !isLoading && onClick) {
			onClick(e);
		}
	};

	const handleSubmit = (body: any) => {
		if (!disabled && !isLoading && onSubmit) {
			onSubmit(body);
		}
	};

	return isInternalLink ? (
		<InternalLink
			className={cn(
				styles.container,
				className,
				styles[fontVariant],
				styles[variant],
				styles[color],
				{
					[styles.disabled]: disabled,
					[styles.mini]: mini,
					[styles.full_width]: fullWidth,
					[styles.loading]: isLoading,
				},
			)}
			to={to}
		>
			{isLoading && (
				<div className={styles.button_loader}>
					<Loader />
				</div>
			)}
			<div
				tabIndex={-1}
				className={cn(styles.button_content, {
					[styles.loading]: isLoading,
					[styles.mini]: mini,
				})}
			>
				{iconCode && iconAlign === "left" ? <i className={`ai ai-${iconCode}`} /> : null}
				{iconCode && iconAlign === "center" ? (
					<i className={`ai ai-${iconCode}`} />
				) : (
					<span>{label}</span>
				)}
				{iconCode && iconAlign === "right" ? <i className={`ai ai-${iconCode}`} /> : null}
			</div>
		</InternalLink>
	) : (
		<button
			className={cn(
				styles.container,
				className,
				styles[fontVariant],
				styles[variant],
				styles[color],
				{
					[styles.disabled]: disabled,
					[styles.mini]: mini,
					[styles.full_width]: fullWidth,
					[styles.loading]: isLoading,
				},
			)}
			// eslint-disable-next-line react/button-has-type
			type={type}
			onClick={handleClick}
			onSubmit={handleSubmit}
			disabled={disabled}
		>
			{isLoading && (
				<div className={styles.button_loader}>
					<Loader />
				</div>
			)}
			<div
				tabIndex={-1}
				className={cn(styles.button_content, {
					[styles.loading]: isLoading,
					[styles.mini]: mini,
					[styles.iconRight]: iconAlign === "right",
				})}
			>
				{iconCode && iconAlign === "left" ? <i className={`ai ai-${iconCode}`} /> : null}
				{iconCode && iconAlign === "center" ? (
					<i className={`ai ai-${iconCode}`} />
				) : (
					<span>{label}</span>
				)}
				{iconCode && iconAlign === "right" ? <i className={`ai ai-${iconCode}`} /> : null}
			</div>
		</button>
	);
};

export default Button;
