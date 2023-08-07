import useWindowSize from "hooks/useWindowSize";
import React from "react";
import { useIntl } from "react-intl";

import styles from "styles/components/Profile/Dashboard/DashboardSupport.module.scss";
import supportCenterMessages from "messages/support";
import accountMessages from "messages/account";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from "./DashboardCard";

const DashboardSupport: React.FC = () => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();
	return (
		<DashboardCard>
			<DashboardCardHeader noBorder link={routes.support.root}>
				<DashboardCardTitle>
					{formatMessage(supportCenterMessages.support_center)}
					{mobile && <i className="ai ai-chevron_right" />}
				</DashboardCardTitle>
				{!mobile && <i className="ai ai-chevron_right" />}
			</DashboardCardHeader>
			<div className={styles.content}>
				{formatMessage(accountMessages.frequently_asked_questions_about_working_with_our_platform)}
			</div>
		</DashboardCard>
	);
};

export default DashboardSupport;
