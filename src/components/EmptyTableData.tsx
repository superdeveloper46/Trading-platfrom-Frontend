import React from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import styles from "styles/components/EmptyTableData.module.scss";

interface IProps {
	message?: string | React.ReactNode;
}

const EmptyTableData: React.FC<IProps> = ({ message }) => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.container}>
			<i className="ai ai-dok_empty" />
			<span>{message || formatMessage(commonMessages.table_no_data)}</span>
		</div>
	);
};

export default EmptyTableData;
