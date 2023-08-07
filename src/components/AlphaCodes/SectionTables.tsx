import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import messages from "messages/alpha_codes";
import styles from "styles/components/AlphaCodes.module.scss";
import InternalLink from "components/InternalLink";
import Tabs from "components/UI/Tabs";
import Tab from "components/UI/Tab";
import { routes } from "constants/routing";
import TableCreated from "./TableCreated";
import TableActivated from "./TableActivated";

enum ActiveTabEnum {
	ACTIVATED = "activated",
	CREATED = "created",
}

const AlphaCodesTable: React.FC = () => {
	const { formatMessage } = useIntl();
	const [tab, setTab] = useState<string>(ActiveTabEnum.ACTIVATED);

	const getComponent = (name: string): JSX.Element | null => {
		switch (name) {
			case ActiveTabEnum.CREATED:
				return <TableCreated />;
			case ActiveTabEnum.ACTIVATED:
				return <TableActivated />;
			default:
				return null;
		}
	};

	const handleCouponsType = (name: string): void => {
		setTab(name);
	};

	return (
		<div className={cn(styles.codes_section, styles.tables_section)}>
			<Tabs>
				<Tab
					name={ActiveTabEnum.ACTIVATED}
					isActive={tab === ActiveTabEnum.ACTIVATED}
					onClick={handleCouponsType}
					className={styles.tab}
				>
					{formatMessage(messages.activated_alpha_codes)}
				</Tab>
				<Tab
					name={ActiveTabEnum.CREATED}
					isActive={tab === ActiveTabEnum.CREATED}
					onClick={handleCouponsType}
					className={styles.tab}
				>
					{formatMessage(messages.created_alpha_codes)}
				</Tab>
			</Tabs>
			{getComponent(tab)}
			<div className={styles.all_history_message_block}>
				<InternalLink to={routes.alphaCodes.history}>
					{formatMessage(messages.check_history)}
					<i className="ai ai-chevron_right" />
				</InternalLink>
			</div>
		</div>
	);
};

export default AlphaCodesTable;
