import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/BuyCrypto.module.scss";
import buyCryptoMessages from "messages/buy_crypto";
import commonMessages from "messages/common";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";

const HelpInfo: React.FC = () => {
	const {
		global: { department },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={styles.help_info_container}>
			<div className={pageStyles.section_container}>
				<div className={cn(pageStyles.help_info_text, styles.help_info_text)}>
					<i className="ai ai-warning" />
					<span>
						{formatMessage(buyCryptoMessages.help_info_1)}
						<br />
						<br />
						{formatMessage(buyCryptoMessages.help_info_2, {
							support_email: department.support_email,
							support: (
								<InternalLink to={routes.support.root} blank>
									{formatMessage(commonMessages.support)}
								</InternalLink>
							),
						})}
					</span>
				</div>
			</div>
		</div>
	);
};

export default observer(HelpInfo);
