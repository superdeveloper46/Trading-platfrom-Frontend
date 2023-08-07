import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import pageStyles from "styles/pages/Page.module.scss";

const rules = [messages.rule_1, messages.rule_2, messages.rule_3, messages.rule_4, messages.rule_5];

const Rules: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={cn(pageStyles.header_content, styles.ny_header_content)}>
			<div className={styles.rules_container}>
				<div className={styles.title}>
					<i className="ai ai-error_circle" />
					{formatMessage(messages.rules)}
				</div>
				{rules.map((rule, idx) => (
					<div className={styles.rule} key={idx}>
						{idx + 1}. {formatMessage(rule)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Rules;
