import React from "react";
import cn from "classnames";

import p2pStyles from "styles/pages/P2P/P2P.module.scss";

interface ITabsProps {
	tab: string;
	onChange: (v: string) => void;
	navItems: INavItem[];
	tabClassName?: string;
	containerClassName?: string;
}

export interface INavItem {
	id: string;
	label: string;
}

const Tabs: React.FC<ITabsProps> = ({
	navItems,
	tab,
	onChange,
	tabClassName,
	containerClassName,
}) => (
	<div className={cn(p2pStyles.tabs_container, containerClassName)}>
		<div className={cn(p2pStyles.nav_bar, p2pStyles.scrollable)}>
			{navItems.map(({ id, label }) => (
				<div
					key={id}
					onClick={() => onChange(id)}
					className={cn(p2pStyles.nav_item, tabClassName, { [p2pStyles.active]: id === tab })}
				>
					<span>
						{label} {id === tab}
					</span>
				</div>
			))}
		</div>
	</div>
);

export default Tabs;
