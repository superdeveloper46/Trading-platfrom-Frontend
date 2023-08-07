import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/finance";
import styles from "styles/components/DepositWithdrawal.module.scss";

const HelpInfo: React.FC = React.memo(() => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.help_info_container}>
			<a
				href="https://www.youtube.com/watch?v=_ROfu2dyPUQ&list=PLtrTHSSyzlsGvzK95UakxhAsWoTIXkwYP&index=12"
				target="_blank"
				rel="noopener noreferrer"
				className={styles.help_info_tutorial}
			>
				<i className="ai ai-play" />
				<span>{formatMessage(messages.deposit_tutorial)}</span>
			</a>
		</div>
	);
});

export default HelpInfo;
