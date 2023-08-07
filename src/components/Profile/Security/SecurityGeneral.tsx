import React from "react";
import styles from "styles/pages/ProfileSecurity.module.scss";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { IProfileStatus } from "models/Account";
import SecurityAccount from "./SecurityAccount";
import SecurityProtection from "./SecurityProtection";
import SecurityPageHeader from "./SecurityPageHeader";
import SecurityActiveSession from "./SecurityActiveSessions";

const SecurityGeneral: React.FC = () => {
	const {
		account: { profileStatus, isProfileStatusLoaded, loadProfileStatus },
	} = useMst();

	return (
		<div className={styles.security_page_container}>
			<SecurityPageHeader
				profileStatus={profileStatus as IProfileStatus}
				isLoading={!isProfileStatusLoaded}
			/>
			<SecurityAccount
				profileStatus={profileStatus as IProfileStatus}
				isLoading={!isProfileStatusLoaded}
			/>
			<SecurityProtection
				profileStatus={profileStatus as IProfileStatus}
				loadProfile={loadProfileStatus}
				isLoading={!isProfileStatusLoaded}
			/>
			<SecurityActiveSession />
		</div>
	);
};

export default observer(SecurityGeneral);
