import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import referralsMessages from "messages/referrals";
import { useMst } from "models/Root";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import Tab from "components/UI/Tab";
import { routes } from "constants/routing";

const Tabs: React.FC = () => {
	const {
		referrals: { info },
		global: { locale },
	} = useMst();
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();

	return (
		<div className={styles.tabs_container}>
			<div className={styles.tabs_content}>
				<div className={styles.page_tabs}>
					<Tab
						key={routes.referrals.root}
						className={styles.page_tab}
						label={formatMessage(referralsMessages.my_friends)}
						link={routes.referrals.root}
						isActive={pathname === `/${locale}/profile/referrals`}
					/>
					<Tab
						key="/profile/referrals/referral-accruals"
						className={styles.page_tab}
						label={formatMessage(referralsMessages.referral_accruals)}
						link="/profile/referrals/referral-accruals"
						isActive={pathname === `/${locale}/profile/referrals/referral-accruals`}
					/>
					{!!info?.invite && (
						<Tab
							key="/profile/referrals/refback"
							className={styles.page_tab}
							label="Refback"
							link="/profile/referrals/refback"
							isActive={pathname === `/${locale}/profile/referrals/refback`}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default observer(Tabs);
