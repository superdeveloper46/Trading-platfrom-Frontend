import React from "react";
import styles from "styles/components/EmptyContent.module.scss";
import maintenance from "assets/images/common/maintenance.svg";
import { useIntl } from "react-intl";
import messages from "messages/common";

const EmptyContent: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.container}>
			<img src={maintenance} alt={formatMessage(messages.table_no_data)} />
			<span>{formatMessage(messages.table_no_data)}</span>
		</div>
	);
};

export default EmptyContent;
