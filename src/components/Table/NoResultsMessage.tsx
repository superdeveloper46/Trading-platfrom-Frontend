import React from "react";
import { FormattedMessage } from "react-intl";
import commonMessages from "messages/common";
import styles from "styles/components/Table/NoResultMessage.module.scss";

const NoResultsMessage: React.FC = () => (
	<div className={styles.no_rows_message_container}>
		<i className="ai ai-dok_empty" />
		<span>
			<FormattedMessage {...commonMessages.no_results} tagName="span" />
		</span>
	</div>
);

export default NoResultsMessage;
