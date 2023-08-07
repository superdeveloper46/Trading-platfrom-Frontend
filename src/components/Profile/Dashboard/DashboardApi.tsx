import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import useWindowSize from "hooks/useWindowSize";
import accountMessages from "messages/account";
import styles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from "./DashboardCard";
import ApiKeyTable from "../Components/ApiKeys/ApiKeyTable";

const DashboardApi: React.FC = () => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();
	const { apiKeys } = useMst();

	useEffect(() => {
		apiKeys.getApiKeys();
	}, []);

	return (
		<DashboardCard>
			<DashboardCardHeader link={routes.api.root}>
				<DashboardCardTitle>
					{formatMessage(accountMessages.api_keys)}
					<div className={styles.api_keys_count}>{Math.min(apiKeys.count, 99)}</div>
					{mobile && (
						<span>
							<i className="ai ai-chevron_right" />
						</span>
					)}
				</DashboardCardTitle>
				{!mobile && (
					<span>
						<i className="ai ai-chevron_right" />
					</span>
				)}
			</DashboardCardHeader>
			<ApiKeyTable mobileClassName={styles.list_mobile_container} />
		</DashboardCard>
	);
};

export default observer(DashboardApi);
