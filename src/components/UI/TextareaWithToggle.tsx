import React, { useCallback, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import styles from "styles/components/UI/TextareaWithToggle.module.scss";
import cn from "classnames";
import Textarea from "./Textarea";
import { IInputChange } from "./Input";
import Tooltip from "./Tooltip";

interface Props {
	title: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	maxLength?: number;
	titleIconClass?: string;
	tooltipIconClass?: string;
	tooltipText?: string;
}

const TextareaWithToggle: React.FC<Props> = React.memo(
	({
		title = "",
		placeholder,
		value = "",
		onChange,
		maxLength = 255,
		titleIconClass,
		tooltipIconClass,
		tooltipText,
	}) => {
		const intl = useIntl();
		const [fieldIsOpen, setFieldIsOpen] = useState<boolean>(false);

		const handleTitleClick = useCallback(() => {
			setFieldIsOpen((prevState) => !prevState);
		}, []);

		const handleChange = useCallback(
			(e: IInputChange) => {
				onChange(
					e.target.value.length <= maxLength ? e.target.value : e.target.value.slice(0, maxLength),
				);
			},
			[onChange],
		);

		useEffect(() => {
			if (!fieldIsOpen) {
				onChange("");
			}
		}, [onChange, fieldIsOpen]);

		return (
			<div className={styles.container}>
				<div className={styles.content}>
					<div
						className={cn(styles.title, {
							[styles.active]: fieldIsOpen,
						})}
						onClick={handleTitleClick}
					>
						<i className={fieldIsOpen ? "ai ai-error_outlined" : titleIconClass} />
						<span>{title}</span>
					</div>
					{tooltipText && tooltipIconClass && (
						<Tooltip
							id="textarea-with-toggle"
							opener={<i className={cn(styles.tooltip_icon, tooltipIconClass)} />}
							text={tooltipText}
							place="top"
							backgroundColor="var(--tooltip-background)"
						/>
					)}
				</div>
				<div
					className={cn(styles.textarea_container, {
						[styles.active]: fieldIsOpen,
					})}
				>
					<Textarea
						name="note"
						placeholder={placeholder}
						value={value}
						onChange={handleChange}
						expand={false}
						helpText={intl.formatMessage(
							{ ...commonMessages.symbols_remaining },
							{ amount: maxLength - value.length },
						)}
					/>
				</div>
			</div>
		);
	},
);

export default TextareaWithToggle;
