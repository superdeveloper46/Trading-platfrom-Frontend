import React from "react";
import Header from "components/Header";
import Cookies from "components/Cookies";
import styles from "styles/layout/ProfileLayout.module.scss";
import Sidebar from "components/UI/Sidebar";
import useWindowSize from "hooks/useWindowSize";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";

interface IProps {
	sidebarMenuLevel?: SidebarMenuLevelsEnum;
}

const ProfileLayout: React.FC<IProps> = ({ children, sidebarMenuLevel }) => {
	const { desktop } = useWindowSize();
	return (
		<>
			<Header />
			<div className={styles.profile_with_sidebar}>
				{desktop && <Sidebar menuLevel={sidebarMenuLevel} />}
				{children}
			</div>
			<Cookies />
		</>
	);
};

export default ProfileLayout;
