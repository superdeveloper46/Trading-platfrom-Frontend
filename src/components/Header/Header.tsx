import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import styles from "styles/components/Header.module.scss";
import { useMst } from "models/Root";
import { getActiveMenuElement } from "utils/shell";
import useWindowSize from "hooks/useWindowSize";
import { routes } from "constants/routing";
import ProfileMenu from "./ProfileMenu";
import NavMenu from "./NavMenu";
import ActionMenu from "./ActionMenu";
import MobileSidebar from "./MobileSidebar";
import MobileAppBanner from "./MobileAppBanner";

interface IProps {
	isLanding?: boolean;
	isExchange?: boolean;
}

const Header: React.FC<IProps> = ({ isLanding, isExchange }) => {
	const {
		global: { locale },
		render: { mobileApp },
	} = useMst();
	const { pathname } = useLocation();
	const { desktop } = useWindowSize();

	const [isMainSidebarVisible, setIsMainSidebarVisible] = useState<boolean>(false);
	const [isProfileSidebarVisible, setIsProfileSidebarVisible] = useState<boolean>(false);

	let pathLevel = pathname?.startsWith(`/${locale}/profile`) ? 3 : 2;
	pathLevel =
		pathname?.startsWith(`/${locale}${routes.profile.wallets}/`) ||
		pathname?.startsWith(`/${locale}${routes.history.root}/`)
			? 4
			: pathLevel;

	const activePage = getActiveMenuElement(pathname, pathLevel);

	useEffect(() => {
		if (desktop) {
			setIsProfileSidebarVisible(false);
		}
	}, [desktop]);

	return (
		<div className={styles.wrapper}>
			{mobileApp && <MobileAppBanner />}
			<div className={cn(styles.container, { [styles.landing]: isLanding })}>
				<NavMenu isLanding={isLanding} />
				<ActionMenu
					toggleMainSidebar={() => setIsMainSidebarVisible(true)}
					toggleProfileSidebar={() => setIsProfileSidebarVisible(true)}
					isLanding={isLanding}
					isExchange={isExchange}
				/>
				{!desktop ? (
					<>
						<ProfileMenu
							sidebarMode
							show={isProfileSidebarVisible}
							closeMenu={() => setIsProfileSidebarVisible(false)}
						/>
						<MobileSidebar
							show={isMainSidebarVisible}
							activePage={activePage}
							closeMenu={() => setIsMainSidebarVisible(false)}
						/>
					</>
				) : null}
			</div>
		</div>
	);
};

export default observer(Header);
