import classnames from "classnames";
import InternalLink from "components/InternalLink";
import React from "react";
import styles from "styles/components/Profile/Dashboard/DashboardCard.module.scss";

export interface IDashboardCardProps {
	className?: string;
}

export const DashboardCard: React.FC<IDashboardCardProps> = ({ className, children }) => (
	<div className={classnames(styles.card, className)}>{children}</div>
);

export const DashboardCardTitle: React.FC = ({ children }) => (
	<div className={styles.card_title}>{children}</div>
);

interface IDashboardCardHeaderProps {
	noBorder?: boolean;
	link?: string;
}

export const DashboardCardHeader: React.FC<IDashboardCardHeaderProps> = ({
	link,
	noBorder,
	children,
}) =>
	link ? (
		<InternalLink
			to={link}
			className={classnames(styles.card_header, {
				[styles.link]: !!link,
				[styles.no_border]: noBorder,
			})}
		>
			{children}
		</InternalLink>
	) : (
		<div
			className={classnames(styles.card_header, {
				[styles.no_border]: noBorder,
			})}
		>
			{children}
		</div>
	);
