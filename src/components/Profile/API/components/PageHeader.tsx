import React from "react";
import styles from "styles/pages/ProfileAPI.module.scss";
import Icons from "assets/images/api/header-icons.png";
import config from "helpers/config";

const PageHeader: React.FC = () => (
	<div className={styles.page_header_container}>
		<div className={styles.page_header_section}>
			<h1 className={styles.page_header_title}>API Key</h1>
			<span className={styles.page_header_subtitle}>
				Read the full API documentation&nbsp;
				<a href={config.publicApiPath} target="_blank" rel="noopener noreferrer">
					here
				</a>
			</span>
		</div>
		<img src={Icons} alt="api" width="189" height="76" />
	</div>
);

export default PageHeader;
