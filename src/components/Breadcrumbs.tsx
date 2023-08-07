import React from "react";
import styles from "styles/components/Breadcrumbs.module.scss";
import cn from "classnames";
import InternalLink from "./InternalLink";

interface IBreadcrumbLink {
	link: string;
	label: string;
}

interface IProps {
	className?: string;
	noMargin?: boolean;
	links: IBreadcrumbLink[];
	current?: string;
}

const Breadcrumbs: React.FC<IProps> = ({ className, noMargin = false, links, current }) => (
	<div className={cn(styles.container, className, { [styles.noMargin]: noMargin })}>
		{links.map((l, idx) => (
			<React.Fragment key={idx}>
				<InternalLink to={l.link}>{l.label}</InternalLink>
				<i className="ai ai-mini_right" />
			</React.Fragment>
		))}
		<span>{current || "●"}</span>
	</div>
);

export default Breadcrumbs;
