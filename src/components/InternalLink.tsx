import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";

interface IProps {
	to?: string;
	className?: string;
	blank?: boolean;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	state?: any;
	name?: string;
}

const InternalLink: React.FC<IProps> = ({
	to,
	children,
	className,
	onClick,
	blank,
	state,
	name,
}) => {
	const { global } = useMst();
	return to ? (
		<Link
			// @ts-ignore
			onClick={onClick}
			to={`/${global.locale}${to}`}
			data-name={name}
			className={className}
			target={blank ? "_blank" : "_self"}
			rel={blank ? "noopener noreferrer" : ""}
			state={state}
		>
			{children}
		</Link>
	) : (
		<span onClick={onClick} className={className}>
			{children}
		</span>
	);
};

export default observer(InternalLink);
