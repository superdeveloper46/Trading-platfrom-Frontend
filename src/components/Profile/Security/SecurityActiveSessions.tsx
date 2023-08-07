import React from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import styles from "styles/pages/ProfileSecurity.module.scss";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import SessionCard from "../Components/SessionCard";

const PAGE_SIZE = 4;

const SecurityActiveSession: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<SessionCard pageSize={PAGE_SIZE}>
			<InternalLink className={styles.security_session_footer_link} to={routes.security.sessions}>
				{formatMessage(commonMessages.review_all)}
				<i className="ai ai-chevron_right" />
			</InternalLink>
		</SessionCard>
	);
};

export default SecurityActiveSession;
