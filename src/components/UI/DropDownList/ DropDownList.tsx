import React, { useRef, useState } from "react";
import styles from "styles/components/UI/DropDownList.module.scss";
import classnames from "classnames";
import styleProps from "utils/styleProps";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import ExternalLink from "components/ExternalLink";

enum DropDownAnimationEnum {
	Open = "open",
	Close = "close",
}

const ANIMATION_TIME = 150;

export interface IDropDownListOption {
	label: string;
	value: any;
}

export enum DropDownListTypeEnum {
	Bordered,
	Filled,
}

interface IProps {
	className?: string;
	icon?: string;
	placeholder?: string;
	type?: DropDownListTypeEnum;
	options: IDropDownListOption[];
	value?: any;
	onSelect?(item: any): void;
	isExternalLink?: boolean;
}

const DropDownList: React.FC<IProps> = ({
	icon,
	className,
	options,
	isExternalLink,
	type,
	placeholder,
	value,
	onSelect,
}) => {
	const [animation, setAnimation] = useState(DropDownAnimationEnum.Close);
	const [isOpen, setOpen] = useState(false);

	const listRef = useRef(null);

	useOnClickOutside(listRef, () => close(ANIMATION_TIME));

	const open = async (ms: number) => {
		setAnimation(DropDownAnimationEnum.Open);
		setTimeout(() => setOpen(true), ms);
	};

	const close = async (ms: number) => {
		setAnimation(DropDownAnimationEnum.Close);
		setTimeout(() => setOpen(false), ms);
	};

	const toggle = () => {
		if (isOpen) {
			close(ANIMATION_TIME);
			return;
		}
		open(ANIMATION_TIME);
	};

	return (
		<div
			className={classnames(
				styles.drowdown_container,
				{
					[styles.bordered]: type === DropDownListTypeEnum.Bordered,
					[styles.filled]: type === DropDownListTypeEnum.Filled,
				},
				className,
			)}
		>
			<div className={classnames(styles.dropdown_toggle)} onClick={toggle}>
				<i className={`ai ai-${icon}`} />
				{placeholder}
				<div
					className={classnames(styles.icon, {
						[styles.open]: isOpen,
					})}
				>
					<i className="ai  ai-arrow_down" />
				</div>
			</div>
			{isOpen && (
				<div
					ref={listRef}
					style={styleProps({ "--animation-time": `${ANIMATION_TIME}ms` })}
					className={classnames(styles.dropdown_list, {
						[styles.open]: animation === DropDownAnimationEnum.Open,
						[styles.close]: animation === DropDownAnimationEnum.Close,
					})}
				>
					{options.map((option) => (
						<DropDownListItem
							isActive={value === option.value}
							label={option.label}
							value={option.value}
							onClick={onSelect}
							isExternalLink={isExternalLink}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default DropDownList;

interface IDropDownListItemProps {
	label: string;
	value: any;
	isExternalLink?: boolean;
	onClick?(value: any): void;
	isActive?: boolean;
}

const DropDownListItem: React.FC<IDropDownListItemProps> = ({
	label,
	onClick,
	value,
	isActive,
	isExternalLink,
}) =>
	isExternalLink ? (
		<a className={styles.dropdown_list_item} href={value} target="_blank" rel="noopener noreferrer">
			{label}
		</a>
	) : (
		<div className={styles.dropdown_list_item} onClick={() => onClick?.(value)}>
			{label} {isActive && <i className="ai ai-check_mini" />}
		</div>
	);
