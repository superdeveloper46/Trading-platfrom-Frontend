import classnames from "classnames";
import React from "react";
import styles from "styles/components/UI/Button.module.scss";

interface IProps {
	onClick(): void;
	className?: string;
	isSmall?: boolean;
}

const ButtonMicro: React.FC<IProps> = ({ children, className, onClick, isSmall }) => (
	<button
		type="button"
		className={classnames(styles.button_micro, className, { [styles.small]: isSmall })}
		onClick={onClick}
	>
		{children}
	</button>
);
export default ButtonMicro;
