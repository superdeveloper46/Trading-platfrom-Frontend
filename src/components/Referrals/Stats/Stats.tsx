import React from "react";
import referralsMessages from "messages/referrals";
import { useIntl } from "react-intl";
import referralsStyles from "styles/components/Profile/Referrals/Referrals.module.scss";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import styles from "styles/components/Profile/Referrals/Stats.module.scss";
import Tooltip from "../../UI/Tooltip";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

const Stats: React.FC = () => {
	const {
		referrals: { info },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();

	return (
		<div className={referralsStyles.content}>
			<div className={styles.container}>
				<div className={styles.stats_card}>
					<div className={styles.card_header}>
						<div className={styles.card_title}>
							{formatMessage(referralsMessages.friends_activity_for_30_days)}
						</div>
					</div>
					<div className={styles.divider} />
					<div className={styles.stats_card_counters}>
						<div className={styles.stats_card_counter}>
							<div className={styles.stats_card_counter_value}>
								{formatNumber(+(info?.bonus_30d ?? 0), FORMAT_NUMBER_OPTIONS)}
								&nbsp;USDT
								<Tooltip
									id="recounted_at_current_rate"
									hint
									place="top"
									backgroundColor="var(--tooltip-background)"
								>
									{formatMessage(referralsMessages.recounted_at_current_rate)}
									&nbsp;USDT
								</Tooltip>
							</div>
							<span>{formatMessage(referralsMessages.earned_30_days)}</span>
						</div>
						<div className={styles.stats_card_counter}>
							<div className={styles.stats_card_counter_value}>{info?.invited_count_30d ?? 0}</div>
							<span>{formatMessage(referralsMessages.invitations_30_days)}</span>
						</div>
					</div>
				</div>
				<div className={styles.stats_card}>
					<div className={styles.card_header}>
						<div className={styles.card_title}>
							{formatMessage(referralsMessages.referral_bonus_for_all_the_time)}
						</div>
					</div>
					<div className={styles.divider} />
					<div className={styles.stats_card_counters}>
						<div className={styles.stats_card_counter}>
							<div className={styles.stats_card_counter_value}>
								{formatNumber(Number(info?.bonus_all_time ?? "0"), FORMAT_NUMBER_OPTIONS)}
								&nbsp;USDT
								<Tooltip
									id="recounted_at_current_rate2"
									hint
									place="top"
									backgroundColor="var(--tooltip-background)"
								>
									{formatMessage(referralsMessages.recounted_at_current_rate)}
									&nbsp;USDT
								</Tooltip>
							</div>
							<span>{formatMessage(referralsMessages.total_earned)}</span>
						</div>
						<div className={styles.stats_card_counter}>
							<div className={styles.stats_card_counter_value}>{info?.invited_count ?? 0}</div>
							<span>{formatMessage(referralsMessages.total_invitations)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(Stats);
