import cn from "classnames";
import React, { useCallback, useEffect } from "react";

import { useOnClickOutside } from "hooks/useOnClickOutside";
import styles from "styles/components/DropdownWithContent.module.scss";

export interface IDropdownWithContentOptions {
	close: () => void;
	isOpened: boolean;
}

interface IProps {
	className?: string;
	contentClassName?: string;
	labelClassName?: string;
	children: (options: IDropdownWithContentOptions) => React.ReactNode | React.ReactNode[];
	label?: (options: IDropdownWithContentOptions) => string | React.ReactNode | React.ReactNode[];
	isOpen?: boolean;
	canOpen?: boolean;
	onClose?: () => void;
	onOpen?: () => void;
}

export type TDropdownProps = Partial<IProps>;

const DropdownWithContent = ({
	className,
	contentClassName,
	labelClassName,
	children,
	label,
	isOpen,
	canOpen = true,
	onClose,
	onOpen,
}: IProps) => {
	const [isDropdownOpened, setIsDropdownOpened] = React.useState(false);

	const dropdownRef = React.useRef(null);

	const openDropdown = React.useCallback(() => {
		setIsDropdownOpened(true);

		if (typeof onOpen === "function") {
			onOpen();
		}
	}, [onOpen]);

	const closeDropdown = useCallback(() => {
		setIsDropdownOpened(false);

		if (typeof onClose === "function") {
			onClose();
		}
	}, [onClose]);

	const toggleDropdown = useCallback(
		(state: boolean) => (state ? openDropdown() : closeDropdown()),
		[openDropdown, closeDropdown],
	);

	const handleDropdownClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
	}, []);

	useOnClickOutside(dropdownRef, closeDropdown);

	useEffect(() => {
		if (!canOpen) {
			return;
		}

		if (typeof isOpen === "undefined" || isOpen === null) {
			return;
		}

		toggleDropdown(isOpen);
	}, [canOpen, isOpen, toggleDropdown]);

	const childOptions = React.useMemo(
		() => ({ close: () => toggleDropdown(false), isOpened: isDropdownOpened }),
		[toggleDropdown, isDropdownOpened],
	);

	return (
		<div
			className={cn(styles.dropdown, className)}
			role="button"
			{...(canOpen ? { onClick: () => toggleDropdown(!isDropdownOpened) } : null)}
			ref={dropdownRef}
		>
			<span className={cn(labelClassName, styles.dropdownLabel)}>{label?.(childOptions)}</span>
			<div
				className={cn(contentClassName, styles.dropdownContent, {
					[styles.closed]: !isDropdownOpened,
				})}
				onClick={handleDropdownClick}
			>
				{children(childOptions)}
			</div>
		</div>
	);
};

export default DropdownWithContent;
