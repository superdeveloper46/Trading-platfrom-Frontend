import React from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import styles from "styles/pages/ProfileSecurity.module.scss";
import InternalLink from "components/InternalLink";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";
import SessionCard from "../Components/SessionCard";

const PAGE_SIZE = 8;

const SecuritySessionList: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.security_page_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.security.root,
						label: formatMessage(commonMessages.security),
					},
				]}
				current="Session"
			/>
			<SessionCard pageSize={PAGE_SIZE} isPaginated>
				<InternalLink className={styles.security_session_footer_link} to={routes.security.root}>
					<i className="ai ai-chevron_left" />
					{formatMessage(commonMessages.back_btn)}
				</InternalLink>
			</SessionCard>
		</div>
	);
};

export default SecuritySessionList;
