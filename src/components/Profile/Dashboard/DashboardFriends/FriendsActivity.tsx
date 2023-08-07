import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import styles from "styles/components/Profile/Dashboard/FriendsActivity.module.scss";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import InternalLink from "components/InternalLink";
import useWindowSize from "hooks/useWindowSize";
import { FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import { IReferralInfo } from "types/referrals";
import { useReferralInfo } from "services/ReferralsService";
import Button from "components/UI/Button";
import { routes } from "constants/routing";
import { DashboardCardHeader } from "../DashboardCard";

interface IStatListItem {
	value: string | React.ReactNode;
	label: string;
}

const StatListItem: React.FC<IStatListItem> = ({ value, label }) => (
	<div className={styles.stat_list_item}>
		<span className={styles.stat_list_item_value}>{value}</span>
		<span className={styles.stat_list_item_label}>{label}</span>
	</div>
);

const FriendsActivity: React.FC = () => {
	const { formatMessage, formatNumber } = useIntl();
	const { mobile } = useWindowSize();

	const { data: info } = useReferralInfo();
	const [referralsInfo, setReferalsInfo] = useState<IReferralInfo | null>(null);

	useEffect(() => {
		if (info) {
			setReferalsInfo(info);
		}
	}, [info]);

	return (
		<>
			<div className={styles.card}>
				<DashboardCardHeader link={routes.referrals.root}>
					<div className={styles.card_title}>
						<i className="ai ai-users" />
						{formatMessage(referralsMessages.friends_activity_for_30_days)}
					</div>
					<span>
						{!mobile && formatMessage(commonMessages.more)}
						<i className="ai ai-chevron_right" />
					</span>
				</DashboardCardHeader>
				<div className={styles.stat_list}>
					<StatListItem
						value={
							<>
								{formatNumber(+(referralsInfo?.bonus_30d ?? 0), FORMAT_NUMBER_OPTIONS_USDT)}
								&nbsp;USDT
							</>
						}
						label={formatMessage(referralsMessages.earned_30_days)}
					/>
					<StatListItem
						value={referralsInfo?.invited_count_30d ?? 0}
						label={formatMessage(referralsMessages.invitations_30_days)}
					/>
				</div>
				{!mobile && (
					<div className={styles.stat_info_sack}>
						<span>{formatMessage(accountMessages.invite_friends_earn_up_to)}</span>
						<InternalLink to={routes.referrals.root}>
							<i className="ai ai-chevron_right" />
						</InternalLink>
					</div>
				)}
			</div>
			{mobile && (
				<InternalLink className={styles.stats_link_button} to={routes.referrals.root}>
					<Button
						variant="filled"
						color="quaternary"
						iconAlign="left"
						iconCode="referral"
						mini
						label={formatMessage(commonMessages.referrals)}
						fullWidth
					/>
				</InternalLink>
			)}
		</>
	);
};

export default FriendsActivity;
