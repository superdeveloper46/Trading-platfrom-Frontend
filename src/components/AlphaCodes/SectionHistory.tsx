import React, { useState } from "react";
import { useIntl } from "react-intl";
import common_messages from "messages/common";
import messages from "messages/alpha_codes";
import tabStyles from "styles/components/UI/Tabs.module.scss";
import styles from "styles/components/AlphaCodes.module.scss";
import cn from "classnames";
import TableCreated from "./TableCreated";
import TableActivated from "./TableActivated";

const SectionHistory: React.FC = () => {
	const { formatMessage } = useIntl();
	const [tab, setTab] = useState<string>("activated");

	const getComponent = (name: string): JSX.Element | null => {
		switch (name) {
			case "created":
				return <TableCreated paginator />;
			case "activated":
				return <TableActivated paginator />;
			default:
				return null;
		}
	};

	const handleCouponsType = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
		setTab(e.currentTarget.dataset.name as string);
	};

	return (
		<div className={styles.history_container}>
			<div className={styles.history_title_container}>
				<h1 className={styles.header_title}>{formatMessage(common_messages.history)}</h1>
			</div>
			<div className={styles.history_table_container}>
				<div className={tabStyles.tabs}>
					<div
						className={cn(
							tabStyles.tab,
							{ [tabStyles.active]: tab === "activated" },
							styles.tab_limited_codes,
						)}
						data-name="activated"
						onClick={handleCouponsType}
					>
						{formatMessage(messages.activated_alpha_codes)}
					</div>
					<div
						className={cn(
							tabStyles.tab,
							{ [tabStyles.active]: tab === "created" },
							styles.tab_limited_codes,
						)}
						data-name="created"
						onClick={handleCouponsType}
					>
						{formatMessage(messages.created_alpha_codes)}
					</div>
				</div>
				{getComponent(tab)}
			</div>
		</div>
	);
};

export default SectionHistory;
