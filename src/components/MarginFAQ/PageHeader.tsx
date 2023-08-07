import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/margin_faq";
import styles from "styles/pages/Page.module.scss";

const PageHeader: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.header_container}>
			<div className={styles.header_content}>
				<div className={styles.header_focus_container}>
					<h1>{formatMessage(messages.page_title)}</h1>
					<h2>{formatMessage(messages.page_subtitle)}</h2>
				</div>
			</div>
		</div>
	);
};

export default PageHeader;
