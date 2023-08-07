import React, { useEffect } from "react";
import ReactModal from "react-modal";
import cn from "classnames";

import styles from "styles/components/UI/Modal.module.scss";
import CheckMark from "./CheckMark";

const appElement = document.getElementById("root");

if (appElement) {
	ReactModal.setAppElement(appElement);
}

interface IProps extends ReactModal.Props {
	className?: string;
	iconCode?: string;
	iconClassName?: string;
	label: string | React.ReactNode;
	headerContent?: React.ReactNode;
	onClose: () => void;
	headerBorder?: boolean;
	fullWidth?: boolean;
}

const Modal: React.FC<IProps> = React.memo(
	({
		children,
		className,
		label,
		headerContent,
		iconCode,
		iconClassName,
		onClose,
		isOpen,
		headerBorder = true,
		fullWidth,
		...rest
	}) => {
		useEffect(() => {
			if (isOpen) {
				document.body.style.overflow = "hidden";
				document.body.style.width = "calc(100% - 8px)"; // 8px - width of scrollbar; has been found here https://github.com/reactjs/react-modal/issues/191#issuecomment-302172285
			} else {
				document.body.style.overflow = "unset";
				document.body.style.position = "unset";
				document.body.style.width = "unset";
			}
		}, [isOpen]);

		useEffect(
			() => () => {
				document.body.style.overflow = "unset";
				document.body.style.position = "unset";
				document.body.style.width = "unset";
			},
			[],
		);

		return isOpen ? (
			<ReactModal
				{...rest}
				isOpen
				className={cn(styles.container, className, { [styles.fullWidth]: fullWidth })}
				overlayClassName={styles.overlay}
				htmlOpenClassName={styles.html}
				onRequestClose={onClose}
			>
				<div className={cn(styles.header, headerBorder && styles.bordered)}>
					{/* {iconCode ? <i className={cn(iconClassName, `ai ai-${iconCode}`)} /> : null} */}
					{headerContent && <div className={styles.header_content}>{headerContent}</div>}
					<h2 className={styles.title}>{label}</h2>
					<button type="button" className={styles.close_btn} onClick={onClose}>
						<i className="ai ai-close" />
					</button>
				</div>
				{children}
			</ReactModal>
		) : null;
	},
);

export const SuccessScreen: React.FC = ({ children }) => (
	<Content centered>
		<div className={cn(styles.success_container)}>
			<CheckMark />
			{children}
		</div>
	</Content>
);

interface IClassName {
	className?: string;
}

interface IContentItemProps extends IClassName {
	centered?: boolean;
}

export const Content: React.FC<IContentItemProps> = ({ children, centered, className }) => (
	<div className={cn(styles.content, centered && styles.centered, className)}>{children}</div>
);

export const InfoGroup: React.FC = ({ children }) => (
	<div className={styles.info_group}>{children}</div>
);

export const InfoGroupItem: React.FC<IClassName> = ({ children, className }) => (
	<div className={cn(styles.info_group_item, className)}>{children}</div>
);

export const InfoGroupItemValue: React.FC<IClassName> = ({ children, className }) => (
	<div className={cn(styles.info_group_item_value, className)}>{children}</div>
);

export const InfoGroupItemAttrValue: React.FC = ({ children }) => (
	<div className={styles.info_group_item_attribute_name}>{children}</div>
);

export const ActionGroup: React.FC<{ noMargin?: boolean }> = ({ children, noMargin }) => (
	<div className={cn(styles.action_group, { [styles.no_margin]: noMargin })}>{children}</div>
);

export const BodyContainer: React.FC<IClassName> = ({ className, children }) => (
	<div className={cn(styles.body_container, className)}>{children}</div>
);

export const Description: React.FC<{ noMargin?: boolean; primary?: boolean }> = ({
	children,
	noMargin,
	primary,
}) => (
	<div
		className={cn(styles.description, {
			[styles.no_margin]: noMargin,
			[styles.color_primary]: primary,
		})}
	>
		{children}
	</div>
);

export const ContentForm: React.FC<IClassName> = ({ children, className }) => (
	<div className={cn(styles.content_form, className)}>{children}</div>
);

export const InfoGrid: React.FC = ({ children }) => (
	<div className={styles.info_grid_container}>
		<div className={styles.info_grid}>{children}</div>
	</div>
);

interface IImageProps {
	className?: string;
}

export const Image: React.FC<IImageProps> = ({ className, children }) => (
	<div className={cn(styles.modal_img, className)}>{children}</div>
);

export const Icon: React.FC<IImageProps> = ({ className, children }) => (
	<div className={cn(styles.modal_icon, className)}>{children}</div>
);

export const Footer: React.FC = ({ children }) => <div className={styles.footer}>{children}</div>;

export default Modal;
