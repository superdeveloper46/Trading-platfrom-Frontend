import InternalLink from "components/InternalLink";
import React from "react";
import { useIntl } from "react-intl";

import styles from "styles/components/Profile/SessionCard.module.scss";
import commonMessages from "messages/common";
import { routes } from "constants/routing";
import SessionCard from "../Components/SessionCard";

const PAGE_SIZE = 4;

const DashboardActiveSession: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<SessionCard icon="ai ai-monitor" pageSize={PAGE_SIZE} fixedHeight>
			<InternalLink className={styles.footer_link} to={routes.security.root}>
				{formatMessage(commonMessages.review_all)}
				<i className="ai ai-chevron_right" />
			</InternalLink>
		</SessionCard>
	);
};

export default DashboardActiveSession;
