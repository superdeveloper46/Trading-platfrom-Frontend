import classnames from "classnames";
import InternalLink from "components/InternalLink";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import LoadingSpinner from "components/UI/LoadingSpinner";
import SkeletonLoader from "components/UI/Skeleton";
import dayjs from "dayjs";
import accountMessages from "messages/account";
import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileSecurity.module.scss";
import { ISession } from "types/profileSecurity";

interface ISettingsListItemProps {
	icon: string;
	title: React.ReactNode;
	link?: string;
	className?: string;
	onClick?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
	noChevron?: boolean;
	isLoading?: boolean;
}

export const SecuritySettingsListItem: React.FC<ISettingsListItemProps> = ({
	icon,
	title,
	link,
	onClick,
	children,
	className,
	noChevron,
	isLoading,
}) => (
	<InternalLink
		className={classnames(styles.security_list_item, className ?? "", {
			[styles.disabled]: !link && !onClick && !isLoading,
		})}
		to={link}
		onClick={onClick}
	>
		<div className={styles.security_list_item_title}>
			<i className={icon} />
			<div className={styles.security_list_item_title_name}>{title}</div>
		</div>
		{isLoading ? <LoadingSpinner /> : children}
		{!noChevron && <i className="ai ai-chevron_right" />}
	</InternalLink>
);
