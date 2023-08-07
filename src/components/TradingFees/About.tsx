import { useMst } from "models/Root";
import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/TradingFees.module.scss";
import accountMessages from "messages/account";
import feesTradingMessages from "messages/fees_trading";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

const About: React.FC = () => {
	const { formatMessage } = useIntl();
	const { render } = useMst();
	return (
		<div className={styles.fee_about_container}>
			<div className={styles.fee_about_info}>
				<i className="ai ai-info_circle_outline" />
				{formatMessage(accountMessages.statistics_are_updated_approximately_every_hour)}
			</div>
			{(render.referrals || render.supportCenter) && (
				<div className={styles.fee_about_links}>
					{render.supportCenter && (
						<InternalLink to="/support/basic-concepts-of-crypto-trading">
							{formatMessage(feesTradingMessages.what_is_maker_taker)}
						</InternalLink>
					)}
					{render.referrals && (
						<InternalLink to={routes.referrals.root}>
							{formatMessage(feesTradingMessages.invite_friends_to_earn_more)}
						</InternalLink>
					)}
				</div>
			)}
		</div>
	);
};

export default observer(About);
