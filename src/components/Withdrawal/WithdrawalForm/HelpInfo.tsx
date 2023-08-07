import React from "react";
import { useIntl } from "react-intl";

import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";

const HelpInfo: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.help_info_container}>
			<InternalLink
				to="/support/how-is-the-depositwithdrawal-performed"
				blank
				className={styles.help_info_tutorial}
			>
				<i className="ai ai-play" />
				<span>{formatMessage(financeMessages.withdrawal_tutorial)}</span>
			</InternalLink>
			<div className={styles.help_info_tip}>
				<i className="ai ai-warning" />
				<span>
					{formatMessage(financeMessages.withdrawal_info_1)}
					<InternalLink to={routes.termsOfUse} blank>
						{formatMessage(commonMessages.more)}
					</InternalLink>
				</span>
			</div>
			<div className={styles.help_info_tip}>
				<i className="ai ai-info_filled" />
				{formatMessage(financeMessages.withdrawal_info_2)}
			</div>
		</div>
	);
};

export default HelpInfo;
