import React from "react";
import cn from "classnames";
import styles from "styles/components/UI/ButtonMicro.module.scss";

interface Props {
	className?: string;
	primary?: boolean;
	small?: boolean;
	colored?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonMicro: React.FC<Props> = (props) => {
	const { className, primary, small, colored, onClick, children, ...rest } = props;
	return (
		<button
			type="button"
			className={cn(
				styles.button_micro,
				{
					[styles.primary]: primary,
					[styles.small]: small,
					[styles.colored]: colored,
				},
				className,
			)}
			onClick={onClick}
			{...rest}
		>
			{children}
		</button>
	);
};

export default ButtonMicro;
