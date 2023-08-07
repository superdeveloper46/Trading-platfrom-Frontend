import React from "react";
import styles from "styles/components/UI/Tabs.module.scss";
import cn from "classnames";
import InternalLink from "components/InternalLink";

interface IProps {
	className?: string;
	link?: string;
	isActive?: boolean;
	name?: string;
	label?: string | React.ReactNode;
	responsive?: boolean;
	disabled?: boolean;
	onClick?: (v: string) => void;
	chip?: boolean;
}

const Tab: React.FC<IProps> = ({
	className,
	isActive = false,
	link,
	name,
	label = "",
	onClick,
	disabled,
	children,
	responsive,
	chip,
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick(name || "");
		}
	};

	return disabled ? (
		<div
			className={cn(styles.tab, className, {
				[styles.disabled]: disabled,
				[styles.responsive]: responsive,
				[styles.chip]: chip,
			})}
		>
			{label}
			{children}
		</div>
	) : link ? (
		<InternalLink
			className={cn(styles.tab, className, {
				[styles.active]: isActive,
				[styles.responsive]: responsive,
				[styles.chip]: chip,
			})}
			to={link}
		>
			<div onClick={handleClick} data-name={name}>
				{label}
				{children}
			</div>
		</InternalLink>
	) : (
		<div
			onClick={handleClick}
			className={cn(styles.tab, className, {
				[styles.active]: isActive,
				[styles.responsive]: responsive,
				[styles.chip]: chip,
			})}
			data-name={name}
		>
			{label}
			{children}
		</div>
	);
};

export default Tab;
